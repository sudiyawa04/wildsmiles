const db = require('../config/database');
const axios = require('axios');

// POST /api/ai/trip-planner
const generateItinerary = async (req, res, next) => {
  try {
    const { destination, days, interests, budget } = req.body;

    if (!destination || !days || !interests) {
      return res.status(400).json({ success: false, message: 'destination, days, and interests are required' });
    }

    // Look up destination info from DB to enrich prompt
    const [destRows] = await db.promise().query(
      'SELECT name, country, description, best_time, highlights FROM destinations WHERE slug = ? OR name LIKE ? LIMIT 1',
      [destination, `%${destination}%`]
    );
    const destInfo = destRows.length > 0 ? destRows[0] : { name: destination };

    // Look up matching tours
    const [tours] = await db.promise().query(
      `SELECT title, category, duration_days, price_per_person, short_desc
       FROM tours t
       JOIN destinations d ON d.id = t.destination_id
       WHERE (d.slug = ? OR d.name LIKE ?) AND t.is_active = 1
       ORDER BY t.avg_rating DESC LIMIT 6`,
      [destination, `%${destination}%`]
    );

    let itinerary;

    // Use OpenAI if key is available, otherwise return rule-based plan
    if (process.env.OPENAI_API_KEY) {
      const prompt = buildPrompt(destInfo, days, interests, budget, tours);
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model:      'gpt-4o-mini',
          messages:   [{ role: 'user', content: prompt }],
          max_tokens: 1500,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      itinerary = {
        type:    'ai_generated',
        content: response.data.choices[0].message.content,
      };
    } else {
      itinerary = buildRuleBasedItinerary(destInfo, parseInt(days), interests, parseFloat(budget) || 2000, tours);
    }

    res.json({
      success: true,
      data: {
        destination: destInfo.name,
        days:        parseInt(days),
        budget,
        interests,
        itinerary,
        recommended_tours: tours,
      },
    });
  } catch (err) {
    next(err);
  }
};

const buildPrompt = (dest, days, interests, budget, tours) => {
  const tourList = tours.map(t => `- ${t.title} (${t.category}, ${t.duration_days} days, $${t.price_per_person}/person)`).join('\n');
  return `Create a detailed ${days}-day travel itinerary for ${dest.name || dest}, ${dest.country || ''}.

Traveler interests: ${Array.isArray(interests) ? interests.join(', ') : interests}
Budget: $${budget || 'flexible'} USD per person
${tours.length > 0 ? `\nAvailable WildSmiles tours:\n${tourList}` : ''}

Provide a day-by-day itinerary with:
- Morning, afternoon, and evening activities
- Recommended restaurants
- Transportation tips
- Estimated costs per day
- Pro tips for each day

Format each day clearly as "Day 1:", "Day 2:", etc.`;
};

const buildRuleBasedItinerary = (dest, days, interests, budget, tours) => {
  const dayPlans = [];
  const dayBudget = budget / days;

  for (let i = 1; i <= days; i++) {
    const tour = tours[(i - 1) % tours.length];
    dayPlans.push({
      day: i,
      title: i === 1 ? 'Arrival & Orientation' : i === days ? 'Farewell Day' : `Exploration Day ${i}`,
      morning: i === 1
        ? `Arrive in ${dest.name}, hotel check-in, rest and freshen up`
        : tour ? `Join the ${tour.title} tour` : `Explore local highlights of ${dest.name}`,
      afternoon: i === days
        ? 'Souvenir shopping and last-minute exploration'
        : `Guided experience — discover local culture and landscapes`,
      evening: i === 1
        ? 'Welcome dinner at a top-rated local restaurant'
        : `Relax at your accommodation, enjoy local cuisine`,
      estimated_cost: `$${Math.round(dayBudget)} per person`,
      tips: `Day ${i} tip: Book activities in advance for best prices`,
    });
  }

  return {
    type: 'rule_based',
    days: dayPlans,
    total_estimated_cost: `$${budget}`,
    note: 'This itinerary is generated based on your preferences. Enable OpenAI for AI-powered planning.',
  };
};

// POST /api/ai/recommendations
const getRecommendations = async (req, res, next) => {
  try {
    const { type = 'tours' } = req.query;
    const userId = req.user ? req.user.id : null;

    let query, params = [];

    if (type === 'tours') {
      if (userId) {
        // Based on user's booking history
        query = `
          SELECT DISTINCT t.id, t.slug, t.title, t.category, t.price_per_person,
                 t.cover_image, t.avg_rating, t.review_count, t.duration_days,
                 d.name AS destination_name, d.country
          FROM tours t
          JOIN destinations d ON d.id = t.destination_id
          WHERE t.is_active = 1
            AND t.category IN (
              SELECT DISTINCT t2.category FROM tour_bookings b
              JOIN tours t2 ON t2.id = b.tour_id
              WHERE b.user_id = ?
            )
            AND t.id NOT IN (
              SELECT tour_id FROM tour_bookings WHERE user_id = ?
            )
          ORDER BY t.avg_rating DESC
          LIMIT 6`;
        params = [userId, userId];
      } else {
        query = `SELECT t.id, t.slug, t.title, t.category, t.price_per_person,
                        t.cover_image, t.avg_rating, t.review_count, t.duration_days,
                        d.name AS destination_name, d.country
                 FROM tours t
                 JOIN destinations d ON d.id = t.destination_id
                 WHERE t.is_active = 1
                 ORDER BY t.booking_count DESC, t.avg_rating DESC
                 LIMIT 6`;
      }
    } else {
      query = `SELECT id, slug, name, country, cover_image, tour_count
               FROM destinations WHERE is_active = 1 AND is_featured = 1
               ORDER BY tour_count DESC LIMIT 6`;
    }

    const [rows] = await db.promise().query(query, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

module.exports = { generateItinerary, getRecommendations };

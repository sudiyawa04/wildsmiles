-- Update all tours with inclusions and exclusions
UPDATE tours SET 
  inclusions = '["Professional safari guide & driver","Game drives in a 4WD safari vehicle","Park & conservancy entrance fees","Full board accommodation (breakfast, lunch & dinner)","Bottled drinking water on all drives","Airport/hotel transfers","Wildlife identification guidebook"]',
  exclusions = '["International & domestic flights","Visa fees","Travel insurance (strongly recommended)","Gratuities for guides & lodge staff","Premium drinks & personal items","Optional balloon safari"]'
WHERE category IN ('safari','wildlife');

UPDATE tours SET 
  inclusions = '["Return airport transfers","All accommodation at selected beach resort","Daily breakfast & dinner (half board)","Snorkelling equipment hire","Welcome dinner on arrival","All hotel taxes & service charges"]',
  exclusions = '["International flights","Visa fees","Travel insurance","Lunches","Drinks & bar tab","Optional excursions","Personal shopping"]'
WHERE category = 'beach';

UPDATE tours SET 
  inclusions = '["Experienced certified mountain guide","All camping equipment (tents, mats, sleeping bags)","Three meals per day on and off mountain","National park entrance fees","Porters (1 per climber)","Emergency oxygen cylinder","Summit attempt certificate"]',
  exclusions = '["International flights","Visa fees","Travel insurance","Tips for guides and porters","Personal climbing gear","Alcoholic beverages"]'
WHERE category = 'adventure';

UPDATE tours SET 
  inclusions = '["Bilingual cultural guide","All site & museum entrance fees","Local transport between all sites","Traditional meal experience","Souvenir cultural activity","City walking tour"]',
  exclusions = '["International flights","Visa fees","Travel insurance","Personal expenses","Optional extensions","Alcoholic beverages"]'
WHERE category = 'cultural';

-- Insert new Kenya destinations (ignore if slug already exists)
INSERT IGNORE INTO destinations (slug, name, country, description, cover_image, is_featured, is_active)
VALUES
  ('mombasa-coast', 'Mombasa & Coastal Kenya', 'Kenya', 
   'Kenya''s coastal gem — a thousand-year-old Swahili city where Fort Jesus stands against a backdrop of white sand beaches, where the scent of spice mixes with ocean breeze, and where centuries of Arab, Portuguese, and African history come alive in winding Old Town alleys.', 
   'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80', 1, 1),
  ('diani-beach', 'Diani Beach', 'Kenya', 
   'Kenya''s most celebrated beach destination — 17km of pristine white-sand paradise along the Indian Ocean, fringed by coral reefs, Colobus monkey forests, and world-class beach resorts. Perfect for water sports, deep-sea fishing, and total relaxation.', 
   'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', 1, 1),
  ('amboseli', 'Amboseli National Park', 'Kenya', 
   'One of Africa''s most iconic wildlife destinations — Amboseli is world-famous for its great herds of elephants roaming the open plains with Mount Kilimanjaro as a dramatic backdrop. The Land of Giant Elephants is every photographer''s dream destination.', 
   'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80', 1, 1);

-- Add Kenya-specific tours
INSERT IGNORE INTO tours (slug, title, destination_id, category, difficulty, description, short_desc, duration_days, group_size_min, group_size_max, price_per_person, price_child, cover_image, highlights, inclusions, exclusions, is_featured, is_active)
VALUES
  ('masai-mara-wildebeest-migration', 'Masai Mara Great Migration Safari', 
   (SELECT id FROM destinations WHERE slug='masai-mara' LIMIT 1), 
   'safari', 'easy',
   'Witness one of nature''s greatest spectacles — the annual wildebeest migration across the Mara River. Join two million wildebeest, 500,000 zebras, and countless predators in a dramatic dance of survival. Our expert guides position you at the best river crossing points for heart-stopping action.',
   'Watch two million wildebeest cross the Mara River in Kenya''s greatest wildlife spectacle.',
   4, 2, 12, 1200.00, 700.00,
   'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80',
   '["Mara River wildebeest crossing","Predator tracking with expert guides","Luxury tented camp accommodation","Sunrise hot air balloon option","Big Five game drives","Sundowner on the savannah"]',
   '["Professional safari guide & 4WD vehicle","2 morning & 2 afternoon game drives daily","Full board luxury tented camp","Park fees & conservancy charges","Airport transfers from Nairobi Wilson Airport","All park fees"]',
   '["International flights","Visa fees","Travel insurance","Gratuities","Optional balloon safari ($450pp)","Alcoholic beverages"]',
   1, 1),

  ('mombasa-cultural-tour', 'Mombasa Old Town & Coast Explorer', 
   (SELECT id FROM destinations WHERE slug='mombasa-coast' LIMIT 1), 
   'cultural', 'easy',
   'Discover the soul of Kenya''s ancient coast city. Walk through the labyrinthine alleys of Mombasa Old Town, explore the UNESCO-listed Fort Jesus, taste authentic Swahili cuisine, and swim in the turquoise waters of the Indian Ocean. A perfect blend of culture and beach.',
   'Explore Kenya''s ancient Swahili coast — Fort Jesus, spice markets, and white sand beaches.',
   3, 2, 15, 580.00, 320.00,
   'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
   '["Fort Jesus UNESCO World Heritage Site","Old Town spice & culture walk","Swahili cooking class","Dhow sunset cruise","Nyali Beach relaxation","Haller Park wildlife sanctuary"]',
   '["Professional cultural guide","Fort Jesus & museum entrance fees","Dhow cruise","Swahili cooking experience","Hotel accommodation (2 nights)","Daily breakfast & dinner","Airport transfers"]',
   '["International flights","Visa fees","Travel insurance","Lunches","Alcoholic beverages","Personal shopping"]',
   1, 1),

  ('diani-beach-escape', 'Diani Beach Paradise Escape', 
   (SELECT id FROM destinations WHERE slug='diani-beach' LIMIT 1), 
   'beach', 'easy',
   'Surrender to the pure magic of Diani Beach — consistently ranked among Africa''s top beaches. Swim in crystal-clear Indian Ocean waters, snorkel vibrant coral reefs, watch colobus monkeys swing through coastal forest, and enjoy world-class seafood as the sun sets over the palms.',
   'White sands, coral reefs, and colobus monkeys on Kenya''s most beautiful coastline.',
   5, 1, 20, 850.00, 480.00,
   'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
   '["17km of private white sand beach","Snorkelling at Kisite Mpunguti Marine Park","Colobus monkey forest walk","Deep-sea fishing excursion","Shimba Hills elephant day trip","Sunset dhow cruise"]',
   '["Return transfers from Mombasa/Ukunda","5 nights at selected beach resort","Daily breakfast & dinner","Snorkelling equipment","One guided excursion","All resort fees & taxes"]',
   '["International flights","Visa fees","Travel insurance","Lunch","Optional activities","Personal spending"]',
   1, 1),

  ('amboseli-elephant-safari', 'Amboseli Elephant & Kilimanjaro Safari', 
   (SELECT id FROM destinations WHERE slug='amboseli' LIMIT 1), 
   'wildlife', 'easy',
   'Stand face to face with the largest elephants in Africa, with the snow-capped summit of Mount Kilimanjaro towering behind them. Amboseli National Park offers Kenya''s most dramatic and photogenic safari experience — a landscape of swamps, open plains, and acacia woodlands.',
   'Africa''s most photogenic safari — giant elephants beneath Kilimanjaro''s snow-capped peak.',
   3, 2, 10, 980.00, 560.00,
   'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80',
   '["World-famous Kilimanjaro elephant herds","Observation Hill panoramic viewpoint","Enkongo Narok & Longinye swamp drives","Maasai village cultural visit","Chyulu Hills views","Pelican colonies at the swamps"]',
   '["Professional wildlife guide","2 full days of game drives","Full board lodge accommodation","All park entrance fees","Return transfers from Nairobi","Sundowner experience"]',
   '["International flights","Visa fees","Travel insurance","Gratuities","Personal items","Optional hot air balloon"]',
   1, 1);

SELECT 'Done! Tours updated.' as status;
SELECT COUNT(*) as total_tours FROM tours;
SELECT COUNT(*) as total_destinations FROM destinations;

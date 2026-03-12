-- ============================================================
-- WildSmiles Seed Data
-- Sample data for development & demonstration
-- ============================================================

USE wildsmiles_db;

-- Super Admin User (password: Admin@1234)
INSERT INTO users (uuid, email, password_hash, first_name, last_name, role, email_verified, is_active) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@wildsmiles.com', '$2a$12$LQv3c1yqBWVHxkd0LQ1Ns.dKHpzFzQSjxE9E9E9E9E9E9E9E9E9Ea', 'WildSmiles', 'Admin', 'super_admin', 1, 1),
('00000000-0000-0000-0000-000000000002', 'demo@wildsmiles.com', '$2a$12$LQv3c1yqBWVHxkd0LQ1Ns.dKHpzFzQSjxE9E9E9E9E9E9E9E9E9Ea', 'Demo', 'User', 'user', 1, 1);

-- Destinations
INSERT INTO destinations (slug, name, country, continent, short_desc, description, best_time, climate, is_featured, lat, lng) VALUES
('serengeti-national-park', 'Serengeti National Park', 'Tanzania', 'Africa',
 'Witness the greatest wildlife spectacle on Earth — the Great Migration.',
 'The Serengeti is one of the oldest and most biodiverse ecosystems on Earth. Spanning 14,750 km², it is home to 1.5 million wildebeest, hundreds of thousands of zebras, and an extraordinary concentration of lions, leopards, cheetahs, and elephants. The annual Great Migration is considered the greatest wildlife spectacle on the planet.',
 'June to October (dry season) for best wildlife viewing.',
 'Semi-arid savanna with distinct wet and dry seasons.',
 1, -2.3333, 34.8333),

('masai-mara', 'Masai Mara National Reserve', 'Kenya', 'Africa',
 'Africa''s greatest wildlife reserve — home to the Big Five.',
 'The Masai Mara is Kenya''s finest wildlife reserve, located in the Great Rift Valley. Famous for the annual wildebeest migration from July to October, the Mara offers unrivalled Big Five game viewing year-round. The golden grasslands, acacia forests, and winding Mara River create one of Africa''s most spectacular safari landscapes.',
 'July to October for the Great Migration.',
 'Warm and temperate with two rainy seasons.',
 1, -1.5833, 35.1500),

('victoria-falls', 'Victoria Falls', 'Zimbabwe/Zambia', 'Africa',
 'The Smoke That Thunders — one of the Seven Natural Wonders of the World.',
 'Victoria Falls, locally known as Mosi-oa-Tunya, is the world''s largest waterfall by combined width and height. Straddling the border between Zambia and Zimbabwe, these magnificent falls stretch 1.7 km wide and plunge 108 meters. Beyond the falls, the area offers bungee jumping, white-water rafting, game drives, and sunset cruises.',
 'February to May for maximum water flow; May to October for activities.',
 'Subtropical with distinct wet and dry seasons.',
 1, -17.9243, 25.8572),

('zanzibar-island', 'Zanzibar Island', 'Tanzania', 'Africa',
 'The Spice Island — pristine beaches, turquoise waters, and rich Swahili culture.',
 'Zanzibar is a semi-autonomous archipelago off the coast of Tanzania. Known as the Spice Island, it offers pristine white-sand beaches, crystal-clear turquoise waters, colorful coral reefs, and the historic UNESCO-listed Stone Town with its blend of African, Arab, Indian, and European influences. The island is perfect for beach relaxation, snorkeling, diving, and cultural exploration.',
 'June to October (dry season) for beach holidays.',
 'Tropical climate, warm year-round.',
 1, -6.1659, 39.2026),

('cape-town', 'Cape Town', 'South Africa', 'Africa',
 'The Mother City — stunning mountains, world-class wines, and incredible diversity.',
 'Cape Town is one of the most beautiful cities in the world, set against the dramatic backdrop of Table Mountain and the Atlantic Ocean. From the vibrant V&A Waterfront and Robben Island to the Cape Winelands and spectacular Cape Peninsula, the city offers a unique blend of natural beauty, cultural richness, adventure sports, and world-class dining.',
 'November to March (summer) for best weather.',
 'Mediterranean climate with warm, dry summers.',
 1, -33.9249, 18.4241),

('bwindi-forest', 'Bwindi Impenetrable Forest', 'Uganda', 'Africa',
 'Home to half the world''s remaining mountain gorillas.',
 'Bwindi Impenetrable National Park is a UNESCO World Heritage Site and one of Africa''s oldest and most biodiverse rainforests. Home to more than half of the world''s remaining mountain gorillas, Bwindi offers the extraordinary experience of gorilla trekking — tracking and observing gorilla families in their natural habitat. The forest also houses over 350 bird species.',
 'June to August and December to February (dry season).',
 'Tropical montane rainforest climate.',
 1, -1.0333, 29.6833);

-- Tours
INSERT INTO tours (slug, title, destination_id, category, difficulty, short_desc, description, duration_days, group_size_max, price_per_person, is_featured, highlights, inclusions, exclusions) VALUES
('serengeti-great-migration-safari', 'Serengeti Great Migration Safari', 1, 'safari', 'moderate',
 '7 days chasing the world''s most spectacular wildlife event.',
 'Embark on the ultimate African safari to witness the legendary Great Migration. Over 7 days, you''ll traverse the endless golden plains of the Serengeti, following the thundering herds of wildebeest and zebra. Experience dramatic river crossings, unbelievable predator-prey interactions, and sunsets that will stay with you forever. Stay in handpicked tented camps right in the heart of the action.',
 7, 12, 3200.00, 1,
 '["Great Migration river crossings","Big Five game drives","Luxury tented camps","Sunset sundowners on the plains","Expert Swahili-speaking guides","Hot air balloon option available"]',
 '["All game drives in 4x4 safari vehicle","6 nights accommodation","All meals (full board)","Airport transfers","Park fees and conservation levies","Professional guide","Bottled water during drives"]',
 '["International flights","Travel insurance","Gratuities","Visa fees","Personal expenses","Optional balloon safari ($450)"]'),

('masai-mara-big-five-safari', 'Masai Mara Big Five Safari', 2, 'safari', 'easy',
 '5 days of unforgettable wildlife encounters in Kenya''s finest reserve.',
 'The Masai Mara is arguably the finest wildlife destination in Africa, and our 5-day safari puts you right in the middle of it all. With twice-daily game drives, expert naturalist guides, and luxurious tented accommodation, this is the definitive Kenyan safari experience. Track lions on the prowl, watch elephants at sunset, and fall asleep to the sounds of the African bush.',
 5, 10, 2400.00, 1,
 '["Big Five game drives","Maasai cultural village visit","Mara River hippo viewing","Bush breakfast in the savanna","Sundowner with panoramic views","Night game drive (seasonal)"]',
 '["All game drives in custom 4x4","4 nights luxury camp","All meals","Transfers from Nairobi","Park fees","Expert guide"]',
 '["International flights","Visa fees","Travel insurance","Personal expenses","Alcoholic beverages"]'),

('victoria-falls-adventure', 'Victoria Falls Multi-Activity Adventure', 3, 'adventure', 'challenging',
 '4 days of adrenaline at the Smoke That Thunders.',
 'Feel the thunder of the world''s most powerful waterfall as your backdrop for 4 days of non-stop adventure. From the terrifying Batoka Gorge white-water rafting (grade 5 rapids) to the 111m bungee jump, helicopter flips over the falls, and sunset river cruises, this trip packs more adventure into 4 days than most people experience in a lifetime.',
 4, 16, 1850.00, 1,
 '["White-water rafting Batoka Gorge","Bungee jump from Victoria Falls Bridge","Helicopter Flight of Angels","Guided falls tour (both sides)","Sunset cruise on Zambezi River","Village cultural tour"]',
 '["3 nights lodge accommodation","Breakfast daily","All listed activities","Transfers","Safety equipment and guides"]',
 '["International flights","Lunches and dinners","Travel insurance","Visa fees","Optional zipline ($65)"]'),

('zanzibar-beach-retreat', 'Zanzibar Spice & Beach Retreat', 4, 'beach', 'easy',
 '6 days of paradise — beaches, spice farms, and Stone Town.',
 'Escape to the paradise island of Zanzibar for the ultimate Indian Ocean beach holiday. Spend your days on pristine white-sand beaches with turquoise waters, explore the aromatic spice farms of the interior, wander the UNESCO-listed Stone Town''s labyrinthine streets, and snorkel or dive in the extraordinary coral reefs. This is Africa''s finest beach destination.',
 6, 20, 1600.00, 1,
 '["Nungwi Beach relaxation","Stone Town UNESCO heritage tour","Spice farm tour with cooking demo","Snorkeling at Mnemba Atoll","Sunset dhow cruise","Prison Island giant tortoise visit"]',
 '["5 nights boutique hotel","Daily breakfast","Stone Town tour","Spice tour","Dhow cruise","Airport transfers"]',
 '["International flights","Visa fees","Travel insurance","Diving courses","Personal expenses"]'),

('cape-peninsula-explorer', 'Cape Town & Peninsula Explorer', 5, 'city', 'easy',
 '5 days discovering the most beautiful city in Africa.',
 'Cape Town regularly tops lists of the world''s most beautiful cities, and after this 5-day explorer tour, you''ll know exactly why. Cable car up Table Mountain for panoramic views, cruise to Robben Island (Nelson Mandela''s prison), drive the legendary Cape Peninsula past Boulders Beach''s African penguins to Cape Point, and taste your way through the Cape Winelands.',
 5, 14, 1400.00, 1,
 '["Table Mountain cable car","Robben Island UNESCO tour","Cape Peninsula scenic drive","Boulders Beach penguins","Cape Winelands tasting","V&A Waterfront exploration"]',
 '["4 nights boutique hotel","Daily breakfast","All guided tours","Transfers","Cable car fees","Robben Island entry"]',
 '["International flights","Visa fees","Travel insurance","Lunches and dinners","Personal shopping"]'),

('gorilla-trekking-bwindi', 'Bwindi Gorilla Trekking Expedition', 6, 'wildlife', 'challenging',
 '4 days tracking mountain gorillas in their ancient rainforest home.',
 'Gorilla trekking in Bwindi''s ancient impenetrable forest is one of the most extraordinary wildlife encounters on Earth. On this 4-day expedition, you''ll trek through the mystical forest in search of habituated gorilla families, spending an unforgettable hour in their presence. Combined with luxury forest lodge accommodation and exceptional birdwatching, this is a life-changing African experience.',
 4, 8, 4200.00, 1,
 '["Gorilla trekking permit included","1 hour with gorilla family","Expert tracker guides","Luxury forest lodge","Community walk","Birdwatching in ancient forest"]',
 '["Gorilla trekking permit ($700)","3 nights luxury lodge","All meals","Expert guide and trackers","4WD transport","Park fees"]',
 '["International/domestic flights","Travel insurance","Visa fees","Gratuities","Personal expenses"]');

-- Reviews (sample)
INSERT INTO reviews (user_id, review_type, entity_id, rating, title, content, is_approved) VALUES
(2, 'tour', 1, 5, 'Absolutely life-changing experience!', 'Words cannot describe witnessing the Great Migration. Thousands of wildebeest crossing the Mara River with crocodiles lurking below... our guide was phenomenal, the camp was luxury, and every moment was magic. Book this before you die.', 1),
(2, 'tour', 2, 5, 'Best safari in Africa', 'We saw all Big Five on day one! The Mara delivered beyond all expectations. Our guide Francis had eagle eyes and knew exactly where to find the animals. Worth every penny.', 1),
(2, 'destination', 1, 5, 'The most spectacular place on Earth', 'Standing on the Serengeti plains as thousands of animals stretch to the horizon... there is nothing like it. Tanzania has stolen my heart forever.', 1);

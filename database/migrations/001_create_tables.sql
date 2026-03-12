-- ============================================================
-- WildSmiles Database Schema
-- Full production-ready schema with all relationships
-- ============================================================

CREATE DATABASE IF NOT EXISTS wildsmiles_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE wildsmiles_db;

-- ============================================================
-- USERS & AUTHENTICATION
-- ============================================================

CREATE TABLE users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  uuid          VARCHAR(36)  NOT NULL UNIQUE,
  email         VARCHAR(191) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  phone         VARCHAR(30),
  avatar        VARCHAR(500),
  role          ENUM('user','guide','admin','super_admin') NOT NULL DEFAULT 'user',
  email_verified TINYINT(1)  NOT NULL DEFAULT 0,
  email_verify_token VARCHAR(255),
  password_reset_token VARCHAR(255),
  password_reset_expires DATETIME,
  is_active     TINYINT(1)  NOT NULL DEFAULT 1,
  last_login    DATETIME,
  created_at    DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email  (email),
  INDEX idx_uuid   (uuid),
  INDEX idx_role   (role)
) ENGINE=InnoDB;

CREATE TABLE user_profiles (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         INT UNSIGNED NOT NULL UNIQUE,
  bio             TEXT,
  nationality     VARCHAR(100),
  date_of_birth   DATE,
  gender          ENUM('male','female','other','prefer_not_to_say'),
  address         VARCHAR(500),
  city            VARCHAR(100),
  country         VARCHAR(100),
  passport_number VARCHAR(100),
  emergency_contact_name  VARCHAR(200),
  emergency_contact_phone VARCHAR(50),
  travel_preferences JSON,
  total_trips     INT UNSIGNED DEFAULT 0,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE admin_users (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL UNIQUE,
  permissions JSON,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- DESTINATIONS
-- ============================================================

CREATE TABLE destinations (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug            VARCHAR(200) NOT NULL UNIQUE,
  name            VARCHAR(200) NOT NULL,
  country         VARCHAR(100) NOT NULL,
  continent       ENUM('Africa','Europe','Asia','Americas','Oceania','Antarctica') NOT NULL,
  description     TEXT,
  short_desc      VARCHAR(500),
  cover_image     VARCHAR(500),
  gallery         JSON,
  highlights      JSON,
  best_time       VARCHAR(200),
  climate         VARCHAR(200),
  currency        VARCHAR(50),
  language        VARCHAR(200),
  timezone        VARCHAR(100),
  lat             DECIMAL(10,7),
  lng             DECIMAL(10,7),
  is_featured     TINYINT(1) NOT NULL DEFAULT 0,
  is_active       TINYINT(1) NOT NULL DEFAULT 1,
  meta_title      VARCHAR(300),
  meta_description VARCHAR(500),
  tour_count      INT UNSIGNED DEFAULT 0,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug      (slug),
  INDEX idx_country   (country),
  INDEX idx_continent (continent),
  INDEX idx_featured  (is_featured)
) ENGINE=InnoDB;

CREATE TABLE destination_attractions (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  destination_id INT UNSIGNED NOT NULL,
  name           VARCHAR(200) NOT NULL,
  description    TEXT,
  image          VARCHAR(500),
  category       VARCHAR(100),
  FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- TOURS
-- ============================================================

CREATE TABLE tours (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug              VARCHAR(200) NOT NULL UNIQUE,
  title             VARCHAR(300) NOT NULL,
  destination_id    INT UNSIGNED NOT NULL,
  guide_id          INT UNSIGNED,
  category          ENUM('safari','adventure','cultural','city','nature','beach','mountain','wildlife','historical','food') NOT NULL,
  difficulty        ENUM('easy','moderate','challenging','extreme') NOT NULL DEFAULT 'moderate',
  description       TEXT,
  short_desc        VARCHAR(500),
  duration_days     INT UNSIGNED NOT NULL,
  group_size_min    INT UNSIGNED NOT NULL DEFAULT 1,
  group_size_max    INT UNSIGNED NOT NULL DEFAULT 20,
  price_per_person  DECIMAL(10,2) NOT NULL,
  price_child       DECIMAL(10,2),
  price_private     DECIMAL(10,2),
  cover_image       VARCHAR(500),
  gallery           JSON,
  highlights        JSON,
  inclusions        JSON,
  exclusions        JSON,
  meeting_point     VARCHAR(500),
  meeting_lat       DECIMAL(10,7),
  meeting_lng       DECIMAL(10,7),
  languages         JSON,
  what_to_bring     JSON,
  cancellation_policy TEXT,
  is_featured       TINYINT(1) NOT NULL DEFAULT 0,
  is_active         TINYINT(1) NOT NULL DEFAULT 1,
  is_instant_book   TINYINT(1) NOT NULL DEFAULT 1,
  avg_rating        DECIMAL(3,2) DEFAULT 0.00,
  review_count      INT UNSIGNED DEFAULT 0,
  booking_count     INT UNSIGNED DEFAULT 0,
  meta_title        VARCHAR(300),
  meta_description  VARCHAR(500),
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE RESTRICT,
  FOREIGN KEY (guide_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_slug        (slug),
  INDEX idx_destination (destination_id),
  INDEX idx_category    (category),
  INDEX idx_featured    (is_featured),
  INDEX idx_price       (price_per_person),
  INDEX idx_rating      (avg_rating),
  FULLTEXT idx_search   (title, description)
) ENGINE=InnoDB;

CREATE TABLE tour_itineraries (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tour_id     INT UNSIGNED NOT NULL,
  day_number  INT UNSIGNED NOT NULL,
  title       VARCHAR(300) NOT NULL,
  description TEXT,
  activities  JSON,
  meals       JSON,
  accommodation VARCHAR(300),
  distance_km DECIMAL(8,2),
  FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
  INDEX idx_tour (tour_id)
) ENGINE=InnoDB;

CREATE TABLE tour_availability (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tour_id         INT UNSIGNED NOT NULL,
  available_date  DATE NOT NULL,
  spots_total     INT UNSIGNED NOT NULL,
  spots_booked    INT UNSIGNED NOT NULL DEFAULT 0,
  price_override  DECIMAL(10,2),
  is_available    TINYINT(1) NOT NULL DEFAULT 1,
  FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
  UNIQUE KEY uq_tour_date (tour_id, available_date),
  INDEX idx_tour  (tour_id),
  INDEX idx_date  (available_date)
) ENGINE=InnoDB;

-- ============================================================
-- HOTELS
-- ============================================================

CREATE TABLE hotels (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug           VARCHAR(200) NOT NULL UNIQUE,
  name           VARCHAR(300) NOT NULL,
  destination_id INT UNSIGNED NOT NULL,
  star_rating    TINYINT UNSIGNED NOT NULL DEFAULT 3,
  description    TEXT,
  address        VARCHAR(500),
  lat            DECIMAL(10,7),
  lng            DECIMAL(10,7),
  cover_image    VARCHAR(500),
  gallery        JSON,
  amenities      JSON,
  check_in_time  TIME,
  check_out_time TIME,
  avg_rating     DECIMAL(3,2) DEFAULT 0.00,
  review_count   INT UNSIGNED DEFAULT 0,
  is_active      TINYINT(1) NOT NULL DEFAULT 1,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE RESTRICT,
  INDEX idx_destination (destination_id)
) ENGINE=InnoDB;

CREATE TABLE hotel_rooms (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  hotel_id     INT UNSIGNED NOT NULL,
  room_type    VARCHAR(100) NOT NULL,
  description  TEXT,
  capacity     INT UNSIGNED NOT NULL DEFAULT 2,
  price_per_night DECIMAL(10,2) NOT NULL,
  images       JSON,
  amenities    JSON,
  is_available TINYINT(1) NOT NULL DEFAULT 1,
  FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- ACTIVITIES & EXPERIENCES
-- ============================================================

CREATE TABLE activities (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug           VARCHAR(200) NOT NULL UNIQUE,
  title          VARCHAR(300) NOT NULL,
  destination_id INT UNSIGNED NOT NULL,
  category       VARCHAR(100) NOT NULL,
  description    TEXT,
  short_desc     VARCHAR(500),
  duration_hours DECIMAL(5,2),
  price          DECIMAL(10,2) NOT NULL,
  cover_image    VARCHAR(500),
  gallery        JSON,
  inclusions     JSON,
  is_active      TINYINT(1) NOT NULL DEFAULT 1,
  avg_rating     DECIMAL(3,2) DEFAULT 0.00,
  FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ============================================================
-- PACKAGES (BUNDLED)
-- ============================================================

CREATE TABLE packages (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug            VARCHAR(200) NOT NULL UNIQUE,
  title           VARCHAR(300) NOT NULL,
  destination_id  INT UNSIGNED NOT NULL,
  description     TEXT,
  short_desc      VARCHAR(500),
  duration_days   INT UNSIGNED NOT NULL,
  price_per_person DECIMAL(10,2) NOT NULL,
  original_price  DECIMAL(10,2),
  cover_image     VARCHAR(500),
  gallery         JSON,
  highlights      JSON,
  inclusions      JSON,
  exclusions      JSON,
  is_featured     TINYINT(1) NOT NULL DEFAULT 0,
  is_active       TINYINT(1) NOT NULL DEFAULT 1,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE package_items (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  package_id  INT UNSIGNED NOT NULL,
  item_type   ENUM('tour','hotel','activity') NOT NULL,
  item_id     INT UNSIGNED NOT NULL,
  night_count INT UNSIGNED,
  notes       TEXT,
  FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- BOOKINGS
-- ============================================================

CREATE TABLE tour_bookings (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_ref       VARCHAR(20) NOT NULL UNIQUE,
  user_id           INT UNSIGNED NOT NULL,
  tour_id           INT UNSIGNED NOT NULL,
  tour_date         DATE NOT NULL,
  adults            INT UNSIGNED NOT NULL DEFAULT 1,
  children          INT UNSIGNED NOT NULL DEFAULT 0,
  infants           INT UNSIGNED NOT NULL DEFAULT 0,
  price_per_adult   DECIMAL(10,2) NOT NULL,
  price_per_child   DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount      DECIMAL(10,2) NOT NULL,
  discount_amount   DECIMAL(10,2) NOT NULL DEFAULT 0,
  status            ENUM('pending','confirmed','cancelled','completed','refunded') NOT NULL DEFAULT 'pending',
  special_requests  TEXT,
  traveler_details  JSON,
  cancellation_reason TEXT,
  cancelled_at      DATETIME,
  confirmed_at      DATETIME,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE RESTRICT,
  INDEX idx_user      (user_id),
  INDEX idx_tour      (tour_id),
  INDEX idx_status    (status),
  INDEX idx_date      (tour_date),
  INDEX idx_ref       (booking_ref)
) ENGINE=InnoDB;

CREATE TABLE hotel_bookings (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_ref     VARCHAR(20) NOT NULL UNIQUE,
  user_id         INT UNSIGNED NOT NULL,
  hotel_id        INT UNSIGNED NOT NULL,
  room_id         INT UNSIGNED NOT NULL,
  check_in_date   DATE NOT NULL,
  check_out_date  DATE NOT NULL,
  guests          INT UNSIGNED NOT NULL DEFAULT 1,
  total_amount    DECIMAL(10,2) NOT NULL,
  status          ENUM('pending','confirmed','cancelled','completed') NOT NULL DEFAULT 'pending',
  special_requests TEXT,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE RESTRICT,
  FOREIGN KEY (room_id) REFERENCES hotel_rooms(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ============================================================
-- PAYMENTS
-- ============================================================

CREATE TABLE payments (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  payment_ref       VARCHAR(50) NOT NULL UNIQUE,
  user_id           INT UNSIGNED NOT NULL,
  booking_type      ENUM('tour','hotel','package') NOT NULL,
  booking_id        INT UNSIGNED NOT NULL,
  amount            DECIMAL(10,2) NOT NULL,
  currency          VARCHAR(3) NOT NULL DEFAULT 'USD',
  method            ENUM('stripe','paypal','bank_transfer','cash') NOT NULL,
  status            ENUM('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
  gateway_payment_id VARCHAR(255),
  gateway_response  JSON,
  refund_amount     DECIMAL(10,2),
  refunded_at       DATETIME,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_user     (user_id),
  INDEX idx_booking  (booking_type, booking_id),
  INDEX idx_status   (status)
) ENGINE=InnoDB;

-- ============================================================
-- REVIEWS
-- ============================================================

CREATE TABLE reviews (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      INT UNSIGNED NOT NULL,
  review_type  ENUM('tour','hotel','destination','guide') NOT NULL,
  entity_id    INT UNSIGNED NOT NULL,
  rating       TINYINT UNSIGNED NOT NULL,
  title        VARCHAR(300),
  content      TEXT NOT NULL,
  images       JSON,
  helpful_count INT UNSIGNED DEFAULT 0,
  is_approved  TINYINT(1) NOT NULL DEFAULT 0,
  reply        TEXT,
  replied_at   DATETIME,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_entity  (review_type, entity_id),
  INDEX idx_approved (is_approved),
  CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB;

-- ============================================================
-- WISHLISTS
-- ============================================================

CREATE TABLE wishlists (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      INT UNSIGNED NOT NULL,
  item_type    ENUM('tour','destination','hotel','package') NOT NULL,
  item_id      INT UNSIGNED NOT NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_wishlist (user_id, item_type, item_id)
) ENGINE=InnoDB;

-- ============================================================
-- GUIDES / LOCAL MARKETPLACE
-- ============================================================

CREATE TABLE guide_profiles (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id          INT UNSIGNED NOT NULL UNIQUE,
  bio              TEXT,
  languages        JSON,
  specializations  JSON,
  certifications   JSON,
  location         VARCHAR(200),
  years_experience INT UNSIGNED,
  id_document      VARCHAR(500),
  is_verified      TINYINT(1) NOT NULL DEFAULT 0,
  is_approved      TINYINT(1) NOT NULL DEFAULT 0,
  avg_rating       DECIMAL(3,2) DEFAULT 0.00,
  tour_count       INT UNSIGNED DEFAULT 0,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  type        VARCHAR(100) NOT NULL,
  title       VARCHAR(300) NOT NULL,
  message     TEXT NOT NULL,
  data        JSON,
  is_read     TINYINT(1) NOT NULL DEFAULT 0,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user   (user_id),
  INDEX idx_unread (user_id, is_read)
) ENGINE=InnoDB;

-- ============================================================
-- COMMUNITY / TRAVEL STORIES
-- ============================================================

CREATE TABLE travel_stories (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       INT UNSIGNED NOT NULL,
  title         VARCHAR(300) NOT NULL,
  slug          VARCHAR(300) NOT NULL UNIQUE,
  content       LONGTEXT NOT NULL,
  cover_image   VARCHAR(500),
  gallery       JSON,
  destination_id INT UNSIGNED,
  tags          JSON,
  like_count    INT UNSIGNED DEFAULT 0,
  comment_count INT UNSIGNED DEFAULT 0,
  view_count    INT UNSIGNED DEFAULT 0,
  is_published  TINYINT(1) NOT NULL DEFAULT 0,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE story_comments (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  story_id   INT UNSIGNED NOT NULL,
  user_id    INT UNSIGNED NOT NULL,
  content    TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (story_id) REFERENCES travel_stories(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- NEWSLETTER
-- ============================================================

CREATE TABLE newsletter_subscribers (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email      VARCHAR(191) NOT NULL UNIQUE,
  is_active  TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- PROMO CODES
-- ============================================================

CREATE TABLE promo_codes (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code            VARCHAR(50) NOT NULL UNIQUE,
  description     VARCHAR(300),
  discount_type   ENUM('percentage','fixed') NOT NULL,
  discount_value  DECIMAL(10,2) NOT NULL,
  min_purchase    DECIMAL(10,2) DEFAULT 0,
  max_uses        INT UNSIGNED,
  used_count      INT UNSIGNED DEFAULT 0,
  valid_from      DATE NOT NULL,
  valid_until     DATE NOT NULL,
  is_active       TINYINT(1) NOT NULL DEFAULT 1,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- DATABASE INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX idx_tours_active_featured ON tours (is_active, is_featured);
CREATE INDEX idx_destinations_active    ON destinations (is_active, is_featured);
CREATE INDEX idx_bookings_date_status   ON tour_bookings (tour_date, status);

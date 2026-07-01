DROP DATABASE IF EXISTS db_name_placeholder;

CREATE DATABASE db_name_placeholder
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE db_name_placeholder;

-- ---------------------------------------------------------------------------
-- Users
-- ---------------------------------------------------------------------------
CREATE TABLE users (
    id            BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    firstname     VARCHAR(70)  NOT NULL,
    lastname      VARCHAR(70),
    phone         VARCHAR(20),
    email         VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role          ENUM('client', 'admin') NOT NULL DEFAULT 'client',
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_users_email UNIQUE (email)
);

-- ---------------------------------------------------------------------------
-- Dining tables (renamed from `tables` to avoid the reserved word)
-- ---------------------------------------------------------------------------
CREATE TABLE dining_tables (
    id         BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    label      VARCHAR(50),
    seats      INT NOT NULL,
    is_active  TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------------
-- Opening slots (when the restaurant is open for a given service)
-- ---------------------------------------------------------------------------
CREATE TABLE opening_slots (
    id         BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    date_time  DATETIME NOT NULL,
    duration   INT NOT NULL,                                   -- service length, in minutes
    service    ENUM('lunch', 'dinner') NOT NULL,
    available  TINYINT(1) NOT NULL DEFAULT 1,                  -- 0 = slot exceptionally closed
    comment    TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_opening_slots_datetime UNIQUE (date_time)
);

-- ---------------------------------------------------------------------------
-- Menu items
-- ---------------------------------------------------------------------------
CREATE TABLE menu_items (
    id           BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name         VARCHAR(150) NOT NULL,
    description  TEXT,
    price_cents  INT NOT NULL,                                 -- price stored in cents (1100 = 11.00 EUR)
    category     ENUM('entree', 'plat', 'dessert') NOT NULL,
    is_available TINYINT(1) NOT NULL DEFAULT 1,
    created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------------
-- Reservations
-- ---------------------------------------------------------------------------
CREATE TABLE reservations (
    id               BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    slot_id          BIGINT UNSIGNED NOT NULL,
    user_id          BIGINT UNSIGNED NOT NULL,
    number_of_people INT NOT NULL,
    starts_at        DATETIME NOT NULL,
    ends_at          DATETIME NOT NULL,
    status           ENUM('pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show')
                         NOT NULL DEFAULT 'pending',
    comment          TEXT,
    cancelled_at     DATETIME NULL,
    created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_reservations_slot FOREIGN KEY (slot_id) REFERENCES opening_slots(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_reservations_user FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_reservations_user (user_id),
    INDEX idx_reservations_slot (slot_id),
    INDEX idx_reservations_starts_status (starts_at, status)
);

-- ---------------------------------------------------------------------------
-- Reservation <-> tables (N-N)
-- ---------------------------------------------------------------------------
CREATE TABLE reservation_tables (
    reservation_id BIGINT UNSIGNED NOT NULL,
    table_id       BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (reservation_id, table_id),
    CONSTRAINT fk_rt_reservation FOREIGN KEY (reservation_id) REFERENCES reservations(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_rt_table FOREIGN KEY (table_id) REFERENCES dining_tables(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_rt_table (table_id)
);

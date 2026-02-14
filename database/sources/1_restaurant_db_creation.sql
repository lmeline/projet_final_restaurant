DROP DATABASE IF EXISTS restaurant_db;

CREATE DATABASE restaurant_db;

USE restaurant_db;


CREATE TABLE `users` (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    firstname VARCHAR(70) NOT NULL,
    lastname VARCHAR(70),
    phone VARCHAR(20),
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(128) NOT NULL,
    role ENUM('client', 'admin') NOT NULL DEFAULT 'client'
);

CREATE TABLE `tables` (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    seats INT NOT NULL
);

CREATE TABLE reservations (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    number_of_people INT NOT NULL,
    `date` DATE NOT NULL,
    `time` TIME NOT NULL,
    `status` ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    user_id BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE reservation_tables (
    reservation_id BIGINT UNSIGNED NOT NULL,
    table_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (reservation_id, table_id),
    FOREIGN KEY (reservation_id) REFERENCES reservations(id),
    FOREIGN KEY (table_id) REFERENCES `tables`(id)
);

CREATE TABLE menu_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    description TEXT,
    price INT NOT NULL,
    category ENUM('entrée', 'plat', 'dessert') NOT NULL
);

CREATE TABLE opening_slots (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    date_time DATETIME NOT NULL,
    duration INT NOT NULL,
    available TINYINT NOT NULL DEFAULT 1,
    comment TEXT
);
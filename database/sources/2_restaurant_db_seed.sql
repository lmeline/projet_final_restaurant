SET FOREIGN_KEY_CHECKS = 0; -- On coupe la surveillance pour nettoyer
TRUNCATE TABLE reservation_tables;
TRUNCATE TABLE reservations;
TRUNCATE TABLE tables;
TRUNCATE TABLE users;
TRUNCATE TABLE menu_items;
TRUNCATE TABLE opening_slots;
SET FOREIGN_KEY_CHECKS = 1; -- On remet la surveillance

USE restaurant_db;

-- 1. Utilisateurs (IDs 1, 2, 3)
INSERT INTO `users` (id, firstname, lastname, phone, email, password_hash, role) VALUES
(1, 'Jean', 'Dupont', '0601020304', 'jean.dupont@email.com', 'hash_password_123', 'client'),
(2, 'Marie', 'Curie', '0611223344', 'marie.curie@email.com', 'hash_password_456', 'client'),

-- 2. Tables (IDs 1 à 6)
INSERT INTO `tables` (id, seats) VALUES
(1, 2), (2, 2), (3, 4), (4, 4), (5, 6), (6, 8);

-- 3. Menu
INSERT INTO `menu_items` (name, description, price, category) VALUES
('Salade César', 'Poulet grillé, parmesan', 1200, 'entree'),
('Entrecôte frites', 'Viande bovine 300g', 2400, 'plat'),
('Tarte Tatin', 'Pommes caramélisées', 800, 'dessert');

-- 4. Créneaux
INSERT INTO `opening_slots` (date_time, duration, available, comment) VALUES
('2026-02-25 12:00:00', 180, 1, 'Midi'),
('2026-02-25 19:00:00', 240, 1, 'Soir');

-- 5. TOUTES les Réservations (IDs 1 à 9)
-- On en insère 9 d'un coup pour être sûr des IDs
INSERT INTO reservations (id, number_of_people, `date`, `time`, `status`, user_id, comment) VALUES
(1, 2, '2026-02-25', '12:00:00', 'confirmed', 1, 'Anniversaire'),
(2, 2, '2026-02-25', '12:15:00', 'confirmed', 2, 'Près de la fenêtre'),
(3, 4, '2026-02-25', '13:00:00', 'pending', 1, 'Besoin chaise haute'),
(4, 2, '2026-02-15', '12:30:00', 'confirmed', 1, 'Ancien test'),
(5, 4, '2026-02-15', '20:00:00', 'pending', 2, 'Ancien test'),
(6, 2, '2026-02-16', '13:00:00', 'confirmed', 1, 'Ancien test'),
(7, 6, '2026-02-25', '19:30:00', 'confirmed', 2, 'Table calme'),
(8, 4, '2026-02-25', '20:00:00', 'confirmed', 1, 'Client régulier'),
(9, 2, '2026-02-25', '21:00:00', 'pending', 2, 'Arrivée tardive');

-- 6. Liaison Tables (On utilise les IDs 1 à 9 de la table au-dessus)
INSERT INTO reservation_tables (reservation_id, table_id) VALUES
(1, 1), (2, 2), (3, 3), -- Midi
(4, 1), (5, 3), (6, 2), -- Anciens
(7, 5), (8, 4), (9, 1); -- Soir
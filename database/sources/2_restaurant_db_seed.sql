USE db_name_placeholder;

-- 1. Insertion des Utilisateurs (Un admin et quelques clients)
INSERT INTO `users` (firstname, lastname, phone, email, password_hash, role) VALUES
('Jean', 'Dupont', '0601020304', 'jean.dupont@email.com', 'hash_password_123', 'client'),
('Marie', 'Curie', '0611223344', 'marie.curie@email.com', 'hash_password_456', 'client'),
('Admin', 'Resto', '0102030405', 'admin@restaurant.com', 'admin_secure_hash_789', 'admin');

-- 2. Insertion des Tables (Capacités variées)
INSERT INTO `tables` (seats) VALUES
(2), (2), -- Deux tables de 2
(4), (4), -- Deux tables de 4
(6),       -- Une table de 6
(8);       -- Une grande table de 8

-- 3. Insertion des Articles du Menu
INSERT INTO `menu_items` (`name`, description, price, category) VALUES
('Soupe à l''oignon', 'Classique français avec croûtons et fromage fondu', 850, 'entree'),
('Salade César', 'Poulet grillé, parmesan, sauce maison', 1200, 'entree'),
('Entrecôte frites', 'Viande bovine 300g, frites maison, sauce au poivre', 2400, 'plat'),
('Risotto aux champignons', 'Riz arborio, mélange de champignons de saison', 1800, 'plat'),
('Mousse au chocolat', 'Chocolat noir 70%, onctueuse et légère', 700, 'dessert'),
('Tarte Tatin', 'Pommes caramélisées, servie avec crème fraîche', 800, 'dessert');

-- 4. Insertion des Créneaux d'Ouverture (Opening Slots)
-- On simule des créneaux de 2h (120 min)
INSERT INTO `opening_slots` (date_time, duration, available, comment) VALUES
('2026-02-15 12:00:00', 120, 1, 'Service du midi'),
('2026-02-15 19:30:00', 120, 1, 'Service du soir'),
('2026-02-16 12:00:00', 120, 1, 'Service du midi - Spécial Saint Valentin (retardé)');

-- 5. Insertion des Réservations
-- On lie les réservations aux IDs des users insérés plus haut (1 et 2)
INSERT INTO reservations (number_of_people, `date`, `time`, `status`, user_id) VALUES
(2, '2026-02-15', '12:30:00', 'confirmed', 1),
(4, '2026-02-15', '20:00:00', 'pending', 2),
(2, '2026-02-16', '13:00:00', 'confirmed', 1);

-- 6. Liaison Réservations <-> Tables (Table Pivot)
-- Réservation 1 (2 pers) -> Table 1 (2 seats)
-- Réservation 2 (4 pers) -> Table 3 (4 seats)
-- Réservation 3 (2 pers) -> Table 2 (2 seats)
INSERT INTO reservation_tables (reservation_id, table_id) VALUES
(1, 1),
(2, 3),
(3, 2);
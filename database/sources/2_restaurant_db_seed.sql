USE db_name_placeholder;

-- ---------------------------------------------------------------------------
-- 1. Users (ids 1 -> 8)
--    Seeded password for every account below: "Password1!"
-- ---------------------------------------------------------------------------
INSERT INTO users (id, firstname, lastname, phone, email, password_hash, role) VALUES
(1, 'Thomas',  'Bernard',  '0622334455', 'thomas.bernard@email.com',   '$2b$10$Q.OGnizPwZ.haa1TZTrx7.Eh/0OaU3teoSw7SUPq4.bQgH4XirEuS', 'client'),
(2, 'Léa',     'Petit',    '0633445566', 'lea.petit@email.com',        '$2b$10$Q.OGnizPwZ.haa1TZTrx7.Eh/0OaU3teoSw7SUPq4.bQgH4XirEuS', 'client'),
(3, 'Nicolas', 'Moreau',   '0644556677', 'nicolas.moreau@email.com',   '$2b$10$Q.OGnizPwZ.haa1TZTrx7.Eh/0OaU3teoSw7SUPq4.bQgH4XirEuS', 'admin'),
(4, 'Camille', 'Rousseau', '0655667788', 'camille.rousseau@email.com', '$2b$10$Q.OGnizPwZ.haa1TZTrx7.Eh/0OaU3teoSw7SUPq4.bQgH4XirEuS', 'client'),
(5, 'Julien',  'Blanc',    '0666778899', 'julien.blanc@email.com',     '$2b$10$Q.OGnizPwZ.haa1TZTrx7.Eh/0OaU3teoSw7SUPq4.bQgH4XirEuS', 'client'),
(6, 'Sarah',   'Guerin',   '0677889900', 'sarah.guerin@email.com',     '$2b$10$Q.OGnizPwZ.haa1TZTrx7.Eh/0OaU3teoSw7SUPq4.bQgH4XirEuS', 'client'),
(7, 'Antoine', 'Muller',   '0688990011', 'antoine.muller@email.com',   '$2b$10$Q.OGnizPwZ.haa1TZTrx7.Eh/0OaU3teoSw7SUPq4.bQgH4XirEuS', 'client'),
(8, 'Chloé',   'Fontaine', '0699001122', 'chloe.fontaine@email.com',   '$2b$10$Q.OGnizPwZ.haa1TZTrx7.Eh/0OaU3teoSw7SUPq4.bQgH4XirEuS', 'client');

-- ---------------------------------------------------------------------------
-- 2. Dining tables (ids 1 -> 12)
-- ---------------------------------------------------------------------------
INSERT INTO dining_tables (label, seats) VALUES
('T1', 2), ('T2', 2), ('T3', 4), ('T4', 4), ('T5', 6), ('T6', 8),
('T7', 2), ('T8', 2), ('T9', 4), ('T10', 4), ('T11', 10), ('T12', 12);

-- ---------------------------------------------------------------------------
-- 3. Menu
-- ---------------------------------------------------------------------------
INSERT INTO menu_items (name, description, price_cents, category) VALUES
-- ENTRÉES
('Burrata Crémeuse', 'Tomates d''antan et pesto basilic', 1100, 'entree'),
('Œufs Mayonnaise', 'Œufs plein air et mayo maison à l''ancienne', 700, 'entree'),
('Carpaccio de Thon', 'Citron vert et baies roses', 1400, 'entree'),

-- PLATS
('Risotto aux Champignons', 'Riz arborio, pleurotes et huile de truffe', 1900, 'plat'),
('Burger Maison', 'Bœuf charolais, cheddar affiné, oignons confits', 1850, 'plat'),
('Pavé de Saumon', 'Riz noir sauvage et sauce hollandaise', 2200, 'plat'),
('Souris d''Agneau', 'Cuite 7h, purée maison au beurre', 2600, 'plat'),

-- DESSERTS
('Fondant au Chocolat', 'Cœur coulant et glace vanille Madagascar', 900, 'dessert'),
('Mousse au Citron', 'Zestes de citron vert et sablé breton', 750, 'dessert'),
('Planche de Fromages', 'Sélection du sommelier et confiture de cerises', 1100, 'dessert');

-- ---------------------------------------------------------------------------
-- 4. Opening slots (lunch = 180 min, dinner = 240 min)
-- ---------------------------------------------------------------------------
INSERT INTO opening_slots (date_time, duration, service) VALUES
-- JUILLET 2026
('2026-07-01 12:00:00', 180, 'lunch'),
('2026-07-03 12:00:00', 180, 'lunch'), ('2026-07-03 19:00:00', 240, 'dinner'),
('2026-07-04 12:00:00', 180, 'lunch'), ('2026-07-04 19:00:00', 240, 'dinner'),
('2026-07-05 12:00:00', 180, 'lunch'), ('2026-07-05 19:00:00', 240, 'dinner'),
('2026-07-06 12:00:00', 180, 'lunch'), ('2026-07-06 19:00:00', 240, 'dinner'),
('2026-07-07 12:00:00', 180, 'lunch'), ('2026-07-07 19:00:00', 240, 'dinner'),
('2026-07-08 12:00:00', 180, 'lunch'),
('2026-07-10 12:00:00', 180, 'lunch'), ('2026-07-10 19:00:00', 240, 'dinner'),
('2026-07-11 12:00:00', 180, 'lunch'), ('2026-07-11 19:00:00', 240, 'dinner'),
('2026-07-12 12:00:00', 180, 'lunch'), ('2026-07-12 19:00:00', 240, 'dinner'),
('2026-07-13 12:00:00', 180, 'lunch'), ('2026-07-13 19:00:00', 240, 'dinner'),
('2026-07-14 12:00:00', 180, 'lunch'), ('2026-07-14 19:00:00', 240, 'dinner'),
('2026-07-15 12:00:00', 180, 'lunch'),
('2026-07-17 12:00:00', 180, 'lunch'), ('2026-07-17 19:00:00', 240, 'dinner'),
('2026-07-18 12:00:00', 180, 'lunch'), ('2026-07-18 19:00:00', 240, 'dinner'),
('2026-07-19 12:00:00', 180, 'lunch'), ('2026-07-19 19:00:00', 240, 'dinner'),
('2026-07-20 12:00:00', 180, 'lunch'), ('2026-07-20 19:00:00', 240, 'dinner'),
('2026-07-21 12:00:00', 180, 'lunch'), ('2026-07-21 19:00:00', 240, 'dinner'),
('2026-07-22 12:00:00', 180, 'lunch'),
('2026-07-24 12:00:00', 180, 'lunch'), ('2026-07-24 19:00:00', 240, 'dinner'),
('2026-07-25 12:00:00', 180, 'lunch'), ('2026-07-25 19:00:00', 240, 'dinner'),
('2026-07-26 12:00:00', 180, 'lunch'), ('2026-07-26 19:00:00', 240, 'dinner'),
('2026-07-27 12:00:00', 180, 'lunch'), ('2026-07-27 19:00:00', 240, 'dinner'),
('2026-07-28 12:00:00', 180, 'lunch'), ('2026-07-28 19:00:00', 240, 'dinner'),
('2026-07-29 12:00:00', 180, 'lunch'),
('2026-07-31 12:00:00', 180, 'lunch'), ('2026-07-31 19:00:00', 240, 'dinner'),

-- AOÛT 2026
('2026-08-01 12:00:00', 180, 'lunch'), ('2026-08-01 19:00:00', 240, 'dinner'),
('2026-08-02 12:00:00', 180, 'lunch'), ('2026-08-02 19:00:00', 240, 'dinner'),
('2026-08-03 12:00:00', 180, 'lunch'), ('2026-08-03 19:00:00', 240, 'dinner'),
('2026-08-04 12:00:00', 180, 'lunch'), ('2026-08-04 19:00:00', 240, 'dinner'),
('2026-08-05 12:00:00', 180, 'lunch'),
('2026-08-07 12:00:00', 180, 'lunch'), ('2026-08-07 19:00:00', 240, 'dinner'),
('2026-08-08 12:00:00', 180, 'lunch'), ('2026-08-08 19:00:00', 240, 'dinner'),
('2026-08-09 12:00:00', 180, 'lunch'), ('2026-08-09 19:00:00', 240, 'dinner'),
('2026-08-10 12:00:00', 180, 'lunch'), ('2026-08-10 19:00:00', 240, 'dinner'),
('2026-08-11 12:00:00', 180, 'lunch'), ('2026-08-11 19:00:00', 240, 'dinner'),
('2026-08-12 12:00:00', 180, 'lunch'),
('2026-08-14 12:00:00', 180, 'lunch'), ('2026-08-14 19:00:00', 240, 'dinner'),
('2026-08-15 12:00:00', 180, 'lunch'), ('2026-08-15 19:00:00', 240, 'dinner'),
('2026-08-16 12:00:00', 180, 'lunch'), ('2026-08-16 19:00:00', 240, 'dinner'),
('2026-08-17 12:00:00', 180, 'lunch'), ('2026-08-17 19:00:00', 240, 'dinner'),
('2026-08-18 12:00:00', 180, 'lunch'), ('2026-08-18 19:00:00', 240, 'dinner'),
('2026-08-19 12:00:00', 180, 'lunch'),
('2026-08-21 12:00:00', 180, 'lunch'), ('2026-08-21 19:00:00', 240, 'dinner'),
('2026-08-22 12:00:00', 180, 'lunch'), ('2026-08-22 19:00:00', 240, 'dinner'),
('2026-08-23 12:00:00', 180, 'lunch'), ('2026-08-23 19:00:00', 240, 'dinner'),
('2026-08-24 12:00:00', 180, 'lunch'), ('2026-08-24 19:00:00', 240, 'dinner'),
('2026-08-25 12:00:00', 180, 'lunch'), ('2026-08-25 19:00:00', 240, 'dinner'),
('2026-08-26 12:00:00', 180, 'lunch'),
('2026-08-28 12:00:00', 180, 'lunch'), ('2026-08-28 19:00:00', 240, 'dinner'),
('2026-08-29 12:00:00', 180, 'lunch'), ('2026-08-29 19:00:00', 240, 'dinner'),
('2026-08-30 12:00:00', 180, 'lunch'), ('2026-08-30 19:00:00', 240, 'dinner');

-- ---------------------------------------------------------------------------
-- 5. Reservations (ids 1 -> 8)
--    A reservation occupies its table(s) for 2h (ends_at = starts_at + 2h).
--    slot_id is resolved from the matching opening slot.
-- ---------------------------------------------------------------------------
INSERT INTO reservations (id, slot_id, user_id, number_of_people, starts_at, ends_at, status, comment) VALUES
-- Vendredi 3 Juillet (midi & soir)
(1, (SELECT id FROM opening_slots WHERE date_time = '2026-07-03 12:00:00'), 1, 2,  '2026-07-03 12:00:00', '2026-07-03 14:00:00', 'confirmed', 'Déjeuner pro'),
(2, (SELECT id FROM opening_slots WHERE date_time = '2026-07-03 19:00:00'), 2, 8,  '2026-07-03 19:30:00', '2026-07-03 21:30:00', 'confirmed', 'Groupe amis'),
(3, (SELECT id FROM opening_slots WHERE date_time = '2026-07-03 19:00:00'), 3, 4,  '2026-07-03 20:00:00', '2026-07-03 22:00:00', 'confirmed', NULL),
-- Lundi 6 Juillet (grosse soirée)
(4, (SELECT id FROM opening_slots WHERE date_time = '2026-07-06 19:00:00'), 4, 15, '2026-07-06 20:00:00', '2026-07-06 22:00:00', 'confirmed', 'Privatisation partielle - Anniversaire'),
(5, (SELECT id FROM opening_slots WHERE date_time = '2026-07-06 19:00:00'), 5, 2,  '2026-07-06 19:00:00', '2026-07-06 21:00:00', 'confirmed', 'Table romantique'),
-- Mardi 7 Juillet
(6, (SELECT id FROM opening_slots WHERE date_time = '2026-07-07 12:00:00'), 6, 6,  '2026-07-07 12:30:00', '2026-07-07 14:30:00', 'confirmed', 'Famille'),
(7, (SELECT id FROM opening_slots WHERE date_time = '2026-07-07 19:00:00'), 7, 4,  '2026-07-07 20:00:00', '2026-07-07 22:00:00', 'pending',   'Attente confirmation'),
-- Mercredi 8 Juillet (midi seulement)
(8, (SELECT id FROM opening_slots WHERE date_time = '2026-07-08 12:00:00'), 8, 10, '2026-07-08 12:00:00', '2026-07-08 14:00:00', 'confirmed', 'Grande tablée familiale');

-- ---------------------------------------------------------------------------
-- 6. Reservation <-> tables
-- ---------------------------------------------------------------------------
INSERT INTO reservation_tables (reservation_id, table_id) VALUES
-- Réservations standards
(1, 7),  -- 2 pers -> T7 (2 places)
(3, 4),  -- 4 pers -> T4 (4 places)
(5, 8),  -- 2 pers -> T8 (2 places)
(6, 5),  -- 6 pers -> T5 (6 places)
(7, 9),  -- 4 pers -> T9 (4 places)
-- Réservation 2 (8 pers) -> table de 8
(2, 6),
-- Réservation 4 (15 pers) -> 3 tables (10 + 4 + 2 = 16 places)
(4, 11),
(4, 3),
(4, 1),
-- Réservation 8 (10 pers) -> grande table de 12
(8, 12);

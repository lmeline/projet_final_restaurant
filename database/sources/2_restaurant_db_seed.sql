
USE db_name_placeholder;

-- 1. Utilisateurs (IDs 1, 2, 3)
INSERT INTO `users` (id, firstname, lastname, phone, email, password_hash, role) VALUES
(3, 'Thomas', 'Bernard', '0622334455', 'thomas.bernard@email.com', 'hash_pwd_789', 'client'),
(4, 'Léa', 'Petit', '0633445566', 'lea.petit@email.com', 'hash_pwd_012', 'client'),
(5, 'Nicolas', 'Moreau', '0644556677', 'nicolas.moreau@email.com', 'hash_pwd_345', 'admin'),
(6, 'Camille', 'Rousseau', '0655667788', 'camille.rousseau@email.com', 'hash_pwd_678', 'client'),
(7, 'Julien', 'Blanc', '0666778899', 'julien.blanc@email.com', 'hash_pwd_901', 'client'),
(8, 'Sarah', 'Guerin', '0677889900', 'sarah.guerin@email.com', 'hash_pwd_234', 'client'),
(9, 'Antoine', 'Muller', '0688990011', 'antoine.muller@email.com', 'hash_pwd_567', 'client'),
(10, 'Chloé', 'Fontaine', '0699001122', 'chloe.fontaine@email.com', 'hash_pwd_890', 'client');

-- 2. Tables (IDs 1 à 6)
INSERT INTO `tables` (seats) VALUES
(2), (2), (4), (4), (6), (8), (2), (2), (4), (4), (10), (12);

-- 3. Menu
INSERT INTO `menu_items` (name, description, price, category) VALUES
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

-- 4. Créneaux
INSERT INTO `opening_slots` (date_time, duration, available, comment) VALUES
-- MARS 2026
('2026-03-01 12:00:00', 180, 1, 'Midi'), -- Dimanche (Midi seulement)
('2026-03-03 12:00:00', 180, 1, 'Midi'), ('2026-03-03 19:00:00', 240, 1, 'Soir'),
('2026-03-04 12:00:00', 180, 1, 'Midi'), ('2026-03-04 19:00:00', 240, 1, 'Soir'),
('2026-03-05 12:00:00', 180, 1, 'Midi'), ('2026-03-05 19:00:00', 240, 1, 'Soir'),
('2026-03-06 12:00:00', 180, 1, 'Midi'), ('2026-03-06 19:00:00', 240, 1, 'Soir'),
('2026-03-07 12:00:00', 180, 1, 'Midi'), ('2026-03-07 19:00:00', 240, 1, 'Soir'),
('2026-03-08 12:00:00', 180, 1, 'Midi'),
('2026-03-10 12:00:00', 180, 1, 'Midi'), ('2026-03-10 19:00:00', 240, 1, 'Soir'),
('2026-03-11 12:00:00', 180, 1, 'Midi'), ('2026-03-11 19:00:00', 240, 1, 'Soir'),
('2026-03-12 12:00:00', 180, 1, 'Midi'), ('2026-03-12 19:00:00', 240, 1, 'Soir'),
('2026-03-13 12:00:00', 180, 1, 'Midi'), ('2026-03-13 19:00:00', 240, 1, 'Soir'),
('2026-03-14 12:00:00', 180, 1, 'Midi'), ('2026-03-14 19:00:00', 240, 1, 'Soir'),
('2026-03-15 12:00:00', 180, 1, 'Midi'),
('2026-03-17 12:00:00', 180, 1, 'Midi'), ('2026-03-17 19:00:00', 240, 1, 'Soir'),
('2026-03-18 12:00:00', 180, 1, 'Midi'), ('2026-03-18 19:00:00', 240, 1, 'Soir'),
('2026-03-19 12:00:00', 180, 1, 'Midi'), ('2026-03-19 19:00:00', 240, 1, 'Soir'),
('2026-03-20 12:00:00', 180, 1, 'Midi'), ('2026-03-20 19:00:00', 240, 1, 'Soir'),
('2026-03-21 12:00:00', 180, 1, 'Midi'), ('2026-03-21 19:00:00', 240, 1, 'Soir'),
('2026-03-22 12:00:00', 180, 1, 'Midi'),
('2026-03-24 12:00:00', 180, 1, 'Midi'), ('2026-03-24 19:00:00', 240, 1, 'Soir'),
('2026-03-25 12:00:00', 180, 1, 'Midi'), ('2026-03-25 19:00:00', 240, 1, 'Soir'),
('2026-03-26 12:00:00', 180, 1, 'Midi'), ('2026-03-26 19:00:00', 240, 1, 'Soir'),
('2026-03-27 12:00:00', 180, 1, 'Midi'), ('2026-03-27 19:00:00', 240, 1, 'Soir'),
('2026-03-28 12:00:00', 180, 1, 'Midi'), ('2026-03-28 19:00:00', 240, 1, 'Soir'),
('2026-03-29 12:00:00', 180, 1, 'Midi'),
('2026-03-31 12:00:00', 180, 1, 'Midi'), ('2026-03-31 19:00:00', 240, 1, 'Soir'),

-- AVRIL 2026
('2026-04-01 12:00:00', 180, 1, 'Midi'), ('2026-04-01 19:00:00', 240, 1, 'Soir'),
('2026-04-02 12:00:00', 180, 1, 'Midi'), ('2026-04-02 19:00:00', 240, 1, 'Soir'),
('2026-04-03 12:00:00', 180, 1, 'Midi'), ('2026-04-03 19:00:00', 240, 1, 'Soir'),
('2026-04-04 12:00:00', 180, 1, 'Midi'), ('2026-04-04 19:00:00', 240, 1, 'Soir'),
('2026-04-05 12:00:00', 180, 1, 'Midi'),
('2026-04-07 12:00:00', 180, 1, 'Midi'), ('2026-04-07 19:00:00', 240, 1, 'Soir'),
('2026-04-08 12:00:00', 180, 1, 'Midi'), ('2026-04-08 19:00:00', 240, 1, 'Soir'),
('2026-04-09 12:00:00', 180, 1, 'Midi'), ('2026-04-09 19:00:00', 240, 1, 'Soir'),
('2026-04-10 12:00:00', 180, 1, 'Midi'), ('2026-04-10 19:00:00', 240, 1, 'Soir'),
('2026-04-11 12:00:00', 180, 1, 'Midi'), ('2026-04-11 19:00:00', 240, 1, 'Soir'),
('2026-04-12 12:00:00', 180, 1, 'Midi'),
('2026-04-14 12:00:00', 180, 1, 'Midi'), ('2026-04-14 19:00:00', 240, 1, 'Soir'),
('2026-04-15 12:00:00', 180, 1, 'Midi'), ('2026-04-15 19:00:00', 240, 1, 'Soir'),
('2026-04-16 12:00:00', 180, 1, 'Midi'), ('2026-04-16 19:00:00', 240, 1, 'Soir'),
('2026-04-17 12:00:00', 180, 1, 'Midi'), ('2026-04-17 19:00:00', 240, 1, 'Soir'),
('2026-04-18 12:00:00', 180, 1, 'Midi'), ('2026-04-18 19:00:00', 240, 1, 'Soir'),
('2026-04-19 12:00:00', 180, 1, 'Midi'),
('2026-04-21 12:00:00', 180, 1, 'Midi'), ('2026-04-21 19:00:00', 240, 1, 'Soir'),
('2026-04-22 12:00:00', 180, 1, 'Midi'), ('2026-04-22 19:00:00', 240, 1, 'Soir'),
('2026-04-23 12:00:00', 180, 1, 'Midi'), ('2026-04-23 19:00:00', 240, 1, 'Soir'),
('2026-04-24 12:00:00', 180, 1, 'Midi'), ('2026-04-24 19:00:00', 240, 1, 'Soir'),
('2026-04-25 12:00:00', 180, 1, 'Midi'), ('2026-04-25 19:00:00', 240, 1, 'Soir'),
('2026-04-26 12:00:00', 180, 1, 'Midi'),
('2026-04-28 12:00:00', 180, 1, 'Midi'), ('2026-04-28 19:00:00', 240, 1, 'Soir'),
('2026-04-29 12:00:00', 180, 1, 'Midi'), ('2026-04-29 19:00:00', 240, 1, 'Soir'),
('2026-04-30 12:00:00', 180, 1, 'Midi'), ('2026-04-30 19:00:00', 240, 1, 'Soir');

-- 5. TOUTES les Réservations (IDs 1 à 9)
-- On en insère 9 d'un coup pour être sûr des IDs
INSERT INTO reservations (id, number_of_people, `date`, `time`, `status`, user_id, comment) VALUES
-- Mardi 3 Mars (Midi & Soir)
(10, 2, '2026-03-03', '12:00:00', 'confirmed', 3, 'Déjeuner pro'),
(11, 8, '2026-03-03', '19:30:00', 'confirmed', 4, 'Groupe amis'),
(12, 4, '2026-03-03', '20:00:00', 'confirmed', 5, NULL),

-- Vendredi 6 Mars (Grosse soirée)
(13, 15, '2026-03-06', '20:00:00', 'confirmed', 6, 'Privatisation partielle - Anniversaire'),
(14, 2, '2026-03-06', '19:00:00', 'confirmed', 7, 'Table romantique'),

-- Samedi 7 Mars 
(15, 6, '2026-03-07', '12:30:00', 'confirmed', 8, 'Famille'),
(16, 4, '2026-03-07', '20:00:00', 'pending', 9, 'Attente confirmation'),

-- Dimanche 8 Mars (Midi seulement)
(17, 10, '2026-03-08', '12:00:00', 'confirmed', 10, 'Grande tablée familiale');


-- 6. Liaison Tables (On utilise les IDs 1 à 9 de la table au-dessus)
INSERT INTO reservation_tables (reservation_id, table_id) VALUES
-- Réservations standards
(10, 7), -- Reserv 10 (2 pers) sur Table 7 (2 places)
(12, 4), -- Reserv 12 (4 pers) sur Table 4 (4 places)
(14, 8), -- Reserv 14 (2 pers) sur Table 8 (2 places)
(15, 5), -- Reserv 15 (6 pers) sur Table 5 (6 places)
(16, 9), -- Reserv 16 (4 pers) sur Table 9 (4 places)

-- CAS PARTICULIER : Réservation 11 (8 personnes)
(11, 6), -- Utilise la table de 8 (Table ID 6)

-- CAS PARTICULIER : Réservation 13 (15 personnes) -> Monopolise 3 tables
(13, 11), -- Table de 10
(13, 3),  -- + Table de 4
(13, 1),  -- + Table de 2 (Total 16 places pour 15 pers)

-- CAS PARTICULIER : Réservation 17 (10 personnes)
(17, 12); -- Utilise la grande table de 12 (Table ID 12)
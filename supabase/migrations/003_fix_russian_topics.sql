-- Migration: Fix Russian topics to match Edexcel specification
-- The previous topics were from a different exam board (possibly AQA)
-- This updates them to match the Pearson Edexcel 9RU0 specification

-- Delete existing Russian topics (themes and their subtopics)
-- Keep the skills, grammar, literary works, and IRP topics
DELETE FROM topics WHERE subject_id = '33333333-3333-3333-3333-333333333333'
  AND id IN (
    -- Theme 1 and subtopics
    '30000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0001-000000000001',
    '30000000-0000-0000-0001-000000000002',
    '30000000-0000-0000-0001-000000000003',
    '30000000-0000-0000-0001-000000000004',
    -- Theme 2 and subtopics
    '30000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0002-000000000001',
    '30000000-0000-0000-0002-000000000002',
    '30000000-0000-0000-0002-000000000003',
    '30000000-0000-0000-0002-000000000004',
    -- Theme 3 and subtopics
    '30000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0003-000000000001',
    '30000000-0000-0000-0003-000000000002',
    '30000000-0000-0000-0003-000000000003',
    '30000000-0000-0000-0003-000000000004',
    -- Theme 4 and subtopics
    '30000000-0000-0000-0000-000000000004',
    '30000000-0000-0000-0004-000000000001',
    '30000000-0000-0000-0004-000000000002',
    '30000000-0000-0000-0004-000000000003',
    '30000000-0000-0000-0004-000000000004'
  );

-- =====================
-- CORRECT EDEXCEL RUSSIAN TOPICS
-- =====================

-- Тема 1: Развитие российского общества (Development of Russian society)
-- Context: Russia only
INSERT INTO topics (id, subject_id, code, title, description, order_index, estimated_hours) VALUES
  ('30000000-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'T1',
   'Развитие российского общества',
   'Development of Russian society. Theme 1 is set in the context of Russia only.',
   1, 6);

INSERT INTO topics (id, subject_id, parent_id, code, title, description, order_index, estimated_hours) VALUES
  ('30000000-0000-0000-0001-000000000001', '33333333-3333-3333-3333-333333333333', '30000000-0000-0000-0000-000000000001',
   'T1.1', 'Жизнь российской молодёжи',
   'Life of Russian youth: Здоровье; отдых; новые технологии (Health; leisure; new technologies)',
   1, 2),
  ('30000000-0000-0000-0001-000000000002', '33333333-3333-3333-3333-333333333333', '30000000-0000-0000-0000-000000000001',
   'T1.2', 'Образование',
   'Education: Система образования; жизнь российских школьников (Education system; life of Russian schoolchildren)',
   2, 2),
  ('30000000-0000-0000-0001-000000000003', '33333333-3333-3333-3333-333333333333', '30000000-0000-0000-0000-000000000001',
   'T1.3', 'Мир труда',
   'World of work: Отношение к труду; возможности для молодых россиян; равноправие (Attitude to work; opportunities for young Russians; equality)',
   3, 2);

-- Тема 2: Политическая и художественная культура в русскоязычном мире
-- Context: Russian-speaking world
INSERT INTO topics (id, subject_id, code, title, description, order_index, estimated_hours) VALUES
  ('30000000-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'T2',
   'Политическая и художественная культура в русскоязычном мире',
   'Political and artistic culture in the Russian-speaking world. Theme 2 is set in the context of the Russian-speaking world.',
   2, 6);

INSERT INTO topics (id, subject_id, parent_id, code, title, description, order_index, estimated_hours) VALUES
  ('30000000-0000-0000-0002-000000000001', '33333333-3333-3333-3333-333333333333', '30000000-0000-0000-0000-000000000002',
   'T2.1', 'Средства массовой информации',
   'Mass media: Свобода выражения; печатная и онлайн пресса; влияние на общество и политику (Freedom of expression; print and online press; influence on society and politics)',
   1, 2),
  ('30000000-0000-0000-0002-000000000002', '33333333-3333-3333-3333-333333333333', '30000000-0000-0000-0000-000000000002',
   'T2.2', 'Массовая культура',
   'Popular culture: Музыка; цирк; танец (Music; circus; dance)',
   2, 2),
  ('30000000-0000-0000-0002-000000000003', '33333333-3333-3333-3333-333333333333', '30000000-0000-0000-0000-000000000002',
   'T2.3', 'Праздники, фестивали и традиции',
   'Holidays, festivals and traditions: Фестивали; праздники; обычаи; традиции (Festivals; holidays; customs; traditions)',
   3, 2);

-- Тема 3: Москва или Санкт-Петербург - Изменения в жизни большого российского города
-- Context: Russia only
INSERT INTO topics (id, subject_id, code, title, description, order_index, estimated_hours) VALUES
  ('30000000-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'T3',
   'Москва или Санкт-Петербург',
   'Moscow or St Petersburg - Changes in the life of a large Russian city. Theme 3 is set in the context of Russia only.',
   3, 6);

INSERT INTO topics (id, subject_id, parent_id, code, title, description, order_index, estimated_hours) VALUES
  ('30000000-0000-0000-0003-000000000001', '33333333-3333-3333-3333-333333333333', '30000000-0000-0000-0000-000000000003',
   'T3.1', 'Изменение населения',
   'Population change: Жизнь в городе; жизнь в пригородах (Life in the city; life in the suburbs)',
   1, 2),
  ('30000000-0000-0000-0003-000000000002', '33333333-3333-3333-3333-333333333333', '30000000-0000-0000-0000-000000000003',
   'T3.2', 'Общественные проблемы',
   'Social problems: Бездомность; преступность (Homelessness; crime)',
   2, 2),
  ('30000000-0000-0000-0003-000000000003', '33333333-3333-3333-3333-333333333333', '30000000-0000-0000-0000-000000000003',
   'T3.3', 'Окружающая среда',
   'Environment: Реконструкция и благоустройства города; загрязнение (City reconstruction and improvement; pollution)',
   3, 2);

-- Тема 4: Последние годы СССР – М.С. Горбачёв (1985-1991)
-- Context: Russia only
INSERT INTO topics (id, subject_id, code, title, description, order_index, estimated_hours) VALUES
  ('30000000-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333', 'T4',
   'Последние годы СССР – М.С. Горбачёв (1985-1991)',
   'The last years of the USSR - Gorbachev (1985-1991). Theme 4 is set in the context of Russia only.',
   4, 6);

INSERT INTO topics (id, subject_id, parent_id, code, title, description, order_index, estimated_hours) VALUES
  ('30000000-0000-0000-0004-000000000001', '33333333-3333-3333-3333-333333333333', '30000000-0000-0000-0000-000000000004',
   'T4.1', 'Перестройка',
   'Perestroika: Что вызвало перестройку; экономические изменения; исходы (What caused perestroika; economic changes; outcomes)',
   1, 2),
  ('30000000-0000-0000-0004-000000000002', '33333333-3333-3333-3333-333333333333', '30000000-0000-0000-0000-000000000004',
   'T4.2', 'Гласность',
   'Glasnost: Что вызвало гласность; общественные изменения; исходы (What caused glasnost; social changes; outcomes)',
   2, 2),
  ('30000000-0000-0000-0004-000000000003', '33333333-3333-3333-3333-333333333333', '30000000-0000-0000-0000-000000000004',
   'T4.3', '1991 год',
   '1991: Проблемы для СССР к началу 1991 г.; путч в августе; распад СССР (Problems for USSR by early 1991; the August coup; collapse of the USSR)',
   3, 2);

-- Update the Literary Work placeholders with the prescribed works list
UPDATE topics
SET description = 'Literary texts: Пиковая дама (Пушкин), Ревизор (Гоголь), Вишнёвый сад (Чехов), Один день Ивана Денисовича (Солженицын), Неделя как неделя (Баранская), Сонечка (Улицкая). Films: Крылья (Шепитько), Утомлённые солнцем (Михалков), Кавказский пленник (Бодров), Левиафан (Звягинцев). Student must study 2 works: either 2 literary texts OR 1 literary text + 1 film.'
WHERE id = '30000000-0000-0000-0000-000000000011';

UPDATE topics
SET description = 'Second prescribed work (literary text or film) - see LIT1 for full list of options'
WHERE id = '30000000-0000-0000-0000-000000000012';

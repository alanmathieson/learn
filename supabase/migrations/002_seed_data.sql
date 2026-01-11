-- Seed Subjects
INSERT INTO subjects (id, name, exam_board, code, color) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Physics', 'Cambridge International (CIE)', '9702', '#3B82F6'),
  ('22222222-2222-2222-2222-222222222222', 'Mathematics', 'Pearson Edexcel', '9MA0', '#10B981'),
  ('33333333-3333-3333-3333-333333333333', 'Russian', 'Pearson Edexcel', '9RU0', '#EF4444');

-- Physics Papers
INSERT INTO papers (id, subject_id, name, paper_number, exam_date, exam_time, duration_minutes) VALUES
  ('p1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Multiple Choice', 1, '2026-06-03', '13:45', 75),
  ('p1111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'AS Structured Questions', 2, '2026-05-20', '13:45', 75),
  ('p1111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111111', 'Advanced Practical Skills', 3, '2026-04-28', '13:45', 120),
  ('p1111111-1111-1111-1111-111111111114', '11111111-1111-1111-1111-111111111111', 'A Level Structured Questions', 4, '2026-05-11', '13:45', 120),
  ('p1111111-1111-1111-1111-111111111115', '11111111-1111-1111-1111-111111111111', 'Planning, Analysis and Evaluation', 5, '2026-05-20', '13:45', 75);

-- Mathematics Papers
INSERT INTO papers (id, subject_id, name, paper_number, exam_date, exam_time, duration_minutes) VALUES
  ('p2222222-2222-2222-2222-222222222221', '22222222-2222-2222-2222-222222222222', 'Pure Mathematics 1', 1, '2026-06-03', '13:45', 120),
  ('p2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Pure Mathematics 2', 2, '2026-06-11', '13:45', 120),
  ('p2222222-2222-2222-2222-222222222223', '22222222-2222-2222-2222-222222222222', 'Statistics and Mechanics', 3, '2026-06-18', '13:45', 120);

-- Russian Papers
INSERT INTO papers (id, subject_id, name, paper_number, exam_date, exam_time, duration_minutes) VALUES
  ('p3333333-3333-3333-3333-333333333331', '33333333-3333-3333-3333-333333333333', 'Listening, Reading and Translation', 1, '2026-06-01', '08:45', 120),
  ('p3333333-3333-3333-3333-333333333332', '33333333-3333-3333-3333-333333333333', 'Written Response to Works and Translation', 2, '2026-06-08', '13:45', 160),
  ('p3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'Speaking', 3, '2026-04-15', NULL, 25);

-- =====================
-- PHYSICS TOPICS
-- =====================

-- AS Level Topics (1-11)
INSERT INTO topics (id, subject_id, code, title, order_index, estimated_hours) VALUES
  ('phy-01', '11111111-1111-1111-1111-111111111111', '1', 'Physical Quantities and Units', 1, 3),
  ('phy-02', '11111111-1111-1111-1111-111111111111', '2', 'Kinematics', 2, 4),
  ('phy-03', '11111111-1111-1111-1111-111111111111', '3', 'Dynamics', 3, 4),
  ('phy-04', '11111111-1111-1111-1111-111111111111', '4', 'Forces, Density and Pressure', 4, 3),
  ('phy-05', '11111111-1111-1111-1111-111111111111', '5', 'Work, Energy and Power', 5, 4),
  ('phy-06', '11111111-1111-1111-1111-111111111111', '6', 'Deformation of Solids', 6, 2),
  ('phy-07', '11111111-1111-1111-1111-111111111111', '7', 'Waves', 7, 4),
  ('phy-08', '11111111-1111-1111-1111-111111111111', '8', 'Superposition', 8, 3),
  ('phy-09', '11111111-1111-1111-1111-111111111111', '9', 'Electricity', 9, 4),
  ('phy-10', '11111111-1111-1111-1111-111111111111', '10', 'D.C. Circuits', 10, 4),
  ('phy-11', '11111111-1111-1111-1111-111111111111', '11', 'Particle Physics', 11, 3);

-- A Level Topics (12-25)
INSERT INTO topics (id, subject_id, code, title, order_index, estimated_hours) VALUES
  ('phy-12', '11111111-1111-1111-1111-111111111111', '12', 'Circular Motion', 12, 3),
  ('phy-13', '11111111-1111-1111-1111-111111111111', '13', 'Gravitational Fields', 13, 4),
  ('phy-14', '11111111-1111-1111-1111-111111111111', '14', 'Temperature', 14, 2),
  ('phy-15', '11111111-1111-1111-1111-111111111111', '15', 'Ideal Gases', 15, 3),
  ('phy-16', '11111111-1111-1111-1111-111111111111', '16', 'Thermodynamics', 16, 4),
  ('phy-17', '11111111-1111-1111-1111-111111111111', '17', 'Oscillations', 17, 4),
  ('phy-18', '11111111-1111-1111-1111-111111111111', '18', 'Electric Fields', 18, 4),
  ('phy-19', '11111111-1111-1111-1111-111111111111', '19', 'Capacitance', 19, 3),
  ('phy-20', '11111111-1111-1111-1111-111111111111', '20', 'Magnetic Fields', 20, 4),
  ('phy-21', '11111111-1111-1111-1111-111111111111', '21', 'Alternating Currents', 21, 3),
  ('phy-22', '11111111-1111-1111-1111-111111111111', '22', 'Quantum Physics', 22, 4),
  ('phy-23', '11111111-1111-1111-1111-111111111111', '23', 'Nuclear Physics', 23, 4),
  ('phy-24', '11111111-1111-1111-1111-111111111111', '24', 'Medical Physics', 24, 4),
  ('phy-25', '11111111-1111-1111-1111-111111111111', '25', 'Astronomy and Cosmology', 25, 4);

-- Physics subtopics - Topic 1: Physical Quantities and Units
INSERT INTO topics (id, subject_id, parent_id, code, title, order_index, estimated_hours) VALUES
  ('phy-01-01', '11111111-1111-1111-1111-111111111111', 'phy-01', '1.1', 'Physical quantities', 1, 0.5),
  ('phy-01-02', '11111111-1111-1111-1111-111111111111', 'phy-01', '1.2', 'SI units', 2, 0.5),
  ('phy-01-03', '11111111-1111-1111-1111-111111111111', 'phy-01', '1.3', 'Errors and uncertainties', 3, 1),
  ('phy-01-04', '11111111-1111-1111-1111-111111111111', 'phy-01', '1.4', 'Scalars and vectors', 4, 1);

-- Physics subtopics - Topic 2: Kinematics
INSERT INTO topics (id, subject_id, parent_id, code, title, order_index, estimated_hours) VALUES
  ('phy-02-01', '11111111-1111-1111-1111-111111111111', 'phy-02', '2.1', 'Equations of motion', 1, 1.5),
  ('phy-02-02', '11111111-1111-1111-1111-111111111111', 'phy-02', '2.2', 'Motion graphs', 2, 1),
  ('phy-02-03', '11111111-1111-1111-1111-111111111111', 'phy-02', '2.3', 'Free fall', 3, 0.75),
  ('phy-02-04', '11111111-1111-1111-1111-111111111111', 'phy-02', '2.4', 'Projectile motion', 4, 0.75);

-- Physics subtopics - Topic 3: Dynamics
INSERT INTO topics (id, subject_id, parent_id, code, title, order_index, estimated_hours) VALUES
  ('phy-03-01', '11111111-1111-1111-1111-111111111111', 'phy-03', '3.1', 'Momentum and Newton''s laws', 1, 1.5),
  ('phy-03-02', '11111111-1111-1111-1111-111111111111', 'phy-03', '3.2', 'Linear momentum and impulse', 2, 1),
  ('phy-03-03', '11111111-1111-1111-1111-111111111111', 'phy-03', '3.3', 'Conservation of momentum', 3, 1),
  ('phy-03-04', '11111111-1111-1111-1111-111111111111', 'phy-03', '3.4', 'Elastic and inelastic collisions', 4, 0.5);

-- Physics subtopics - Topic 7: Waves
INSERT INTO topics (id, subject_id, parent_id, code, title, order_index, estimated_hours) VALUES
  ('phy-07-01', '11111111-1111-1111-1111-111111111111', 'phy-07', '7.1', 'Progressive waves', 1, 1),
  ('phy-07-02', '11111111-1111-1111-1111-111111111111', 'phy-07', '7.2', 'Transverse and longitudinal waves', 2, 0.5),
  ('phy-07-03', '11111111-1111-1111-1111-111111111111', 'phy-07', '7.3', 'Doppler effect', 3, 1),
  ('phy-07-04', '11111111-1111-1111-1111-111111111111', 'phy-07', '7.4', 'Electromagnetic spectrum', 4, 0.5),
  ('phy-07-05', '11111111-1111-1111-1111-111111111111', 'phy-07', '7.5', 'Polarisation', 5, 1);

-- Physics subtopics - Topic 9: Electricity
INSERT INTO topics (id, subject_id, parent_id, code, title, order_index, estimated_hours) VALUES
  ('phy-09-01', '11111111-1111-1111-1111-111111111111', 'phy-09', '9.1', 'Electric current', 1, 0.5),
  ('phy-09-02', '11111111-1111-1111-1111-111111111111', 'phy-09', '9.2', 'Potential difference and power', 2, 1),
  ('phy-09-03', '11111111-1111-1111-1111-111111111111', 'phy-09', '9.3', 'Resistance and resistivity', 3, 1.5),
  ('phy-09-04', '11111111-1111-1111-1111-111111111111', 'phy-09', '9.4', 'I-V characteristics', 4, 1);

-- Physics subtopics - Topic 17: Oscillations
INSERT INTO topics (id, subject_id, parent_id, code, title, order_index, estimated_hours) VALUES
  ('phy-17-01', '11111111-1111-1111-1111-111111111111', 'phy-17', '17.1', 'Simple harmonic motion', 1, 1.5),
  ('phy-17-02', '11111111-1111-1111-1111-111111111111', 'phy-17', '17.2', 'Energy in SHM', 2, 1),
  ('phy-17-03', '11111111-1111-1111-1111-111111111111', 'phy-17', '17.3', 'Damped oscillations', 3, 0.75),
  ('phy-17-04', '11111111-1111-1111-1111-111111111111', 'phy-17', '17.4', 'Forced oscillations and resonance', 4, 0.75);

-- Physics subtopics - Topic 22: Quantum Physics
INSERT INTO topics (id, subject_id, parent_id, code, title, order_index, estimated_hours) VALUES
  ('phy-22-01', '11111111-1111-1111-1111-111111111111', 'phy-22', '22.1', 'Photoelectric effect', 1, 1.5),
  ('phy-22-02', '11111111-1111-1111-1111-111111111111', 'phy-22', '22.2', 'Wave-particle duality', 2, 1),
  ('phy-22-03', '11111111-1111-1111-1111-111111111111', 'phy-22', '22.3', 'Energy levels in atoms', 3, 1),
  ('phy-22-04', '11111111-1111-1111-1111-111111111111', 'phy-22', '22.4', 'Line spectra', 4, 0.5);

-- =====================
-- MATHEMATICS TOPICS
-- =====================

-- Pure Mathematics Topics
INSERT INTO topics (id, subject_id, code, title, order_index, estimated_hours) VALUES
  ('mat-p01', '22222222-2222-2222-2222-222222222222', '1', 'Proof', 1, 3),
  ('mat-p02', '22222222-2222-2222-2222-222222222222', '2', 'Algebra and Functions', 2, 6),
  ('mat-p03', '22222222-2222-2222-2222-222222222222', '3', 'Coordinate Geometry in the (x,y) plane', 3, 4),
  ('mat-p04', '22222222-2222-2222-2222-222222222222', '4', 'Sequences and Series', 4, 5),
  ('mat-p05', '22222222-2222-2222-2222-222222222222', '5', 'Trigonometry', 5, 6),
  ('mat-p06', '22222222-2222-2222-2222-222222222222', '6', 'Exponentials and Logarithms', 6, 4),
  ('mat-p07', '22222222-2222-2222-2222-222222222222', '7', 'Differentiation', 7, 6),
  ('mat-p08', '22222222-2222-2222-2222-222222222222', '8', 'Integration', 8, 6),
  ('mat-p09', '22222222-2222-2222-2222-222222222222', '9', 'Numerical Methods', 9, 3),
  ('mat-p10', '22222222-2222-2222-2222-222222222222', '10', 'Vectors', 10, 3);

-- Statistics Topics
INSERT INTO topics (id, subject_id, code, title, order_index, estimated_hours) VALUES
  ('mat-s01', '22222222-2222-2222-2222-222222222222', 'S1', 'Statistical Sampling', 11, 2),
  ('mat-s02', '22222222-2222-2222-2222-222222222222', 'S2', 'Data Presentation and Interpretation', 12, 3),
  ('mat-s03', '22222222-2222-2222-2222-222222222222', 'S3', 'Probability', 13, 4),
  ('mat-s04', '22222222-2222-2222-2222-222222222222', 'S4', 'Statistical Distributions', 14, 4),
  ('mat-s05', '22222222-2222-2222-2222-222222222222', 'S5', 'Statistical Hypothesis Testing', 15, 4);

-- Mechanics Topics
INSERT INTO topics (id, subject_id, code, title, order_index, estimated_hours) VALUES
  ('mat-m06', '22222222-2222-2222-2222-222222222222', 'M6', 'Quantities and Units in Mechanics', 16, 1),
  ('mat-m07', '22222222-2222-2222-2222-222222222222', 'M7', 'Kinematics', 17, 4),
  ('mat-m08', '22222222-2222-2222-2222-222222222222', 'M8', 'Forces and Newton''s Laws', 18, 4),
  ('mat-m09', '22222222-2222-2222-2222-222222222222', 'M9', 'Moments', 19, 2);

-- Mathematics subtopics - Proof
INSERT INTO topics (id, subject_id, parent_id, code, title, order_index, estimated_hours) VALUES
  ('mat-p01-01', '22222222-2222-2222-2222-222222222222', 'mat-p01', '1.1', 'Proof by deduction', 1, 1),
  ('mat-p01-02', '22222222-2222-2222-2222-222222222222', 'mat-p01', '1.2', 'Proof by exhaustion', 2, 0.5),
  ('mat-p01-03', '22222222-2222-2222-2222-222222222222', 'mat-p01', '1.3', 'Disproof by counter example', 3, 0.5),
  ('mat-p01-04', '22222222-2222-2222-2222-222222222222', 'mat-p01', '1.4', 'Proof by contradiction', 4, 1);

-- Mathematics subtopics - Algebra and Functions
INSERT INTO topics (id, subject_id, parent_id, code, title, order_index, estimated_hours) VALUES
  ('mat-p02-01', '22222222-2222-2222-2222-222222222222', 'mat-p02', '2.1', 'Laws of indices', 1, 0.5),
  ('mat-p02-02', '22222222-2222-2222-2222-222222222222', 'mat-p02', '2.2', 'Surds', 2, 0.5),
  ('mat-p02-03', '22222222-2222-2222-2222-222222222222', 'mat-p02', '2.3', 'Quadratic functions', 3, 1),
  ('mat-p02-04', '22222222-2222-2222-2222-222222222222', 'mat-p02', '2.4', 'Simultaneous equations', 4, 0.5),
  ('mat-p02-05', '22222222-2222-2222-2222-222222222222', 'mat-p02', '2.5', 'Inequalities', 5, 0.5),
  ('mat-p02-06', '22222222-2222-2222-2222-222222222222', 'mat-p02', '2.6', 'Polynomials and factor theorem', 6, 1),
  ('mat-p02-07', '22222222-2222-2222-2222-222222222222', 'mat-p02', '2.7', 'Graphs of functions', 7, 0.5),
  ('mat-p02-08', '22222222-2222-2222-2222-222222222222', 'mat-p02', '2.8', 'Composite and inverse functions', 8, 0.5),
  ('mat-p02-09', '22222222-2222-2222-2222-222222222222', 'mat-p02', '2.9', 'Graph transformations', 9, 0.5),
  ('mat-p02-10', '22222222-2222-2222-2222-222222222222', 'mat-p02', '2.10', 'Partial fractions', 10, 0.5);

-- Mathematics subtopics - Trigonometry
INSERT INTO topics (id, subject_id, parent_id, code, title, order_index, estimated_hours) VALUES
  ('mat-p05-01', '22222222-2222-2222-2222-222222222222', 'mat-p05', '5.1', 'Sine, cosine, tangent definitions', 1, 0.5),
  ('mat-p05-02', '22222222-2222-2222-2222-222222222222', 'mat-p05', '5.2', 'Small angle approximations', 2, 0.5),
  ('mat-p05-03', '22222222-2222-2222-2222-222222222222', 'mat-p05', '5.3', 'Trig graphs and exact values', 3, 1),
  ('mat-p05-04', '22222222-2222-2222-2222-222222222222', 'mat-p05', '5.4', 'Sec, cosec, cot and inverse trig', 4, 1),
  ('mat-p05-05', '22222222-2222-2222-2222-222222222222', 'mat-p05', '5.5', 'Trig identities', 5, 1),
  ('mat-p05-06', '22222222-2222-2222-2222-222222222222', 'mat-p05', '5.6', 'Double angle and compound angle formulae', 6, 1),
  ('mat-p05-07', '22222222-2222-2222-2222-222222222222', 'mat-p05', '5.7', 'Solving trig equations', 7, 1);

-- Mathematics subtopics - Differentiation
INSERT INTO topics (id, subject_id, parent_id, code, title, order_index, estimated_hours) VALUES
  ('mat-p07-01', '22222222-2222-2222-2222-222222222222', 'mat-p07', '7.1', 'Derivatives and differentiation from first principles', 1, 1),
  ('mat-p07-02', '22222222-2222-2222-2222-222222222222', 'mat-p07', '7.2', 'Standard derivatives', 2, 1),
  ('mat-p07-03', '22222222-2222-2222-2222-222222222222', 'mat-p07', '7.3', 'Applications: tangents, normals, stationary points', 3, 1.5),
  ('mat-p07-04', '22222222-2222-2222-2222-222222222222', 'mat-p07', '7.4', 'Product, quotient, chain rules', 4, 1.5),
  ('mat-p07-05', '22222222-2222-2222-2222-222222222222', 'mat-p07', '7.5', 'Implicit and parametric differentiation', 5, 0.5),
  ('mat-p07-06', '22222222-2222-2222-2222-222222222222', 'mat-p07', '7.6', 'Differential equations', 6, 0.5);

-- Mathematics subtopics - Integration
INSERT INTO topics (id, subject_id, parent_id, code, title, order_index, estimated_hours) VALUES
  ('mat-p08-01', '22222222-2222-2222-2222-222222222222', 'mat-p08', '8.1', 'Fundamental theorem of calculus', 1, 0.5),
  ('mat-p08-02', '22222222-2222-2222-2222-222222222222', 'mat-p08', '8.2', 'Standard integrals', 2, 1),
  ('mat-p08-03', '22222222-2222-2222-2222-222222222222', 'mat-p08', '8.3', 'Definite integrals and areas', 3, 1),
  ('mat-p08-04', '22222222-2222-2222-2222-222222222222', 'mat-p08', '8.4', 'Integration as limit of sum', 4, 0.5),
  ('mat-p08-05', '22222222-2222-2222-2222-222222222222', 'mat-p08', '8.5', 'Integration by substitution and parts', 5, 1.5),
  ('mat-p08-06', '22222222-2222-2222-2222-222222222222', 'mat-p08', '8.6', 'Integration using partial fractions', 6, 0.5),
  ('mat-p08-07', '22222222-2222-2222-2222-222222222222', 'mat-p08', '8.7', 'Solving differential equations', 7, 0.5),
  ('mat-p08-08', '22222222-2222-2222-2222-222222222222', 'mat-p08', '8.8', 'Interpreting solutions', 8, 0.5);

-- Mathematics subtopics - Statistical Distributions
INSERT INTO topics (id, subject_id, parent_id, code, title, order_index, estimated_hours) VALUES
  ('mat-s04-01', '22222222-2222-2222-2222-222222222222', 'mat-s04', 'S4.1', 'Discrete distributions and binomial', 1, 2),
  ('mat-s04-02', '22222222-2222-2222-2222-222222222222', 'mat-s04', 'S4.2', 'Normal distribution', 2, 1.5),
  ('mat-s04-03', '22222222-2222-2222-2222-222222222222', 'mat-s04', 'S4.3', 'Selecting distributions', 3, 0.5);

-- Mathematics subtopics - Mechanics: Kinematics
INSERT INTO topics (id, subject_id, parent_id, code, title, order_index, estimated_hours) VALUES
  ('mat-m07-01', '22222222-2222-2222-2222-222222222222', 'mat-m07', 'M7.1', 'Language of kinematics', 1, 0.5),
  ('mat-m07-02', '22222222-2222-2222-2222-222222222222', 'mat-m07', 'M7.2', 'Kinematics graphs', 2, 1),
  ('mat-m07-03', '22222222-2222-2222-2222-222222222222', 'mat-m07', 'M7.3', 'Constant acceleration (suvat)', 3, 1),
  ('mat-m07-04', '22222222-2222-2222-2222-222222222222', 'mat-m07', 'M7.4', 'Calculus in kinematics', 4, 1),
  ('mat-m07-05', '22222222-2222-2222-2222-222222222222', 'mat-m07', 'M7.5', 'Projectiles', 5, 0.5);

-- =====================
-- RUSSIAN TOPICS
-- =====================

-- Theme 1: Changes in contemporary Russian-speaking society
INSERT INTO topics (id, subject_id, code, title, order_index, estimated_hours) VALUES
  ('rus-t01', '33333333-3333-3333-3333-333333333333', 'T1', 'Changes in contemporary Russian-speaking society', 1, 8);

INSERT INTO topics (id, subject_id, parent_id, code, title, order_index, estimated_hours) VALUES
  ('rus-t01-01', '33333333-3333-3333-3333-333333333333', 'rus-t01', 'T1.1', 'Changes in family structures', 1, 2),
  ('rus-t01-02', '33333333-3333-3333-3333-333333333333', 'rus-t01', 'T1.2', 'Education and employment', 2, 2),
  ('rus-t01-03', '33333333-3333-3333-3333-333333333333', 'rus-t01', 'T1.3', 'Tourism, travel and Russian-speaking communities', 3, 2),
  ('rus-t01-04', '33333333-3333-3333-3333-333333333333', 'rus-t01', 'T1.4', 'Digital and social media', 4, 2);

-- Theme 2: Russian-speaking culture
INSERT INTO topics (id, subject_id, code, title, order_index, estimated_hours) VALUES
  ('rus-t02', '33333333-3333-3333-3333-333333333333', 'T2', 'Russian-speaking culture', 2, 8);

INSERT INTO topics (id, subject_id, parent_id, code, title, order_index, estimated_hours) VALUES
  ('rus-t02-01', '33333333-3333-3333-3333-333333333333', 'rus-t02', 'T2.1', 'Regional customs and traditions', 1, 2),
  ('rus-t02-02', '33333333-3333-3333-3333-333333333333', 'rus-t02', 'T2.2', 'Literature, art, film and music', 2, 2),
  ('rus-t02-03', '33333333-3333-3333-3333-333333333333', 'rus-t02', 'T2.3', 'Influence of past on present', 3, 2),
  ('rus-t02-04', '33333333-3333-3333-3333-333333333333', 'rus-t02', 'T2.4', 'Russian-speaking identity', 4, 2);

-- Theme 3: Political and artistic culture in Russian-speaking society
INSERT INTO topics (id, subject_id, code, title, order_index, estimated_hours) VALUES
  ('rus-t03', '33333333-3333-3333-3333-333333333333', 'T3', 'Political and artistic culture', 3, 8);

INSERT INTO topics (id, subject_id, parent_id, code, title, order_index, estimated_hours) VALUES
  ('rus-t03-01', '33333333-3333-3333-3333-333333333333', 'rus-t03', 'T3.1', 'Political engagement of young people', 1, 2),
  ('rus-t03-02', '33333333-3333-3333-3333-333333333333', 'rus-t03', 'T3.2', 'Festivals, music and sport', 2, 2),
  ('rus-t03-03', '33333333-3333-3333-3333-333333333333', 'rus-t03', 'T3.3', 'How political and artistic culture enrich society', 3, 2),
  ('rus-t03-04', '33333333-3333-3333-3333-333333333333', 'rus-t03', 'T3.4', 'Volunteer work and community engagement', 4, 2);

-- Theme 4: The changing nature of Russian-speaking society
INSERT INTO topics (id, subject_id, code, title, order_index, estimated_hours) VALUES
  ('rus-t04', '33333333-3333-3333-3333-333333333333', 'T4', 'The changing nature of Russian-speaking society', 4, 8);

INSERT INTO topics (id, subject_id, parent_id, code, title, order_index, estimated_hours) VALUES
  ('rus-t04-01', '33333333-3333-3333-3333-333333333333', 'rus-t04', 'T4.1', 'Migration and integration', 1, 2),
  ('rus-t04-02', '33333333-3333-3333-3333-333333333333', 'rus-t04', 'T4.2', 'Cultural diversity, discrimination and racism', 2, 2),
  ('rus-t04-03', '33333333-3333-3333-3333-333333333333', 'rus-t04', 'T4.3', 'Impact of migration on society', 3, 2),
  ('rus-t04-04', '33333333-3333-3333-3333-333333333333', 'rus-t04', 'T4.4', 'Promotion of equality', 4, 2);

-- Russian Language Skills
INSERT INTO topics (id, subject_id, code, title, order_index, estimated_hours) VALUES
  ('rus-sk01', '33333333-3333-3333-3333-333333333333', 'SK1', 'Listening Skills', 5, 4),
  ('rus-sk02', '33333333-3333-3333-3333-333333333333', 'SK2', 'Reading Skills', 6, 4),
  ('rus-sk03', '33333333-3333-3333-3333-333333333333', 'SK3', 'Translation Skills (Russian to English)', 7, 4),
  ('rus-sk04', '33333333-3333-3333-3333-333333333333', 'SK4', 'Translation Skills (English to Russian)', 8, 4),
  ('rus-sk05', '33333333-3333-3333-3333-333333333333', 'SK5', 'Writing Skills', 9, 4),
  ('rus-sk06', '33333333-3333-3333-3333-333333333333', 'SK6', 'Speaking Skills', 10, 4);

-- Russian Literary Works (placeholder - to be filled when confirmed)
INSERT INTO topics (id, subject_id, code, title, description, order_index, estimated_hours) VALUES
  ('rus-lit01', '33333333-3333-3333-3333-333333333333', 'LIT1', 'Literary Work 1', 'Placeholder - literary work to be confirmed', 11, 8),
  ('rus-lit02', '33333333-3333-3333-3333-333333333333', 'LIT2', 'Literary Work 2 / Film', 'Placeholder - second work/film to be confirmed', 12, 8);

-- Russian Grammar Topics
INSERT INTO topics (id, subject_id, code, title, order_index, estimated_hours) VALUES
  ('rus-gr01', '33333333-3333-3333-3333-333333333333', 'GR', 'Grammar Review', 13, 10);

INSERT INTO topics (id, subject_id, parent_id, code, title, order_index, estimated_hours) VALUES
  ('rus-gr01-01', '33333333-3333-3333-3333-333333333333', 'rus-gr01', 'GR.1', 'Nouns and cases', 1, 2),
  ('rus-gr01-02', '33333333-3333-3333-3333-333333333333', 'rus-gr01', 'GR.2', 'Adjectives and agreement', 2, 1),
  ('rus-gr01-03', '33333333-3333-3333-3333-333333333333', 'rus-gr01', 'GR.3', 'Verbs: aspects and tenses', 3, 2),
  ('rus-gr01-04', '33333333-3333-3333-3333-333333333333', 'rus-gr01', 'GR.4', 'Verbs of motion', 4, 1.5),
  ('rus-gr01-05', '33333333-3333-3333-3333-333333333333', 'rus-gr01', 'GR.5', 'Participles and verbal adverbs', 5, 1.5),
  ('rus-gr01-06', '33333333-3333-3333-3333-333333333333', 'rus-gr01', 'GR.6', 'Complex sentences and conjunctions', 6, 1),
  ('rus-gr01-07', '33333333-3333-3333-3333-333333333333', 'rus-gr01', 'GR.7', 'Numbers and quantifiers', 7, 1);

-- Independent Research Project
INSERT INTO topics (id, subject_id, code, title, description, order_index, estimated_hours) VALUES
  ('rus-irp', '33333333-3333-3333-3333-333333333333', 'IRP', 'Independent Research Project', 'Research presentation for Speaking exam', 14, 6);

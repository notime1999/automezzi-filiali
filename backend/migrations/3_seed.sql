INSERT IGNORE INTO filiale (codice, indirizzo, citta, cap) VALUES
  ('FIL-MI', 'Via di milano', 'Milano', '21231'),
  ('FIL-RM', 'Piazza spagna', 'Roma', '16556'),
  ('FIL-TO', 'Via ciccio 5', 'Torino', '15624');

INSERT IGNORE INTO automezzo (codice, targa, marca, modello, filiale_id) VALUES
  ('AUTO-001', 'AB123CD', 'Fiat', 'Fiorino', 1),
  ('AUTO-002', 'EF456GH', 'Ford', 'Transit', 1),
  ('AUTO-003', 'IJ789KL', 'Mercedes', 'Sprinter', 2),
  ('AUTO-004', 'MN012OP', 'Iveco', 'Daily', 2),
  ('AUTO-005', 'QR345ST', 'Volkswagen', 'Crafter', 3),
  ('AUTO-006', 'UV678WX', 'Renault', 'Master', 3);
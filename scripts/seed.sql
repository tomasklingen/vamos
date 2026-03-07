-- Auto-generated seed file — do not edit manually
CREATE TABLE IF NOT EXISTS cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(front, back)
);

CREATE TABLE IF NOT EXISTS labels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS card_labels (
  card_id INTEGER NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  label_id INTEGER NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
  PRIMARY KEY(card_id, label_id)
);

INSERT OR IGNORE INTO labels (name) VALUES ('greeting'), ('goodbye'), ('number');

INSERT OR IGNORE INTO cards (front, back) VALUES ('Hola', 'Hello');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'Hola' AND c.back = 'Hello' AND l.name = 'greeting';
INSERT OR IGNORE INTO cards (front, back) VALUES ('Buenos días', 'Good morning');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'Buenos días' AND c.back = 'Good morning' AND l.name = 'greeting';
INSERT OR IGNORE INTO cards (front, back) VALUES ('Buenas tardes', 'Good afternoon');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'Buenas tardes' AND c.back = 'Good afternoon' AND l.name = 'greeting';
INSERT OR IGNORE INTO cards (front, back) VALUES ('Buenas noches', 'Good evening / Good night');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'Buenas noches' AND c.back = 'Good evening / Good night' AND l.name = 'greeting';
INSERT OR IGNORE INTO cards (front, back) VALUES ('¿Cómo estás?', 'How are you?');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = '¿Cómo estás?' AND c.back = 'How are you?' AND l.name = 'greeting';
INSERT OR IGNORE INTO cards (front, back) VALUES ('¿Qué tal?', 'What''s up? / How''s it going?');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = '¿Qué tal?' AND c.back = 'What''s up? / How''s it going?' AND l.name = 'greeting';
INSERT OR IGNORE INTO cards (front, back) VALUES ('Mucho gusto', 'Nice to meet you');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'Mucho gusto' AND c.back = 'Nice to meet you' AND l.name = 'greeting';
INSERT OR IGNORE INTO cards (front, back) VALUES ('Bienvenido', 'Welcome');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'Bienvenido' AND c.back = 'Welcome' AND l.name = 'greeting';
INSERT OR IGNORE INTO cards (front, back) VALUES ('¿Cómo te llamas?', 'What is your name?');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = '¿Cómo te llamas?' AND c.back = 'What is your name?' AND l.name = 'greeting';
INSERT OR IGNORE INTO cards (front, back) VALUES ('Me llamo...', 'My name is...');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'Me llamo...' AND c.back = 'My name is...' AND l.name = 'greeting';
INSERT OR IGNORE INTO cards (front, back) VALUES ('Encantado', 'Pleased to meet you');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'Encantado' AND c.back = 'Pleased to meet you' AND l.name = 'greeting';
INSERT OR IGNORE INTO cards (front, back) VALUES ('¿De dónde eres?', 'Where are you from?');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = '¿De dónde eres?' AND c.back = 'Where are you from?' AND l.name = 'greeting';

INSERT OR IGNORE INTO cards (front, back) VALUES ('Adiós', 'Goodbye');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'Adiós' AND c.back = 'Goodbye' AND l.name = 'goodbye';
INSERT OR IGNORE INTO cards (front, back) VALUES ('Hasta luego', 'See you later');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'Hasta luego' AND c.back = 'See you later' AND l.name = 'goodbye';
INSERT OR IGNORE INTO cards (front, back) VALUES ('Hasta mañana', 'See you tomorrow');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'Hasta mañana' AND c.back = 'See you tomorrow' AND l.name = 'goodbye';
INSERT OR IGNORE INTO cards (front, back) VALUES ('Nos vemos', 'See you');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'Nos vemos' AND c.back = 'See you' AND l.name = 'goodbye';
INSERT OR IGNORE INTO cards (front, back) VALUES ('Chao', 'Bye');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'Chao' AND c.back = 'Bye' AND l.name = 'goodbye';
INSERT OR IGNORE INTO cards (front, back) VALUES ('Hasta pronto', 'See you soon');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'Hasta pronto' AND c.back = 'See you soon' AND l.name = 'goodbye';
INSERT OR IGNORE INTO cards (front, back) VALUES ('Cuídate', 'Take care');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'Cuídate' AND c.back = 'Take care' AND l.name = 'goodbye';
INSERT OR IGNORE INTO cards (front, back) VALUES ('Que te vaya bien', 'Have a good one');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'Que te vaya bien' AND c.back = 'Have a good one' AND l.name = 'goodbye';

INSERT OR IGNORE INTO cards (front, back) VALUES ('uno', '1');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'uno' AND c.back = '1' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('dos', '2');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'dos' AND c.back = '2' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('tres', '3');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'tres' AND c.back = '3' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('cuatro', '4');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'cuatro' AND c.back = '4' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('cinco', '5');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'cinco' AND c.back = '5' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('seis', '6');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'seis' AND c.back = '6' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('siete', '7');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'siete' AND c.back = '7' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('ocho', '8');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'ocho' AND c.back = '8' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('nueve', '9');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'nueve' AND c.back = '9' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('diez', '10');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'diez' AND c.back = '10' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('once', '11');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'once' AND c.back = '11' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('doce', '12');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'doce' AND c.back = '12' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('trece', '13');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'trece' AND c.back = '13' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('catorce', '14');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'catorce' AND c.back = '14' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('quince', '15');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'quince' AND c.back = '15' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('dieciséis', '16');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'dieciséis' AND c.back = '16' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('diecisiete', '17');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'diecisiete' AND c.back = '17' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('dieciocho', '18');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'dieciocho' AND c.back = '18' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('diecinueve', '19');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'diecinueve' AND c.back = '19' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('veinte', '20');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'veinte' AND c.back = '20' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('veintiuno', '21');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'veintiuno' AND c.back = '21' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('veintidos', '22');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'veintidos' AND c.back = '22' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('veintitres', '23');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'veintitres' AND c.back = '23' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('veinticuatro', '24');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'veinticuatro' AND c.back = '24' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('veinticinco', '25');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'veinticinco' AND c.back = '25' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('veintiseis', '26');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'veintiseis' AND c.back = '26' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('veintisiete', '27');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'veintisiete' AND c.back = '27' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('veintiocho', '28');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'veintiocho' AND c.back = '28' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('veintinueve', '29');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'veintinueve' AND c.back = '29' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('treinta', '30');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'treinta' AND c.back = '30' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('treinta y uno', '31');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'treinta y uno' AND c.back = '31' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('treinta y dos', '32');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'treinta y dos' AND c.back = '32' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('treinta y tres', '33');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'treinta y tres' AND c.back = '33' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('treinta y cuatro', '34');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'treinta y cuatro' AND c.back = '34' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('treinta y cinco', '35');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'treinta y cinco' AND c.back = '35' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('treinta y seis', '36');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'treinta y seis' AND c.back = '36' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('treinta y siete', '37');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'treinta y siete' AND c.back = '37' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('treinta y ocho', '38');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'treinta y ocho' AND c.back = '38' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('treinta y nueve', '39');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'treinta y nueve' AND c.back = '39' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('cuarenta', '40');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'cuarenta' AND c.back = '40' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('cuarenta y uno', '41');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'cuarenta y uno' AND c.back = '41' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('cuarenta y dos', '42');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'cuarenta y dos' AND c.back = '42' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('cuarenta y tres', '43');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'cuarenta y tres' AND c.back = '43' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('cuarenta y cuatro', '44');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'cuarenta y cuatro' AND c.back = '44' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('cuarenta y cinco', '45');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'cuarenta y cinco' AND c.back = '45' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('cuarenta y seis', '46');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'cuarenta y seis' AND c.back = '46' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('cuarenta y siete', '47');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'cuarenta y siete' AND c.back = '47' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('cuarenta y ocho', '48');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'cuarenta y ocho' AND c.back = '48' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('cuarenta y nueve', '49');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'cuarenta y nueve' AND c.back = '49' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('cincuenta', '50');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'cincuenta' AND c.back = '50' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('cincuenta y uno', '51');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'cincuenta y uno' AND c.back = '51' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('cincuenta y dos', '52');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'cincuenta y dos' AND c.back = '52' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('cincuenta y tres', '53');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'cincuenta y tres' AND c.back = '53' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('cincuenta y cuatro', '54');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'cincuenta y cuatro' AND c.back = '54' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('cincuenta y cinco', '55');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'cincuenta y cinco' AND c.back = '55' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('cincuenta y seis', '56');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'cincuenta y seis' AND c.back = '56' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('cincuenta y siete', '57');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'cincuenta y siete' AND c.back = '57' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('cincuenta y ocho', '58');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'cincuenta y ocho' AND c.back = '58' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('cincuenta y nueve', '59');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'cincuenta y nueve' AND c.back = '59' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('sesenta', '60');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'sesenta' AND c.back = '60' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('sesenta y uno', '61');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'sesenta y uno' AND c.back = '61' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('sesenta y dos', '62');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'sesenta y dos' AND c.back = '62' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('sesenta y tres', '63');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'sesenta y tres' AND c.back = '63' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('sesenta y cuatro', '64');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'sesenta y cuatro' AND c.back = '64' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('sesenta y cinco', '65');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'sesenta y cinco' AND c.back = '65' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('sesenta y seis', '66');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'sesenta y seis' AND c.back = '66' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('sesenta y siete', '67');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'sesenta y siete' AND c.back = '67' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('sesenta y ocho', '68');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'sesenta y ocho' AND c.back = '68' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('sesenta y nueve', '69');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'sesenta y nueve' AND c.back = '69' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('setenta', '70');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'setenta' AND c.back = '70' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('setenta y uno', '71');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'setenta y uno' AND c.back = '71' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('setenta y dos', '72');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'setenta y dos' AND c.back = '72' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('setenta y tres', '73');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'setenta y tres' AND c.back = '73' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('setenta y cuatro', '74');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'setenta y cuatro' AND c.back = '74' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('setenta y cinco', '75');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'setenta y cinco' AND c.back = '75' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('setenta y seis', '76');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'setenta y seis' AND c.back = '76' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('setenta y siete', '77');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'setenta y siete' AND c.back = '77' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('setenta y ocho', '78');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'setenta y ocho' AND c.back = '78' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('setenta y nueve', '79');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'setenta y nueve' AND c.back = '79' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('ochenta', '80');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'ochenta' AND c.back = '80' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('ochenta y uno', '81');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'ochenta y uno' AND c.back = '81' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('ochenta y dos', '82');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'ochenta y dos' AND c.back = '82' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('ochenta y tres', '83');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'ochenta y tres' AND c.back = '83' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('ochenta y cuatro', '84');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'ochenta y cuatro' AND c.back = '84' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('ochenta y cinco', '85');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'ochenta y cinco' AND c.back = '85' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('ochenta y seis', '86');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'ochenta y seis' AND c.back = '86' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('ochenta y siete', '87');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'ochenta y siete' AND c.back = '87' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('ochenta y ocho', '88');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'ochenta y ocho' AND c.back = '88' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('ochenta y nueve', '89');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'ochenta y nueve' AND c.back = '89' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('noventa', '90');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'noventa' AND c.back = '90' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('noventa y uno', '91');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'noventa y uno' AND c.back = '91' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('noventa y dos', '92');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'noventa y dos' AND c.back = '92' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('noventa y tres', '93');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'noventa y tres' AND c.back = '93' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('noventa y cuatro', '94');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'noventa y cuatro' AND c.back = '94' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('noventa y cinco', '95');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'noventa y cinco' AND c.back = '95' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('noventa y seis', '96');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'noventa y seis' AND c.back = '96' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('noventa y siete', '97');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'noventa y siete' AND c.back = '97' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('noventa y ocho', '98');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'noventa y ocho' AND c.back = '98' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('noventa y nueve', '99');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'noventa y nueve' AND c.back = '99' AND l.name = 'number';
INSERT OR IGNORE INTO cards (front, back) VALUES ('cien', '100');
INSERT OR IGNORE INTO card_labels (card_id, label_id)
  SELECT c.id, l.id FROM cards c, labels l
  WHERE c.front = 'cien' AND c.back = '100' AND l.name = 'number';

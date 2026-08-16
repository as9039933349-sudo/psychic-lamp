CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  description TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  name VARCHAR(180) NOT NULL,
  description TEXT DEFAULT '',
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url TEXT DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  customer_name VARCHAR(120) NOT NULL,
  customer_phone VARCHAR(30) NOT NULL,
  customer_address TEXT NOT NULL,
  payment_method VARCHAR(30) NOT NULL DEFAULT 'COD',
  payment_status VARCHAR(30) NOT NULL DEFAULT 'pending',
  order_status VARCHAR(40) NOT NULL DEFAULT 'new',
  subtotal NUMERIC(10,2) NOT NULL,
  delivery_charge NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(180) NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0)
);

INSERT INTO categories(name) VALUES
('मूर्तियां एवं तस्वीरें'),('दीपक व दीया'),('अगरबत्ती व धूप'),('कलश व लोटा'),
('चुनरी व वस्त्र'),('माला व पुष्प'),('हवन सामग्री'),('पूजा थाली सेट'),
('नारियल व सुपारी'),('कपूर, रोली व चंदन')
ON CONFLICT (name) DO NOTHING;


-- Expanded catalog seed (295 items)
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"श्री गणेश मूर्ति","पूजा सामग्री — दुकान से उपलब्ध।",55,20 FROM categories WHERE name="मूर्तियां एवं तस्वीरें";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"श्री लक्ष्मी मूर्ति","पूजा सामग्री — दुकान से उपलब्ध।",68,23 FROM categories WHERE name="मूर्तियां एवं तस्वीरें";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"श्री विष्णु मूर्ति","पूजा सामग्री — दुकान से उपलब्ध।",81,26 FROM categories WHERE name="मूर्तियां एवं तस्वीरें";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"श्री कृष्ण मूर्ति","पूजा सामग्री — दुकान से उपलब्ध।",94,29 FROM categories WHERE name="मूर्तियां एवं तस्वीरें";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"राधा-कृष्ण मूर्ति","पूजा सामग्री — दुकान से उपलब्ध।",107,32 FROM categories WHERE name="मूर्तियां एवं तस्वीरें";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"श्री राम दरबार मूर्ति","पूजा सामग्री — दुकान से उपलब्ध।",120,35 FROM categories WHERE name="मूर्तियां एवं तस्वीरें";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हनुमान जी मूर्ति","पूजा सामग्री — दुकान से उपलब्ध।",133,38 FROM categories WHERE name="मूर्तियां एवं तस्वीरें";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"शिव-पार्वती मूर्ति","पूजा सामग्री — दुकान से उपलब्ध।",146,41 FROM categories WHERE name="मूर्तियां एवं तस्वीरें";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"भगवान शिव मूर्ति","पूजा सामग्री — दुकान से उपलब्ध।",159,44 FROM categories WHERE name="मूर्तियां एवं तस्वीरें";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"नंदी मूर्ति","पूजा सामग्री — दुकान से उपलब्ध।",172,47 FROM categories WHERE name="मूर्तियां एवं तस्वीरें";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"माता दुर्गा मूर्ति","पूजा सामग्री — दुकान से उपलब्ध।",185,50 FROM categories WHERE name="मूर्तियां एवं तस्वीरें";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"माता लक्ष्मी मूर्ति","पूजा सामग्री — दुकान से उपलब्ध।",198,12 FROM categories WHERE name="मूर्तियां एवं तस्वीरें";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"माता सरस्वती मूर्ति","पूजा सामग्री — दुकान से उपलब्ध।",35,15 FROM categories WHERE name="मूर्तियां एवं तस्वीरें";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"श्री राम मूर्ति","पूजा सामग्री — दुकान से उपलब्ध।",48,18 FROM categories WHERE name="मूर्तियां एवं तस्वीरें";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"श्री सीता मूर्ति","पूजा सामग्री — दुकान से उपलब्ध।",61,21 FROM categories WHERE name="मूर्तियां एवं तस्वीरें";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"श्री कार्तिकेय मूर्ति","पूजा सामग्री — दुकान से उपलब्ध।",74,24 FROM categories WHERE name="मूर्तियां एवं तस्वीरें";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"श्री शनिदेव मूर्ति","पूजा सामग्री — दुकान से उपलब्ध।",87,27 FROM categories WHERE name="मूर्तियां एवं तस्वीरें";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"श्री खाटू श्याम जी मूर्ति","पूजा सामग्री — दुकान से उपलब्ध।",100,30 FROM categories WHERE name="मूर्तियां एवं तस्वीरें";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"संतोषी माता मूर्ति","पूजा सामग्री — दुकान से उपलब्ध।",113,33 FROM categories WHERE name="मूर्तियां एवं तस्वीरें";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"बाल गोपाल मूर्ति","पूजा सामग्री — दुकान से उपलब्ध।",126,36 FROM categories WHERE name="मूर्तियां एवं तस्वीरें";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लड्डू गोपाल पोशाक सेट","पूजा सामग्री — दुकान से उपलब्ध।",139,39 FROM categories WHERE name="मूर्तियां एवं तस्वीरें";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गोवर्धन जी चित्र","पूजा सामग्री — दुकान से उपलब्ध।",152,42 FROM categories WHERE name="मूर्तियां एवं तस्वीरें";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"श्री यंत्र","पूजा सामग्री — दुकान से उपलब्ध।",165,45 FROM categories WHERE name="मूर्तियां एवं तस्वीरें";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"ॐ चित्र","पूजा सामग्री — दुकान से उपलब्ध।",178,48 FROM categories WHERE name="मूर्तियां एवं तस्वीरें";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हनुमान जी फोटो","पूजा सामग्री — दुकान से उपलब्ध।",191,10 FROM categories WHERE name="मूर्तियां एवं तस्वीरें";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"कृष्ण जी फोटो","पूजा सामग्री — दुकान से उपलब्ध।",28,13 FROM categories WHERE name="मूर्तियां एवं तस्वीरें";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"राधा-कृष्ण फोटो","पूजा सामग्री — दुकान से उपलब्ध।",41,16 FROM categories WHERE name="मूर्तियां एवं तस्वीरें";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"शिव परिवार फोटो","पूजा सामग्री — दुकान से उपलब्ध।",54,19 FROM categories WHERE name="मूर्तियां एवं तस्वीरें";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"दुर्गा माता फोटो","पूजा सामग्री — दुकान से उपलब्ध।",67,22 FROM categories WHERE name="मूर्तियां एवं तस्वीरें";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गणेश-लक्ष्मी फोटो","पूजा सामग्री — दुकान से उपलब्ध।",80,25 FROM categories WHERE name="मूर्तियां एवं तस्वीरें";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"मिट्टी का दीपक","पूजा सामग्री — दुकान से उपलब्ध।",72,27 FROM categories WHERE name="दीपक व दीया";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पंचमुखी दीपक","पूजा सामग्री — दुकान से उपलब्ध।",85,30 FROM categories WHERE name="दीपक व दीया";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"अखंड दीपक","पूजा सामग्री — दुकान से उपलब्ध।",98,33 FROM categories WHERE name="दीपक व दीया";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पीतल दीपक","पूजा सामग्री — दुकान से उपलब्ध।",111,36 FROM categories WHERE name="दीपक व दीया";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"चांदी रंग दीपक","पूजा सामग्री — दुकान से उपलब्ध।",124,39 FROM categories WHERE name="दीपक व दीया";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"कांसे का दीपक","पूजा सामग्री — दुकान से उपलब्ध।",137,42 FROM categories WHERE name="दीपक व दीया";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"दीया सेट 11 नग","पूजा सामग्री — दुकान से उपलब्ध।",150,45 FROM categories WHERE name="दीपक व दीया";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"दीया सेट 21 नग","पूजा सामग्री — दुकान से उपलब्ध।",163,48 FROM categories WHERE name="दीपक व दीया";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"दीया सेट 51 नग","पूजा सामग्री — दुकान से उपलब्ध।",176,10 FROM categories WHERE name="दीपक व दीया";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"दीया बत्ती","पूजा सामग्री — दुकान से उपलब्ध।",189,13 FROM categories WHERE name="दीपक व दीया";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"रुई की बत्ती","पूजा सामग्री — दुकान से उपलब्ध।",26,16 FROM categories WHERE name="दीपक व दीया";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लंबी बत्ती","पूजा सामग्री — दुकान से उपलब्ध।",39,19 FROM categories WHERE name="दीपक व दीया";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"फूल बत्ती","पूजा सामग्री — दुकान से उपलब्ध।",52,22 FROM categories WHERE name="दीपक व दीया";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"कमल बत्ती","पूजा सामग्री — दुकान से उपलब्ध।",65,25 FROM categories WHERE name="दीपक व दीया";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"घी दीपक कप","पूजा सामग्री — दुकान से उपलब्ध।",78,28 FROM categories WHERE name="दीपक व दीया";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"दीपक स्टैंड","पूजा सामग्री — दुकान से उपलब्ध।",91,31 FROM categories WHERE name="दीपक व दीया";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"दीपक प्लेट","पूजा सामग्री — दुकान से उपलब्ध।",104,34 FROM categories WHERE name="दीपक व दीया";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"समई दीपक","पूजा सामग्री — दुकान से उपलब्ध।",117,37 FROM categories WHERE name="दीपक व दीया";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लक्ष्मी दीपक","पूजा सामग्री — दुकान से उपलब्ध।",130,40 FROM categories WHERE name="दीपक व दीया";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गणेश दीपक","पूजा सामग्री — दुकान से उपलब्ध।",143,43 FROM categories WHERE name="दीपक व दीया";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"नंदा दीपक","पूजा सामग्री — दुकान से उपलब्ध।",156,46 FROM categories WHERE name="दीपक व दीया";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"अखंड ज्योति सेट","पूजा सामग्री — दुकान से उपलब्ध।",169,49 FROM categories WHERE name="दीपक व दीया";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"दीया बाती पैक","पूजा सामग्री — दुकान से उपलब्ध।",182,11 FROM categories WHERE name="दीपक व दीया";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"चंदन अगरबत्ती","पूजा सामग्री — दुकान से उपलब्ध।",89,34 FROM categories WHERE name="अगरबत्ती व धूप";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गुलाब अगरबत्ती","पूजा सामग्री — दुकान से उपलब्ध।",102,37 FROM categories WHERE name="अगरबत्ती व धूप";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"मोगरा अगरबत्ती","पूजा सामग्री — दुकान से उपलब्ध।",115,40 FROM categories WHERE name="अगरबत्ती व धूप";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"केवड़ा अगरबत्ती","पूजा सामग्री — दुकान से उपलब्ध।",128,43 FROM categories WHERE name="अगरबत्ती व धूप";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"जैस्मिन अगरबत्ती","पूजा सामग्री — दुकान से उपलब्ध।",141,46 FROM categories WHERE name="अगरबत्ती व धूप";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लोबान अगरबत्ती","पूजा सामग्री — दुकान से उपलब्ध।",154,49 FROM categories WHERE name="अगरबत्ती व धूप";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"मिश्रित सुगंध अगरबत्ती","पूजा सामग्री — दुकान से उपलब्ध।",167,11 FROM categories WHERE name="अगरबत्ती व धूप";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"धूपबत्ती","पूजा सामग्री — दुकान से उपलब्ध।",180,14 FROM categories WHERE name="अगरबत्ती व धूप";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गुग्गुल धूप","पूजा सामग्री — दुकान से उपलब्ध।",193,17 FROM categories WHERE name="अगरबत्ती व धूप";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लोबान धूप","पूजा सामग्री — दुकान से उपलब्ध।",30,20 FROM categories WHERE name="अगरबत्ती व धूप";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"चंदन धूप","पूजा सामग्री — दुकान से उपलब्ध।",43,23 FROM categories WHERE name="अगरबत्ती व धूप";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"कपूर धूप","पूजा सामग्री — दुकान से उपलब्ध।",56,26 FROM categories WHERE name="अगरबत्ती व धूप";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"धूप कोन","पूजा सामग्री — दुकान से उपलब्ध।",69,29 FROM categories WHERE name="अगरबत्ती व धूप";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"धूप कप","पूजा सामग्री — दुकान से उपलब्ध।",82,32 FROM categories WHERE name="अगरबत्ती व धूप";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"धूपबत्ती स्टैंड","पूजा सामग्री — दुकान से उपलब्ध।",95,35 FROM categories WHERE name="अगरबत्ती व धूप";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"अगरबत्ती स्टैंड","पूजा सामग्री — दुकान से उपलब्ध।",108,38 FROM categories WHERE name="अगरबत्ती व धूप";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन धूप मिश्रण","पूजा सामग्री — दुकान से उपलब्ध।",121,41 FROM categories WHERE name="अगरबत्ती व धूप";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"सुगंधित धूप पैक","पूजा सामग्री — दुकान से उपलब्ध।",134,44 FROM categories WHERE name="अगरबत्ती व धूप";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"नैवेद्य धूप","पूजा सामग्री — दुकान से उपलब्ध।",147,47 FROM categories WHERE name="अगरबत्ती व धूप";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"सम्ब्रानी कप","पूजा सामग्री — दुकान से उपलब्ध।",160,50 FROM categories WHERE name="अगरबत्ती व धूप";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पीतल कलश","पूजा सामग्री — दुकान से उपलब्ध।",106,41 FROM categories WHERE name="कलश व लोटा";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"तांबे का कलश","पूजा सामग्री — दुकान से उपलब्ध।",119,44 FROM categories WHERE name="कलश व लोटा";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"स्टील कलश","पूजा सामग्री — दुकान से उपलब्ध।",132,47 FROM categories WHERE name="कलश व लोटा";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"चांदी रंग कलश","पूजा सामग्री — दुकान से उपलब्ध।",145,50 FROM categories WHERE name="कलश व लोटा";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"नारियल कलश सेट","पूजा सामग्री — दुकान से उपलब्ध।",158,12 FROM categories WHERE name="कलश व लोटा";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"कलश मौली","पूजा सामग्री — दुकान से उपलब्ध।",171,15 FROM categories WHERE name="कलश व लोटा";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"कलश थाली सेट","पूजा सामग्री — दुकान से उपलब्ध।",184,18 FROM categories WHERE name="कलश व लोटा";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पीतल लोटा","पूजा सामग्री — दुकान से उपलब्ध।",197,21 FROM categories WHERE name="कलश व लोटा";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"तांबे का लोटा","पूजा सामग्री — दुकान से उपलब्ध।",34,24 FROM categories WHERE name="कलश व लोटा";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"स्टील लोटा","पूजा सामग्री — दुकान से उपलब्ध।",47,27 FROM categories WHERE name="कलश व लोटा";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पंचपात्र","पूजा सामग्री — दुकान से उपलब्ध।",60,30 FROM categories WHERE name="कलश व लोटा";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"उद्धरणी","पूजा सामग्री — दुकान से उपलब्ध।",73,33 FROM categories WHERE name="कलश व लोटा";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"आचमनी चम्मच","पूजा सामग्री — दुकान से उपलब्ध।",86,36 FROM categories WHERE name="कलश व लोटा";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पंचपात्र सेट","पूजा सामग्री — दुकान से उपलब्ध।",99,39 FROM categories WHERE name="कलश व लोटा";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पूजा जल पात्र","पूजा सामग्री — दुकान से उपलब्ध।",112,42 FROM categories WHERE name="कलश व लोटा";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"अर्घ्य पात्र","पूजा सामग्री — दुकान से उपलब्ध।",125,45 FROM categories WHERE name="कलश व लोटा";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"शंख पात्र","पूजा सामग्री — दुकान से उपलब्ध।",138,48 FROM categories WHERE name="कलश व लोटा";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"छोटा तांबा गिलास","पूजा सामग्री — दुकान से उपलब्ध।",151,10 FROM categories WHERE name="कलश व लोटा";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पीतल गिलास","पूजा सामग्री — दुकान से उपलब्ध।",164,13 FROM categories WHERE name="कलश व लोटा";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"कलश ढक्कन","पूजा सामग्री — दुकान से उपलब्ध।",177,16 FROM categories WHERE name="कलश व लोटा";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"कलश सजावट सेट","पूजा सामग्री — दुकान से उपलब्ध।",190,19 FROM categories WHERE name="कलश व लोटा";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पूजा पात्र सेट","पूजा सामग्री — दुकान से उपलब्ध।",27,22 FROM categories WHERE name="कलश व लोटा";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लाल चुनरी","पूजा सामग्री — दुकान से उपलब्ध।",123,48 FROM categories WHERE name="चुनरी व वस्त्र";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पीली चुनरी","पूजा सामग्री — दुकान से उपलब्ध।",136,10 FROM categories WHERE name="चुनरी व वस्त्र";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हरी चुनरी","पूजा सामग्री — दुकान से उपलब्ध।",149,13 FROM categories WHERE name="चुनरी व वस्त्र";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"माता की चुनरी जरी वाली","पूजा सामग्री — दुकान से उपलब्ध।",162,16 FROM categories WHERE name="चुनरी व वस्त्र";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"माता की चुनरी प्रिंटेड","पूजा सामग्री — दुकान से उपलब्ध।",175,19 FROM categories WHERE name="चुनरी व वस्त्र";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"मौली वस्त्र","पूजा सामग्री — दुकान से उपलब्ध।",188,22 FROM categories WHERE name="चुनरी व वस्त्र";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"देवी वस्त्र सेट","पूजा सामग्री — दुकान से उपलब्ध।",25,25 FROM categories WHERE name="चुनरी व वस्त्र";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लड्डू गोपाल पोशाक","पूजा सामग्री — दुकान से उपलब्ध।",38,28 FROM categories WHERE name="चुनरी व वस्त्र";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लड्डू गोपाल मुकुट","पूजा सामग्री — दुकान से उपलब्ध।",51,31 FROM categories WHERE name="चुनरी व वस्त्र";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लड्डू गोपाल माला","पूजा सामग्री — दुकान से उपलब्ध।",64,34 FROM categories WHERE name="चुनरी व वस्त्र";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"राधा-कृष्ण पोशाक","पूजा सामग्री — दुकान से उपलब्ध।",77,37 FROM categories WHERE name="चुनरी व वस्त्र";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"शिवलिंग वस्त्र","पूजा सामग्री — दुकान से उपलब्ध।",90,40 FROM categories WHERE name="चुनरी व वस्त्र";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हनुमान जी वस्त्र","पूजा सामग्री — दुकान से उपलब्ध।",103,43 FROM categories WHERE name="चुनरी व वस्त्र";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"माता का श्रृंगार पैक","पूजा सामग्री — दुकान से उपलब्ध।",116,46 FROM categories WHERE name="चुनरी व वस्त्र";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"चोला सेट","पूजा सामग्री — दुकान से उपलब्ध।",129,49 FROM categories WHERE name="चुनरी व वस्त्र";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"साफा कपड़ा","पूजा सामग्री — दुकान से उपलब्ध।",142,11 FROM categories WHERE name="चुनरी व वस्त्र";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पीतांबर वस्त्र","पूजा सामग्री — दुकान से उपलब्ध।",155,14 FROM categories WHERE name="चुनरी व वस्त्र";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"आसन कपड़ा","पूजा सामग्री — दुकान से उपलब्ध।",168,17 FROM categories WHERE name="चुनरी व वस्त्र";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पूजा चौकी वस्त्र","पूजा सामग्री — दुकान से उपलब्ध।",181,20 FROM categories WHERE name="चुनरी व वस्त्र";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"भगवान का अंगवस्त्र","पूजा सामग्री — दुकान से उपलब्ध।",194,23 FROM categories WHERE name="चुनरी व वस्त्र";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"तुलसी माला","पूजा सामग्री — दुकान से उपलब्ध।",140,14 FROM categories WHERE name="माला व पुष्प";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"रुद्राक्ष माला","पूजा सामग्री — दुकान से उपलब्ध।",153,17 FROM categories WHERE name="माला व पुष्प";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"स्फटिक माला","पूजा सामग्री — दुकान से उपलब्ध।",166,20 FROM categories WHERE name="माला व पुष्प";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"चंदन माला","पूजा सामग्री — दुकान से उपलब्ध।",179,23 FROM categories WHERE name="माला व पुष्प";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"कमल गट्टा माला","पूजा सामग्री — दुकान से उपलब्ध।",192,26 FROM categories WHERE name="माला व पुष्प";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"वैजयंती माला","पूजा सामग्री — दुकान से उपलब्ध।",29,29 FROM categories WHERE name="माला व पुष्प";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"मोती माला","पूजा सामग्री — दुकान से उपलब्ध।",42,32 FROM categories WHERE name="माला व पुष्प";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हनुमान माला","पूजा सामग्री — दुकान से उपलब्ध।",55,35 FROM categories WHERE name="माला व पुष्प";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गणेश माला","पूजा सामग्री — दुकान से उपलब्ध।",68,38 FROM categories WHERE name="माला व पुष्प";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"नवग्रह माला","पूजा सामग्री — दुकान से उपलब्ध।",81,41 FROM categories WHERE name="माला व पुष्प";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"माता माला","पूजा सामग्री — दुकान से उपलब्ध।",94,44 FROM categories WHERE name="माला व पुष्प";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"फूल माला","पूजा सामग्री — दुकान से उपलब्ध।",107,47 FROM categories WHERE name="माला व पुष्प";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गेंदे की माला","पूजा सामग्री — दुकान से उपलब्ध।",120,50 FROM categories WHERE name="माला व पुष्प";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गुलाब माला","पूजा सामग्री — दुकान से उपलब्ध।",133,12 FROM categories WHERE name="माला व पुष्प";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"कमल फूल","पूजा सामग्री — दुकान से उपलब्ध।",146,15 FROM categories WHERE name="माला व पुष्प";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गुलाब फूल","पूजा सामग्री — दुकान से उपलब्ध।",159,18 FROM categories WHERE name="माला व पुष्प";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गेंदा फूल","पूजा सामग्री — दुकान से उपलब्ध।",172,21 FROM categories WHERE name="माला व पुष्प";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"बेलपत्र","पूजा सामग्री — दुकान से उपलब्ध।",185,24 FROM categories WHERE name="माला व पुष्प";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"दूर्वा","पूजा सामग्री — दुकान से उपलब्ध।",198,27 FROM categories WHERE name="माला व पुष्प";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"तुलसी दल","पूजा सामग्री — दुकान से उपलब्ध।",35,30 FROM categories WHERE name="माला व पुष्प";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"शमी पत्र","पूजा सामग्री — दुकान से उपलब्ध।",48,33 FROM categories WHERE name="माला व पुष्प";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"आम के पत्ते","पूजा सामग्री — दुकान से उपलब्ध।",61,36 FROM categories WHERE name="माला व पुष्प";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"अशोक पत्ते","पूजा सामग्री — दुकान से उपलब्ध।",74,39 FROM categories WHERE name="माला व पुष्प";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पुष्प सजावट पैक","पूजा सामग्री — दुकान से उपलब्ध।",87,42 FROM categories WHERE name="माला व पुष्प";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"फूल पंखुड़ी पैक","पूजा सामग्री — दुकान से उपलब्ध।",100,45 FROM categories WHERE name="माला व पुष्प";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन सामग्री सामान्य","पूजा सामग्री — दुकान से उपलब्ध।",157,21 FROM categories WHERE name="हवन सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन सामग्री विशेष","पूजा सामग्री — दुकान से उपलब्ध।",170,24 FROM categories WHERE name="हवन सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"नवग्रह हवन सामग्री","पूजा सामग्री — दुकान से उपलब्ध।",183,27 FROM categories WHERE name="हवन सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"महामृत्युंजय हवन सामग्री","पूजा सामग्री — दुकान से उपलब्ध।",196,30 FROM categories WHERE name="हवन सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गृह प्रवेश हवन सामग्री","पूजा सामग्री — दुकान से उपलब्ध।",33,33 FROM categories WHERE name="हवन सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"विवाह हवन सामग्री","पूजा सामग्री — दुकान से उपलब्ध।",46,36 FROM categories WHERE name="हवन सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"सत्यनारायण पूजा हवन सामग्री","पूजा सामग्री — दुकान से उपलब्ध।",59,39 FROM categories WHERE name="हवन सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"सुंदरकांड हवन सामग्री","पूजा सामग्री — दुकान से उपलब्ध।",72,42 FROM categories WHERE name="हवन सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गुग्गुल","पूजा सामग्री — दुकान से उपलब्ध।",85,45 FROM categories WHERE name="हवन सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लोबान","पूजा सामग्री — दुकान से उपलब्ध।",98,48 FROM categories WHERE name="हवन सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन समिधा","पूजा सामग्री — दुकान से उपलब्ध।",111,10 FROM categories WHERE name="हवन सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"आम की समिधा","पूजा सामग्री — दुकान से उपलब्ध।",124,13 FROM categories WHERE name="हवन सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पीपल समिधा","पूजा सामग्री — दुकान से उपलब्ध।",137,16 FROM categories WHERE name="हवन सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पलाश समिधा","पूजा सामग्री — दुकान से उपलब्ध।",150,19 FROM categories WHERE name="हवन सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन कपूर","पूजा सामग्री — दुकान से उपलब्ध।",163,22 FROM categories WHERE name="हवन सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन जौ","पूजा सामग्री — दुकान से उपलब्ध।",176,25 FROM categories WHERE name="हवन सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन तिल","पूजा सामग्री — दुकान से उपलब्ध।",189,28 FROM categories WHERE name="हवन सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन चावल","पूजा सामग्री — दुकान से उपलब्ध।",26,31 FROM categories WHERE name="हवन सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन सुपारी","पूजा सामग्री — दुकान से उपलब्ध।",39,34 FROM categories WHERE name="हवन सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन लौंग","पूजा सामग्री — दुकान से उपलब्ध।",52,37 FROM categories WHERE name="हवन सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन इलायची","पूजा सामग्री — दुकान से उपलब्ध।",65,40 FROM categories WHERE name="हवन सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन गिलोय","पूजा सामग्री — दुकान से उपलब्ध।",78,43 FROM categories WHERE name="हवन सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन औषधि मिश्रण","पूजा सामग्री — दुकान से उपलब्ध।",91,46 FROM categories WHERE name="हवन सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन कुंड छोटा","पूजा सामग्री — दुकान से उपलब्ध।",104,49 FROM categories WHERE name="हवन सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन कुंड मध्यम","पूजा सामग्री — दुकान से उपलब्ध।",117,11 FROM categories WHERE name="हवन सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन कुंड बड़ा","पूजा सामग्री — दुकान से उपलब्ध।",130,14 FROM categories WHERE name="हवन सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन चम्मच","पूजा सामग्री — दुकान से उपलब्ध।",143,17 FROM categories WHERE name="हवन सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन लकड़ी पैक","पूजा सामग्री — दुकान से उपलब्ध।",156,20 FROM categories WHERE name="हवन सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन घी","पूजा सामग्री — दुकान से उपलब्ध।",169,23 FROM categories WHERE name="हवन सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"यज्ञोपवीत हवन सेट","पूजा सामग्री — दुकान से उपलब्ध।",182,26 FROM categories WHERE name="हवन सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"स्टील पूजा थाली","पूजा सामग्री — दुकान से उपलब्ध।",174,28 FROM categories WHERE name="पूजा थाली सेट";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पीतल पूजा थाली","पूजा सामग्री — दुकान से उपलब्ध।",187,31 FROM categories WHERE name="पूजा थाली सेट";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"कॉपर पूजा थाली","पूजा सामग्री — दुकान से उपलब्ध।",200,34 FROM categories WHERE name="पूजा थाली सेट";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पूजा थाली सादा","पूजा सामग्री — दुकान से उपलब्ध।",37,37 FROM categories WHERE name="पूजा थाली सेट";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पूजा थाली डिजाइन","पूजा सामग्री — दुकान से उपलब्ध।",50,40 FROM categories WHERE name="पूजा थाली सेट";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"आरती थाली","पूजा सामग्री — दुकान से उपलब्ध।",63,43 FROM categories WHERE name="पूजा थाली सेट";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"कुंकुम थाली","पूजा सामग्री — दुकान से उपलब्ध।",76,46 FROM categories WHERE name="पूजा थाली सेट";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"रोली चावल थाली","पूजा सामग्री — दुकान से उपलब्ध।",89,49 FROM categories WHERE name="पूजा थाली सेट";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पंचदीप थाली","पूजा सामग्री — दुकान से उपलब्ध।",102,11 FROM categories WHERE name="पूजा थाली सेट";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"आरती दीप थाली","पूजा सामग्री — दुकान से उपलब्ध।",115,14 FROM categories WHERE name="पूजा थाली सेट";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पूजा घंटी थाली सेट","पूजा सामग्री — दुकान से उपलब्ध।",128,17 FROM categories WHERE name="पूजा थाली सेट";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"शंख थाली सेट","पूजा सामग्री — दुकान से उपलब्ध।",141,20 FROM categories WHERE name="पूजा थाली सेट";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पूजा कटोरी सेट","पूजा सामग्री — दुकान से उपलब्ध।",154,23 FROM categories WHERE name="पूजा थाली सेट";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पंचपात्र थाली सेट","पूजा सामग्री — दुकान से उपलब्ध।",167,26 FROM categories WHERE name="पूजा थाली सेट";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पूजा चम्मच सेट","पूजा सामग्री — दुकान से उपलब्ध।",180,29 FROM categories WHERE name="पूजा थाली सेट";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पूजा डिब्बी सेट","पूजा सामग्री — दुकान से उपलब्ध।",193,32 FROM categories WHERE name="पूजा थाली सेट";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पूजा कलश थाली सेट","पूजा सामग्री — दुकान से उपलब्ध।",30,35 FROM categories WHERE name="पूजा थाली सेट";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"विवाह पूजा थाली","पूजा सामग्री — दुकान से उपलब्ध।",43,38 FROM categories WHERE name="पूजा थाली सेट";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गृह प्रवेश थाली","पूजा सामग्री — दुकान से उपलब्ध।",56,41 FROM categories WHERE name="पूजा थाली सेट";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"सत्यनारायण पूजा थाली","पूजा सामग्री — दुकान से उपलब्ध।",69,44 FROM categories WHERE name="पूजा थाली सेट";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"श्रीफल नारियल","पूजा सामग्री — दुकान से उपलब्ध।",191,35 FROM categories WHERE name="नारियल व सुपारी";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पूजा नारियल","पूजा सामग्री — दुकान से उपलब्ध।",28,38 FROM categories WHERE name="नारियल व सुपारी";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"नारियल जोड़ा","पूजा सामग्री — दुकान से उपलब्ध।",41,41 FROM categories WHERE name="नारियल व सुपारी";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"सुपारी","पूजा सामग्री — दुकान से उपलब्ध।",54,44 FROM categories WHERE name="नारियल व सुपारी";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पूजा सुपारी पैक","पूजा सामग्री — दुकान से उपलब्ध।",67,47 FROM categories WHERE name="नारियल व सुपारी";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लाल सुपारी","पूजा सामग्री — दुकान से उपलब्ध।",80,50 FROM categories WHERE name="नारियल व सुपारी";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"इलायची सुपारी","पूजा सामग्री — दुकान से उपलब्ध।",93,12 FROM categories WHERE name="नारियल व सुपारी";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पान पत्ता","पूजा सामग्री — दुकान से उपलब्ध।",106,15 FROM categories WHERE name="नारियल व सुपारी";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"नागवेली पान","पूजा सामग्री — दुकान से उपलब्ध।",119,18 FROM categories WHERE name="नारियल व सुपारी";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लौंग","पूजा सामग्री — दुकान से उपलब्ध।",132,21 FROM categories WHERE name="नारियल व सुपारी";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हरी इलायची","पूजा सामग्री — दुकान से उपलब्ध।",145,24 FROM categories WHERE name="नारियल व सुपारी";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"बड़ी इलायची","पूजा सामग्री — दुकान से उपलब्ध।",158,27 FROM categories WHERE name="नारियल व सुपारी";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"काली मिर्च","पूजा सामग्री — दुकान से उपलब्ध।",171,30 FROM categories WHERE name="नारियल व सुपारी";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"जायफल","पूजा सामग्री — दुकान से उपलब्ध।",184,33 FROM categories WHERE name="नारियल व सुपारी";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"जावित्री","पूजा सामग्री — दुकान से उपलब्ध।",197,36 FROM categories WHERE name="नारियल व सुपारी";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"बादाम","पूजा सामग्री — दुकान से उपलब्ध।",34,39 FROM categories WHERE name="नारियल व सुपारी";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"काजू","पूजा सामग्री — दुकान से उपलब्ध।",47,42 FROM categories WHERE name="नारियल व सुपारी";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"किशमिश","पूजा सामग्री — दुकान से उपलब्ध।",60,45 FROM categories WHERE name="नारियल व सुपारी";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"मखाना","पूजा सामग्री — दुकान से उपलब्ध।",73,48 FROM categories WHERE name="नारियल व सुपारी";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"चिरौंजी","पूजा सामग्री — दुकान से उपलब्ध।",86,10 FROM categories WHERE name="नारियल व सुपारी";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"खोपरा","पूजा सामग्री — दुकान से उपलब्ध।",99,13 FROM categories WHERE name="नारियल व सुपारी";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गोला","पूजा सामग्री — दुकान से उपलब्ध।",112,16 FROM categories WHERE name="नारियल व सुपारी";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"मिश्री","पूजा सामग्री — दुकान से उपलब्ध।",125,19 FROM categories WHERE name="नारियल व सुपारी";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"बताशे","पूजा सामग्री — दुकान से उपलब्ध।",138,22 FROM categories WHERE name="नारियल व सुपारी";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"खांड","पूजा सामग्री — दुकान से उपलब्ध।",151,25 FROM categories WHERE name="नारियल व सुपारी";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गुड़","पूजा सामग्री — दुकान से उपलब्ध।",164,28 FROM categories WHERE name="नारियल व सुपारी";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"सूखा नारियल बुरादा","पूजा सामग्री — दुकान से उपलब्ध।",177,31 FROM categories WHERE name="नारियल व सुपारी";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"मेवा पूजा पैक","पूजा सामग्री — दुकान से उपलब्ध।",190,34 FROM categories WHERE name="नारियल व सुपारी";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पूजा कपूर","पूजा सामग्री — दुकान से उपलब्ध।",32,42 FROM categories WHERE name="कपूर, रोली व चंदन";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"भीमसेनी कपूर","पूजा सामग्री — दुकान से उपलब्ध।",45,45 FROM categories WHERE name="कपूर, रोली व चंदन";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"कपूर टिकिया","पूजा सामग्री — दुकान से उपलब्ध।",58,48 FROM categories WHERE name="कपूर, रोली व चंदन";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"रोली","पूजा सामग्री — दुकान से उपलब्ध।",71,10 FROM categories WHERE name="कपूर, रोली व चंदन";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"कुमकुम","पूजा सामग्री — दुकान से उपलब्ध।",84,13 FROM categories WHERE name="कपूर, रोली व चंदन";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"सिंदूर","पूजा सामग्री — दुकान से उपलब्ध।",97,16 FROM categories WHERE name="कपूर, रोली व चंदन";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हल्दी गांठ","पूजा सामग्री — दुकान से उपलब्ध।",110,19 FROM categories WHERE name="कपूर, रोली व चंदन";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हल्दी पाउडर","पूजा सामग्री — दुकान से उपलब्ध।",123,22 FROM categories WHERE name="कपूर, रोली व चंदन";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"चंदन पाउडर","पूजा सामग्री — दुकान से उपलब्ध।",136,25 FROM categories WHERE name="कपूर, रोली व चंदन";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"चंदन बट्टी","पूजा सामग्री — दुकान से उपलब्ध।",149,28 FROM categories WHERE name="कपूर, रोली व चंदन";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"अष्टगंध","पूजा सामग्री — दुकान से उपलब्ध।",162,31 FROM categories WHERE name="कपूर, रोली व चंदन";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"केसर चंदन","पूजा सामग्री — दुकान से उपलब्ध।",175,34 FROM categories WHERE name="कपूर, रोली व चंदन";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गोपी चंदन","पूजा सामग्री — दुकान से उपलब्ध।",188,37 FROM categories WHERE name="कपूर, रोली व चंदन";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"मौली कलावा","पूजा सामग्री — दुकान से उपलब्ध।",25,40 FROM categories WHERE name="कपूर, रोली व चंदन";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लाल मौली","पूजा सामग्री — दुकान से उपलब्ध।",38,43 FROM categories WHERE name="कपूर, रोली व चंदन";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पीली मौली","पूजा सामग्री — दुकान से उपलब्ध।",51,46 FROM categories WHERE name="कपूर, रोली व चंदन";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"चावल अक्षत","पूजा सामग्री — दुकान से उपलब्ध।",64,49 FROM categories WHERE name="कपूर, रोली व चंदन";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"सफेद तिल","पूजा सामग्री — दुकान से उपलब्ध।",77,11 FROM categories WHERE name="कपूर, रोली व चंदन";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"काले तिल","पूजा सामग्री — दुकान से उपलब्ध।",90,14 FROM categories WHERE name="कपूर, रोली व चंदन";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"जौ","पूजा सामग्री — दुकान से उपलब्ध।",103,17 FROM categories WHERE name="कपूर, रोली व चंदन";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गुलाल","पूजा सामग्री — दुकान से उपलब्ध।",116,20 FROM categories WHERE name="कपूर, रोली व चंदन";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"अबीर","पूजा सामग्री — दुकान से उपलब्ध।",129,23 FROM categories WHERE name="कपूर, रोली व चंदन";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"सिंदूर डिब्बी","पूजा सामग्री — दुकान से उपलब्ध।",142,26 FROM categories WHERE name="कपूर, रोली व चंदन";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"रोली डिब्बी","पूजा सामग्री — दुकान से उपलब्ध।",155,29 FROM categories WHERE name="कपूर, रोली व चंदन";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"चंदन डिब्बी","पूजा सामग्री — दुकान से उपलब्ध।",168,32 FROM categories WHERE name="कपूर, रोली व चंदन";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"कुमकुम डिब्बी","पूजा सामग्री — दुकान से उपलब्ध।",181,35 FROM categories WHERE name="कपूर, रोली व चंदन";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पूजा रंगोली","पूजा सामग्री — दुकान से उपलब्ध।",194,38 FROM categories WHERE name="कपूर, रोली व चंदन";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"शंख","पूजा सामग्री — दुकान से उपलब्ध।",49,49 FROM categories WHERE name="पूजा उपयोगी सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"घंटी","पूजा सामग्री — दुकान से उपलब्ध।",62,11 FROM categories WHERE name="पूजा उपयोगी सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"घंटा","पूजा सामग्री — दुकान से उपलब्ध।",75,14 FROM categories WHERE name="पूजा उपयोगी सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"आरती दीप","पूजा सामग्री — दुकान से उपलब्ध।",88,17 FROM categories WHERE name="पूजा उपयोगी सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"धूपदान","पूजा सामग्री — दुकान से उपलब्ध।",101,20 FROM categories WHERE name="पूजा उपयोगी सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"कपूरदानी","पूजा सामग्री — दुकान से उपलब्ध।",114,23 FROM categories WHERE name="पूजा उपयोगी सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पूजा आसन","पूजा सामग्री — दुकान से उपलब्ध।",127,26 FROM categories WHERE name="पूजा उपयोगी सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"कुश आसन","पूजा सामग्री — दुकान से उपलब्ध।",140,29 FROM categories WHERE name="पूजा उपयोगी सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"चौकी","पूजा सामग्री — दुकान से उपलब्ध।",153,32 FROM categories WHERE name="पूजा उपयोगी सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पूजा बाजोट","पूजा सामग्री — दुकान से उपलब्ध।",166,35 FROM categories WHERE name="पूजा उपयोगी सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"घी चम्मच","पूजा सामग्री — दुकान से उपलब्ध।",179,38 FROM categories WHERE name="पूजा उपयोगी सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पूजा चम्मच","पूजा सामग्री — दुकान से उपलब्ध।",192,41 FROM categories WHERE name="पूजा उपयोगी सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"चिमटी","पूजा सामग्री — दुकान से उपलब्ध।",29,44 FROM categories WHERE name="पूजा उपयोगी सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"अगरबत्ती डिब्बा","पूजा सामग्री — दुकान से उपलब्ध।",42,47 FROM categories WHERE name="पूजा उपयोगी सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"माचिस पूजा पैक","पूजा सामग्री — दुकान से उपलब्ध।",55,50 FROM categories WHERE name="पूजा उपयोगी सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"मौली कंगन","पूजा सामग्री — दुकान से उपलब्ध।",68,12 FROM categories WHERE name="पूजा उपयोगी सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"यज्ञोपवीत","पूजा सामग्री — दुकान से उपलब्ध।",81,15 FROM categories WHERE name="पूजा उपयोगी सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"जनेऊ सेट","पूजा सामग्री — दुकान से उपलब्ध।",94,18 FROM categories WHERE name="पूजा उपयोगी सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"रक्षा सूत्र","पूजा सामग्री — दुकान से उपलब्ध।",107,21 FROM categories WHERE name="पूजा उपयोगी सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गोमुखी","पूजा सामग्री — दुकान से उपलब्ध।",120,24 FROM categories WHERE name="पूजा उपयोगी सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"शंख ध्वनि शंख","पूजा सामग्री — दुकान से उपलब्ध।",133,27 FROM categories WHERE name="पूजा उपयोगी सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पूजा झाड़ू","पूजा सामग्री — दुकान से उपलब्ध।",146,30 FROM categories WHERE name="पूजा उपयोगी सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गंगाजल बोतल","पूजा सामग्री — दुकान से उपलब्ध।",159,33 FROM categories WHERE name="पूजा उपयोगी सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गंगाजल पात्र","पूजा सामग्री — दुकान से उपलब्ध।",172,36 FROM categories WHERE name="पूजा उपयोगी सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गोमूत्र अर्क","पूजा सामग्री — दुकान से उपलब्ध।",185,39 FROM categories WHERE name="पूजा उपयोगी सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गौमय कंडे","पूजा सामग्री — दुकान से उपलब्ध।",198,42 FROM categories WHERE name="पूजा उपयोगी सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गौमय उपले","पूजा सामग्री — दुकान से उपलब्ध।",35,45 FROM categories WHERE name="पूजा उपयोगी सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गोबर दीपक","पूजा सामग्री — दुकान से उपलब्ध।",48,48 FROM categories WHERE name="पूजा उपयोगी सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"कमलगट्टा","पूजा सामग्री — दुकान से उपलब्ध।",61,10 FROM categories WHERE name="पूजा उपयोगी सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"स्फटिक शिवलिंग","पूजा सामग्री — दुकान से उपलब्ध।",74,13 FROM categories WHERE name="पूजा उपयोगी सामग्री";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"सत्यनारायण पूजा पैकेज","पूजा सामग्री — दुकान से उपलब्ध।",66,15 FROM categories WHERE name="विशेष पूजा पैकेज";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गृह प्रवेश पूजा पैकेज","पूजा सामग्री — दुकान से उपलब्ध।",79,18 FROM categories WHERE name="विशेष पूजा पैकेज";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"विवाह पूजा पैकेज","पूजा सामग्री — दुकान से उपलब्ध।",92,21 FROM categories WHERE name="विशेष पूजा पैकेज";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गणेश पूजा पैकेज","पूजा सामग्री — दुकान से उपलब्ध।",105,24 FROM categories WHERE name="विशेष पूजा पैकेज";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लक्ष्मी पूजा पैकेज","पूजा सामग्री — दुकान से उपलब्ध।",118,27 FROM categories WHERE name="विशेष पूजा पैकेज";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"नवरात्रि पूजा पैकेज","पूजा सामग्री — दुकान से उपलब्ध।",131,30 FROM categories WHERE name="विशेष पूजा पैकेज";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"महाशिवरात्रि पूजा पैकेज","पूजा सामग्री — दुकान से उपलब्ध।",144,33 FROM categories WHERE name="विशेष पूजा पैकेज";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हनुमान पूजा पैकेज","पूजा सामग्री — दुकान से उपलब्ध।",157,36 FROM categories WHERE name="विशेष पूजा पैकेज";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"शनि पूजा पैकेज","पूजा सामग्री — दुकान से उपलब्ध।",170,39 FROM categories WHERE name="विशेष पूजा पैकेज";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"रुद्राभिषेक पैकेज","पूजा सामग्री — दुकान से उपलब्ध।",183,42 FROM categories WHERE name="विशेष पूजा पैकेज";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"महामृत्युंजय जाप पैकेज","पूजा सामग्री — दुकान से उपलब्ध।",196,45 FROM categories WHERE name="विशेष पूजा पैकेज";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"सुंदरकांड पैकेज","पूजा सामग्री — दुकान से उपलब्ध।",33,48 FROM categories WHERE name="विशेष पूजा पैकेज";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"भगवत कथा पैकेज","पूजा सामग्री — दुकान से उपलब्ध।",46,10 FROM categories WHERE name="विशेष पूजा पैकेज";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"13वीं पूजा सामग्री पैकेज","पूजा सामग्री — दुकान से उपलब्ध।",59,13 FROM categories WHERE name="विशेष पूजा पैकेज";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पितृ पूजा पैकेज","पूजा सामग्री — दुकान से उपलब्ध।",72,16 FROM categories WHERE name="विशेष पूजा पैकेज";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"नवग्रह पूजा पैकेज","पूजा सामग्री — दुकान से उपलब्ध।",85,19 FROM categories WHERE name="विशेष पूजा पैकेज";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"माता श्रृंगार पैकेज","पूजा सामग्री — दुकान से उपलब्ध।",98,22 FROM categories WHERE name="विशेष पूजा पैकेज";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लड्डू गोपाल श्रृंगार पैकेज","पूजा सामग्री — दुकान से उपलब्ध।",111,25 FROM categories WHERE name="विशेष पूजा पैकेज";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"जन्माष्टमी पैकेज","पूजा सामग्री — दुकान से उपलब्ध।",124,28 FROM categories WHERE name="विशेष पूजा पैकेज";
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"दीपावली पूजा पैकेज","पूजा सामग्री — दुकान से उपलब्ध।",137,31 FROM categories WHERE name="विशेष पूजा पैकेज";

-- Killer Feature 1: Pooja Kit Builder
CREATE TABLE IF NOT EXISTS pooja_kits (
  id SERIAL PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  description TEXT DEFAULT '',
  fixed_price NUMERIC(10,2),
  active BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE IF NOT EXISTS pooja_kit_items (
  kit_id INTEGER NOT NULL REFERENCES pooja_kits(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK(quantity > 0),
  PRIMARY KEY (kit_id, product_id)
);

-- Killer Feature 2: Customer Order Tracking
CREATE TABLE IF NOT EXISTS order_tracking (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(40) NOT NULL,
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- Bhagwan Shringar catalog
INSERT INTO categories(name) VALUES ('भगवान श्रृंगार सामग्री') ON CONFLICT (name) DO NOTHING;
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लड्डू गोपाल मुकुट","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",54,10 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लड्डू गोपाल पगड़ी","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",73,15 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लड्डू गोपाल मोर मुकुट","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",92,20 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लड्डू गोपाल बांसुरी","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",111,25 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लड्डू गोपाल हार","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",130,30 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लड्डू गोपाल कंठी","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",149,9 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लड्डू गोपाल तुलसी माला","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",168,14 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लड्डू गोपाल वैजयंती माला","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",187,19 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लड्डू गोपाल कड़े","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",206,24 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लड्डू गोपाल पायल","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",225,29 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लड्डू गोपाल बाजूबंद","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",244,8 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लड्डू गोपाल कमरबंध","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",263,13 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लड्डू गोपाल झुमकी","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",282,18 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लड्डू गोपाल तिलक","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",35,23 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लड्डू गोपाल चंदन","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",54,28 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लड्डू गोपाल वस्त्र सेट","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",73,7 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लड्डू गोपाल शीतकालीन पोशाक","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",92,12 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लड्डू गोपाल ग्रीष्मकालीन पोशाक","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",111,17 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लड्डू गोपाल वर्षा पोशाक","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",130,22 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लड्डू गोपाल जन्माष्टमी पोशाक","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",149,27 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"राधा जी मुकुट","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",168,6 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"राधा जी पोशाक","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",187,11 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"राधा जी हार","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",206,16 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"राधा जी नथ","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",225,21 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"राधा जी झुमका","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",244,26 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"राधा जी कंगन","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",263,5 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"राधा जी पायल","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",282,10 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"राधा जी कमरबंध","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",35,15 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"राधा-कृष्ण पोशाक सेट","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",54,20 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"राधा-कृष्ण श्रृंगार सेट","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",73,25 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"कृष्ण जी मुकुट","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",92,30 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"कृष्ण जी मोर पंख","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",111,9 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"कृष्ण जी बांसुरी सजावट","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",130,14 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"कृष्ण जी हार","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",149,19 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"कृष्ण जी कंठी","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",168,24 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"कृष्ण जी बाजूबंद","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",187,29 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"कृष्ण जी कंगन","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",206,8 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"कृष्ण जी पायल","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",225,13 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"बाल गोपाल झूला सजावट","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",244,18 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"झूला श्रृंगार सेट","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",263,23 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"भगवान शिव जटा सजावट","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",282,28 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"शिवलिंग वस्त्र","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",35,7 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"शिवलिंग मौली","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",54,12 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"शिवलिंग चंदन","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",73,17 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"शिवलिंग श्रृंगार पैक","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",92,22 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"नंदी श्रृंगार माला","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",111,27 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हनुमान जी चोला","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",130,6 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हनुमान जी सिंदूर","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",149,11 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हनुमान जी चमेली तेल","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",168,16 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हनुमान जी गदा","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",187,21 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हनुमान जी माला","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",206,26 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हनुमान जी मुकुट","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",225,5 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गणेश जी मुकुट","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",244,10 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गणेश जी माला","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",263,15 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गणेश जी वस्त्र","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",282,20 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गणेश जी दूर्वा माला","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",35,25 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गणेश जी श्रृंगार सेट","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",54,30 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"माता रानी मुकुट","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",73,9 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"माता रानी चुनरी","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",92,14 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"माता रानी हार","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",111,19 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"माता रानी नथ","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",130,24 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"माता रानी टीका","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",149,29 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"माता रानी झुमका","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",168,8 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"माता रानी कंगन","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",187,13 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"माता रानी बाजूबंद","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",206,18 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"माता रानी कमरबंध","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",225,23 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"माता रानी पायल","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",244,28 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"माता रानी चूड़ी","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",263,7 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"माता रानी श्रृंगार बॉक्स","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",282,12 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"माता रानी पूर्ण श्रृंगार सेट","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",35,17 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लक्ष्मी जी कमल श्रृंगार","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",54,22 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लक्ष्मी जी हार","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",73,27 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लक्ष्मी जी मुकुट","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",92,6 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"सरस्वती जी हार","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",111,11 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"सरस्वती जी वीणा सजावट","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",130,16 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"राम दरबार वस्त्र सेट","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",149,21 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"श्री राम मुकुट","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",168,26 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"सीता माता मुकुट","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",187,5 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लक्ष्मण जी मुकुट","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",206,10 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"भरत जी मुकुट","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",225,15 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"शत्रुघ्न जी मुकुट","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",244,20 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"राम दरबार श्रृंगार सेट","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",263,25 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"भगवान वस्त्र पिन","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",282,30 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"वस्त्र हुक","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",35,9 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"श्रृंगार ड्रेसिंग स्टैंड","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",54,14 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"देवता श्रृंगार ट्रे","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",73,19 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"श्रृंगार पिन सेट","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",92,24 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"छोटा श्रृंगार बॉक्स","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",111,29 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"मुकुट बॉक्स","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",130,8 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"माला स्टैंड","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",149,13 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"भगवान के कपड़े रखने का बॉक्स","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",168,18 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पूजा वस्त्र पैक","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",187,23 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"देवता आसन वस्त्र","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",206,28 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"भगवान का सिंहासन कपड़ा","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",225,7 FROM categories WHERE name='भगवान श्रृंगार सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"देवता श्रृंगार किट","भगवान के श्रृंगार के लिए सामग्री — विभिन्न आकार/डिजाइन उपलब्ध।",244,12 FROM categories WHERE name='भगवान श्रृंगार सामग्री';


-- Expanded Havan Samagri catalog
INSERT INTO categories(name) VALUES ('हवन सामग्री') ON CONFLICT (name) DO NOTHING;
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन सामग्री सामान्य 100 ग्राम","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",53,12 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन सामग्री सामान्य 250 ग्राम","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",76,19 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन सामग्री सामान्य 500 ग्राम","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",99,26 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन सामग्री सामान्य 1 किलो","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",122,33 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"विशेष हवन सामग्री 250 ग्राम","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",145,9 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"विशेष हवन सामग्री 500 ग्राम","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",168,16 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"विशेष हवन सामग्री 1 किलो","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",191,23 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गृह प्रवेश हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",214,30 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गृह शांति हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",237,6 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"वास्तु शांति हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",260,13 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"नवग्रह हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",283,20 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"महामृत्युंजय हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",35,27 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"रुद्र हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",58,34 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"सत्यनारायण पूजा हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",81,10 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"विवाह हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",104,17 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"सगाई हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",127,24 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"नामकरण हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",150,31 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"मुंडन हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",173,7 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"उपनयन हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",196,14 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"अन्नप्राशन हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",219,21 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"दुर्गा हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",242,28 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गणेश हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",265,35 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लक्ष्मी हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",288,11 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"सरस्वती हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",40,18 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हनुमान हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",63,25 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"शनि हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",86,32 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"नवरात्रि हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",109,8 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"दीपावली हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",132,15 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"शिवरात्रि हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",155,22 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"जन्माष्टमी हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",178,29 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"सुंदरकांड हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",201,5 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"भागवत कथा हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",224,12 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"13वीं हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",247,19 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पितृ शांति हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",270,26 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"दोष निवारण हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",293,33 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"राहु-केतु शांति हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",45,9 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"मंगल दोष हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",68,16 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"कालसर्प हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",91,23 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"संतान प्राप्ति हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",114,30 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"आरोग्य हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",137,6 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"समृद्धि हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",160,13 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"व्यापार वृद्धि हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",183,20 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गौघृत हवन घी","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",206,27 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"देशी घी हवन पैक","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",229,34 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन समिधा मिश्रित","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",252,10 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"आम की समिधा","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",275,17 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पीपल की समिधा","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",298,24 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पलाश की समिधा","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",50,31 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"बड़ की समिधा","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",73,7 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"बेर की समिधा","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",96,14 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"शमी की समिधा","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",119,21 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"चंदन की समिधा","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",142,28 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन लकड़ी पैक","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",165,35 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गुग्गुल","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",188,11 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"लोबान","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",211,18 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"सम्ब्रानी","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",234,25 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन धूप","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",257,32 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन जौ","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",280,8 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन तिल","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",32,15 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"काले तिल हवन","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",55,22 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"सफेद तिल हवन","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",78,29 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन चावल","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",101,5 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"अक्षत","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",124,12 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन सुपारी","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",147,19 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन लौंग","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",170,26 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन इलायची","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",193,33 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"बड़ी इलायची","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",216,9 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"जायफल हवन","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",239,16 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"जावित्री हवन","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",262,23 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"कपूर हवन","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",285,30 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"केसर हवन","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",37,6 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"नागकेसर","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",60,13 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गिलोय","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",83,20 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गिलोय गिलोय मिश्रण","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",106,27 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन औषधि मिश्रण","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",129,34 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पंचमेवा हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",152,10 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"नवधान्य हवन पैक","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",175,17 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"नवरत्न हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",198,24 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पंचरत्न हवन सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",221,31 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"सूखा नारियल हवन","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",244,7 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गोला हवन","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",267,14 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"खोपरा हवन","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",290,21 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"बूरा हवन","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",42,28 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गुड़ हवन","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",65,35 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"मिश्री हवन","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",88,11 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"बताशा हवन","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",111,18 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"कमलगट्टा हवन","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",134,25 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"बेलपत्र सूखा","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",157,32 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"नीम पत्ती सूखी","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",180,8 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"आम पत्ती सूखी","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",203,15 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"देवदारु","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",226,22 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"तगर","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",249,29 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"अगर","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",272,5 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"काली तिल्ली","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",295,12 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"सरसों हवन","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",47,19 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"कुशा","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",70,26 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"दर्भा","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",93,33 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गोबर कंडे","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",116,9 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गौमय उपले","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",139,16 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन कुंड छोटा","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",162,23 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन कुंड मध्यम","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",185,30 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन कुंड बड़ा","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",208,6 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"तांबे का हवन कुंड","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",231,13 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पीतल हवन कुंड","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",254,20 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन चम्मच","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",277,27 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन स्रुवा","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",300,34 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन पात्र","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",52,10 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन सामग्री डिब्बा","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",75,17 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन आसन","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",98,24 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन लकड़ी स्टैंड","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",121,31 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन राख पात्र","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",144,7 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन राख छन्नी","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",167,14 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन सुरक्षा चिमटा","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",190,21 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"हवन पूर्णाहुति पैक","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",213,28 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पूर्णाहुति नारियल","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",236,35 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पूर्णाहुति वस्त्र","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",259,11 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"पूर्णाहुति सामग्री","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",282,18 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"नवग्रह समिधा सेट","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",34,25 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"महामृत्युंजय समिधा सेट","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",57,32 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गृह प्रवेश पूर्ण हवन किट","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",80,8 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"गृह शांति पूर्ण हवन किट","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",103,15 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"वास्तु शांति पूर्ण हवन किट","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",126,22 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"रुद्राभिषेक हवन किट","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",149,29 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"नवग्रह शांति पूर्ण किट","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",172,5 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"विवाह हवन पूर्ण किट","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",195,12 FROM categories WHERE name='हवन सामग्री';
INSERT INTO products(category_id,name,description,price,stock) SELECT id,"सत्यनारायण हवन पूर्ण किट","हवन एवं यज्ञ के लिए सामग्री। उपलब्धता/पैक आकार के अनुसार कीमत बदल सकती है।",218,19 FROM categories WHERE name='हवन सामग्री';

-- Seed a few ready-made kits. Product links can be assigned by admin after import.
INSERT INTO pooja_kits(name,description,fixed_price) VALUES
('गृह प्रवेश Complete Kit','गृह प्रवेश के लिए ready-made पूजा kit',NULL),
('सत्यनारायण पूजा Complete Kit','सत्यनारायण कथा एवं पूजा की सामग्री',NULL),
('महामृत्युंजय पूजा Kit','महामृत्युंजय जाप/हवन के लिए सामग्री',NULL),
('रुद्राभिषेक Complete Kit','रुद्राभिषेक और शिव पूजा की सामग्री',NULL),
('विवाह पूजा Complete Kit','विवाह संस्कार में उपयोगी पूजा सामग्री',NULL),
('13वीं पूजा सामग्री Kit','13वीं/पितृ कर्म के लिए सामग्री',NULL)
ON CONFLICT DO NOTHING;

-- Production commerce extensions
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(180),
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS product_variants (
  id BIGSERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku VARCHAR(80) UNIQUE,
  size VARCHAR(80),
  quantity_label VARCHAR(80),
  design VARCHAR(100),
  color VARCHAR(80),
  price NUMERIC(10,2),
  stock INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE IF NOT EXISTS coupons (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(40) UNIQUE NOT NULL,
  discount_type VARCHAR(20) NOT NULL CHECK(discount_type IN ('percent','flat')),
  discount_value NUMERIC(10,2) NOT NULL,
  min_order NUMERIC(10,2) NOT NULL DEFAULT 0,
  max_discount NUMERIC(10,2),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  expires_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS order_coupons (
  order_id BIGINT PRIMARY KEY REFERENCES orders(id) ON DELETE CASCADE,
  coupon_id BIGINT REFERENCES coupons(id),
  discount NUMERIC(10,2) NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS delivery_zones (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  pincode VARCHAR(10),
  area VARCHAR(160),
  charge NUMERIC(10,2) NOT NULL DEFAULT 0,
  free_above NUMERIC(10,2),
  active BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE IF NOT EXISTS reviews (
  id BIGSERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  order_id BIGINT REFERENCES orders(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  title VARCHAR(150),
  body TEXT,
  approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS payment_transactions (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  provider VARCHAR(40) NOT NULL,
  provider_payment_id VARCHAR(160),
  amount NUMERIC(10,2) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'created',
  raw_event JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS error_logs (
  id BIGSERIAL PRIMARY KEY,
  level VARCHAR(20) NOT NULL DEFAULT 'error',
  message TEXT NOT NULL,
  stack TEXT,
  path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS order_events (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
  event VARCHAR(80) NOT NULL,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);

-- Default Bhind delivery rule
INSERT INTO delivery_zones(name,pincode,area,charge,free_above,active)
SELECT 'Bhind City - Flat Delivery', NULL, 'Bhind', 50, NULL, TRUE
WHERE NOT EXISTS (SELECT 1 FROM delivery_zones WHERE name='Bhind City - Flat Delivery');

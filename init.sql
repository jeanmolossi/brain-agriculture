SET client_encoding = 'UTF8';

CREATE TYPE doc_type AS ENUM ('CPF', 'CNPJ');

CREATE UNLOGGED TABLE IF NOT EXISTS farmers (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(50) NOT NULL,
  document VARCHAR(14) NOT NULL,
  doc_type doc_type NOT NULL DEFAULT 'CPF',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX unique_doc_idx ON farmers (document);

CREATE UNLOGGED TABLE IF NOT EXISTS farms (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(160) NOT NULL,
  city VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  total_area INTEGER NOT NULL,
  max_usable_area INTEGER NOT NULL DEFAULT 0,
  usable_inuse_area INTEGER NOT NULL DEFAULT 0,
  total_inuse_area INTEGER GENERATED ALWAYS AS (
    total_area - max_usable_area + usable_inuse_area
  ) STORED,
  farmer_id INTEGER NOT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_farmers_farms_id
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,

  CONSTRAINT chk_usable_area CHECK (
    usable_inuse_area <= max_usable_area
  )
);

CREATE UNIQUE INDEX unique_farmer_id_idx ON farms (farmer_id);

CREATE INDEX IF NOT EXISTS farms_farmer_idx ON farms (
  farmer_id DESC NULLS LAST
);

CREATE INDEX CONCURRENTLY IF NOT EXISTS farms_updated_idx ON farms (
  updated_at DESC NULLS LAST
);

CREATE INDEX CONCURRENTLY IF NOT EXISTS farms_state_idx ON farms (
  state DESC NULLS LAST
);

CREATE INDEX CONCURRENTLY IF NOT EXISTS farms_total_area_idx ON farms (
  total_inuse_area DESC NULLS FIRST 
);

CREATE UNLOGGED TABLE IF NOT EXISTS farmings (
  id SERIAL PRIMARY KEY NOT NULL,
  farm_id INTEGER NOT NULL,
  farming_type VARCHAR(255) NOT NULL,
  area INTEGER NOT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_farms_farmings_id
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
);


-- SEED

DO $$
BEGIN
  INSERT INTO farmers (name, document, doc_type)
  VALUES
    ('Vicente', '67326409000173', 'CNPJ'),
    ('John Doe', '34807856000195', 'CNPJ'),
    ('Professor', '89197229199', 'CPF'),
    ('Estagiario', '29022693155', 'CPF'),
    ('Carroça empinada', '89349386000155', 'CNPJ');

  INSERT INTO farms (farmer_id, name, city, state, total_area, max_usable_area, usable_inuse_area)
  VALUES
    (1, 'Fazenda Talismã do Vicente', 'Goiania', 'Goias', 10, 9, 5),
    (2, 'Fazenda do John', 'Goiania', 'Goias', 3, 3, 0),
    (3, 'Teachers Farm', 'Salvador', 'Bahia', 3, 3, 0),
    (4, 'Fazenda do aprendizado', 'Porto Alergre', 'Rio Grande do Sul', 25, 22, 0),
    (5, 'Fazenda da muié', 'Porto Alergre', 'Rio Grande do Sul', 15, 12, 10);

  INSERT INTO farmings (farm_id, farming_type, area)
  VALUES
    (1, 'Mandioca', 5),
    (5, 'Tomate', 5),
    (5, 'Café', 5);

END;
$$;

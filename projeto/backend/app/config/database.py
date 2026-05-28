import sqlite3
from pathlib import Path

from flask import current_app, g


SCHEMA = """
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS units (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT,
    type TEXT NOT NULL,
    active INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    seasonal INTEGER NOT NULL,
    active INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS menu_items (
    id TEXT PRIMARY KEY,
    unit_id TEXT NOT NULL REFERENCES units(id),
    product_id TEXT NOT NULL REFERENCES products(id),
    available INTEGER NOT NULL,
    note TEXT,
    UNIQUE(unit_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    unit_id TEXT NOT NULL REFERENCES units(id),
    customer_name TEXT,
    customer_phone TEXT,
    accepts_communication INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL,
    total REAL NOT NULL,
    idempotency_key TEXT NOT NULL UNIQUE,
    request_hash TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders(id),
    product_id TEXT NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    subtotal REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS simulated_payments (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders(id),
    result TEXT NOT NULL,
    authorization_code TEXT,
    message TEXT,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_events (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    entity TEXT,
    entity_id TEXT,
    message TEXT NOT NULL,
    level TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS consents (
    id TEXT PRIMARY KEY,
    order_id TEXT REFERENCES orders(id),
    purpose TEXT NOT NULL,
    accepted INTEGER NOT NULL,
    created_at TEXT NOT NULL
);
"""


SEED = """
INSERT OR IGNORE INTO units (id, name, city, type, active) VALUES
('U-01', 'Recife Centro', 'Recife', 'COZINHA_COMPLETA', 1),
('U-02', 'Salvador Shopping', 'Salvador', 'COZINHA_REDUZIDA', 1),
('U-03', 'Fortaleza Beira-Mar', 'Fortaleza', 'COZINHA_COMPLETA', 1),
('U-99', 'Unidade Pausada', 'Teste', 'COZINHA_REDUZIDA', 0);

INSERT OR IGNORE INTO products (id, name, description, price, seasonal, active) VALUES
('P-01', 'Tapioca de queijo coalho', 'Tapioca tradicional com queijo coalho.', 12.90, 0, 1),
('P-02', 'Cuscuz com carne de sol', 'Cuscuz recheado com carne de sol.', 18.50, 0, 1),
('P-03', 'Bolo de macaxeira', 'Fatia macia para retirada rapida.', 9.90, 0, 1),
('P-04', 'Suco de caja', 'Suco gelado de caja.', 8.00, 0, 1),
('P-05', 'Combo Junino', 'Combo sazonal com itens selecionados.', 24.90, 1, 1);

INSERT OR IGNORE INTO menu_items (id, unit_id, product_id, available, note) VALUES
('M-0101', 'U-01', 'P-01', 1, NULL),
('M-0102', 'U-01', 'P-02', 1, NULL),
('M-0103', 'U-01', 'P-03', 1, NULL),
('M-0104', 'U-01', 'P-04', 1, NULL),
('M-0105', 'U-01', 'P-05', 1, 'Produto sazonal'),
('M-0201', 'U-02', 'P-01', 1, NULL),
('M-0203', 'U-02', 'P-03', 1, NULL),
('M-0301', 'U-03', 'P-01', 1, NULL),
('M-0302', 'U-03', 'P-02', 1, NULL),
('M-0303', 'U-03', 'P-03', 1, NULL),
('M-0304', 'U-03', 'P-04', 1, NULL);
"""


def connect(database_path):
    connection = sqlite3.connect(database_path)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def get_db():
    if "db" not in g:
        g.db = connect(current_app.config["DATABASE"])
    return g.db


def close_db(_error=None):
    connection = g.pop("db", None)
    if connection is not None:
        connection.close()


def init_db(database_path):
    Path(database_path).parent.mkdir(parents=True, exist_ok=True)
    connection = connect(database_path)
    connection.executescript(SCHEMA)
    ensure_migrations(connection)
    connection.executescript(SEED)
    connection.commit()
    connection.close()


def ensure_migrations(connection):
    order_columns = {
        row["name"]
        for row in connection.execute("PRAGMA table_info(orders)").fetchall()
    }
    if "request_hash" not in order_columns:
        connection.execute("ALTER TABLE orders ADD COLUMN request_hash TEXT")

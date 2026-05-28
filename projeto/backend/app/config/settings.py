from pathlib import Path


class Config:
    ROOT_DIR = Path(__file__).resolve().parents[2]
    DATABASE = str(ROOT_DIR / "instance" / "raizes.db")
    CORS_ORIGIN = "*"
    JSON_SORT_KEYS = False

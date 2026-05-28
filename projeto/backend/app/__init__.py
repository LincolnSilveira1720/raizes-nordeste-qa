from pathlib import Path

from flask import Flask

from .common.errors import register_error_handlers
from .config.database import close_db, init_db
from .config.settings import Config
from .modules.cardapio.controller import cardapio_bp
from .modules.pagamento.controller import payments_bp
from .modules.pedido.controller import orders_bp
from .modules.unidade.controller import units_bp
from .system.controller import health_bp


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(Config)

    if test_config:
        app.config.update(test_config)

    database_path = Path(app.config["DATABASE"])
    database_path.parent.mkdir(parents=True, exist_ok=True)

    init_db(app.config["DATABASE"])
    app.teardown_appcontext(close_db)

    app.register_blueprint(health_bp)
    app.register_blueprint(units_bp)
    app.register_blueprint(cardapio_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(payments_bp)
    register_error_handlers(app)

    @app.after_request
    def add_local_cors_headers(response):
        response.headers["Access-Control-Allow-Origin"] = app.config["CORS_ORIGIN"]
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
        return response

    return app

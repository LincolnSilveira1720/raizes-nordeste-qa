from flask import Blueprint, jsonify

from ...config.database import get_db
from .service import build_cardapio_service


cardapio_bp = Blueprint("cardapio", __name__, url_prefix="/api")


@cardapio_bp.get("/unidades/<unit_id>/cardapio")
def get_menu(unit_id):
    return jsonify(build_cardapio_service(get_db()).obter_cardapio(unit_id))

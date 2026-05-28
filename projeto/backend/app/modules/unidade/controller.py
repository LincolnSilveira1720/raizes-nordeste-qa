from flask import Blueprint, jsonify

from ...config.database import get_db
from .service import build_unidade_service


units_bp = Blueprint("units", __name__, url_prefix="/api")


@units_bp.get("/unidades")
def list_units():
    return jsonify(build_unidade_service(get_db()).listar_unidades())

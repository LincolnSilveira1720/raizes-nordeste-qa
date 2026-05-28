from flask import Blueprint, jsonify, request

from ...config.database import get_db
from .service import build_pedido_service


orders_bp = Blueprint("orders", __name__, url_prefix="/api")


@orders_bp.post("/pedidos")
def create_order():
    result = build_pedido_service(get_db()).criar_pedido(request.get_json(silent=True))
    return jsonify(result.payload), result.status_code


@orders_bp.get("/pedidos/<order_id>/status")
def get_order_status(order_id):
    return jsonify(build_pedido_service(get_db()).obter_status(order_id))

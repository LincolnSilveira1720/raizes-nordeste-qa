from flask import Blueprint, jsonify, request

from ...config.database import get_db
from .service import build_pagamento_service


payments_bp = Blueprint("payments", __name__, url_prefix="/api")


@payments_bp.post("/pagamentos/simular")
def simulate_payment():
    payload = request.get_json(silent=True) or {}
    outcome = build_pagamento_service(get_db()).simular(
        payload.get("pedidoId"),
        float(payload.get("valor") or 0),
        payload.get("cenario"),
    )
    return jsonify(outcome.to_payload(payload.get("pedidoId")))

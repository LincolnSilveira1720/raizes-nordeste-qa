from dataclasses import dataclass
from datetime import datetime, timezone

from flask import jsonify
from werkzeug.exceptions import HTTPException


@dataclass
class ApiError(Exception):
    status_code: int
    code: str
    message: str
    detail: str | None = None
    trace: str | None = None


def error_payload(error):
    payload = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "codigo": error.code,
        "mensagem": error.message,
    }
    if error.detail:
        payload["detalhe"] = error.detail
    if error.trace:
        payload["rastreio"] = error.trace
    return payload


def register_error_handlers(app):
    @app.errorhandler(ApiError)
    def handle_api_error(error):
        return jsonify(error_payload(error)), error.status_code

    @app.errorhandler(HTTPException)
    def handle_http_error(error):
        api_error = ApiError(
            error.code or 500,
            "HTTP_ERROR",
            error.description or "Requisicao invalida.",
        )
        return jsonify(error_payload(api_error)), api_error.status_code

    @app.errorhandler(Exception)
    def handle_unexpected_error(error):
        if app.config.get("TESTING"):
            raise error
        api_error = ApiError(
            500,
            "ERRO_INESPERADO",
            "Ocorreu um erro inesperado. Tente novamente.",
        )
        return jsonify(error_payload(api_error)), 500

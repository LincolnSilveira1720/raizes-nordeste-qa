from ...shared.utils.ids import new_id
from ...shared.utils.time import now_iso


class PagamentoRepository:
    def __init__(self, connection):
        self.connection = connection

    def registrar(self, pedido_id, pagamento):
        self.connection.execute(
            """
            INSERT INTO simulated_payments (
                id, order_id, result, authorization_code, message, created_at
            ) VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                new_id("PAY"),
                pedido_id,
                pagamento.resultado,
                pagamento.codigo_autorizacao,
                pagamento.mensagem,
                now_iso(),
            ),
        )
        self.connection.commit()

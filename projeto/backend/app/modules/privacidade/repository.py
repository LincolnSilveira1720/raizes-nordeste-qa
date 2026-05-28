from ...shared.utils.ids import new_id
from ...shared.utils.time import now_iso


class PrivacidadeRepository:
    def __init__(self, connection):
        self.connection = connection

    def registrar_escolha_comunicacao(self, consentimento):
        self.connection.execute(
            """
            INSERT INTO consents (id, order_id, purpose, accepted, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                new_id("CONS"),
                consentimento.pedido_id,
                "COMUNICACAO_PEDIDO",
                int(consentimento.aceito),
                now_iso(),
            ),
        )
        self.connection.commit()

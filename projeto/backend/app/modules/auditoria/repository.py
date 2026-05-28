from ...shared.utils.ids import new_id
from ...shared.utils.time import now_iso


class AuditoriaRepository:
    def __init__(self, connection):
        self.connection = connection

    def registrar(self, evento):
        audit_id = new_id("AUD")
        self.connection.execute(
            """
            INSERT INTO audit_events (
                id, type, entity, entity_id, message, level, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                audit_id,
                evento.tipo,
                evento.entidade,
                evento.entidade_id,
                evento.mensagem,
                evento.nivel,
                now_iso(),
            ),
        )
        self.connection.commit()
        return audit_id

    def listar_por_entidade(self, entidade_id):
        rows = self.connection.execute(
            """
            SELECT id, type, message, level
            FROM audit_events
            WHERE entity_id = ?
            ORDER BY created_at
            """,
            (entidade_id,),
        ).fetchall()
        return [dict(row) for row in rows]

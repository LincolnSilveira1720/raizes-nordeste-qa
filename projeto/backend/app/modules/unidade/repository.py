from .dto import UnidadeDto


class UnidadeRepository:
    def __init__(self, connection):
        self.connection = connection

    def listar_ativas(self):
        rows = self.connection.execute(
            """
            SELECT id, name, type, active
            FROM units
            WHERE active = 1
            ORDER BY name
            """
        ).fetchall()
        return [self._unit(row) for row in rows]

    def obter_por_id(self, unit_id):
        row = self.connection.execute(
            """
            SELECT id, name, type, active
            FROM units
            WHERE id = ?
            """,
            (unit_id,),
        ).fetchone()
        return self._unit(row) if row else None

    @staticmethod
    def _unit(row):
        return UnidadeDto(
            id=row["id"],
            nome=row["name"],
            tipo=row["type"],
            ativa=bool(row["active"]),
        )

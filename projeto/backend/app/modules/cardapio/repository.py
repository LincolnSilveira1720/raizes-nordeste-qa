from .dto import ProdutoDto


class CardapioRepository:
    def __init__(self, connection):
        self.connection = connection

    def listar_por_unidade(self, unit_id):
        rows = self.connection.execute(
            """
            SELECT p.id, p.name, p.description, p.price, m.available
            FROM menu_items m
            JOIN products p ON p.id = m.product_id
            WHERE m.unit_id = ?
              AND m.available = 1
              AND p.active = 1
            ORDER BY p.name
            """,
            (unit_id,),
        ).fetchall()
        return [self._product(row) for row in rows]

    def obter_produto_disponivel(self, unit_id, product_id):
        row = self.connection.execute(
            """
            SELECT p.id, p.name, p.description, p.price, m.available
            FROM menu_items m
            JOIN products p ON p.id = m.product_id
            WHERE m.unit_id = ?
              AND p.id = ?
              AND m.available = 1
              AND p.active = 1
            """,
            (unit_id, product_id),
        ).fetchone()
        return self._product(row) if row else None

    @staticmethod
    def _product(row):
        return ProdutoDto(
            id=row["id"],
            nome=row["name"],
            descricao=row["description"],
            preco=round(row["price"], 2),
            disponivel=bool(row["available"]),
        )

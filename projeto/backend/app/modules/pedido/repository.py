from ...shared.utils.ids import new_id


class PedidoRepository:
    def __init__(self, connection):
        self.connection = connection

    def criar(self, pedido, itens):
        self.connection.execute(
            """
            INSERT INTO orders (
                id, unit_id, customer_name, customer_phone, accepts_communication,
                status, total, idempotency_key, request_hash, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                pedido["id"],
                pedido["unidade_id"],
                pedido["nome_cliente"],
                pedido["telefone_cliente"],
                int(pedido["aceite_comunicacao"]),
                pedido["status"],
                pedido["valor_total"],
                pedido["idempotency_key"],
                pedido["request_hash"],
                pedido["criado_em"],
                pedido["atualizado_em"],
            ),
        )

        self.connection.executemany(
            """
            INSERT INTO order_items (
                id, order_id, product_id, quantity, unit_price, subtotal
            ) VALUES (?, ?, ?, ?, ?, ?)
            """,
            [
                (
                    new_id("ITEM"),
                    pedido["id"],
                    item["produto_id"],
                    item["quantidade"],
                    item["preco_unitario"],
                    item["subtotal"],
                )
                for item in itens
            ],
        )
        self.connection.commit()
        return self.obter_por_id(pedido["id"])

    def atualizar_status(self, pedido_id, status, atualizado_em):
        self.connection.execute(
            """
            UPDATE orders
            SET status = ?, updated_at = ?
            WHERE id = ?
            """,
            (status, atualizado_em, pedido_id),
        )
        self.connection.commit()
        return self.obter_por_id(pedido_id)

    def obter_por_id(self, pedido_id):
        row = self.connection.execute(
            """
            SELECT id, unit_id, status, total, idempotency_key, request_hash, updated_at
            FROM orders
            WHERE id = ?
            """,
            (pedido_id,),
        ).fetchone()
        return self._order(row) if row else None

    def obter_por_chave_idempotencia(self, idempotency_key):
        row = self.connection.execute(
            """
            SELECT id, unit_id, status, total, idempotency_key, request_hash, updated_at
            FROM orders
            WHERE idempotency_key = ?
            """,
            (idempotency_key,),
        ).fetchone()
        return self._order(row) if row else None

    def contar_por_chave_idempotencia(self, idempotency_key):
        row = self.connection.execute(
            """
            SELECT COUNT(*) AS total
            FROM orders
            WHERE idempotency_key = ?
            """,
            (idempotency_key,),
        ).fetchone()
        return row["total"]

    @staticmethod
    def _order(row):
        return {
            "id": row["id"],
            "unidade_id": row["unit_id"],
            "status": row["status"],
            "valor_total": round(row["total"], 2),
            "idempotency_key": row["idempotency_key"],
            "request_hash": row["request_hash"],
            "atualizado_em": row["updated_at"],
        }

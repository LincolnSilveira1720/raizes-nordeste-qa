export interface Product {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  disponivel: boolean;
}

export interface Menu {
  unidadeId: string;
  unidadeNome: string;
  produtos: Product[];
}

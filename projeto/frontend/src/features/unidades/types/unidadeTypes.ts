export interface Unit {
  id: string;
  nome: string;
  tipo: "COZINHA_COMPLETA" | "COZINHA_REDUZIDA";
  ativa: boolean;
}

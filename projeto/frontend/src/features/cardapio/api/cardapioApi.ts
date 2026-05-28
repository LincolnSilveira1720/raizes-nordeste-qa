import { apiRequest } from "../../../services/apiClient";
import type { Menu } from "../types/cardapioTypes";

export function getMenu(unitId: string) {
  return apiRequest<Menu>(`/api/unidades/${unitId}/cardapio`);
}

import { apiRequest } from "../../../services/apiClient";
import type { Unit } from "../types/unidadeTypes";

export function listUnits() {
  return apiRequest<Unit[]>("/api/unidades");
}

import type { ApiProblem } from "../shared/types/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export class ApiClientError extends Error {
  readonly problem: ApiProblem;
  readonly status: number;

  constructor(problem: ApiProblem, status: number) {
    super(problem.mensagem);
    this.problem = problem;
    this.status = status;
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });

  const body = (await response.json()) as T | ApiProblem;

  if (!response.ok) {
    throw new ApiClientError(
      body as ApiProblem,
      response.status,
    );
  }

  return body as T;
}

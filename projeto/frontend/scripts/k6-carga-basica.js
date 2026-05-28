import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 20,
  duration: "30s",
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<2000"],
  },
};

export default function () {
  const unidades = http.get("http://127.0.0.1:5000/api/unidades");

  check(unidades, {
    "GET /api/unidades status 200": (res) => res.status === 200,
    "GET /api/unidades tempo < 2s": (res) => res.timings.duration < 2000,
  });

  const cardapio = http.get("http://127.0.0.1:5000/api/unidades/U-02/cardapio");

  check(cardapio, {
    "GET /api/unidades/U-02/cardapio status 200": (res) => res.status === 200,
    "GET /api/unidades/U-02/cardapio tempo < 2s": (res) => res.timings.duration < 2000,
  });

  sleep(1);
}
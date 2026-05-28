import { chromium } from "@playwright/test";
import { execFile, spawn } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.resolve(scriptDir, "..");
const projectRoot = path.resolve(frontendRoot, "..");
const workspaceRoot = path.resolve(projectRoot, "..");
const backendRoot = path.join(projectRoot, "backend");
const printsRoot = path.join(workspaceRoot, "evidencias", "prints");
const apiBaseUrl = "http://127.0.0.1:5000";
const frontendUrl = "http://127.0.0.1:5173";

const outputDirs = {
  backend: path.join(printsRoot, "backend"),
  api: path.join(printsRoot, "api"),
  frontend: path.join(printsRoot, "frontend"),
  mobile: path.join(printsRoot, "mobile"),
};

for (const directory of Object.values(outputDirs)) {
  await fs.mkdir(directory, { recursive: true });
}

const browser = await chromium.launch();
const generatedFiles = [];
let viteProcess;

try {
  await ensureApiAvailable();
  viteProcess = await ensureFrontendAvailable();

  await captureApiPrints();
  await captureBackendTestPrint();
  await captureFrontendFlowPrints();
} finally {
  await browser.close();
  if (viteProcess) {
    viteProcess.kill();
  }
}

console.log(JSON.stringify(generatedFiles, null, 2));

async function ensureApiAvailable() {
  const response = await fetch(`${apiBaseUrl}/api/health`);
  if (!response.ok) {
    throw new Error(`API indisponivel em ${apiBaseUrl}`);
  }
}

async function ensureFrontendAvailable() {
  if (await isHttpAvailable(frontendUrl)) {
    return undefined;
  }

  const child = spawn(
    process.platform === "win32" ? "npm.cmd" : "npm",
    ["run", "dev", "--", "--host", "127.0.0.1", "--port", "5173"],
    {
      cwd: frontendRoot,
      env: process.env,
      shell: false,
      stdio: "ignore",
    },
  );

  await waitForHttp(frontendUrl, 30000);
  return child;
}

async function isHttpAvailable(url) {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForHttp(url, timeoutMs) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (await isHttpAvailable(url)) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Timeout aguardando ${url}`);
}

async function captureApiPrints() {
  await renderApiEvidence({
    path: path.join(outputDirs.backend, "EV-001_backend_health.png"),
    title: "EV-001 - Backend Flask em execucao",
    method: "GET",
    endpoint: "/api/health",
    response: await apiRequest("/api/health"),
    requirement: "Disponibilidade local da API",
  });

  await renderApiEvidence({
    path: path.join(outputDirs.api, "EV-005_cardapio_u02.png"),
    title: "EV-005 - Cardapio da unidade U-02",
    method: "GET",
    endpoint: "/api/unidades/U-02/cardapio",
    response: await apiRequest("/api/unidades/U-02/cardapio"),
    requirement: "RF-02 / CA-02 - Exibir apenas produtos disponiveis na unidade",
  });

  const unavailablePayload = {
    unidadeId: "U-02",
    itens: [{ produtoId: "P-04", quantidade: 1 }],
    cenarioPagamento: "APROVADO",
    idempotencyKey: "ct-04-produto-indisponivel-print",
  };
  await renderApiEvidence({
    path: path.join(outputDirs.api, "CT-04_produto_indisponivel_api.png"),
    title: "CT-04 - Produto indisponivel para unidade",
    method: "POST",
    endpoint: "/api/pedidos",
    request: unavailablePayload,
    response: await apiRequest("/api/pedidos", {
      method: "POST",
      body: JSON.stringify(unavailablePayload),
    }),
    requirement: "RF-05 / CA-03 / RQ-04",
  });

  const key = `ct-08-payload-divergente-${Date.now()}`;
  await apiRequest("/api/pedidos", {
    method: "POST",
    body: JSON.stringify({
      unidadeId: "U-01",
      itens: [{ produtoId: "P-01", quantidade: 1 }],
      pagamento: { cenario: "APROVADO" },
      idempotencyKey: key,
    }),
  });
  await renderApiEvidence({
    path: path.join(outputDirs.api, "CT-08_idempotencia_payload_divergente.png"),
    title: "CT-08 - Idempotencia com payload divergente",
    method: "POST",
    endpoint: "/api/pedidos",
    request: {
      unidadeId: "U-01",
      itens: [{ produtoId: "P-03", quantidade: 1 }],
      pagamento: { cenario: "APROVADO" },
      idempotencyKey: key,
    },
    response: await apiRequest("/api/pedidos", {
      method: "POST",
      body: JSON.stringify({
        unidadeId: "U-01",
        itens: [{ produtoId: "P-03", quantidade: 1 }],
        pagamento: { cenario: "APROVADO" },
        idempotencyKey: key,
      }),
    }),
    requirement: "RF-16 / RQ-03 - Evitar duplicidade e detectar tentativa divergente",
  });
}

async function apiRequest(endpoint, init = {}) {
  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
    ...init,
  });

  const body = await response.json();
  return {
    status: response.status,
    ok: response.ok,
    body,
  };
}

async function renderApiEvidence({ path: outputPath, title, method, endpoint, request, response, requirement }) {
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  await page.setContent(apiEvidenceHtml({ title, method, endpoint, request, response, requirement }));
  await page.screenshot({ path: outputPath, fullPage: true });
  await page.close();
  generatedFiles.push(outputPath);
}

function apiEvidenceHtml({ title, method, endpoint, request, response, requirement }) {
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <style>
      body {
        margin: 0;
        background: #f3f5f7;
        color: #1e293b;
        font: 16px/1.45 Arial, sans-serif;
      }
      main {
        max-width: 1120px;
        margin: 36px auto;
        background: #ffffff;
        border: 1px solid #d8dee8;
        border-radius: 8px;
        box-shadow: 0 12px 34px rgba(15, 23, 42, 0.10);
        overflow: hidden;
      }
      header {
        padding: 26px 30px;
        border-bottom: 1px solid #d8dee8;
      }
      h1 {
        margin: 0 0 8px;
        font-size: 25px;
        color: #0f172a;
      }
      .meta {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        color: #475569;
      }
      .pill {
        padding: 5px 10px;
        border-radius: 999px;
        background: #e8f0f2;
        font-weight: 700;
      }
      .status-ok { background: #dff4e7; color: #166534; }
      .status-error { background: #fde8e8; color: #991b1b; }
      section {
        padding: 22px 30px;
      }
      h2 {
        margin: 0 0 10px;
        font-size: 17px;
        color: #334155;
      }
      pre {
        margin: 0;
        padding: 18px;
        background: #0f172a;
        color: #e5edf7;
        border-radius: 7px;
        overflow: auto;
        font: 14px/1.5 Consolas, monospace;
      }
      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 18px;
      }
      .note {
        padding: 14px 18px;
        background: #fff8db;
        border-top: 1px solid #e5d28b;
        color: #5f4b00;
        font-weight: 700;
      }
    </style>
  </head>
  <body>
    <main>
      <header>
        <h1>${escapeHtml(title)}</h1>
        <div class="meta">
          <span class="pill">${escapeHtml(method)}</span>
          <span class="pill">${escapeHtml(endpoint)}</span>
          <span class="pill ${response.ok ? "status-ok" : "status-error"}">HTTP ${response.status}</span>
        </div>
      </header>
      <div class="note">${escapeHtml(requirement)}</div>
      <section class="${request ? "grid" : ""}">
        ${request ? `<div><h2>Request</h2><pre>${escapeHtml(pretty(request))}</pre></div>` : ""}
        <div>
          <h2>Response</h2>
          <pre>${escapeHtml(pretty(response.body))}</pre>
        </div>
      </section>
    </main>
  </body>
</html>`;
}

async function captureBackendTestPrint() {
  const python = path.join(
    os.homedir(),
    ".cache",
    "codex-runtimes",
    "codex-primary-runtime",
    "dependencies",
    "python",
    process.platform === "win32" ? "python.exe" : "bin/python",
  );
  const sitePackages = path.join(backendRoot, ".venv", "Lib", "site-packages");
  const env = {
    ...process.env,
    PYTHONDONTWRITEBYTECODE: "1",
    PYTHONPATH: `.;${sitePackages}`,
  };
  let output = "";
  try {
    const result = await execFileAsync(
      python,
      ["-m", "pytest", "-p", "no:cacheprovider"],
      { cwd: backendRoot, env, maxBuffer: 1024 * 1024 },
    );
    output = result.stdout + result.stderr;
  } catch (error) {
    output = `${error.stdout ?? ""}${error.stderr ?? ""}`;
    await renderTerminalEvidence(
      path.join(outputDirs.backend, "EV-010_pytest_backend_falha.png"),
      "EV-010 - Testes backend",
      output,
    );
    throw error;
  }

  await renderTerminalEvidence(
    path.join(outputDirs.backend, "EV-010_pytest_backend.png"),
    "EV-010 - Testes backend",
    output,
  );
}

async function renderTerminalEvidence(outputPath, title, output) {
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  await page.setContent(`<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <style>
      body { margin: 0; background: #111827; color: #e5e7eb; font: 15px Consolas, monospace; }
      header { padding: 22px 28px; border-bottom: 1px solid #374151; background: #0b1220; }
      h1 { margin: 0; font: 700 22px Arial, sans-serif; color: #ffffff; }
      pre { margin: 0; padding: 28px; white-space: pre-wrap; line-height: 1.55; }
    </style>
  </head>
  <body>
    <header><h1>${escapeHtml(title)}</h1></header>
    <pre>${escapeHtml(output.trim())}</pre>
  </body>
</html>`);
  await page.screenshot({ path: outputPath, fullPage: true });
  await page.close();
  generatedFiles.push(outputPath);
}

async function captureFrontendFlowPrints() {
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await context.newPage();

  await page.goto(frontendUrl, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Recife Centro/ }).waitFor();
  await screenshot(page, path.join(outputDirs.frontend, "CT-01_01_unidades.png"));

  await page.getByRole("button", { name: /Recife Centro/ }).click();
  await page.getByRole("button", { name: /Adicionar Tapioca/ }).waitFor();
  await page.getByRole("button", { name: /Adicionar Tapioca/ }).click();
  await screenshot(page, path.join(outputDirs.frontend, "CT-01_02_cardapio_carrinho.png"));

  await page.getByRole("button", { name: "Revisar pedido" }).click();
  await page.getByRole("button", { name: /Confirmar pedido/ }).waitFor();
  await screenshot(page, path.join(outputDirs.frontend, "CT-01_03_revisao.png"));

  await page.getByRole("button", { name: /Confirmar pedido/ }).click();
  await page.getByRole("heading", { name: "CONFIRMADO" }).waitFor();
  await screenshot(page, path.join(outputDirs.frontend, "CT-01_04_status_confirmado.png"));
  await context.close();

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(frontendUrl, { waitUntil: "networkidle" });
  await mobilePage.getByRole("button", { name: /Recife Centro/ }).click();
  await mobilePage.getByRole("button", { name: /Adicionar Tapioca/ }).waitFor();
  await mobilePage.getByRole("button", { name: /Adicionar Tapioca/ }).click();
  await mobilePage.getByRole("button", { name: "Revisar pedido" }).click();
  await mobilePage.getByRole("button", { name: /Confirmar pedido/ }).click();
  await mobilePage.getByRole("heading", { name: "CONFIRMADO" }).waitFor();
  await screenshot(mobilePage, path.join(outputDirs.mobile, "CT-11_mobile_390_status_confirmado.png"));
  await mobileContext.close();
}

async function screenshot(page, outputPath) {
  await page.screenshot({ path: outputPath, fullPage: true });
  generatedFiles.push(outputPath);
}

function pretty(value) {
  return JSON.stringify(value, null, 2);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

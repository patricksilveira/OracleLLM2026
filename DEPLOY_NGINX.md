# Arquitetura com Container de Entrada NGINX

Configuração completa do **Container de Entrada (Ingress / Reverse Proxy NGINX)** para o **LLM Oracle 2026**.

---

## 🏗️ Como Funciona a Arquitetura

```
                            [ Tráfego Externo: Porta 80 / 8080 / 443 ]
                                                │
                                                ▼
                         ┌──────────────────────────────────────────────┐
                         │   CONTAINER DE ENTRADA (NGINX Ingress)       │
                         │   - Serve Frontend SPA estático (/assets, /) │
                         │   - Cache imutável para bundles Vite         │
                         │   - Headers de segurança & Compressão Gzip   │
                         │   - Endpoint direto de saúde /healthz        │
                         └──────────────────────┬───────────────────────┘
                                                │
                                                │ proxy_pass (/api/*)
                                                ▼
                         ┌──────────────────────────────────────────────┐
                         │   CONTAINER BACKEND (Node.js Express)        │
                         │   - Motor de Verificação Sistemático         │
                         │   - APIs de Pesquisa ao Vivo Gemini          │
                         │   - Gestão de Dossiês & Persistência         │
                         │   - Porta interna: 3000                      │
                         └──────────────────────────────────────────────┘
```

---

## 🚀 Opção 1: Rodar Localmente ou em VPS via Docker Compose

Para subir ambos os containers juntos com 1 comando:

```bash
# 1. Certifique-se de configurar a chave GEMINI_API_KEY no arquivo .env
echo "GEMINI_API_KEY=sua_chave_aqui" >> .env

# 2. Construir e iniciar os containers
docker compose up -d --build

# 3. Verificar o status dos containers
docker compose ps

# 4. Acessar a aplicação
http://localhost
```

---

## ☁️ Opção 2: Deploy no Google Cloud Run (Container de Entrada Multi-Container)

O Google Cloud Run suporta múltiplos containers em uma única revisão, onde o NGINX atua como o **Ingress Container** (recebendo a porta `$PORT` atribuída pelo Cloud Run) e roteando internamente para o backend Node via `http://127.0.0.1:3000`.

### 1. Construir e enviar as imagens para o Artifact Registry / Container Registry
```bash
# Substitua SEU_PROJETO pelo seu ID do GCP (ex: 1002606437930)
gcloud config set project SEU_PROJETO

# Construir imagem do NGINX Ingress
docker build -t gcr.io/SEU_PROJETO/llm-oracle-nginx:latest -f Dockerfile.nginx .
docker push gcr.io/SEU_PROJETO/llm-oracle-nginx:latest

# Construir imagem do Backend Node.js
docker build -t gcr.io/SEU_PROJETO/llm-oracle-backend:latest -f Dockerfile .
docker push gcr.io/SEU_PROJETO/llm-oracle-backend:latest
```

### 2. Implantar no Cloud Run usando o arquivo `cloudrun.yaml`
```bash
# Ajuste o SEU_PROJETO no cloudrun.yaml e execute:
gcloud run services replace cloudrun.yaml --region us-east1
```

---

## 📁 Arquivos Criados

1. **`nginx.conf`**: Configuração do NGINX com compressão gzip, cache de assets, SPA fallback e proxy `/api/`.
2. **`nginx/default.conf.template`**: Template com substituição automática de `$PORT` e `$BACKEND_URL` pelo container `nginx:alpine`.
3. **`Dockerfile.nginx`**: Multi-stage Dockerfile compilando os assets estáticos e embutindo no NGINX com healthcheck.
4. **`docker-compose.yml`**: Orquestrador pronto para subir NGINX + Node Backend.
5. **`cloudrun.yaml`**: Especificação oficial do Cloud Run para serviço multi-container com NGINX como container de entrada.

<div align="center">

# 🛡️ AEGIS Guardrails

### Real-Time AI Prompt and Response Security Engine

[![Python](https://img.shields.io/badge/Python-3.12%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Groq](https://img.shields.io/badge/Groq-LLM_API-000000?style=for-the-badge)](https://groq.com/)
[![WebSocket](https://img.shields.io/badge/WebSocket-Live_Streaming-8B5CF6?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC--BY--NC--4.0-green?style=for-the-badge)](LICENSE)

<br/>

> **AEGIS Guardrails** is a full-stack AI safety firewall that intercepts every prompt and response, detects threats like injection/jailbreak/toxicity/PII leakage, and visualizes risk in a live cyber-defense dashboard.

<br/>

![Live Feed](https://img.shields.io/badge/Live-Threat%20Feed-red?style=for-the-badge) ![Guardrails](https://img.shields.io/badge/Defense-Multi%20Layer-blue?style=for-the-badge) ![Demo](https://img.shields.io/badge/Interactive-Attack%20Simulator-orange?style=for-the-badge)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Application Preview](#-application-preview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Reference](#-api-reference)
- [Configuration](#-configuration)
- [Testing](#-testing)
- [Security Notes](#-security-notes)

---

## 🧠 Overview

AEGIS is built for teams shipping AI-powered products that need real-time guardrails between users and LLMs.

It answers key production safety questions quickly:

- Is this prompt trying prompt injection or jailbreak?
- Is sensitive data (PII/secrets) being sent or leaked?
- Should this request be blocked before model execution?
- Are response quality risks (hallucination/schema drift) increasing?

Instead of treating AI calls as opaque text, AEGIS converts every interaction into structured threat telemetry.

---

## 💻 Application Preview

<br/>
<br/>
<img width="1366" alt="AEGIS Dashboard Overview" src="docs/screenshots/dashboard-overview.png" />
<br/>
<br/>
<img width="1366" alt="Blocked Injection Detection" src="docs/screenshots/dashboard-blocked-injection.png" />
<br/>
<br/>
<img width="1366" alt="Toxic Content Detection" src="docs/screenshots/dashboard-toxic-detection.png" />
<br/>
<br/>
<img width="1366" alt="PII Detection State" src="docs/screenshots/dashboard-pii-detection.png" />
<br/>
<br/>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔎 **Prompt Interception Pipeline** | Multi-layer analysis before model completion |
| 🧱 **Two-Layer Detection** | Fast regex checks + Groq-powered semantic threat analysis |
| 🚫 **Threat Blocking Logic** | Configurable block behavior for critical/high severity |
| 🧾 **PII Redaction** | Detects and redacts sensitive fields in prompt/response paths |
| 🧠 **Response Validation** | Hallucination risk scoring and schema compliance checks |
| 📡 **Live WebSocket Feed** | Real-time threat events streamed to frontend dashboard |
| 🎛️ **Interactive Attack Simulator** | One-click attack scenarios for injection/jailbreak/toxic/PII tests |
| 📊 **Defense Metrics** | Block rate, threat rate, by-type breakdown, and recent threat log |

---

## 🏗️ Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                    React Defense Dashboard                  │
│  Metrics • shield state • live feed • heatmap • radar       │
└───────────────┬─────────────────────────────────────────────┘
                │ HTTP + WebSocket
┌───────────────▼─────────────────────────────────────────────┐
│                       FastAPI Backend                       │
│                                                             │
│  /intercept/prompt     prompt safety pipeline               │
│  /intercept/response   response validation pipeline         │
│  /demo/attack          one-click attack simulation          │
│  /threats, /stats      threat records + aggregate metrics   │
│  /ws                   live event broadcast                 │
└───────────────┬─────────────────────────────────────────────┘
                │
      ┌─────────▼─────────┐          ┌────────────────────────┐
      │  Pattern Detectors│          │   Groq LLM Analysis    │
      │  regex + scoring  │          │   semantic risk eval   │
      └───────────────────┘          └────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Framer Motion, Recharts, Axios |
| **Backend** | FastAPI, Uvicorn, Pydantic, httpx |
| **LLM Provider** | Groq Chat Completions API |
| **Realtime** | FastAPI WebSockets |
| **Security Logic** | Regex threat detectors + in-memory rate limiter |
| **Environment** | python-dotenv |

---

## 📁 Project Structure

```text
aegis-guardrails/
├── backend/
│   ├── main.py
│   ├── interceptor.py
│   ├── gemini_service.py          # Groq-backed service layer
│   ├── threat_logger.py
│   ├── rate_limiter.py
│   ├── threat_detectors/
│   │   ├── injection_detector.py
│   │   ├── toxicity_detector.py
│   │   ├── pii_detector.py
│   │   ├── hallucination_scorer.py
│   │   └── schema_validator.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── public/index.html
│   ├── src/pages/DashboardPage.jsx
│   ├── src/components/
│   ├── src/services/api.js
│   ├── src/hooks/useWebSocket.js
│   ├── src/styles/globals.css
│   └── package.json
├── DECISIONS.md
├── LICENSE
└── README.md
```

---

## 🚀 Installation

### Prerequisites

- Python 3.12+
- Node.js 18+
- Groq API key

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# set GROQ_API_KEY in .env
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm start
```

### Local URLs

- Dashboard: `http://localhost:3000` (or `3001` if configured)
- API: `http://localhost:8000`
- Swagger: `http://localhost:8000/docs`

---

## 💻 Usage

### 1) Intercept prompts

Send input through:

- `POST /intercept/prompt`

### 2) Validate model responses

Validate output through:

- `POST /intercept/response`

### 3) Run interactive attacks

Use the dashboard demo controls or:

- `POST /demo/attack`

### 4) Observe live defense telemetry

Watch updates through:

- WebSocket stream at `/ws`
- Metrics via `/stats`
- Threat log via `/threats`

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health and shield status |
| POST | `/intercept/prompt` | Intercept and score incoming prompts |
| POST | `/intercept/response` | Validate response safety/schema |
| GET | `/threats?limit=50` | Recent threat events |
| GET | `/stats` | Aggregate defense metrics |
| POST | `/demo/attack` | Trigger predefined attack payload |
| WS | `/ws` | Live threat event stream |

---

## ⚙️ Configuration

Set values in `backend/.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant
BLOCK_ON_CRITICAL=true
BLOCK_ON_HIGH=false
MAX_REQUESTS_PER_MINUTE=60
```

---

## 🧪 Testing

```bash
# Backend quick run
cd backend
venv\Scripts\python -m uvicorn main:app --reload

# Frontend build check
cd ../frontend
npm run build
```

---

## 🔒 Security Notes

- Never commit real API keys.
- Keep `backend/.env` out of source control.
- Tighten CORS and rate limits before production exposure.
- Replace in-memory log/rate limiter with persistent infra for scale.

---

## 📜 License

Licensed under **CC BY-NC 4.0** — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built by [Crasta Telvin](https://github.com/crastatelvin)

⭐ Star this repo if it helps your AI safety work.

</div>

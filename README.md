# AEGIS - AI Guardrails Engine

AEGIS is a middleware security layer for LLM applications. It intercepts prompts and responses, classifies threats, and serves a live dashboard for guardrail visibility.

## Features

- Prompt interception with two detection layers (regex + Gemini)
- Prompt injection, jailbreak, toxicity, and PII detection
- Response-side hallucination and schema checks
- Live WebSocket-powered defense dashboard
- Demo attack simulator for interactive testing

## Project Structure

- `backend/` FastAPI API, detectors, interceptor pipeline
- `frontend/` React dashboard UI and live feed

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# add GROQ_API_KEY in .env
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## API Endpoints

- `GET /` health and shield status
- `POST /intercept/prompt` prompt interception pipeline
- `POST /intercept/response` response validation pipeline
- `GET /threats` recent threat events
- `GET /stats` aggregate metrics
- `POST /demo/attack` run predefined attack payloads
- `WS /ws` live threat stream

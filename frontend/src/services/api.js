import axios from "axios";

const BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const interceptPrompt = async (prompt, config = {}) =>
  (await axios.post(`${BASE}/intercept/prompt`, { prompt, config }, { timeout: 30000 })).data;

export const validateResponse = async (response, prompt = "", schema = null) =>
  (await axios.post(`${BASE}/intercept/response`, { response, prompt, schema })).data;

export const getThreats = async (limit = 50) => (await axios.get(`${BASE}/threats?limit=${limit}`)).data;
export const getStats = async () => (await axios.get(`${BASE}/stats`)).data;
export const runDemoAttack = async (type) => (await axios.post(`${BASE}/demo/attack`, { type })).data;

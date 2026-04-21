import { useEffect } from "react";

const WS_URL = process.env.REACT_APP_WS_URL || "ws://localhost:8000/ws";

export default function useWebSocket(onIntercept, onConnectionChange) {
  useEffect(() => {
    let ws = null;
    let reconnectTimer = null;
    let heartbeatTimer = null;
    let stopped = false;

    const clearTimers = () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (heartbeatTimer) clearInterval(heartbeatTimer);
      reconnectTimer = null;
      heartbeatTimer = null;
    };

    const connect = () => {
      if (stopped) return;
      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        onConnectionChange?.(true);
        heartbeatTimer = setInterval(() => {
          if (ws && ws.readyState === WebSocket.OPEN) ws.send("ping");
        }, 15000);
      };

      ws.onclose = () => {
        onConnectionChange?.(false);
        if (heartbeatTimer) clearInterval(heartbeatTimer);
        reconnectTimer = setTimeout(connect, 2000);
      };

      ws.onerror = () => {
        onConnectionChange?.(false);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.event === "intercept") onIntercept?.(data.data);
        } catch (e) {
          // Ignore non-JSON heartbeat or malformed messages.
        }
      };
    };

    connect();
    return () => {
      stopped = true;
      clearTimers();
      if (ws && ws.readyState === WebSocket.OPEN) ws.close();
    };
  }, [onIntercept, onConnectionChange]);
}

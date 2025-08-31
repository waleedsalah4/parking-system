import type { Status } from "@/types";

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private status: Status = "disconnected";
  private pendingSubscriptions: Set<string> = new Set(); // Track pending subscriptions

  private setStatus(status: Status) {
    this.status = status;
  }

  public getStatus() {
    return this.status;
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.setStatus("connecting");
    this.ws = new WebSocket("ws://localhost:3000/api/v1/ws");

    this.ws.onopen = () => {
      console.log("WebSocket connected");
      this.setStatus("connected");
      this.emit("connection", { status: "connected" });

      // Send any pending subscriptions
      this.pendingSubscriptions.forEach((gateId) => {
        this.subscribe(gateId);
      });
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("WebSocket message received:", message); // Debug log
        this.emit(message.type, message.payload);
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    };

    this.ws.onclose = () => {
      console.log("WebSocket disconnected");
      this.setStatus("disconnected");
      this.emit("connection", { status: "disconnected" });
      this.scheduleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.emit("connection", { status: "error" });
    };
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    this.setStatus("connecting");
    this.reconnectTimeout = setTimeout(() => this.connect(), 3000);
  }

  subscribe(gateId: string) {
    // Add to pending subscriptions regardless of connection status
    this.pendingSubscriptions.add(gateId);

    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log("Subscribing to gate:", gateId); // Debug log
      this.ws.send(
        JSON.stringify({
          type: "subscribe",
          payload: { gateId },
        })
      );
    } else {
      console.log("WebSocket not ready, queuing subscription for:", gateId);
    }
  }

  unsubscribe(gateId: string) {
    this.pendingSubscriptions.delete(gateId);

    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log("Unsubscribing from gate:", gateId); // Debug log
      this.ws.send(
        JSON.stringify({
          type: "unsubscribe",
          payload: { gateId },
        })
      );
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
    console.log(`Event listener added for: ${event}`); // Debug log
  }

  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
        console.log(`Event listener removed for: ${event}`); // Debug log
      }
    }
  }

  private emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      console.log(
        `Emitting event: ${event} to ${eventListeners.length} listeners`
      ); // Debug log
      eventListeners.forEach((callback) => callback(data));
    } else {
      console.log(`No listeners for event: ${event}`); // Debug log
    }
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.pendingSubscriptions.clear();
  }
}

export const wsService = new WebSocketService();

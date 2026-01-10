/**
 * Minimal WebSocket abstraction:
 * - If REACT_APP_WS_URL is provided, connects and emits message events.
 * - Otherwise uses a mock in-memory pub/sub to keep UI logic consistent.
 */

function resolveWsUrl() {
  return process.env.REACT_APP_WS_URL || "";
}

class MockWS {
  constructor() {
    this.listeners = new Set();
    this.isOpen = true;
  }

  onMessage(cb) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  send(_msg) {
    // no-op in mock
  }

  close() {
    this.isOpen = false;
    this.listeners.clear();
  }

  emit(msg) {
    for (const cb of this.listeners) cb(msg);
  }
}

// Single mock instance to simulate broadcast
const mock = new MockWS();

// PUBLIC_INTERFACE
export function createWSClient() {
  /** Creates a WS client based on REACT_APP_WS_URL; mock if not configured. */
  const url = resolveWsUrl();

  if (!url) {
    return {
      isMock: true,
      onMessage: (cb) => mock.onMessage(cb),
      send: (msg) => mock.send(msg),
      close: () => mock.close(),
      // internal hook for local mode
      _emitLocal: (msg) => mock.emit(msg),
    };
  }

  let socket = null;
  const listeners = new Set();

  const connect = () => {
    socket = new WebSocket(url);
    socket.addEventListener("message", (ev) => {
      for (const cb of listeners) cb(ev.data);
    });
  };

  connect();

  return {
    isMock: false,
    onMessage: (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    send: (msg) => {
      if (!socket || socket.readyState !== WebSocket.OPEN) return;
      socket.send(typeof msg === "string" ? msg : JSON.stringify(msg));
    },
    close: () => {
      try {
        socket?.close();
      } catch {
        // ignore
      }
    },
  };
}

type LogMeta = Record<string, unknown>;

type LogLevel = "info" | "warn" | "error";

function serialize(level: LogLevel, message: string, meta?: LogMeta) {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    environment: process.env.NODE_ENV ?? "development",
    meta: meta ?? {},
  });
}

function write(level: LogLevel, message: string, meta?: LogMeta) {
  const payload = serialize(level, message, meta);

  if (level === "error") {
    console.error(payload);
    return;
  }

  if (level === "warn") {
    console.warn(payload);
    return;
  }

  console.info(payload);
}

export const logger = {
  info(message: string, meta?: LogMeta) {
    write("info", message, meta);
  },
  warn(message: string, meta?: LogMeta) {
    write("warn", message, meta);
  },
  error(message: string, meta?: LogMeta) {
    write("error", message, meta);
  },
};

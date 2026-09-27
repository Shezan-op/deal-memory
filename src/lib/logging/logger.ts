export interface LogContext {
  requestId?: string;
  operation?: string;
  dealId?: string;
  interactionId?: string;
  durationMs?: number;
  [key: string]: unknown;
}

export class Logger {
  private static sanitize(meta?: LogContext): Record<string, unknown> {
    if (!meta) return {};
    const sanitized = { ...meta };
    // Strip sensitive fields
    const sensitiveKeys = ['apiKey', 'api_key', 'authorization', 'secret', 'password', 'token'];
    for (const key of Object.keys(sanitized)) {
      if (sensitiveKeys.some((s) => key.toLowerCase().includes(s))) {
        sanitized[key] = '[REDACTED]';
      }
    }
    return sanitized;
  }

  static info(message: string, meta?: LogContext): void {
    const payload = {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      message,
      ...this.sanitize(meta),
    };
    console.log(JSON.stringify(payload));
  }

  static warn(message: string, meta?: LogContext): void {
    const payload = {
      timestamp: new Date().toISOString(),
      level: 'WARN',
      message,
      ...this.sanitize(meta),
    };
    console.warn(JSON.stringify(payload));
  }

  static error(message: string, error?: unknown, meta?: LogContext): void {
    const payload = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      message,
      error: error instanceof Error ? error.message : String(error),
      ...this.sanitize(meta),
    };
    console.error(JSON.stringify(payload));
  }
}

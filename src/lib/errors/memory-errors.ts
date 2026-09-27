export class MemoryError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number = 500,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'MemoryError';
  }
}

export class BankNotFoundError extends MemoryError {
  constructor(bankId: string) {
    super(`Hindsight memory bank "${bankId}" was not found`, 'BANK_NOT_FOUND', 404);
  }
}

export class MemoryServiceUnavailableError extends MemoryError {
  constructor(originalError?: unknown) {
    super(
      'Hindsight memory service is temporarily unavailable. Verify HINDSIGHT_BASE_URL and server health.',
      'MEMORY_SERVICE_UNAVAILABLE',
      503,
      originalError
    );
  }
}

export class InsufficientEvidenceError extends MemoryError {
  constructor(dealId: string) {
    super(`Insufficient evidence in deal memory for deal "${dealId}"`, 'INSUFFICIENT_EVIDENCE', 200);
  }
}

export class ValidationError extends MemoryError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}

export class RestApiError extends Error {
  readonly statusCode: number;
  readonly stackTrace?: string;

  constructor(statusCode: number, message: string, stackTrace?: string) {
    super(message);
    this.statusCode = statusCode;
    this.stackTrace = stackTrace;
  }
}

export enum ServiceErrorCode {
  BAD_REQUEST = "BAD_REQUEST",
  NOT_FOUND = "NOT_FOUND",
  FORBIDDEN = "FORBIDDEN",
  CONFLICT = "CONFLICT"
}

export class ServiceError extends Error {
  constructor(
    public readonly code: ServiceErrorCode,
    message: string
  ) {
    super(message);
    this.name = new.target.name;
  }
}

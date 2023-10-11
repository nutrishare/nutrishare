export class BadRequestError extends Error {}

export class ConflictError extends Error {}

export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message ?? "Unauthorized");
  }
}

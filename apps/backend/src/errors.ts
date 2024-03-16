export class BadRequestError extends Error {}

export class ConflictError extends Error {}

export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message ?? "Unauthorized");
  }
}

export class NotFoundError extends Error {
  constructor(model: string, id: string) {
    super(`${model} with id ${id} not found`);
  }
}

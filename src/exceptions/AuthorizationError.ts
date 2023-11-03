export class AuthorizationError extends Error {
    constructor(public message: string) {
      super(message);
    }
  }
export class AuthenticationError extends Error {
    constructor(public message: string) {
      super(message);
    }
  }

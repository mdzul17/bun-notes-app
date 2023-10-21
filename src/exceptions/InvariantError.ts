export class InvariantError extends Error {
    constructor(public message: string) {
      super(message);
    }
  }
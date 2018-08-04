export class UnmountedError extends Error {
  constructor(message = "", ...args) {
    super(message, ...args);
    this.name = 'UnmountedError';
    this.message = message;
  }
}
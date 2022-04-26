export class CanceledPromiseError extends Error {
  constructor() {
    super('Promise canceled!');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class CancelablePromise<T> extends Promise<T> {
  public cancelMethod?: () => void;

  public cancel() {
    if (this.cancelMethod) {
      this.cancelMethod();
    }
  }
}

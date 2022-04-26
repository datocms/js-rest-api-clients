export class CanceledPromiseError extends Error {
  constructor() {
    super('Promise canceled!');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export interface CancelablePromise<T> extends Promise<T> {
  cancel(): void;
}

export function makeCancelablePromise<T>(
  promiseOrAsyncFn: Promise<T> | (() => Promise<T>),
  onCancel: () => void,
): CancelablePromise<T> {
  let cancel: (() => void) | null = null;

  const cancelable = <CancelablePromise<T>>new Promise((resolve, reject) => {
    cancel = () => {
      try {
        onCancel();
        reject(new CanceledPromiseError());
      } catch (e) {
        reject(e);
      }
    };

    const promise =
      typeof promiseOrAsyncFn === 'function'
        ? promiseOrAsyncFn()
        : promiseOrAsyncFn;

    promise.then(resolve, reject);
  });

  if (cancel) {
    cancelable.cancel = cancel;
  }

  return cancelable;
}

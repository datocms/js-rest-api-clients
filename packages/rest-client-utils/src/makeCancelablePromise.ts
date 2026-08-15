/**
 * See the note on the brands in `errors.ts`: identity is carried by a symbol
 * from the cross-realm global registry so that `instanceof` keeps working even
 * when a bundler ends up loading more than one copy of this module.
 */
const CANCELED_PROMISE_ERROR = Symbol.for(
  '@datocms/rest-client-utils:CanceledPromiseError',
);

export class CanceledPromiseError extends Error {
  declare readonly [CANCELED_PROMISE_ERROR]: true;

  static [Symbol.hasInstance](value: unknown): value is CanceledPromiseError {
    if (
      typeof value !== 'object' ||
      value === null ||
      !(CANCELED_PROMISE_ERROR in value)
    ) {
      return false;
    }

    // `this` is the constructor `instanceof` was invoked on: when it is a
    // subclass, defer to a real prototype-chain check so subclasses stay exact.
    // biome-ignore lint/complexity/noThisInStatic: dynamic `this` is required here; hardcoding the class would break subclass checks
    const invokedOn = this as unknown as { prototype: object };

    if (invokedOn !== CanceledPromiseError) {
      return Object.prototype.isPrototypeOf.call(invokedOn.prototype, value);
    }

    return true;
  }

  constructor() {
    super('Promise canceled!');
    Object.setPrototypeOf(this, new.target.prototype);

    Object.defineProperty(this, CANCELED_PROMISE_ERROR, {
      value: true,
      enumerable: false,
      writable: false,
      configurable: false,
    });

    this.name = 'CanceledPromiseError';
  }
}

export interface CancelablePromise<T> extends Promise<T> {
  cancel(): void;
}

export function makeCancelablePromise<T>(
  promiseOrAsyncFn: Promise<T> | (() => Promise<T>),
  onCancel?: () => void,
): CancelablePromise<T> {
  let cancel: (() => void) | null = null;

  const cancelable = <CancelablePromise<T>>new Promise((resolve, reject) => {
    cancel = () => {
      try {
        if (onCancel) {
          onCancel();
        }
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

export interface GarbageCollect {
  cleanGarbageCollect(): void;
}

export interface EventEmitterLike {
  addListener(event: string | symbol, listener: Function): this;
  removeListener(event: string | symbol, listener?: Function): this;
}

export interface NativeEventEmitterLike {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addEventListener(event: any, listener: any, options?: any): void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeEventListener(event: any, listener: any, options?: any): void;
}

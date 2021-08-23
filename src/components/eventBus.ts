import EventEmitter from 'eventemitter3';

export interface EventBus extends EventEmitter {
  // empty
}

export class EventBusImpl extends EventEmitter implements EventBus {
  // empty
}

export const globalEventBus: EventBus = new EventBusImpl();

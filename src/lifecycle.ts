const events = [];

export const addLifecycleEvent = (func: Function) => {
  events.push(func);
}

export const flushLifecycleEvents = () => {
  while (events.length) { events.pop()() }
}
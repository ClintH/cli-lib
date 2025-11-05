export const forgetfulMap = <V>(init: (key: string) => V) => {
  const c: Map<string, V> = new Map();

  const get = (key: string): V => {
    let value = c.get(key);
    if (value === undefined) {
      value = init(key);
      c.set(key, value);
    }
    return value;
  }

  const clear = () => {
    c.clear();
  }

  setInterval(() => {
    clear();
  }, 60_1000);

  return get;
}
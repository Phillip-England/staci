export class Everest {
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    delay: number,
  ): T {
    let lastTime = 0;
    return function (
      this: any,
      ...args: Parameters<T>
    ): ReturnType<T> | undefined {
      const now = Date.now();
      if (now - lastTime >= delay) {
        lastTime = now;
        return func.apply(this, args);
      }
    } as T;
  }

  static debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number,
  ): T {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return function (this: any, ...args: Parameters<T>): void {
      if (timeout !== null) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        func.apply(this, args);
        timeout = null;
      }, delay);
    } as T;
  }
}

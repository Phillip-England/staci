import { Result } from "./Result";

export class Iter {
  static map<T>(items: T[], fn: (i: number, item: any) => boolean) {
    for (let i = 0; i < items.length; i++) {
      if (!fn(i, items[i])) {
        break;
      }
    }
    return Result.Ok(null);
  }

  static mapObj<T>(
    obj: { [key: string | number | symbol]: T },
    fn: (key: any, val: T) => boolean,
  ) {
    for (let [key, value] of Object.entries(obj)) {
      if (!fn(key, value)) {
        break;
      }
    }
  }
}

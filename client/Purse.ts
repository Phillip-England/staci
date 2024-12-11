export class Purse {
  static scanBetweenSubStrs(s: string, start: string, end: string): string[] {
    const out: string[] = [];
    let inSearch = false;
    let searchStr = "";
    let i = 0;

    while (i < s.length) {
      if (
        !inSearch &&
        i + start.length <= s.length &&
        s.substring(i, i + start.length) === start &&
        (i === 0 || s[i - 1] !== "\\") // Check for preceding escape character
      ) {
        inSearch = true;
        searchStr = start;
        i += start.length;
        continue;
      }

      if (inSearch) {
        if (
          i + end.length <= s.length &&
          s.substring(i, i + end.length) === end
        ) {
          searchStr += end;
          out.push(searchStr);
          searchStr = "";
          inSearch = false;
          i += end.length;
          continue;
        }
        searchStr += s[i];
      }

      i++;
    }
    return out;
  }

  static removeFromArray<T>(array: T[], ...valuesToRemove: T[]): T[] {
    return array.filter((item) => !valuesToRemove.includes(item));
  }

  static strIsInt(str: unknown): boolean {
    if (typeof str !== "string") return false;
    const num = Number(str);
    return Number.isInteger(num) && str.trim() !== "";
  }

  static ifElse<T>(value: T, potential1: T, potential2: T): T | null {
    if (value === potential1) {
      return potential2;
    }
    if (value === potential2) {
      return potential1;
    }
    console.error("used Purse.ifElse, but function returned a null value");
    return null;
  }

  static removeDuplicates<T>(arr: T[]): T[] {
    return [...new Set(arr)];
  }
}

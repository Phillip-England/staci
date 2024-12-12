import { Result } from "./Result";

export const keySignalStr = "KeySignalStr";
export const keySignalBool = "KeySignalBool";
export const keySignalInt = "KeySignalInt";

export interface ISignal {
  name: string;
  value: any;
  type: string;
  signalStates: any[];
  states: (signalStates: any[]) => ISignal;
  next: () => void;
  set: (newValue: any) => void;
  toggle: () => void;
  subscribe: (callback: (oldVal: any, newVal: any) => void) => () => void;
  iter: (framerate: number) => ISignal;
  val: () => any;
  str: () => string;
  getOppositeVal: () => Result<any, string>;
  oppositeValue: any;
  opposite: (val: any) => ISignal;
}

export class SignalStr implements ISignal {
  name: string;
  value: string;
  type: string;
  signalStates: string[];
  oppositeValue: any;
  private listeners: Set<(oldVal: string, newVal: string) => void>;

  constructor(name: string, value: string) {
    this.name = name;
    this.value = value;
    this.type = keySignalStr;
    this.signalStates = [value];
    this.listeners = new Set();
    this.oppositeValue = null;
  }

  states(signalStates: string[]): ISignal {
    this.signalStates = [this.value, ...signalStates];
    return this;
  }

  set(newValue: string): void {
    if (this.value !== newValue) {
      const oldVal = this.value;
      this.value = newValue;
      this.notify(oldVal, newValue);
    }
  }

  toggle(): void {
    if (this.oppositeValue !== null) {
      const oldVal = this.value;
      const temp = this.value;
      this.value = this.oppositeValue;
      this.oppositeValue = temp;
      this.notify(oldVal, this.value);
    }
  }

  next(): void {
    if (this.signalStates.length > 1) {
      const currentIndex = this.signalStates.indexOf(this.value);
      const nextIndex = (currentIndex + 1) % this.signalStates.length;
      const oldVal = this.value;
      this.value = this.signalStates[nextIndex];
      this.notify(oldVal, this.value);
    }
  }

  subscribe(callback: (oldVal: string, newVal: string) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  iter(framerate: number): ISignal {
    window.addEventListener("DOMContentLoaded", () => {
      setInterval(() => {
        this.next();
      }, framerate);
    });
    return this;
  }

  val(): string {
    return this.value;
  }

  str(): string {
    return this.value.toString();
  }

  getOppositeVal(): Result<any, string> {
    if (this.oppositeValue !== null) {
      return Result.Ok(this.oppositeValue);
    }
    return Result.Err(
      `signal ${this.name} does not have an opposite value set.`,
    );
  }

  opposite(val: any): ISignal {
    this.oppositeValue = val;
    return this;
  }

  private notify(oldVal: string, newVal: string): void {
    this.listeners.forEach((callback) => callback(oldVal, newVal));
  }
}

export class SignalBool implements ISignal {
  name: string;
  value: boolean;
  type: string;
  signalStates: boolean[];
  oppositeValue: any;
  private listeners: Set<(oldVal: boolean, newVal: boolean) => void>;

  constructor(name: string, value: boolean) {
    this.name = name;
    this.value = value;
    this.type = keySignalBool;
    this.signalStates = [value, !value];
    this.listeners = new Set();
    this.oppositeValue = !value;
  }

  states(signalStates: boolean[]): ISignal {
    this.signalStates = [this.signalStates[0], !this.value];
    return this;
  }

  set(newValue: boolean): void {
    if (this.value !== newValue) {
      const oldVal = this.value;
      this.value = newValue;
      this.notify(oldVal, newValue);
    }
  }

  toggle(): void {
    if (this.oppositeValue !== null) {
      const oldVal = this.value;
      const temp = this.value;
      this.value = this.oppositeValue;
      this.oppositeValue = temp;
      this.notify(oldVal, this.value);
    }
  }

  next(): void {
    const oldVal = this.value;
    this.value = !this.value;
    this.notify(oldVal, this.value);
  }

  subscribe(callback: (oldVal: boolean, newVal: boolean) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  iter(framerate: number): ISignal {
    window.addEventListener("DOMContentLoaded", () => {
      setInterval(() => {
        this.next();
      }, framerate);
    });
    return this;
  }

  val(): boolean {
    return this.value;
  }

  str(): string {
    return this.value.toString();
  }

  getOppositeVal(): Result<any, string> {
    if (this.oppositeValue !== null) {
      return Result.Ok(this.oppositeValue);
    }
    return Result.Err(
      `signal ${this.name} does not have an opposite value set.`,
    );
  }

  opposite(val: any): ISignal {
    this.oppositeValue = val;
    return this;
  }

  private notify(oldVal: boolean, newVal: boolean): void {
    this.listeners.forEach((callback) => callback(oldVal, newVal));
  }
}

export class SignalInt implements ISignal {
  name: string;
  value: number;
  type: string;
  signalStates: number[];
  oppositeValue: any;
  private listeners: Set<(oldVal: number, newVal: number) => void>;

  constructor(name: string, value: number) {
    this.name = name;
    this.value = value;
    this.type = keySignalInt;
    this.signalStates = [value];
    this.listeners = new Set();
    this.oppositeValue = null;
  }

  states(signalStates: number[]): ISignal {
    this.signalStates = [this.value, ...signalStates];
    return this;
  }

  set(newValue: number): void {
    if (this.value !== newValue) {
      const oldVal = this.value;
      this.value = newValue;
      this.notify(oldVal, newValue);
    }
  }

  toggle(): void {
    if (this.oppositeValue !== null) {
      const oldVal = this.value;
      const temp = this.value;
      this.value = this.oppositeValue;
      this.oppositeValue = temp;
      this.notify(oldVal, this.value);
    }
  }

  next(): void {
    if (this.signalStates.length > 1) {
      const currentIndex = this.signalStates.indexOf(this.value);
      const nextIndex = (currentIndex + 1) % this.signalStates.length;
      const oldVal = this.value;
      this.value = this.signalStates[nextIndex];
      this.notify(oldVal, this.value);
    }
  }

  subscribe(callback: (oldVal: number, newVal: number) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  iter(framerate: number): ISignal {
    window.addEventListener("DOMContentLoaded", () => {
      setInterval(() => {
        this.next();
      }, framerate);
    });
    return this;
  }

  val(): number {
    return this.value;
  }

  str(): string {
    return this.value.toString();
  }

  getOppositeVal(): Result<any, string> {
    if (this.oppositeValue !== null) {
      return Result.Ok(this.oppositeValue);
    }
    return Result.Err(
      `signal ${this.name} does not have an opposite value set.`,
    );
  }

  opposite(val: any): ISignal {
    this.oppositeValue = val;
    return this;
  }

  private notify(oldVal: number, newVal: number): void {
    this.listeners.forEach((callback) => callback(oldVal, newVal));
  }
}

export class Signal {
  static New(name: string, value: any): Result<ISignal, string> {
    if (typeof value == "boolean") {
      return Result.Ok(new SignalBool(name, value));
    }
    if (typeof value == "string") {
      return Result.Ok(new SignalStr(name, value));
    }
    if (typeof value == "number") {
      return Result.Ok(new SignalInt(name, value));
    }
    return Result.Err(`value '${value}' does not link to a valid signal`);
  }
}

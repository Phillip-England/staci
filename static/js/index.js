// client/Result.ts
class Result {
  _value;
  _error;
  constructor(_value, _error) {
    this._value = _value;
    this._error = _error;
  }
  static Ok(value) {
    return new Result(value);
  }
  static Err(error) {
    return new Result(undefined, error);
  }
  isOk() {
    return this._error === undefined;
  }
  isErr() {
    return this._value === undefined;
  }
  unwrap() {
    if (this.isErr()) {
      throw new Error("Tried to unwrap an Err value");
    }
    return this._value;
  }
  unwrapErr() {
    if (this.isOk()) {
      throw new Error("Tried to unwrap an Ok value");
    }
    return this._error;
  }
  unwrapOr(defaultValue) {
    return this.isOk() ? this._value : defaultValue;
  }
  getErr() {
    return this.isErr() ? this._error : undefined;
  }
}

// client/Iter.ts
class Iter {
  static map(items, fn) {
    for (let i = 0; i < items.length; i++) {
      if (!fn(i, items[i])) {
        break;
      }
    }
    return Result.Ok(null);
  }
  static mapObj(obj, fn) {
    for (let [key, value] of Object.entries(obj)) {
      if (!fn(key, value)) {
        break;
      }
    }
  }
}

// client/Signal.ts
var keySignalStr = "KeySignalStr";
var keySignalBool = "KeySignalBool";
var keySignalInt = "KeySignalInt";

class SignalStr {
  value;
  type;
  signalStates;
  oppositeValue;
  listeners;
  constructor(value) {
    this.value = value;
    this.type = keySignalStr;
    this.signalStates = [value];
    this.listeners = new Set();
    this.oppositeValue = null;
  }
  states(signalStates) {
    this.signalStates = [this.value, ...signalStates];
    return this;
  }
  set(newValue) {
    if (this.value !== newValue) {
      const oldVal = this.value;
      this.value = newValue;
      this.notify(oldVal, newValue);
    }
  }
  next() {
    if (this.signalStates.length > 1) {
      const currentIndex = this.signalStates.indexOf(this.value);
      const nextIndex = (currentIndex + 1) % this.signalStates.length;
      const oldVal = this.value;
      this.value = this.signalStates[nextIndex];
      this.notify(oldVal, this.value);
    }
  }
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
  iter(framerate) {
    window.addEventListener("DOMContentLoaded", () => {
      setInterval(() => {
        this.next();
      }, framerate);
    });
    return this;
  }
  val() {
    return this.value;
  }
  opposite(val) {
    this.oppositeValue = val;
    return this;
  }
  notify(oldVal, newVal) {
    this.listeners.forEach((callback) => callback(oldVal, newVal));
  }
}

class SignalBool {
  value;
  type;
  signalStates;
  oppositeValue;
  listeners;
  constructor(value) {
    this.value = value;
    this.type = keySignalBool;
    this.signalStates = [value, !value];
    this.listeners = new Set();
    this.oppositeValue = !value;
  }
  states(signalStates) {
    this.signalStates = [this.signalStates[0], !this.value];
    return this;
  }
  set(newValue) {
    if (this.value !== newValue) {
      const oldVal = this.value;
      this.value = newValue;
      this.notify(oldVal, newValue);
    }
  }
  next() {
    const oldVal = this.value;
    this.value = !this.value;
    this.notify(oldVal, this.value);
  }
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
  iter(framerate) {
    window.addEventListener("DOMContentLoaded", () => {
      setInterval(() => {
        this.next();
      }, framerate);
    });
    return this;
  }
  val() {
    return this.value;
  }
  opposite(val) {
    this.oppositeValue = val;
    return this;
  }
  notify(oldVal, newVal) {
    this.listeners.forEach((callback) => callback(oldVal, newVal));
  }
}

class SignalInt {
  value;
  type;
  signalStates;
  oppositeValue;
  listeners;
  constructor(value) {
    this.value = value;
    this.type = keySignalInt;
    this.signalStates = [value];
    this.listeners = new Set();
    this.oppositeValue = null;
  }
  states(signalStates) {
    this.signalStates = [this.value, ...signalStates];
    return this;
  }
  set(newValue) {
    if (this.value !== newValue) {
      const oldVal = this.value;
      this.value = newValue;
      this.notify(oldVal, newValue);
    }
  }
  next() {
    if (this.signalStates.length > 1) {
      const currentIndex = this.signalStates.indexOf(this.value);
      const nextIndex = (currentIndex + 1) % this.signalStates.length;
      const oldVal = this.value;
      this.value = this.signalStates[nextIndex];
      this.notify(oldVal, this.value);
    }
  }
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
  iter(framerate) {
    window.addEventListener("DOMContentLoaded", () => {
      setInterval(() => {
        this.next();
      }, framerate);
    });
    return this;
  }
  val() {
    return this.value;
  }
  opposite(val) {
    this.oppositeValue = val;
    return this;
  }
  notify(oldVal, newVal) {
    this.listeners.forEach((callback) => callback(oldVal, newVal));
  }
}

class Signal {
  static New(value) {
    if (typeof value == "boolean") {
      return Result.Ok(new SignalBool(value));
    }
    if (typeof value == "string") {
      return Result.Ok(new SignalStr(value));
    }
    if (typeof value == "number") {
      return Result.Ok(new SignalInt(value));
    }
    return Result.Err(`value '${value}' does not link to a valid signal`);
  }
}

// client/Dom.ts
class Dom {
  static qsa(selector) {
    let elements = document.querySelectorAll(selector);
    let arr = [];
    for (let i = 0; i < elements.length; i++) {
      arr.push(elements[i]);
    }
    return arr;
  }
  static qs(selector) {
    let element = document.querySelector(selector);
    return element;
  }
  static getDirectTextContent(element) {
    let directText = "";
    element.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        directText += node.nodeValue;
      }
    });
    return directText.trim();
  }
  static replaceTextContent(element, placeholder, newValue) {
    const currentText = element.textContent;
    const updatedText = currentText.replace(placeholder, newValue);
    element.textContent = updatedText;
  }
  static ClimbDomUntil(element, callback) {
    if (!element || typeof callback !== "function") {
      throw new Error(
        "Invalid arguments: Provide a valid element and a callback function.",
      );
    }
    let currentElement = element;
    while (currentElement) {
      if (callback(currentElement)) {
        return true;
      }
      if (currentElement === document.body) {
        break;
      }
      currentElement = currentElement.parentElement;
    }
    return false;
  }
}

// client/Everest.ts
class Everest {
  static throttle(func, delay) {
    let lastTime = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastTime >= delay) {
        lastTime = now;
        return func.apply(this, args);
      }
    };
  }
  static debounce(func, delay) {
    let timeout = null;
    return function (...args) {
      if (timeout !== null) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        func.apply(this, args);
        timeout = null;
      }, delay);
    };
  }
}

// client/Purse.ts
class Purse {
  static scanBetweenSubStrs(s, start, end) {
    const out = [];
    let inSearch = false;
    let searchStr = "";
    let i = 0;
    while (i < s.length) {
      if (
        !inSearch && i + start.length <= s.length &&
        s.substring(i, i + start.length) === start &&
        (i === 0 || s[i - 1] !== "\\")
      ) {
        inSearch = true;
        searchStr = start;
        i += start.length;
        continue;
      }
      if (inSearch) {
        if (
          i + end.length <= s.length && s.substring(i, i + end.length) === end
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
  static removeFromArray(array, ...valuesToRemove) {
    return array.filter((item) => !valuesToRemove.includes(item));
  }
  static strIsInt(str) {
    if (typeof str !== "string") {
      return false;
    }
    const num = Number(str);
    return Number.isInteger(num) && str.trim() !== "";
  }
  static ifElse(value, potential1, potential2) {
    if (value === potential1) {
      return potential2;
    }
    if (value === potential2) {
      return potential1;
    }
    console.error("used Purse.ifElse, but function returned a null value");
    return null;
  }
  static removeDuplicates(arr) {
    return [...new Set(arr)];
  }
}

// client/Staci.ts
class Staci {
  version;
  repo;
  events;
  signals;
  eventPairs;
  constructor() {
    this.version = "0.0.2";
    this.repo = "https://github.com/phillip-england/staci";
    this.events = {};
    this.signals = {};
    this.eventPairs = [
      ["st-click", "click"],
      ["st-dblclick", "dblclick"],
      ["st-mouseup", "mouseup"],
      ["st-mousedown", "mousedown"],
      ["st-mousemove", "mousemove"],
      ["st-mouseenter", "mouseenter"],
      ["st-mouseleave", "mouseleave"],
      ["st-keydown", "keydown"],
      ["st-keypress", "keypress"],
      ["st-keyup", "keyup"],
      ["st-focus", "focus"],
      ["st-blur", "blur"],
      ["st-submit", "submit"],
      ["st-change", "change"],
      ["st-input", "input"],
      ["st-focusin", "focusin"],
      ["st-focusout", "focusout"],
      ["st-select", "select"],
      ["st-resize", "resize"],
      ["st-scroll", "scroll"],
      ["st-wheel", "wheel"],
      ["st-touchstart", "touchstart"],
      ["st-touchend", "touchend"],
      ["st-touchmove", "touchmove"],
      ["st-touchcancel", "touchcancel"],
      ["st-pointerdown", "pointerdown"],
      ["st-pointerup", "pointerup"],
      ["st-pointermove", "pointermove"],
      ["st-pointerenter", "pointerenter"],
      ["st-pointerleave", "pointerleave"],
      ["st-pointercancel", "pointercancel"],
      ["st-contextmenu", "contextmenu"],
      ["st-drag", "drag"],
      ["st-dragstart", "dragstart"],
      ["st-dragend", "dragend"],
      ["st-dragover", "dragover"],
      ["st-dragenter", "dragenter"],
      ["st-dragleave", "dragleave"],
      ["st-drop", "drop"],
      ["st-input", "input"],
      ["st-keydown", "keydown"],
      ["st-keyup", "keyup"],
    ];
    document.addEventListener("DOMContentLoaded", () => {
      let result = this.init();
      if (result.isErr()) {
        console.error(result.getErr());
      }
    });
  }
  init() {
    let result = this.initAllEventTypes();
    if (result.isErr()) {
      return result;
    }
    result = this.initSignalTextPlaceholders();
    if (result.isErr()) {
      return result;
    }
    this.initSignalAttrPlaceholders();
    return Result.Ok(null);
  }
  initAllEventTypes() {
    let potResult = null;
    Iter.map(this.eventPairs, (i, pair) => {
      let stEvent = pair[0];
      let htmlEvent = pair[1];
      let result = this.initEventsOfType(stEvent, htmlEvent);
      if (result.isErr()) {
        potResult = result;
        return false;
      }
      return true;
    });
    if (potResult != null) {
      return potResult;
    }
    return Result.Ok(null);
  }
  initEventsOfType(eventAttr, mapsTo) {
    Iter.mapObj(this.events, (key, val) => {
      let subElms = Dom.qsa(`*[${eventAttr}]`);
      Iter.map(subElms, (i, elm) => {
        let sublist = elm.getAttribute(`${eventAttr}`);
        if (sublist == null) {
          return false;
        }
        let parts = sublist.split(":");
        Iter.map(parts, (i2, part) => {
          let event = this.getEvent(part);
          let shouldThrottle = false;
          let shouldDebounce = false;
          let elmThrottle = elm.getAttribute("st-throttle");
          if (elmThrottle != null) {
            shouldThrottle = true;
          }
          let elmDebounce = elm.getAttribute("st-debounce");
          if (elmDebounce != null) {
            shouldDebounce = true;
          }
          if (shouldDebounce && shouldThrottle) {
            console.error(
              `element ${elm} found with both st-throttle and st-decounce, only one allowed per element`,
            );
          }
          if (shouldThrottle) {
            elmThrottle = elmThrottle;
            let throttle = parseInt(elmThrottle);
            if (isNaN(throttle)) {
              console.error(
                `element ${elm} found with st-throttle, but the passed in value ${throttle} cannot be parsed to an int`,
              );
            }
            let currentEvents2 = elm.getAttribute("st-events");
            if (!currentEvents2) {
              elm.addEventListener(mapsTo, Everest.throttle(event, throttle));
              elm.setAttribute("st-events", eventAttr);
            } else {
              if (!currentEvents2.includes(eventAttr)) {
                elm.addEventListener(mapsTo, Everest.throttle(event, throttle));
                elm.setAttribute("st-events", currentEvents2 + ":" + eventAttr);
              }
            }
          }
          if (shouldDebounce) {
            elmDebounce = elmDebounce;
            let debounce = parseInt(elmDebounce);
            if (isNaN(debounce)) {
              console.error(
                `element ${elm} found with st-debounce, but the passed in value ${debounce} cannot be parsed to an int`,
              );
            }
            let currentEvents2 = elm.getAttribute("st-events");
            if (!currentEvents2) {
              elm.addEventListener(mapsTo, Everest.debounce(event, debounce));
              elm.setAttribute("st-events", eventAttr);
            } else {
              if (!currentEvents2.includes(eventAttr)) {
                elm.addEventListener(mapsTo, Everest.debounce(event, debounce));
                elm.setAttribute("st-events", currentEvents2 + ":" + eventAttr);
              }
            }
          }
          let currentEvents = elm.getAttribute("st-events");
          if (!currentEvents) {
            elm.addEventListener(mapsTo, event);
          } else {
            if (!currentEvents.includes(eventAttr)) {
              elm.addEventListener(mapsTo, event);
            }
          }
          return true;
        });
        return true;
      });
      return true;
    });
    return Result.Ok(null);
  }
  initSignalTextPlaceholders() {
    let allElms = Dom.qsa("*");
    let ignoreElms = [];
    Iter.map(allElms, (i, elm) => {
      let stIgnore = elm.getAttribute("st-ignore");
      if (stIgnore == null) {
        return true;
      }
      if (stIgnore == "true") {
        ignoreElms.push(elm);
      }
      Iter.map(allElms, (i2, elm2) => {
        let hasStIgnoreParent = Dom.ClimbDomUntil(elm2, (parent) => {
          let stIgnoreAttr = parent.getAttribute("st-ignore");
          if (stIgnoreAttr == null) {
            return false;
          }
          if (stIgnoreAttr == "true") {
            return true;
          }
          return false;
        });
        let stForce = elm2.getAttribute("st-force");
        let forceElm = false;
        if (stForce) {
          if (stForce == "true") {
            forceElm = true;
          }
        }
        if (!forceElm && hasStIgnoreParent) {
          return true;
        }
        let text = Dom.getDirectTextContent(elm2);
        let placeholders = Purse.scanBetweenSubStrs(text, "{|", "|}");
        Iter.map(placeholders, (i3, placeholder) => {
          let index = text.indexOf(placeholder);
          let prechars = text.slice(index - 2, index);
          let len = placeholder.length;
          let postchars = text.slice(index + len, index + len + 2);
          let signalKey = placeholder.replace("{|", "").replace("|}", "")
            .trim();
          let signal = this.getSignalFull(signalKey);
          if (signal == null) {
            return true;
          }
          if (signal == null || signal == undefined) {
            console.error(
              `attempting to set signal values on a {{ }} placeholder, but
                        we encountered a null signal from using the key ${signalKey} and placeholder ${placeholder}`,
            );
          }
          Dom.replaceTextContent(elm2, placeholder, signal.val());
          let styleAttr = elm2.getAttribute("style");
          if (styleAttr && styleAttr.includes("hidden")) {
            elm2.setAttribute("style", "");
          }
          let classAttr = elm2.getAttribute("class");
          let isHidden = false;
          let isInvisible = false;
          Iter.map(classAttr.split(" "), (i4, part) => {
            if (part == "hidden") {
              isHidden = true;
            }
            if (part == "invisible") {
              isInvisible = true;
            }
            if (isHidden) {
              elm2.classList.remove("hidden");
            }
            if (isInvisible) {
              elm2.classList.remove("invisible");
            }
            return true;
          });
          signal.subscribe((oldVal, newVal) => {
            Dom.replaceTextContent(
              elm2,
              prechars + oldVal + postchars,
              prechars + newVal + postchars,
            );
          });
          return true;
        });
        return true;
      });
      return true;
    });
    return Result.Ok(null);
  }
  initSignalAttrPlaceholders() {
    let allElms = Dom.qsa("*");
    Iter.map(allElms, (i, elm) => {
      Iter.map(elm.attributes, (i2, attr) => {
        let attrKey = attr.name;
        let attrVal = attr.value;
        let placeholders = Purse.scanBetweenSubStrs(attrVal, "{|", "|}");
        Iter.map(placeholders, (i3, placeholder) => {
          let signalKey = placeholder.replace("{|", "").replace("|}", "")
            .trim();
          let hasExclamation = false;
          if (signalKey[0] == "!") {
            signalKey = signalKey.replace("!", "");
            hasExclamation = true;
          }
          let signal = this.getSignalFull(signalKey);
          if (signal == null || signal == undefined) {
            console.error(
              `attempting to set signal values on a {| |} placeholder, but
                  we encountered a null signal from using the key ${signalKey} and placeholder ${placeholder}`,
            );
            return false;
          }
          let index = 0;
          let prechars = "";
          let postchars = "";
          if (hasExclamation) {
            if (signal.type == keySignalStr || signal.type == keySignalInt) {
              if (signal.oppositeValue == null) {
                console.error(
                  `used an exclamation on a string/int signal with no opposite, in order to use {| !signalName |} on a string, you must declare it's opposite`,
                );
              }
            }
            let parts = attrVal.split(" ");
            if (parts.includes(signal.oppositeValue)) {
              attrVal = attrVal.replace(placeholder, "").trim();
            } else {
              attrVal = attrVal.replace(placeholder, signal.oppositeValue);
              index = attrVal.indexOf(signal.oppositeValue);
              prechars = attrVal.slice(index - 2, index);
              let strVal = String(signal.oppositeValue);
              let len = strVal.length - 1;
              if (index + len + 2 > attrVal.length) {
                postchars = attrVal.slice(index + len, -1);
              } else {
                postchars = attrVal.slice(index + len, index + len + 2);
              }
              console.log(attrVal);
            }
          } else {
            let parts = attrVal.split(" ");
            if (parts.includes(signal.val())) {
              attrVal = attrVal.replace(placeholder, "").trim();
            } else {
              attrVal = attrVal.replace(placeholder, signal.val());
              index = attrVal.indexOf(signal.val());
              prechars = attrVal.slice(index - 2, index);
              let strVal = String(signal.val());
              let len = strVal.length - 1;
              if (index + len + 2 > attrVal.length) {
                postchars = attrVal.slice(index + len, -1);
              } else {
                postchars = attrVal.slice(index + len, index + len + 2);
              }
            }
          }
          elm.setAttribute(attrKey, attrVal);
          let callback = (oldVal, newVal) => {
            if (hasExclamation) {
              attrVal = attrVal.replace(
                prechars + newVal + postchars,
                prechars + oldVal + postchars,
              );
              elm.setAttribute(attrKey, attrVal);
            } else {
              attrVal = attrVal.replace(
                prechars + oldVal + postchars,
                prechars + newVal + postchars,
              );
              elm.setAttribute(attrKey, attrVal);
            }
          };
          signal.subscribe(callback);
          return true;
        });
        return true;
      });
      return true;
    });
  }
  event(name, fn) {
    this.events[name] = fn;
  }
  getEvent(key) {
    let event = this.events[key];
    if (event == undefined) {
      console.error(
        `tried to access and event named ${key} which does not exist`,
      );
    }
    return event;
  }
  hydrate() {
    let result = this.initAllEventTypes();
    if (result.isErr()) {
      console.error(result.getErr());
    }
  }
  signal(name, value) {
    let result = Signal.New(value);
    if (result.isErr()) {
      console.error(result.getErr());
    }
    let sig = result.unwrap();
    this.signals[name] = sig;
    return sig;
  }
  getSignalFull(key) {
    let foundSignal = false;
    let signal = null;
    Iter.mapObj(this.signals, (innerKey, val) => {
      if (key == innerKey) {
        foundSignal = true;
        signal = val;
        return false;
      }
      return true;
    });
    if (foundSignal == false) {
      console.error(
        `attempted to access signal named ${key} when one does not exist`,
      );
      return null;
    }
    return signal;
  }
}

// index.ts
var staci = new Staci();
var sig = staci.signal("navClass", "hidden").opposite("flex");
staci.event("toggleNav", () => {
  if (sig.val() == "hidden") {
    sig.set("flex");
  } else {
    sig.set("hidden");
  }
});
import { Iter } from "./Iter";
import { Result } from "./Result";
import { type ISignal, keySignalInt, keySignalStr, Signal } from "./Signal";
import { Dom } from "./Dom";
import { Everest } from "./Everest";
import { Purse } from "./Purse";

export class Staci {
  version: string;
  repo: string;
  events: { [key: string]: () => void };
  signals: { [key: string]: ISignal };
  eventPairs: [string, string][]; // Array of string tuples

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

  init(): Result<null, string> {
    let result = this.initAllEventTypes();
    if (result.isErr()) {
      return result;
    }
    result = this.initSignalTextPlaceholders();
    if (result.isErr()) {
      return result;
    }
    result = this.initSignalAttrPlaceholders();
    if (result.isErr()) {
      return result;
    }
    return Result.Ok(null);
  }

  initAllEventTypes(): Result<null, string> {
    let potResult = null;
    Iter.map<[string, string]>(
      this.eventPairs,
      (i: number, pair: [string, string]): boolean => {
        let stEvent = pair[0];
        let htmlEvent = pair[1];
        let result = this.initEventsOfType(stEvent, htmlEvent);
        if (result.isErr()) {
          potResult = result;
          return false;
        }
        return true;
      },
    );
    if (potResult != null) {
      return potResult;
    }
    return Result.Ok(null);
  }

  initEventsOfType(eventAttr: string, mapsTo: string): Result<null, string> {
    Iter.mapObj<() => void>(this.events, (key, val) => {
      let subElms = Dom.qsa(`*[${eventAttr}]`);
      Iter.map<HTMLElement>(subElms, (i: number, elm: HTMLElement) => {
        let sublist = elm.getAttribute(`${eventAttr}`);
        if (sublist == null) {
          return false;
        }
        let parts: string[] = sublist.split(":");
        Iter.map<string>(parts, (i: number, part: string) => {
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
            elmThrottle = elmThrottle as string;
            let throttle = parseInt(elmThrottle);
            if (isNaN(throttle)) {
              console.error(
                `element ${elm} found with st-throttle, but the passed in value ${throttle} cannot be parsed to an int`,
              );
            }
            let currentEvents = elm.getAttribute("st-events");
            if (!currentEvents) {
              elm.addEventListener(mapsTo, Everest.throttle(event, throttle));
              elm.setAttribute("st-events", eventAttr);
            } else {
              if (!currentEvents.includes(eventAttr)) {
                elm.addEventListener(mapsTo, Everest.throttle(event, throttle));
                elm.setAttribute("st-events", currentEvents + ":" + eventAttr);
              }
            }
          }
          if (shouldDebounce) {
            elmDebounce = elmDebounce as string;
            let debounce = parseInt(elmDebounce);
            if (isNaN(debounce)) {
              console.error(
                `element ${elm} found with st-debounce, but the passed in value ${debounce} cannot be parsed to an int`,
              );
            }
            let currentEvents = elm.getAttribute("st-events");
            if (!currentEvents) {
              elm.addEventListener(mapsTo, Everest.debounce(event, debounce));
              elm.setAttribute("st-events", eventAttr);
            } else {
              if (!currentEvents.includes(eventAttr)) {
                elm.addEventListener(mapsTo, Everest.debounce(event, debounce));
                elm.setAttribute("st-events", currentEvents + ":" + eventAttr);
              }
            }
          }
          let currentEvents = elm.getAttribute("st-events");
          if (!currentEvents) {
            elm.addEventListener(mapsTo, event);
            elm.setAttribute("st-events", eventAttr);
          } else {
            if (!currentEvents.includes(eventAttr)) {
              elm.addEventListener(mapsTo, event);
              elm.setAttribute("st-events", currentEvents + ":" + eventAttr);
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

  initSignalTextPlaceholders(): Result<null, string> {
    let allElms = Dom.qsa("*");
    let ignoreElms = [];
    Iter.map<HTMLElement>(allElms, (i, elm) => {
      let stIgnore = elm.getAttribute("st-ignore");
      if (stIgnore == null) {
        return true;
      }
      if (stIgnore == "true") {
        ignoreElms.push(elm);
      }
      Iter.map<HTMLElement>(allElms, (i, elm): boolean => {
        let hasStIgnoreParent = Dom.ClimbDomUntil(
          elm,
          (parent: HTMLElement): boolean => {
            let stIgnoreAttr = parent.getAttribute("st-ignore");
            if (stIgnoreAttr == null) {
              return false;
            }
            if (stIgnoreAttr == "true") {
              return true;
            }
            return false;
          },
        );
        let stForce = elm.getAttribute("st-force");
        let forceElm = false;
        if (stForce) {
          if (stForce == "true") {
            forceElm = true;
          }
        }
        if (!forceElm && hasStIgnoreParent) {
          return true;
        }
        let text = Dom.getDirectTextContent(elm);
        let placeholders = Purse.scanBetweenSubStrs(text, "{|", "|}");
        Iter.map<string>(placeholders, (i, placeholder) => {
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
          Dom.replaceTextContent(elm, placeholder, signal.val());
          let styleAttr = elm.getAttribute("style");
          if (styleAttr && styleAttr.includes("hidden")) {
            elm.setAttribute("style", "");
          }
          let classAttr = elm.getAttribute("class");
          let isHidden = false;
          let isInvisible = false;
          Iter.map<string>(classAttr.split(" "), (i, part): boolean => {
            if (part == "hidden") {
              isHidden = true;
            }
            if (part == "invisible") {
              isInvisible = true;
            }
            if (isHidden) {
              elm.classList.remove("hidden");
            }
            if (isInvisible) {
              elm.classList.remove("invisible");
            }
            return true;
          });
          signal.subscribe((oldVal, newVal) => {
            Dom.replaceTextContent(
              elm,
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

  initSignalAttrPlaceholders(): Result<null, string> {
    let allElms = Dom.qsa("*");
    for (let i = 0; i < allElms.length; i++) {
      let elm = allElms[i];
      let result = this.initSignalAttrPlaceholder(elm);
      if (result.isErr()) {
        return result;
      }
    }
    return Result.Ok(null);
  }

  initSignalAttrPlaceholder(elm: HTMLElement): Result<null, string> {
    let attrs = elm.attributes;
    for (let i = 0; i < attrs.length; i++) {
      let attr = attrs[i];
      let placeholders = Purse.scanBetweenSubStrs(attr.value, "{|", "|}");
      if (placeholders.length == 0) {
        continue;
      }
      for (let i2 = 0; i2 < placeholders.length; i2++) {
        let placeholder = placeholders[i2];
        let index = attr.value.indexOf(placeholder);
        console.log(index);
        let prechars = attr.value.slice(index - 2, index);
        let len = attr.value.length;
        let postchars = attr.value.slice(index + len, index + len + 2);
        let signalKey = placeholder.replace("{|", "").replace("|}", "").trim();
        let hasExclamation = false;
        if (signalKey[0] == "!") {
          hasExclamation = true;
          signalKey = signalKey.replace("!", "");
        }
        let signal = this.getSignalFull(signalKey);
        if (signal == null) {
          return Result.Err(
            `tried to access signal named ${signalKey} but it does not exist`,
          );
        }
        if (hasExclamation) {
          let opposite = signal.getOppositeVal();
          if (opposite.isErr()) {
            return opposite;
          }
          elm.setAttribute(
            attr.name,
            attr.value.replace(
              placeholder,
              opposite.unwrap(),
            ),
          );
        } else {
          elm.setAttribute(
            attr.name,
            attr.value.replace(
              prechars + placeholder + postchars,
              " " + signal.val(),
            ),
          );
        }
        console.log(prechars, postchars);
      }
    }
    return Result.Ok(null);
  }

  initElementReel(elm: HTMLElement, signal: ISignal) {
    let attrs = elm.attributes;
    let stDelay = "0";
    let stReel = "60";
    let foundReel = false;
    for (let i = 0; i < attrs.length; i++) {
      let attr = attrs[i];
      if (attr.name == "st-reel") {
        foundReel = true;
      }
      let delay = elm.getAttribute("st-delay");
      if (delay != null) {
        stDelay = delay;
      }
      stReel = elm.getAttribute("st-reel") as string;
    }
    if (foundReel) {
      window.addEventListener("DOMContentLoaded", () => {
        let delayint = parseInt(stDelay);
        let reelint = parseInt(stReel);
        // console err if delay int is not a number and exit the func
        setTimeout(() => {
          setInterval(() => {
            signal.next();
          }, reelint);
        }, delayint);
      });
    }
  }

  event(name: string, fn: () => void) {
    this.events[name] = fn;
  }

  getEvent(key: string): () => void {
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

  signal(name: string, value: any) {
    let result = Signal.New(name, value);
    if (result.isErr()) {
      console.error(result.getErr());
    }
    let sig = result.unwrap();
    this.signals[name] = sig;
    return sig;
  }

  getSignalFull(key: string): ISignal | null {
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

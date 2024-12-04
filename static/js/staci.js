/*
Codebase Rules
1. If a function returns a value, it must be wrapped in a Result
*/

// contains wrapper functions like throttle and debounce to wrap events
class Everest {
  static throttle(func, delay) {
    let lastTime = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastTime >= delay) {
        lastTime = now;
        func.apply(this, args);
      }
    };
  }

  static debounce(func, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }
}

// contains functions used to access and manipulate the dom
class Dom {
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
}

// contains functions intended to be used to iterate over different types of data
class Iter {
  static map(items, fn) {
    for (let i = 0; i < items.length; i++) {
      let shouldContinue = fn(items[i]);
      if (shouldContinue == null || shouldContinue == undefined) {
        console.error(
          "forgot to return true from Iter.map(items, fn), return false to break",
        );
      }
      if (!shouldContinue) {
        break;
      }
    }
  }

  static mapObj(obj, fn) {
    for (let [key, value] of Object.entries(obj)) {
      let shouldContinue = fn(key, value);
      if (shouldContinue == null || shouldContinue == undefined) {
        console.error(
          "forgot to return true from Iter.mapObj(items, fn), return false to break",
        );
      }
      if (!shouldContinue) {
        break;
      }
    }
  }
}

// contains string parsing functions
class Purse {
    static scanBetweenSubStrs(s, start, end) {
        const out = [];
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
      

  static removeFromArray(array, ...valuesToRemove) {
    return array.filter((item) => !valuesToRemove.includes(item));
  }

  static strIsInt(str) {
    if (typeof str !== "string") return false; // Ensure the input is a string
    const num = Number(str);
    return Number.isInteger(num) && str.trim() !== "";
  }
}

// a class to handle signals within our application
class Signal {
  constructor(initialValue) {
    this.value = initialValue;
    this.listeners = new Set();
    this.history = [initialValue];
  }

  val() {
    return this.value;
  }

  set(newValue) {
    let oldVal = this.val();
    if (this.value !== newValue) {
      this.value = newValue;
      this.notify(oldVal);
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback); // Return an unsubscribe function
  }

  notify(oldVal) {
    this.listeners.forEach((callback) => callback(oldVal, this.value));
  }
}

// wrap some markdown content in this web component to style it the md content with tailwind
class StMarkdown extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        document.addEventListener('DOMContentLoaded', () => {
            this.classList.add('overflow-hidden', 'rounded')
            let allElms = this.querySelectorAll('*')
            Iter.map(allElms, (elm) => {
                if (elm.tagName == "PRE") {
                    elm.classList.add('p-4', 'text-sm', 'overflow-x-scroll')
                }
                return true
            })
        })
    }
}

// registering all of our custom elements
customElements.define("st-markdown", StMarkdown);

// a class to handle dynamic web interactions
class Staci {
  constructor() {
    this.version = "0.0.1";
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
      ["st-wheel", "wheel"],
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
    this.initOnLoad();
  }

  initOnLoad() {
    document.addEventListener("DOMContentLoaded", () => {
      this.initAllEventTypes();
      this.initSignalTextPlaceholders();
      this.initSignalAttrPlaceholders();
      this.initRemoveStaciIgnoreFromElements();
      this.initProvideScrollbarClasses();
    });
  }

  initAllEventTypes() {
    Iter.map(this.eventPairs, (pair) => {
      let stEvent = pair[0];
      let htmlEvent = pair[1];
      this.initEventsOfType(stEvent, htmlEvent);
      return true;
    });
  }

  initEventsOfType(eventAttr, mapsTo) {
    Iter.mapObj(this.events, (key, event) => {
      let subElms = document.querySelectorAll(`*[${eventAttr}]`);
      Iter.map(subElms, (elm) => {
        let sublist = elm.getAttribute(`${eventAttr}`);
        let parts = sublist.split(";");
        Iter.map(parts, (part) => {
          let event = staci.getEvent(part);
          let elmThrottle = elm.getAttribute("st-throttle");
          if (elmThrottle) {
            let throttleIsInt = Purse.strIsInt(elmThrottle);
            if (!throttleIsInt) {
              console.error(
                `element ${element} contains st-throttle with a string that cannot be converted to an int ${elmThrottle}`,
              );
            }
            let throttle = parseInt(elmThrottle);
            let currentEvents = elm.getAttribute("st-events");
            if (!currentEvents) {
                elm.addEventListener(mapsTo, Everest.throttle(event, throttle));
                elm.setAttribute("st-events", eventAttr);
            } else {
                if (!currentEvents.includes(eventAttr)) {
                    elm.addEventListener(mapsTo, Everest.throttle(event, throttle));
                    elm.setAttribute("st-events", currentEvents + ";" + eventAttr);
                }
            }
            return true;
          }
          let elmDebounce = elm.getAttribute("st-debounce");
          if (elmDebounce) {
            let debounceIsInt = Purse.strIsInt(elmDebounce);
            if (!debounceIsInt) {
              console.error(
                `element ${element} contains st-debounce with a string that cannot be converted to an int ${elmDebounce}`,
              );
            }
            let debounce = parseInt(elmDebounce);
            let currentEvents = elm.getAttribute("st-events");
            if (!currentEvents) {
                elm.addEventListener(mapsTo, Everest.debounce(event, debounce));
                elm.setAttribute("st-events", eventAttr);
            } else {
                if (!currentEvents.includes(eventAttr)) {
                    elm.addEventListener(mapsTo, Everest.debounce(event, debounce));
                    elm.setAttribute("st-events", currentEvents + ";" + eventAttr);
                }
            }
            return true;
          }
          let currentEvents = elm.getAttribute("st-events");
          if (!currentEvents) {
            elm.addEventListener(mapsTo, event);

              elm.setAttribute("st-events", eventAttr);
          } else {
              if (!currentEvents.includes(eventAttr)) {
                elm.addEventListener(mapsTo, event);

                  elm.setAttribute("st-events", currentEvents + ";" + eventAttr);
              }
          }

          return true;
        });
        return true;
      });
      return true;
    });
  }

  initSignalTextPlaceholders() {
    let allElms = document.querySelectorAll("*");
    Iter.map(allElms, (elm) => {
      let text = Dom.getDirectTextContent(elm);
      let placeholders = Purse.scanBetweenSubStrs(text, "{{", "}}");
      Iter.map(placeholders, (placeholder) => {
        let signalKey = placeholder.replace("{{", "").replace("}}", "").trim();
        let signal = staci.getSignal(signalKey);
        if (signal == null || signal == undefined) {
          console.error(
            `attempting to set signal values on a {{ }} placeholder, but
                    we encountered a null signal from using the key ${signalKey} and placeholder ${placeholder}`,
          );
        }
        Dom.replaceTextContent(elm, placeholder, signal.val());
        signal.subscribe((oldVal, newVal) => {
          Dom.replaceTextContent(elm, oldVal, newVal);
        });
        return true;
      });
      return true;
    });
  }

  initSignalAttrPlaceholders() {
    let allElms = document.querySelectorAll("*");
    Iter.map(allElms, (elm) => {
      Iter.map(elm.attributes, (attr) => {
        let attrKey = attr.name;
        let attrVal = attr.value;
        let placeholders = Purse.scanBetweenSubStrs(attrVal, "{{", "}}");
        Iter.map(placeholders, (placeholder) => {
          let signalKey = placeholder
            .replace("{{", "")
            .replace("}}", "")
            .trim();
          let signal = staci.getSignal(signalKey);
          if (signal == null || signal == undefined) {
            console.error(
              `attempting to set signal values on a {{ }} placeholder, but
                        we encountered a null signal from using the key ${signalKey} and placeholder ${placeholder}`,
            );
          }
          attrVal = attrVal.replace(placeholder, signal.val());
          elm.setAttribute(attrKey, attrVal);
          signal.subscribe((oldVal, newVal) => {
            attrVal = attrVal.replace(oldVal, newVal);
            elm.setAttribute(attrKey, attrVal);
          });
          return true;
        });
        return true;
      });
      return true;
    });
  }

  initRemoveStaciIgnoreFromElements() {
    let allElms = document.querySelectorAll("*");
    Iter.map(allElms, (elm) => {
        let text = Dom.getDirectTextContent(elm)
        if (text.includes("\\\\")) {
            Dom.replaceTextContent(elm, "\\\\", "")
        }
        return true
    })
  }

  initProvideScrollbarClasses() {
    let elm = document.createElement('style')
    elm.innerHTML = `
        <style>
            .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background-color: #4B5563; /* Gray-600 */
                border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background-color: #E5E7EB; /* Gray-200 */
            }
        </style>
    `
    let head = document.querySelector('head')
    head.appendChild(elm)
  }

  event(name, fn) {
    this.events[name] = fn;
  }

  signal(key, val) {
    this.signals[key] = new Signal(val);
  }

  getEvent(key) {
    let foundEvent = false;
    let event = null;
    Iter.mapObj(this.events, (innerKey, val) => {
      if (key == innerKey) {
        foundEvent = true;
        event = val;
        return false;
      }
      return true;
    });
    if (foundEvent == false) {
      console.error(
        `attempted to access event named ${key} when one does not exist`,
      );
      return null;
    }
    return event;
  }

  getSignal(key) {
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

let staci = new Staci();
console.log(staci);

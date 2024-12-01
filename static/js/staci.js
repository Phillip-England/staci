

/* 
Codebase Rules
1. If a function returns a value, it must be wrapped in a Result
*/



class Everest {

    static throttle(func, limit) {
        let lastFunc;
        let lastRan;
    
        return function (...args) {
            const context = this;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(() => {
                    if (Date.now() - lastRan >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }

    static debounce(func, delay) {
        let timeout;
    
        return function (...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    }

}


class Dom {

    static getDirectTextContent(element) {
        let directText = "";
        element.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                directText += node.nodeValue;
            }
        });
        return directText.trim()
    }

    static replaceTextContent(element, placeholder, newValue) {
        const currentText = element.textContent;
        const updatedText = currentText.replace(placeholder, newValue);
        element.textContent = updatedText;
    }


}


class Iter {

    static map(items, fn) {
        for (let i = 0; i < items.length; i++) {
            let shouldContinue = fn(items[i])
            if (shouldContinue == null || shouldContinue == undefined) {
                console.error("forgot to return true from Iter.map(items, fn), return false to break")
            }
            if (!shouldContinue) {
                break
            }
        }
    }

    static mapObj(obj, fn) {
        for (let [key, value] of Object.entries(obj)) {
            let shouldContinue = fn(key, value);
            if (shouldContinue == null || shouldContinue == undefined) {
                console.error("forgot to return true from Iter.mapObj(items, fn), return false to break")
            }
            if (!shouldContinue) {
                break
            }
        }
    }

}





class Purse {

    static scanBetweenSubStrs(s, start, end) {
        const out = [];
        let inSearch = false;
        let searchStr = "";
        let i = 0;
        while (i < s.length) {
            if (!inSearch && i + start.length <= s.length && s.substring(i, i + start.length) === start) {
                inSearch = true;
                searchStr = start;
                i += start.length;
                continue;
            }
            if (inSearch) {
                if (i + end.length <= s.length && s.substring(i, i + end.length) === end) {
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
        return array.filter(item => !valuesToRemove.includes(item));
    }

}

class Signal {

    constructor(initialValue) {
        this.value = initialValue;
        this.listeners = new Set();
        this.history = [initialValue]
    }

    val() {
        return this.value;
    }

    set(newValue) {
        let oldVal = this.val()
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
        this.listeners.forEach(callback => callback(oldVal, this.value));
    }

}



class Staci {

    constructor() {
        this.version = "0.0.1"
        this.repo = "https://github.com/phillip-england/staci"
        this.events = {} 
        this.signals = {}
        this.eventPairs = [
            ['st-click', 'click'],
            ['st-dblclick', 'dblclick'],
            ['st-mouseup', 'mouseup'],
            ['st-mousedown', 'mousedown'],
            ['st-mousemove', 'mousemove'],
            ['st-mouseenter', 'mouseenter'],
            ['st-mouseleave', 'mouseleave'],
            ['st-keydown', 'keydown'],
            ['st-keypress', 'keypress'],
            ['st-keyup', 'keyup'],
            ['st-focus', 'focus'],
            ['st-blur', 'blur'],
            ['st-submit', 'submit'],
            ['st-change', 'change'],
            ['st-input', 'input'],
            ['st-focusin', 'focusin'],
            ['st-focusout', 'focusout'],
            ['st-select', 'select'],
            ['st-resize', 'resize'],
            ['st-scroll', 'scroll'],
            ['st-wheel', 'wheel'],
            ['st-touchstart', 'touchstart'],
            ['st-touchend', 'touchend'],
            ['st-touchmove', 'touchmove'],
            ['st-touchcancel', 'touchcancel'],
            ['st-pointerdown', 'pointerdown'],
            ['st-pointerup', 'pointerup'],
            ['st-pointermove', 'pointermove'],
            ['st-pointerenter', 'pointerenter'],
            ['st-pointerleave', 'pointerleave'],
            ['st-pointercancel', 'pointercancel'],
            ['st-contextmenu', 'contextmenu'],
            ['st-wheel', 'wheel'],
            ['st-drag', 'drag'],
            ['st-dragstart', 'dragstart'],
            ['st-dragend', 'dragend'],
            ['st-dragover', 'dragover'],
            ['st-dragenter', 'dragenter'],
            ['st-dragleave', 'dragleave'],
            ['st-drop', 'drop'],
            ['st-input', 'input'],
            ['st-keydown', 'keydown'],
            ['st-keyup', 'keyup']
        ];
        this.initOnLoad()
    }

    initOnLoad() {
        document.addEventListener("DOMContentLoaded", () => {
            this.initAllEventTypes()
            this.initSignalTextPlaceholders()
            this.initSignalAttrPlaceholders()
        });
    }

    initAllEventTypes() {
        Iter.map(this.eventPairs, (pair) => {
            let stEvent = pair[0]
            let htmlEvent = pair[1]
            this.initEventsOfType(stEvent, htmlEvent)
            return true
        })
    }

    initEventsOfType(eventAttr, mapsTo) {
        Iter.mapObj(this.events, (key, event) => {
            let subElms = document.querySelectorAll(`*[${eventAttr}]`)
            Iter.map(subElms, (elm) => {
                let sublist = elm.getAttribute(`${eventAttr}`)
                let parts = sublist.split(";")
                Iter.map(parts, (part) => {
                    let event = staci.getEvent(part)
                    elm.addEventListener(mapsTo, event)
                    return true
                })
                return true
            })
            return true
        })
    }

    initSignalTextPlaceholders() {
        let allElms = document.querySelectorAll("*")
        Iter.map(allElms, (elm) => {
            // handling text content {%  %}
            let text = Dom.getDirectTextContent(elm)
            let placeholders = Purse.scanBetweenSubStrs(text, "{{", "}}")
            Iter.map(placeholders, (placeholder) => {
                let signalKey = placeholder.replace("{{", "").replace("}}", "").trim()
                let signal = staci.getSignal(signalKey)
                if (signal == null || signal == undefined) {
                    console.error(`attempting to set signal values on a {{ }} placeholder, but 
                    we encountered a null signal from using the key ${signalKey} and placeholder ${placeholder}`)
                }
                Dom.replaceTextContent(elm, placeholder, signal.val())
                signal.subscribe((oldVal, newVal) => {
                    Dom.replaceTextContent(elm, oldVal, newVal)
                })
                return true
            })
            return true
        })
    }

    initSignalAttrPlaceholders() {
        let allElms = document.querySelectorAll("*")
        Iter.map(allElms, (elm) => {
            Iter.map(elm.attributes, (attr) => {
                let attrKey = attr.name
                let attrVal = attr.value
                let placeholders = Purse.scanBetweenSubStrs(attrVal, "{{", "}}")
                Iter.map(placeholders, (placeholder) => {
                    let signalKey = placeholder.replace("{{", "").replace("}}", "").trim()
                    let signal = staci.getSignal(signalKey)
                    if (signal == null || signal == undefined) {
                        console.error(`attempting to set signal values on a {{ }} placeholder, but 
                        we encountered a null signal from using the key ${signalKey} and placeholder ${placeholder}`)
                    }
                    attrVal = attrVal.replace(placeholder, signal.val())
                    elm.setAttribute(attrKey, attrVal)
                    signal.subscribe((oldVal, newVal) => {
                        attrVal = attrVal.replace(oldVal, newVal)
                        elm.setAttribute(attrKey, attrVal)
                    })
                    return true
                })
                return true
            })
            // let text = Dom.getDirectTextContent(elm)
            // let placeholders = Purse.scanBetweenSubStrs(text, "{%", "%}")
            // Iter.map(placeholders, (placeholder) => {
            //     let signalKey = placeholder.replace("{%", "").replace("%}", "").trim()
            //     let signal = staci.getSignal(signalKey)
            //     if (signal == null || signal == undefined) {
            //         console.error(`attempting to set signal values on a {% %} placeholder, but 
            //         we encountered a null signal from using the key ${signalKey} and placeholder ${placeholder}`)
            //     }
            //     Dom.replaceTextContent(elm, placeholder, signal.val())
            //     signal.subscribe((oldVal, newVal) => {
            //         Dom.replaceTextContent(elm, oldVal, newVal)
            //     })
            //     return true
            // })
            return true
        })
    }

    event(name, fn) {
        this.events[name] = fn
    }

    signal(key, val) {
        this.signals[key] = new Signal(val)
    }

    getEvent(key) {
        let foundEvent = false
        let event = null
        Iter.mapObj(this.events, (innerKey, val) => {
            if (key == innerKey) {
                foundEvent = true
                event = val
                return false

            }
            return true
        })
        if (foundEvent == false) {
            console.error(`attempted to access event named ${key} when one does not exist`)
            return null
        }
        return event
    }

    getSignal(key) {
        let foundSignal = false
        let signal = null
        Iter.mapObj(this.signals, (innerKey, val) => {
            if (key == innerKey) {
                foundSignal = true
                signal = val
                return false
            }
            return true
        })
        if (foundSignal == false) {
            console.error(`attempted to access signal named ${key} when one does not exist`)
            return null
        }
        return signal
    }

}


let staci = new Staci()


console.log(staci)
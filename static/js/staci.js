

/* 
Codebase Rules
1. If a function returns a value, it must be wrapped in a Result
*/


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
        this.states = {}
        this.initOnLoad()
    }

    initOnLoad() {
        document.addEventListener("DOMContentLoaded", () => {
            this.initEventsOfType("st-click", "click")
            this.initSignalTextPlaceholders()
            this.initSignalAttrPlaceholders()
        });
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
            let placeholders = Purse.scanBetweenSubStrs(text, "{%", "%}")
            Iter.map(placeholders, (placeholder) => {
                let signalKey = placeholder.replace("{%", "").replace("%}", "").trim()
                let signal = staci.getSignal(signalKey)
                if (signal == null || signal == undefined) {
                    console.error(`attempting to set signal values on a {% %} placeholder, but 
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
            console.log(elm)
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

    setSignal(key, val) {
        this.states[key] = new Signal(val)
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
        let foundState = false
        let state = null
        Iter.mapObj(this.states, (innerKey, val) => {
            if (key == innerKey) {
                foundState = true
                state = val
                return false
            }
            return true
        })
        if (foundState == false) {
            console.error(`attempted to access state value named ${key} when one does not exist`)
            return null
        }
        return state
    }

}

class StSignal extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        let name = this.getAttribute('name')
        let val = this.getAttribute('value')
        let num = parseInt(val)
        if (isNaN(num)) {
            staci.setSignal(name, val)
        } else {
            staci.setSignal(name, num)
        }

    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Attribute ${name} has changed from ${oldValue} to ${newValue}`);
    }

}

customElements.define("st-signal", StSignal);


let staci = new Staci()


console.log(staci)
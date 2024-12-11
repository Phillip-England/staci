import type { PotentialErr } from "./PotentialErr";
import { Result } from "./Result";

export class Dom {
  static qsa(selector: string): HTMLElement[] {
    let elements: NodeListOf<HTMLElement> = document.querySelectorAll(selector);
    let arr: HTMLElement[] = [];
    for (let i = 0; i < elements.length; i++) {
      arr.push(elements[i]);
    }
    return arr as HTMLElement[];
  }

  static qs(selector: string): HTMLElement {
    let element: HTMLElement | null = document.querySelector(selector);
    return element as HTMLElement;
  }

  static getDirectTextContent(element: HTMLElement): string {
    let directText = "";
    element.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        directText += node.nodeValue;
      }
    });
    return directText.trim();
  }

  static replaceTextContent(
    element: HTMLElement,
    placeholder: string,
    newValue: string,
  ) {
    const currentText = element.textContent as string;
    const updatedText = currentText.replace(placeholder, newValue);
    element.textContent = updatedText;
  }

  static ClimbDomUntil(
    element: HTMLElement,
    callback: (elm: HTMLElement) => boolean,
  ) {
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
      currentElement = currentElement.parentElement as HTMLElement;
    }
    return false;
  }
}

import { Signal } from "./client/Signal";
import { Staci } from "./client/Staci";

let staci = new Staci();
let count = 0;

let sig = staci.signal("navClass", "hidden").opposite("flex");

staci.event("toggleNav", () => {
  if (sig.val() == "hidden") {
    sig.set("flex");
  } else {
    sig.set("hidden");
  }
});

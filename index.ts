import { Signal } from "./client/Signal";
import { Staci } from "./client/Staci";

let staci = new Staci();

let sig = staci.signal("navClass", "hidden").states(["flex"]);

staci.event("toggleNav", () => {
  sig.next();
});

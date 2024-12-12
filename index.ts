import { Signal } from "./client/Signal";
import { Staci } from "./client/Staci";

let staci = new Staci();

let sig = staci.signal("navClass", "hidden").opposite('flex');
let sig2 = staci.signal('navClass2', "border border-black").states(["border border-red"])

staci.event("toggleNav", () => {
    sig.toggle()
});

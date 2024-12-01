# Staci
A Suite of Web Components Which Add Behavior to Static HTML 💄

Staci is all about *complimenting* existing HTML. Simply drop in a few web components, add some attributes, and let Staci do all the work 🤤.

Staci is not about replacing you're existing wife__ I mean system. Rather, Staci intends to join-in where needed. She can be adopted incrementally overtime.

## Counter Example
Need to define some `state`? Cool:
```html
<st-signal name="count" value="0"></st-signal>
<script>
    staci.event("increment-count", () => {
        let count = staci.getSignal('count');
        count.set(count.val()+1);
    });
</script>

<div>
    <h2>Counter Example</h2>
    <p>{{ count }}</p>
    <button st-click="increment-count">Increment</button>
</div>
```

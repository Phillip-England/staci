# Staci
A Suite of Web Components Which Add Behavior to Static HTML 💄

Staci is all about *complimenting* existing HTML. Simply drop in a few web components, add some attributes, and let Staci do all the work 🤤.

Staci is not about replacing you're existing wife__ I mean system. Rather, Staci intends to join-in where needed. She can be adopted incrementally overtime.

## Counter Example
Need to define some `state`? Cool:
```html
<st-signal name="count" value="0"></st-state>

<script name="increment-count" trigger="click">
    staci.setState("count", staci.getState("count") + 1)
</script>

<p id="current-count">{% count %}</p>
<button id="increment-button" subscribe="increment-count">Increment</button>
```

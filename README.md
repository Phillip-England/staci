# Staci
A Suite of Web Components Which Add Behavior to Static HTML 💄

Staci is all about *complimenting* existing HTML. Simply drop in a few web components, add some attributes, and let Staci do all the work 🤤.

Staci is not about replacing you're existing wife__ I mean system. Rather, Staci intends to join-in where needed. She can be adopted incrementally overtime.

## Counter Example
Need to define some `state`? Cool:
```html
<!-- Enables the use of target and trigger attributes in <script> -->
<st-signal name="count" value="0" target="#current-count.text;"></st-state>

<script target="#increment-button" trigger="click">
    staci.setState("count", staci.getState("count") + 1)
</script>

<p id="current-count"></p>
<button id="increment-button">Increment</button>
```

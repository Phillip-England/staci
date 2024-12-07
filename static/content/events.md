# Events Drive Behaviour
In `staci`, you can create an event using `staci.event("eventName", callback)`. Events can then be registered to elements using the `st-event-type="eventName"` syntax.

## Creating an Event
Here, we establish a `signal` and create an `event` to increment the `signal`:
```html
<script>
  staci.signal("count", 0);
  staci.event("increment-count", () => {
    let count = staci.getSignal("count");
    count.set(count.val() + 1);
  });
</script>
```

## Registering an Event
Once an event has been created, you can register it like so:
```html
<button st-click="incrementCount">Click Me!</button>
```

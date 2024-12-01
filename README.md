# Staci
Lightweight, reactive signals for dynamic web interactions 💄

## Use-Case
`staci` is all about *complimenting* existing HTML. Other reactive solutions attempt to dictate the way you write your HTML. When you want to generate HTML, you must do so **with the framework**.

`staci` is different. She is not about replacing you're existing wife__ I mean system. Rather, `staci` intends to join-in where needed and can be adopted incrementally overtime.


## Installation
`staci` is not bundled.. yet. I will get to that. For now, simply copy `./static/js/staci.js` and paste it into your own project.


## Counter Example
```html
<script>
    staci.signal("count", 0)
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

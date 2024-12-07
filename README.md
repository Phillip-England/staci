<img src="/static/img/logo-dark.svg" alt="Logo" width="200" height="auto">


# Staci
drop-in, reactive signals 🤌

## Counter Example
```html
<script>
    staci.signal("count", 0);
    staci.event("increment-count", () => {
        let count = staci.getSignal("count");
        count.set(count.val() + 1);
    });
</script>

<button st-click="increment-count">
    <p>Increment</p>
    <st-signal>{{ count }}</st-signal>
</button>
```

## Use-Case
`staci` is all about *compliementing* existing HTML. Other solutions dictate the way you write your HTML. When you want to generate HTML, you must do so **with the framework**.

`staci` is different. She is not about replacing you're existing wife__ I mean system. Rather, `staci` intends to join-in where needed and can be adopted incrementally overtime.

## Philosophy
Imagine if signals were available natively in the DOM. That is the vibe `staci` attempts to create.

Using signals should feel *natural*.

![Natural](/static/img/buddy.jpg)
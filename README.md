# Staci
drop-in, reactive signals 🤌

## The Docs
Read the docs at [stacijs.com](https://staci-production.up.railway.app/)

## Counter Example
```html
<script>
    staci.set("count", 0);
    staci.createEvent("increment-count", () => {
        let [count, setCount] = staci.get("count");
        setCount(count + 1);
    });
</script>

<button st-click="increment-count">
    <p>Increment</p>
    <st-signal>{| count |}</st-signal>
</button>
```

## Use-Case
`staci` is all about *compliementing* existing HTML. Other solutions dictate the way you write your HTML. When you want to generate HTML, you must do so **with the framework**.

`staci` is different. She is not about replacing you're existing wife__ I mean system. Rather, `staci` intends to join-in where needed and can be adopted incrementally overtime.
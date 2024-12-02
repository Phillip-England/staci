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
    staci.signal("count", 0);
    staci.event("increment-count", () => {
        let count = staci.getSignal("count");
        count.set(count.val() + 1);
    });
</script>

<div>
    <h2>Counter Example</h2>
    <p>This example demonstrates how to use signals to update the text content of an element<p>
</div>
<p>{{ count }}</p>
<button st-click="increment-count">Increment</button>
```

## Random Color Example (with throttle)
```html
	<script>
		staci.signal("color", "bg-blue-200");
		staci.event("set-random-color", () => {
			let color = staci.getSignal("color");
			let colors = ["bg-blue-200", "bg-red-200", "bg-yellow-200"];
			colors = Purse.removeFromArray(colors, color.val());
			let randomColor =
				colors[Math.floor(Math.random() * colors.length)];
			color.set(randomColor);
		});
	</script>
	
    <h2>Random Color Example</h2>
    <p>This example demonstrates how signals can be used within element attributes.</p>
    <p class="{{ color }}" st-mousemove="set-random-color" st-throttle="80">Enter your mouse here to change the class! I have the class {{ color }}<p>
```

## Form Validation Example (with debounce)
```html
	<script>
        staci.signal("error", "I am hidden");
        staci.signal("errorDisplay", "invisible");
		staci.event("validate-username", (e) => {
            let input = e.target;
            let value = input.value;
            let err = staci.getSignal("error");
            let display = staci.getSignal("errorDisplay");
            if (value == "stacismom") {
                err.set("great, you did it! 🦄");
                display.set("flex text-green-700");
            } else {
                err.set("the correct username is 'stacismom' you typed: '"+value+"'");
                display.set("flex text-red-700");
            }
		});
	</script>

	<h2>Form Debounce Example</h2>
	<p>This example demonstates how staci can be used to validate form fields with debouncing.</p>
	<form>
		<h2>Login</h2>
        <p class="{{ errorDisplay }}">{{ error }}</p>
		<div>
			<label>username</label>
			<input type="text" st-input="validate-username" st-debounce="250" />
		</div>
	</form>
```


```html
<div>
	<script>
		staci.signal("count", 0);
		staci.event("increment-count", () => {
			let count = staci.getSignal("count");
			count.set(count.val() + 1);
		});
	</script>
	<div>
		<h2>Counter Example</h2>
		<p>This example demonstrates how to use signals to update the text content of an element.</p>
	</div>
	<p>\\{{ count }}</p>
	<button st-click="increment-count">Increment</button>
</div>
```
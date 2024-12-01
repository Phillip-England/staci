// Code generated by gtml; DO NOT EDIT.
// v0.1.0 | you may see errors with types, you'll need to manage your own imports
// type support coming soon!

package components

import "strings"



func gtmlFor[T any](slice []T, callback func(i int, item T) string) string {
	var builder strings.Builder
	for i, item := range slice {
		builder.WriteString(callback(i, item))
	}
	return builder.String()
}

func gtmlIf(condition bool, fn func() string) string {
if condition {
	return fn()
}
	return ""
}

func gtmlElse(condition bool, fn func() string) string {
	if !condition {
		return fn()
	}
	return ""
}

func gtmlSlot(contentFunc func() string) string {
	return contentFunc()
}

func gtmlEscape(input string) string {
	return input
}

func Layout(title string) string {
	layout := func() string {
		var layoutBuilder strings.Builder
		layoutBuilder.WriteString(`<html _component="Layout" _id="0"><head><meta name="viewport" content="width=device-width, initial-scale=1"/><meta charset="UTF-8"/><link rel="stylesheet" href="/static/css/output.css"/><script src="/static/js/staci.js"></script><title>`)
		layoutBuilder.WriteString(title)
		layoutBuilder.WriteString(`</title></head><body><div class="p-4 flex flex-col gap-2 border-b"><h1 class="font-bold text-2xl">Staci</h1><p class="text-sm">Come visit sometime.. 💄</p></div><div class="p-4 flex gap-4 flex-col"><script>staci.signal("count", 0);staci.event("increment-count", () => {let count = staci.getSignal('count');count.set(count.val()+1);});</script><div class="flex flex-col gap-2"><h2 class="text-xl font-bold">Counter Example</h2><p class="text-sm">This example demonstrates how to use signals to update the text content of an element.</p></div><p>{{ count }}</p><button st-click="increment-count" class="border w-fit bg-black text-white rounded px-4 py-2 text-sm">Increment</button></div><div class="p-4 flex gap-4 flex-col"><script>staci.signal("color", "bg-blue-500");staci.event("set-random-color", () => {let color = staci.getSignal("color");let colors = ['bg-blue-500', 'bg-red-500', 'bg-yellow-500'];colors = Purse.removeFromArray(colors, color.val());let randomColor = colors[Math.floor(Math.random() * colors.length)];color.set(randomColor);});</script><div class="flex flex-col gap-2"><h2 class="text-xl font-bold">Random Color Example</h2><p class="text-sm">This example demonstrates how signals can be used within element attributes.</p></div><p class="{{ color }} p-4 rounded text-sm" st-mousemove="set-random-color">Enter your mouse here to change the class! I have the class {{ color }}</p><!-- <button st-click="set-random-color" class="border w-fit bg-black text-white rounded px-4 py-2 text-sm">Randomize</button> --></div></body></html>`)
		return layoutBuilder.String()
	}
	return gtmlEscape(layout())
}


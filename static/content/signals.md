# What are Signals?
Signals are points of data located somewhere within the DOM. When a signal's value changes, the value in the DOM will reflect the change automatically.

Put plainly, signals allow us to bypass using `document.querySelector` and related methods to handle DOM updates.

Signals allow to go from a fine-grained update:
```html
<script>
    let button = document.getElementById('btn');
    button.addEventListener('click', () => {
        let text = document.getElementById('text');
        if (text.classList.contains('text-blue-500')) {
            text.classList.remove('text-blue-500');
            text.classList.add('text-red-500');
        } else {
            text.classList.remove('text-red-500');
            text.classList.add('text-blue-500');
        }
    });
</script>

<button id='btn'>Click!</button>
<p id='text' class="text-blue-500">Change my color by clicking</p>
```

To a reactive model like this:
```html
    <script>
        staci.signal('colorClass', 'text-blue-500')
        staci.event('change-color', () => {
            let color = staci.getSignal('colorClass')
            if (color.val() == 'text-blue-500') {
                color.set('text-red-500')
            } else {
                color.set('text-blue-500')
            }
        })
    </script>

    <button st-click='change-color'>Click!</button>
    <p class="{{ colorClass }}">Change my color by clicking</p>
```

## Creating a Signal
To create a signal:
```html
<script>
    staci.signal("count", 0)
</script>
```

## Mounting a Signal Within the DOM
To use the signal's value within the DOM, use the `<st-signal>` custom element.
```html
<script>
    staci.signal("count", 0)
</script>
<p>
    <st-signal>{{ count }}</st-signal>
</p>
```

> 🚨 Failing to use `<st-signal>` will result in potential bugs when updating the value.

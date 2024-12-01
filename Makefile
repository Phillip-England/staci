gtml:
	gtml --watch build ./components ./src/components/components.go components

tw:
	tailwindcss -i ./static/css/input.css -o ./static/css/output.css --watch
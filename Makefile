gtml:
	gtml --watch build ./components ./server/components/components.go components

tw:
	tailwindcss -i ./static/css/input.css -o ./static/css/output.css --watch

bundle:
	bun build ./client/index.js --outdir ./static/js --watch
gtml:
	gtml --watch build ./components ./server/components/components.go components

tw:
	tailwindcss -i ./static/css/input.css -o ./static/css/output.css --watch

prepare:
	flint spark; mv out ..; cd ..; mv out www.stacijs.com; cd www.stacijs.com; rm -r static; rm -r docs; rm -r favicon.ico; rm -r index.html; cd out; mv * ..; cd ..; rm -r out; cd ..; cd staci;

bundle:
	bun build ./index.ts --outdir ./static/js --watch
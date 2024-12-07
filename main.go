package main

import (
	"net/http"
	"staci/server/components"

	"github.com/phillip-england/vbf"
)

func main() {
	mux, gCtx := vbf.VeryBestFramework()

	vbf.HandleFavicon(mux)
	vbf.HandleStaticFiles(mux)

	vbf.AddRoute("/", mux, gCtx, func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" {
			vbf.WriteHTML(w, components.HomePage())
			return
		}
		vbf.WriteHTML(w, "<h1>404 not found</h1>")
	}, vbf.MwLogger)

	vbf.AddRoute("/docs/signals", mux, gCtx, func(w http.ResponseWriter, r *http.Request) {
		vbf.WriteHTML(w, components.DocSignals())
	}, vbf.MwLogger)

	vbf.AddRoute("/docs/events", mux, gCtx, func(w http.ResponseWriter, r *http.Request) {
		vbf.WriteHTML(w, components.DocEvents())
	}, vbf.MwLogger)

	vbf.Serve(mux, "8080")

}

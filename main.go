package main

import (
	"net/http"
	"staci/src/components"

	"github.com/Phillip-England/vbf"
)

func main() {

	mux, gCtx := vbf.VeryBestFramework()

	vbf.HandleFavicon(mux)
	vbf.HandleStaticFiles(mux)

	vbf.AddRoute("/", mux, gCtx, func(w http.ResponseWriter, r *http.Request) {
		vbf.WriteHTML(w, components.Layout("Home Page"))
	}, vbf.MwLogger)

	vbf.Serve(mux, "8080")

}

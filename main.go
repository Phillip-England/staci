package main

import (
	"net/http"

	"github.com/Phillip-England/vbf"
)

func main() {

	mux, gCtx := vbf.VeryBestFramework()

	vbf.HandleFavicon(mux, vbf.MwLogger)
	vbf.HandleStaticFiles(mux, vbf.MwLogger)

	vbf.AddRoute("/", mux, gCtx, func(w http.ResponseWriter, r *http.Request) {
	})

	vbf.Serve(mux, "8080")

}

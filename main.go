package main

import (
	"fmt"
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
			vbf.WriteHTML(w, components.Layout("Home Page"))
			return
		}
		fmt.Println("hit")
	}, vbf.MwLogger)

	vbf.Serve(mux, "8080")

}

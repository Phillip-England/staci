package main

import (
	"html/template"
	"net/http"

	"github.com/phillip-england/vbf"
)

const KEY_TEMPLATES = "TEMPLATES"

func main() {

	mux, gCtx := vbf.VeryBestFramework()

	strEquals := func(input string, value string) bool {
		return input == value
	}

	funcMap := template.FuncMap{
		"strEquals": strEquals,
	}

	templates, err := vbf.ParseTemplates("./templates", funcMap)
	if err != nil {
		panic(err)
	}

	vbf.SetGlobalContext(gCtx, KEY_TEMPLATES, templates)
	vbf.HandleStaticFiles(mux)
	vbf.HandleFavicon(mux)

	vbf.AddRoute("GET /", mux, gCtx, func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" {
			templates, _ := vbf.GetContext(KEY_TEMPLATES, r).(*template.Template)
			mdContent, err := vbf.LoadMarkdown("./static/docs/intro.md", "dracula")
			if err != nil {
				vbf.WriteString(w, err.Error())
			}
			vbf.ExecuteTemplate(w, templates, "root.html", map[string]interface{}{
				"Title":     "staci - drop-in, reactive signals 🤌",
				"Content":   template.HTML(mdContent),
				"ReqPath":   r.URL.Path,
				"PrevHref":  "",
				"PrevTitle": "",
				"NextHref":  "/docs/signals",
				"NextTitle": "Signals",
			})
		} else {
			vbf.WriteString(w, "404 not found")
		}
	}, vbf.MwLogger)

	vbf.AddRoute("GET /docs/signals", mux, gCtx, func(w http.ResponseWriter, r *http.Request) {
		templates, _ := vbf.GetContext(KEY_TEMPLATES, r).(*template.Template)
		mdContent, err := vbf.LoadMarkdown("./static/docs/signals.md", "dracula")
		if err != nil {
			vbf.WriteString(w, err.Error())
		}
		vbf.ExecuteTemplate(w, templates, "root.html", map[string]interface{}{
			"Title":     "staci - drop-in, reactive signals 🤌",
			"Content":   template.HTML(mdContent),
			"ReqPath":   r.URL.Path,
			"PrevHref":  "/",
			"PrevTitle": "Home",
			"NextHref":  "/docs/events",
			"NextTitle": "Events",
		})
	}, vbf.MwLogger)

	vbf.AddRoute("GET /docs/events", mux, gCtx, func(w http.ResponseWriter, r *http.Request) {
		templates, _ := vbf.GetContext(KEY_TEMPLATES, r).(*template.Template)
		mdContent, err := vbf.LoadMarkdown("./static/docs/events.md", "dracula")
		if err != nil {
			vbf.WriteString(w, err.Error())
		}
		vbf.ExecuteTemplate(w, templates, "root.html", map[string]interface{}{
			"Title":     "staci - drop-in, reactive signals 🤌",
			"Content":   template.HTML(mdContent),
			"ReqPath":   r.URL.Path,
			"PrevHref":  "/docs/signals",
			"PrevTitle": "Signals",
			"NextHref":  "/docs/observers",
			"NextTitle": "Observers",
		})
	}, vbf.MwLogger)

	vbf.AddRoute("GET /docs/observers", mux, gCtx, func(w http.ResponseWriter, r *http.Request) {
		templates, _ := vbf.GetContext(KEY_TEMPLATES, r).(*template.Template)
		mdContent, err := vbf.LoadMarkdown("./static/docs/observers.md", "dracula")
		if err != nil {
			vbf.WriteString(w, err.Error())
		}
		vbf.ExecuteTemplate(w, templates, "root.html", map[string]interface{}{
			"Title":     "staci - drop-in, reactive signals 🤌",
			"Content":   template.HTML(mdContent),
			"ReqPath":   r.URL.Path,
			"PrevHref":  "/docs/events",
			"PrevTitle": "Events",
			"NextHref":  "/docs/installation",
			"NextTitle": "Installation",
		})
	}, vbf.MwLogger)

	vbf.AddRoute("GET /docs/installation", mux, gCtx, func(w http.ResponseWriter, r *http.Request) {
		templates, _ := vbf.GetContext(KEY_TEMPLATES, r).(*template.Template)
		mdContent, err := vbf.LoadMarkdown("./static/docs/installation.md", "dracula")
		if err != nil {
			vbf.WriteString(w, err.Error())
		}
		vbf.ExecuteTemplate(w, templates, "root.html", map[string]interface{}{
			"Title":     "staci - drop-in, reactive signals 🤌",
			"Content":   template.HTML(mdContent),
			"ReqPath":   r.URL.Path,
			"PrevHref":  "/docs/observers",
			"PrevTitle": "Observers",
			"NextHref":  "",
			"NextTitle": "",
		})
	}, vbf.MwLogger)

	err = vbf.Serve(mux, "8080")
	if err != nil {
		panic(err)
	}

}

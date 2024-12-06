// Code generated by gtml; DO NOT EDIT.

// v0.1.0 | you may see errors with types, you'll need to manage your own imports
// type support coming soon!

package components

import (
	"strings"
	chromahtml "github.com/alecthomas/chroma/v2/formatters/html"
	highlighting "github.com/yuin/goldmark-highlighting/v2"
	goldmarkhtml "github.com/yuin/goldmark/renderer/html"
	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/parser"
	"bytes"
	"os"
	"github.com/PuerkitoBio/goquery"
	"fmt"
)
		

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

func gtmlMd(mdPath string, theme string) string {
    if len(mdPath) == 0 {
        fmt.Println("_md elements require a valid path")
    }
    firstChar := string(mdPath[0])
    if firstChar != "." {
        mdPath = "."+mdPath
    }
 	mdFileContent, _ := os.ReadFile(mdPath)
	md := goldmark.New(
		goldmark.WithExtensions(
			highlighting.NewHighlighting(
				highlighting.WithStyle(theme),
				highlighting.WithFormatOptions(
					chromahtml.WithLineNumbers(true),
				),
			),
		),
		goldmark.WithParserOptions(
			parser.WithAutoHeadingID(),
		),
		goldmark.WithRendererOptions(
			goldmarkhtml.WithHardWraps(),
			goldmarkhtml.WithXHTML(),
			goldmarkhtml.WithUnsafe(),
		),
	)
	var buf bytes.Buffer
	_ = md.Convert([]byte(mdFileContent), &buf)
	str := buf.String()
	doc, _ := goquery.NewDocumentFromReader(strings.NewReader(str))

	doc.Find("*").Each(func(i int, inner *goquery.Selection) {
		nodeName := goquery.NodeName(inner)
		currentStyle, _ := inner.Attr("style")
		switch nodeName {
		case "pre":
			inner.SetAttr("style", currentStyle+"padding: 1rem; font-size: 0.875rem; overflow-x: auto; border-radius: 0.25rem; margin-bottom: 1rem;")
		case "h1":
			inner.SetAttr("style", currentStyle+"font-weight: bold; font-size: 1.875rem; padding-bottom: 1rem;")
		case "h2":
			inner.SetAttr("style", currentStyle+"font-size: 1.5rem; font-weight: bold; padding-bottom: 1rem; padding-top: 0.5rem; border-top-width: 1px; border-top-style: solid; border-color: #1f2937; padding-top: 1rem;")
		case "h3":
			inner.SetAttr("style", currentStyle+"font-size: 1.25rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 1rem;")
		case "p":
			inner.SetAttr("style", currentStyle+"font-size: 0.875rem; line-height: 1.5; margin-bottom: 1rem;")
		case "ul":
			inner.SetAttr("style", currentStyle+"padding-left: 1.5rem; margin-bottom: 1rem; list-style-type: disc;")
		case "ol":
			inner.SetAttr("style", currentStyle+"padding-left: 1.5rem; margin-bottom: 1rem; list-style-type: decimal;")
		case "li":
			inner.SetAttr("style", currentStyle+"margin-bottom: 0.5rem;")
		case "blockquote":
			inner.SetAttr("style", currentStyle+"margin-left: 1rem; padding-left: 1rem; border-left: 4px solid #ccc; font-style: italic; color: #555;")
		case "code":
			parent := inner.Parent()
			if goquery.NodeName(parent) == "pre" {
				return
			}
			inner.SetAttr("style", currentStyle+"font-family: monospace; background-color: #1f2937; padding: 0.25rem 0.5rem; border-radius: 0.25rem;")
		case "hr":
			inner.SetAttr("style", currentStyle+"border: none; border-top: 1px solid #ccc; margin: 2rem 0;")
		case "a":
			inner.SetAttr("style", currentStyle+"color: #007BFF; text-decoration: none;")
		case "img":
			inner.SetAttr("style", currentStyle+"max-width: 100%; height: auto; border-radius: 0.25rem; margin: 1rem 0;")
		}
	})
	modifiedHTML, _ := doc.Html()
	return modifiedHTML
}

func Layout(title string, mdContent string) string {
	layout := func() string {
		var layoutBuilder strings.Builder
		staciheaderPlaceholder1 := func() string {
			return StaciHeader()
		}
		layoutBuilder.WriteString(`<html _component="Layout" _id="0"><head><meta name="viewport" content="width=device-width, initial-scale=1"/><meta charset="UTF-8"/><link rel="stylesheet" href="/static/css/output.css"/><script src="/static/js/staci.js"></script><title>`)
		layoutBuilder.WriteString(title)
		layoutBuilder.WriteString(`</title></head><body class="bg-black h-full text-white st-scrollbar flex flex-col"><st-scrollbar></st-scrollbar>`)
		layoutBuilder.WriteString(staciheaderPlaceholder1())
		layoutBuilder.WriteString(`<div class="flex-grow pt-[90px]">`)
		layoutBuilder.WriteString(mdContent)
		layoutBuilder.WriteString(`</div><footer class="p-4 text-sm italic border-t border-gray-800"><p>&#34;M-M-Mama says alligators are so ornery &#39;cause they got all them teeth and no toothbrush. 🐊&#34; - Adam Sandler, *The Waterboy*</p></footer></body></html>`)
		return layoutBuilder.String()
	}
	return gtmlEscape(layout())
}

func HomePage() string {
	layoutPlaceholder0 := func() string {
		mdContentSlot1 := gtmlSlot(func() string {
			var mdContentBuilder strings.Builder
			staticcontentintromdMd2 := gtmlMd("./static/content/intro.md", "dracula")
			mdContentBuilder.WriteString(`<div class="p-4" st-ignore="true" _slot="mdContent" _id="1">`)
			mdContentBuilder.WriteString(staticcontentintromdMd2)
			mdContentBuilder.WriteString(`<a href="/docs/signals" class="flex cursor-pointer p-4 flex-row rounded  items-center justify-center bg-dracula-pink text-black">Read the Docs</a></div>`)
			return mdContentBuilder.String()
		})
		return Layout("staci - lightweight, reactive signals 🤌", mdContentSlot1)
	}
	return gtmlEscape(layoutPlaceholder0())
}

func DocSignals() string {
	layoutPlaceholder0 := func() string {
		mdContentSlot1 := gtmlSlot(func() string {
			var mdContentBuilder strings.Builder
			staticcontentsignalsmdMd2 := gtmlMd("./static/content/signals.md", "dracula")
			mdContentBuilder.WriteString(`<div class="p-4" st-ignore="true" _slot="mdContent" _id="1">`)
			mdContentBuilder.WriteString(staticcontentsignalsmdMd2)
			mdContentBuilder.WriteString(`</div>`)
			return mdContentBuilder.String()
		})
		return Layout("staci - lightweight, reactive signals 🤌", mdContentSlot1)
	}
	return gtmlEscape(layoutPlaceholder0())
}

func StaciHeader() string {
	staciheader := func() string {
		var staciheaderBuilder strings.Builder
		staciheaderBuilder.WriteString(`<header _component="StaciHeader" class="p-4 flex fixed w-full flex-row justify-between border-b border-gray-800 text-white bg-black h-[90px]" _id="0"><div class="flex"><div class="flex w-10 items-center justify-center"><img src="/static/img/logo-dark.svg" class="flex h-full"/></div></div><div class="flex items-center justify-center"><div><svg class="w-8 h-8 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h14"></path></svg></div></div></header>`)
		return staciheaderBuilder.String()
	}
	return gtmlEscape(staciheader())
}

func PageTurn(prevHref string, prevTitle string, nextHref string, nextTitle string, showPrev bool, showNext bool) string {
	pageturn := func() string {
		var pageturnBuilder strings.Builder
		showPrevIf1 := gtmlIf(showPrev, func() string {
			var showPrevBuilder strings.Builder
			showPrevBuilder.WriteString(`<a _if="showPrev" class="px-4 py-2 border rounded border-gray-800 text-sm w-[33%] flex items-center justify-center" href="`)
			showPrevBuilder.WriteString(prevHref)
			showPrevBuilder.WriteString(`" _id="1"><h2 class="font-bold text-dracula-yellow">`)
			showPrevBuilder.WriteString(prevTitle)
			showPrevBuilder.WriteString(`</h2></a>`)
			if showPrev {
				return showPrevBuilder.String()
			}
			return ""
		})
		showPrevElse2 := gtmlElse(showPrev, func() string {
			var showPrevBuilder strings.Builder
			showPrevBuilder.WriteString(`<div _else="showPrev" _id="2"></div>`)
			if !showPrev {
				return showPrevBuilder.String()
			}
			return ""
		})
		showNextIf3 := gtmlIf(showNext, func() string {
			var showNextBuilder strings.Builder
			showNextBuilder.WriteString(`<a _if="showNext" class="px-4 py-2 border rounded border-gray-800 text-sm w-[33%] flex items-center justify-center" href="`)
			showNextBuilder.WriteString(nextHref)
			showNextBuilder.WriteString(`" _id="3"><h2 class="font-bold text-dracula-yellow">`)
			showNextBuilder.WriteString(nextTitle)
			showNextBuilder.WriteString(`</h2></a>`)
			if showNext {
				return showNextBuilder.String()
			}
			return ""
		})
		showNextElse4 := gtmlElse(showNext, func() string {
			var showNextBuilder strings.Builder
			showNextBuilder.WriteString(`<div _else="showNext" _id="4"></div>`)
			if !showNext {
				return showNextBuilder.String()
			}
			return ""
		})
		pageturnBuilder.WriteString(`<section _component="PageTurn" class="flex flex-row justify-between p-4" _id="0">`)
		pageturnBuilder.WriteString(showPrevIf1)
		pageturnBuilder.WriteString(showPrevElse2)
		pageturnBuilder.WriteString(showNextIf3)
		pageturnBuilder.WriteString(showNextElse4)
		pageturnBuilder.WriteString(`</section>`)
		return pageturnBuilder.String()
	}
	return gtmlEscape(pageturn())
}


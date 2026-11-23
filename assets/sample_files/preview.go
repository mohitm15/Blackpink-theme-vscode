package main

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"
)

type Settings struct {
	Foreground string   `json:"foreground"`
	Background string   `json:"background"`
	FontStyle  []string `json:"fontStyle"`
}

type TokenColor struct {
	Scope    interface{} `json:"scope"`
	Settings Settings    `json:"settings"`
}

func main() {
	themeDir := "your-theme-name" // ← change this

	// ── Read tokenColors.json ──
	data, err := os.ReadFile(themeDir + "/tokenColors.json")
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	var tokens []TokenColor
	if err := json.Unmarshal(data, &tokens); err != nil {
		fmt.Println("Error:", err)
		return
	}

	sep := strings.Repeat("═", 60)
	fmt.Println(sep)
	fmt.Println("TOKEN COLORS")
	fmt.Println(sep)

	for i, t := range tokens {
		var scopes string
		switch v := t.Scope.(type) {
		case string:
			scopes = v
		case []interface{}:
			parts := make([]string, len(v))
			for j, s := range v {
				parts[j] = fmt.Sprintf("%v", s)
			}
			scopes = strings.Join(parts, ", ")
		default:
			scopes = "—"
		}

		style := strings.Join(t.Settings.FontStyle, " ")

		fmt.Printf("\n[%d] %s\n", i, scopes)
		fmt.Printf("     fg: %s", t.Settings.Foreground)
		if t.Settings.Background != "" {
			fmt.Printf("  bg: %s", t.Settings.Background)
		}
		if style != "" {
			fmt.Printf("  style: %s", style)
		}
		fmt.Println()
	}

	// ── Also dump colors.json if present ──
	colorsData, err := os.ReadFile(themeDir + "/colors.json")
	if err == nil {
		var colors map[string]string
		if json.Unmarshal(colorsData, &colors) == nil {
			fmt.Println("\n" + sep)
			fmt.Println("EDITOR COLORS")
			fmt.Println(sep)
			for k, v := range colors {
				fmt.Printf("  %s: %s\n", k, v)
			}
		}
	}
}   
<?php
// ── Point to your theme's directory ──
$themeDir = __DIR__ . '/your-theme-name'; // ← change this

// ── Read tokenColors.json ──
$tokenColors = json_decode(file_get_contents("$themeDir/tokenColors.json"), true);

echo str_repeat('═', 60) . "\n";
echo "TOKEN COLORS\n";
echo str_repeat('═', 60) . "\n";

foreach ($tokenColors as $i => $entry) {
    $scopes = is_array($entry['scope'] ?? null)
        ? implode(', ', $entry['scope'])
        : ($entry['scope'] ?? '—');

    $s    = $entry['settings'] ?? [];
    $fg   = $s['foreground'] ?? '—';
    $bg   = $s['background'] ?? '';
    $style = $s['fontStyle']  ?? '';

    echo "\n[$i] $scopes\n";
    echo "     fg: $fg";
    if ($bg)    echo "  bg: $bg";
    if ($style) echo "  style: $style";
    echo "\n";
}

// ── Also dump colors.json if present ──
$colorsPath = "$themeDir/colors.json";
if (file_exists($colorsPath)) {
    $colors = json_decode(file_get_contents($colorsPath), true);
    echo "\n" . str_repeat('═', 60) . "\n";
    echo "EDITOR COLORS\n";
    echo str_repeat('═', 60) . "\n";
    foreach ($colors as $k => $v) {
        echo "  $k: $v\n";
    }
}   
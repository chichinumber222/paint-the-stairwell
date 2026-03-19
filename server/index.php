<?php
$manifestJsonFile = file_get_contents('manifest.json');
$manifest = json_decode($manifestJsonFile);
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <?php
    $css_href_array = $manifest->{"index.html"}->css;
    if (!is_array($css_href_array)) {
        $css_href_array = [$css_href_array];
    }
    foreach ($css_href_array as $css_href) {
        echo ("<link rel='stylesheet' href='{$css_href}'></link>");
    }
    ?>
    <title>stairwell</title>
  </head>
  <body>
    <div id="app">
      <canvas id="background-canvas"></canvas>
      <canvas id="drawing-canvas"></canvas>
      <div id="export-control">
        <p id="export-status" tabindex="-1" hidden></p>
        <button id="export-button">Export</button>
      </div>
      <div id="controls">
        <button id="undo-button">Undo</button>
        <button id="delete-button">Delete</button>
      </div>
    </div>
    <?php 
      $db = new SQLite3('drawings.db');
      $result = $db->query("SELECT id, name, created_at, data FROM drawings ORDER BY id DESC");
      $paths = [];
      while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $decodedData = json_decode($row['data']);
        if (!is_array($decodedData)) {
          continue;
        }
        $paths = array_merge($paths, $decodedData);
      }
      echo "<script>window.__PRELOADED_STATE__  = " . json_encode(['paths' => $paths], JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP) . ";</script>";
    ?>
    <?php
    $js_src_array = $manifest->{"index.html"}->file;
    if (!is_array($js_src_array)) {
        $js_src_array = [$js_src_array];
    }
    foreach ($js_src_array as $js_src) {
        echo ("<script type='module' src='{$js_src}'></script>");
    }
    ?>
  </body>
</html>

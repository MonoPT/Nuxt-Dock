<?php

$nuxt_port = 3000;

$url = $_GET['src'];
$url = str_replace("http://localhost", "http://localhost:$nuxt_port", $url);

$page = file_get_contents($url);
$page = str_replace("/__nuxt", "http://localhost:$nuxt_port/__nuxt", $page);

//http://localhost:3000/__nuxt_devtools__/client/_nuxt/entry.hxdKUDpu.css

echo $page;
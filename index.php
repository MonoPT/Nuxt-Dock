<?php 
    include './env_loader.php';

    $nuxt_port = getenv('NUXT_PORT');
    $request_url = $_SERVER['REQUEST_URI'];

    $count = 1;

    //load page from nuxt 
    $page = file_get_contents("http://localhost:$nuxt_port" . $request_url);    
    $page = str_replace("/_nuxt", "http://localhost:$nuxt_port/_nuxt", $page);

    //Load and handle script
    $script = file_get_contents("./socket_modification.js");
    $script = str_replace("{{port}}", $nuxt_port, $script);

    //inject scripts
    $page = str_replace("<head>", "<head>\n<script>$script</script>", $page, $count);

    $script = file_get_contents("./defered_script.js");
    $page = str_replace("</body>", "</body>\n<script>$script</script>", $page, $count);

   
    /*
        //$page = str_replace("&lt;\?php", "<?php", $page);
    //$page = str_replace("?&gt;", "?>", $page);
    //$page = str_replace("&quot;", "\"", $page);
    //$page = eval($page);
    */  

    echo $page;
?>
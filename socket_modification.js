let original_WebSocketClass = window.WebSocket;

//url: string | URL, protocols?: string | string[]
window.WebSocket = function(url, protocols) {
    if (url == "ws://localhost:/_nuxt/") {
        url = "ws://localhost:{{port}}/_nuxt/";
    }

    let socket = new original_WebSocketClass(url, protocols);

    return socket;
}

//(method) fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>
let original_fetch = window.fetch

window.fetch = function(input, init) {
    if (input === "/_nuxt/builds/meta/dev.json") {
        input = "http://localhost:{{port}}/_nuxt/builds/meta/dev.json";
    }

    return original_fetch(input, init);
}


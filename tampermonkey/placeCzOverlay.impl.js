// ==UserScript==
// @name         PlaceCZ overlay implementation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  For the krtek!
// @author       Syssx
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @require	     https://cdn.jsdelivr.net/npm/toastify-js
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @resource     TOASTIFY_CSS https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css
// @updateURL    https://github.com/PlaceCZ/Bot/raw/master/tampermonkey/placenlbot.user.js
// @downloadURL  https://github.com/PlaceCZ/Bot/raw/master/tampermonkey/placenlbot.user.js
// @grant        GM_getResourceText
// @grant        GM_addStyle

// ==/UserScript==
const BACKEND_URL = 'placecz.martinnemi.me';
const BACKEND_API_WS_URL = `wss://${BACKEND_URL}/api/ws`;
const BACKEND_API_MAPS = `https://${BACKEND_URL}/maps`;
GM_addStyle(GM_getResourceText('TOASTIFY_CSS'));
let socket;


if (window.top !== window.self) {
    window.addEventListener('load', () => {
            document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].appendChild(
        (function () {
            getCurrentOverlay();
            const i = document.createElement("img");
            i.src = "https://raw.githubusercontent.com/Syssx/PlaceCZOverlay/main/overlay/test.png";
            //i.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 1000px;";
            i.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 1000px; opacity: 1;";
            console.log(i);
            return i;
        })())

    }, false);

}

function getCurrentOverlay() {
    Toastify({
        text: 'Připojuji se na server PlaceCZ',
        duration: 10000
    }).showToast();

    socket = new WebSocket(BACKEND_API_WS_URL);

    const errorTimeout = setTimeout(() => {
        Toastify({
            text: 'Chyba při pokusu o připojení na PlaceCZ server',
            duration: 10000
        }).showToast();
        console.error('Chyba při pokusu o připojení na PlaceCZ server')
    }, 2000)

    socket.onopen = function () {
        clearTimeout(errorTimeout);
        Toastify({
            text: 'Připojeno na server PlaceCZ',
            duration: 10000
        }).showToast();
        socket.send(JSON.stringify({ type: 'getmap' }));
        //socket.send(JSON.stringify({ type: "brand", brand: "tampermonkeyV15" }));
    };

    socket.onmessage = async function (message) {
        var data;
        try {
            data = JSON.parse(message.data);
        } catch (e) {
            return;
        }

        switch (data.type.toLowerCase()) {
            case 'map':
                Toastify({
                    text: `Nové rozkazy připraveny, duvod: ${data.reason ? data.reason : 'Připojeno se na PlaceCZ'})`,
                    duration: 10000
                }).showToast();
                currentOrderCtx = await getCanvasFromUrl(`${BACKEND_API_MAPS}/${data.data}`, currentOrderCanvas);
                hasOrders = true;
                break;
            default:
                break;
        }
    };

    socket.onclose = function (e) {
        Toastify({
            text: `Odpojen od PlaceCZ serveru: ${e.reason}`,
            duration: 10000
        }).showToast();
        console.error('Socketfout: ', e.reason);
        socket.close();
        setTimeout(connectSocket, 1000);
    };
}
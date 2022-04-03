// ==UserScript==
// @name        PlaceCZ template user script
// @namespace   http://tampermonkey.net/
// @version     0.1
// @description For the krtek!
// @include     https://hot-potato.reddit.com/embed*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant       GM.xmlHttpRequest
// @author      Syssx
// @downloadURL https://raw.githubusercontent.com/Syssx/PlaceCZOverlay/main/tampermonkey/placeCzOverlay.impl.js
// @updateURL   https://raw.githubusercontent.com/Syssx/PlaceCZOverlay/main/tampermonkey/placeCzOverlay.impl.js
// @connect     raw.githubusercontent.com
// @connect     media.githubusercontent.com
// @require     https://unpkg.com/uhtml@2.8.1
// ==/UserScript==

const _Overlay = this;
(async function () {
  // Updater
  GM.xmlHttpRequest({
    method: "GET",
    url: "https://raw.githubusercontent.com/Syssx/PlaceCZOverlay/main/tampermonkey/placeCzOverlay.impl.js",
    onload: function (res) {
      new Function(res.responseText)(_Overlay);
    },
  });
})();

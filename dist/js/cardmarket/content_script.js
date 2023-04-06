/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/cardmarket/content_script.ts":
/*!******************************************!*\
  !*** ./src/cardmarket/content_script.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Users_1 = __webpack_require__(/*! ./pages/Users */ "./src/cardmarket/pages/Users.ts");
const Singles_1 = __webpack_require__(/*! ./pages/Singles */ "./src/cardmarket/pages/Singles.ts");
const ShoppingWizard_1 = __webpack_require__(/*! ./pages/ShoppingWizard */ "./src/cardmarket/pages/ShoppingWizard.ts");
if (window.location.pathname.includes("Users")) {
    (0, Users_1.showTrend)();
}
if (window.location.pathname.includes("Products/Singles")) {
    (0, Singles_1.addLinkToSingles)();
    (0, Singles_1.addCheckboxes)();
}
if (window.location.pathname.includes("ShoppingWizard/Results")) {
    (0, ShoppingWizard_1.addLinkToCards)();
}


/***/ }),

/***/ "./src/cardmarket/pages/ShoppingWizard.ts":
/*!************************************************!*\
  !*** ./src/cardmarket/pages/ShoppingWizard.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.addLinkToCards = void 0;
const scryfall_1 = __webpack_require__(/*! ../../common/scryfall */ "./src/common/scryfall.ts");
const utilities_1 = __webpack_require__(/*! ../utilities */ "./src/cardmarket/utilities.ts");
function addLinkToCards() {
    var _a, _b;
    for (const table of document.getElementsByTagName("tbody")) {
        for (const row of table.getElementsByTagName("tr")) {
            const card_id = (0, utilities_1.get_mkm_id)(row);
            const card_elem = row.getElementsByClassName("card-name")[0];
            const set_type = (_b = (_a = row.getElementsByClassName("expansion-symbol")[0]) === null || _a === void 0 ? void 0 : _a.getAttribute("data-original-title")) === null || _b === void 0 ? void 0 : _b.split(":").pop();
            if (card_id) {
                (0, scryfall_1.get_cardmarket)(card_id).then((card) => {
                    if (card.name) {
                        const name = card.name;
                        let set = card.set_name + (set_type === "Extras" || set_type === "Promos" ? set_type : "");
                        set = set.replace("Set", "");
                        let path = (set + "/" + name).replace(/ \/\/ /g, "-").replace(/:/g, "").replace(/\s+/g, "-").replace(/\'/g, "");
                        let url = "https://www.cardmarket.com/Magic/Products/Singles/" + path;
                        card_elem.innerHTML = "<a href='" + url + "'>" + name + "</a><br>/ <a href='" + card.purchase_uris.cardmarket + "'>All printings</a>";
                    }
                    else {
                        (0, scryfall_1.fetch_single)(card_elem.innerHTML.replace(/\(V\.\d+\)/g, '')).then((card) => {
                            card_elem.innerHTML += "<br>/ <a href='" + card.purchase_uris.cardmarket + "'>All printings</a>";
                        });
                    }
                });
            }
        }
    }
}
exports.addLinkToCards = addLinkToCards;


/***/ }),

/***/ "./src/cardmarket/pages/Singles.ts":
/*!*****************************************!*\
  !*** ./src/cardmarket/pages/Singles.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.addCheckboxes = exports.addLinkToSingles = void 0;
const utilities_1 = __webpack_require__(/*! ../../common/utilities */ "./src/common/utilities.ts");
function addLinkToSingles() {
    for (const user of document.getElementsByClassName("seller-name")) {
        const user_link = user.getElementsByTagName("a")[0];
        user_link.parentElement.innerHTML += "&nbsp;-&nbsp;<a href='" + user_link.href + "/Offers/Singles/'>Singles</a>";
    }
}
exports.addLinkToSingles = addLinkToSingles;
function getReference(default_ref) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get('reference', (data) => {
                if (data.reference) {
                    return resolve(data.reference);
                }
                else {
                    chrome.storage.sync.set({ reference: default_ref });
                    return resolve(default_ref);
                }
                ;
            });
        });
    });
}
function addCheckboxes() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let reference = yield getReference(1);
        const info = document.getElementsByClassName("info-list-container")[0];
        if (info) {
            const rows = info.getElementsByTagName("dd");
            const nrows = 4;
            let prices = [];
            for (let i = 0; i < nrows; i++) {
                const elem = rows[rows.length - nrows + i];
                prices.push(parseFloat(elem.innerHTML.match(/\d+\,\d+/)[0].replace(",", ".")));
                elem.innerHTML += "&nbsp;<input type='radio' name='reference' value=" + i + (i == reference ? " checked" : "") + ">";
            }
            colorPrices(prices[reference]);
            for (const radio of document.querySelectorAll('input[name="reference"]')) {
                radio.addEventListener("change", function () {
                    chrome.storage.sync.set({ reference: this.value }).then(() => {
                        reference = this.value;
                    });
                    colorPrices(prices[this.value]);
                });
            }
            (_a = document.getElementById("loadMoreButton")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => (0, utilities_1.sleep)(3000).then(() => colorPrices(prices[reference])));
        }
    });
}
exports.addCheckboxes = addCheckboxes;
function colorPrices(reference_price) {
    var _a;
    for (const elem of document.getElementsByClassName("price-container")) {
        const price_elem = elem.getElementsByClassName("font-weight-bold")[0];
        const playset_elem = price_elem.parentElement.parentElement.getElementsByClassName("extra-small");
        let ppu = 0;
        if (playset_elem.length > 0) {
            ppu = parseFloat((_a = playset_elem[0].innerHTML) === null || _a === void 0 ? void 0 : _a.match(/\d+(?:\,\d+)?/g)[0].replace(",", "."));
        }
        price_elem.classList.remove("color-primary");
        if (price_elem) {
            if ((ppu > 0 && ppu <= reference_price) || parseFloat(price_elem.innerHTML.replace(" €", "").replace(",", ".")) <= reference_price) {
                price_elem.style.color = "green";
            }
            else {
                price_elem.style.color = "red";
            }
        }
    }
}


/***/ }),

/***/ "./src/cardmarket/pages/Users.ts":
/*!***************************************!*\
  !*** ./src/cardmarket/pages/Users.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.showTrend = void 0;
const scryfall_1 = __webpack_require__(/*! ../../common/scryfall */ "./src/common/scryfall.ts");
const utilities_1 = __webpack_require__(/*! ../utilities */ "./src/cardmarket/utilities.ts");
function showTrend() {
    var _a;
    const table = document.getElementById("UserOffersTable");
    if (table) {
        const legenda_div = document.createElement("div");
        legenda_div.innerHTML = "<hr><p class='font-weight-bold'>Legenda: E = Stesso set / L = Prezzo più basso\ <br>Colori: <span style='color: green'>Prezzo minore</span> / <span style='color: red'>Prezzo maggiore</span> / <span style='color: darkviolet'>Foil [ <i>non supportato</i> ]</span> / <span class='color-primary'>Prezzo non trovato</span</p>";
        table.before(legenda_div);
        const rows = table.querySelectorAll('[id^=articleRow]');
        for (const row of rows) {
            const card_url = row.getElementsByClassName("col-seller")[0].getElementsByTagName("a")[0].href.split("?")[0].split("/");
            let card_name = (_a = card_url.pop()) === null || _a === void 0 ? void 0 : _a.replace(/-V\d+/, '');
            let card_id = (0, utilities_1.get_mkm_id)(row);
            let foil = false;
            if (row.querySelectorAll('[data-original-title="Foil"]').length > 0) {
                foil = true;
            }
            Promise.all([(0, scryfall_1.get_cheapest)(card_name), (0, scryfall_1.get_cardmarket)(card_id)]).then(responses => {
                var _a, _b, _c, _d, _e, _f, _g;
                const cheapest = responses[0];
                const exact = responses[1];
                const price_elem = row.getElementsByClassName("price-container")[0].getElementsByClassName("font-weight-bold")[0];
                const original_price = parseFloat(price_elem.innerHTML.replace(" €", "").replace(",", "."));
                const playset_elem = price_elem.parentElement.parentElement.getElementsByClassName("extra-small");
                let ppu = 0;
                if (playset_elem.length > 0) {
                    ppu = parseFloat((_a = playset_elem[0].innerHTML) === null || _a === void 0 ? void 0 : _a.match(/\d+(?:\,\d+)?/g)[0].replace(",", "."));
                }
                let cheapest_color = "", exact_color = "";
                let cheapest_price = 0, exact_price = 0;
                if (cheapest) {
                    cheapest_price = parseFloat((_c = (_b = cheapest.prices) === null || _b === void 0 ? void 0 : _b.eur) !== null && _c !== void 0 ? _c : (_d = cheapest.prices) === null || _d === void 0 ? void 0 : _d.eur_foil);
                    if (cheapest_price) {
                        cheapest_color = (foil ? "darkviolet" : color_from_price(original_price, cheapest_price, ppu));
                    }
                }
                if (exact) {
                    exact_price = parseFloat((_f = (_e = exact.prices) === null || _e === void 0 ? void 0 : _e.eur) !== null && _f !== void 0 ? _f : (_g = exact.prices) === null || _g === void 0 ? void 0 : _g.eur_foil);
                    if (exact_price) {
                        exact_color = (foil ? "darkviolet" : color_from_price(original_price, exact_price, ppu));
                    }
                }
                let original_color = exact_color || cheapest_color;
                price_elem.innerHTML = "<span style='color: " + original_color + "'>" + price_elem.innerHTML + "<span>";
                if (!foil) {
                    if (exact_price > 0 && cheapest.set != exact.set)
                        price_elem.innerHTML += "<br><span style='color: " + exact_color + ";' >E </span><a style='color: black' href='" + exact.scryfall_uri + "'> " + exact_price.toLocaleString("it-IT", { minimumFractionDigits: 2 }) + " €</a>";
                    if (cheapest_price > 0)
                        price_elem.innerHTML += "<br><span style='color: " + cheapest_color + ";'>" + (cheapest.set == exact.set ? "E=" : "") + "L </span><a style='color: black' href='" + cheapest.scryfall_uri + "'> " + cheapest_price.toLocaleString("it-IT", { minimumFractionDigits: 2 }) + " €</a>";
                }
            });
        }
    }
}
exports.showTrend = showTrend;
function color_from_price(old_price, new_price, ppu) {
    if ((ppu > 0 && ppu > new_price) || old_price > new_price) {
        return "red";
    }
    else {
        return "green";
    }
}


/***/ }),

/***/ "./src/cardmarket/utilities.ts":
/*!*************************************!*\
  !*** ./src/cardmarket/utilities.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.get_mkm_id = void 0;
function get_mkm_id(row) {
    var _a, _b;
    return ((_b = (_a = row.getElementsByClassName("fonticon-camera")[0]) === null || _a === void 0 ? void 0 : _a.getAttribute("data-original-title")) === null || _b === void 0 ? void 0 : _b.split(/\.jpg/g)[0].split("/").splice(-1)[0]) || "";
}
exports.get_mkm_id = get_mkm_id;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"cardmarket/content_script": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkIds[i]] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkboris"] = self["webpackChunkboris"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor"], () => (__webpack_require__("./src/cardmarket/content_script.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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a0I7Ozs7Ozs7VUNQbEI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOzs7OztXQ3pCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLCtCQUErQix3Q0FBd0M7V0FDdkU7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQkFBaUIscUJBQXFCO1dBQ3RDO1dBQ0E7V0FDQSxrQkFBa0IscUJBQXFCO1dBQ3ZDO1dBQ0E7V0FDQSxLQUFLO1dBQ0w7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQzNCQTs7Ozs7V0NBQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTSxxQkFBcUI7V0FDM0I7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7Ozs7O1VFaERBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ib3Jpcy8uL3NyYy9jYXJkbWFya2V0L2NvbnRlbnRfc2NyaXB0LnRzIiwid2VicGFjazovL2JvcmlzLy4vc3JjL2NhcmRtYXJrZXQvcGFnZXMvU2hvcHBpbmdXaXphcmQudHMiLCJ3ZWJwYWNrOi8vYm9yaXMvLi9zcmMvY2FyZG1hcmtldC9wYWdlcy9TaW5nbGVzLnRzIiwid2VicGFjazovL2JvcmlzLy4vc3JjL2NhcmRtYXJrZXQvcGFnZXMvVXNlcnMudHMiLCJ3ZWJwYWNrOi8vYm9yaXMvLi9zcmMvY2FyZG1hcmtldC91dGlsaXRpZXMudHMiLCJ3ZWJwYWNrOi8vYm9yaXMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYm9yaXMvd2VicGFjay9ydW50aW1lL2NodW5rIGxvYWRlZCIsIndlYnBhY2s6Ly9ib3Jpcy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JvcmlzL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2JvcmlzL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vYm9yaXMvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2JvcmlzL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IFVzZXJzXzEgPSByZXF1aXJlKFwiLi9wYWdlcy9Vc2Vyc1wiKTtcbmNvbnN0IFNpbmdsZXNfMSA9IHJlcXVpcmUoXCIuL3BhZ2VzL1NpbmdsZXNcIik7XG5jb25zdCBTaG9wcGluZ1dpemFyZF8xID0gcmVxdWlyZShcIi4vcGFnZXMvU2hvcHBpbmdXaXphcmRcIik7XG5pZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKFwiVXNlcnNcIikpIHtcbiAgICAoMCwgVXNlcnNfMS5zaG93VHJlbmQpKCk7XG59XG5pZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKFwiUHJvZHVjdHMvU2luZ2xlc1wiKSkge1xuICAgICgwLCBTaW5nbGVzXzEuYWRkTGlua1RvU2luZ2xlcykoKTtcbiAgICAoMCwgU2luZ2xlc18xLmFkZENoZWNrYm94ZXMpKCk7XG59XG5pZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKFwiU2hvcHBpbmdXaXphcmQvUmVzdWx0c1wiKSkge1xuICAgICgwLCBTaG9wcGluZ1dpemFyZF8xLmFkZExpbmtUb0NhcmRzKSgpO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmFkZExpbmtUb0NhcmRzID0gdm9pZCAwO1xuY29uc3Qgc2NyeWZhbGxfMSA9IHJlcXVpcmUoXCIuLi8uLi9jb21tb24vc2NyeWZhbGxcIik7XG5jb25zdCB1dGlsaXRpZXNfMSA9IHJlcXVpcmUoXCIuLi91dGlsaXRpZXNcIik7XG5mdW5jdGlvbiBhZGRMaW5rVG9DYXJkcygpIHtcbiAgICB2YXIgX2EsIF9iO1xuICAgIGZvciAoY29uc3QgdGFibGUgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0Ym9keVwiKSkge1xuICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiB0YWJsZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRyXCIpKSB7XG4gICAgICAgICAgICBjb25zdCBjYXJkX2lkID0gKDAsIHV0aWxpdGllc18xLmdldF9ta21faWQpKHJvdyk7XG4gICAgICAgICAgICBjb25zdCBjYXJkX2VsZW0gPSByb3cuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImNhcmQtbmFtZVwiKVswXTtcbiAgICAgICAgICAgIGNvbnN0IHNldF90eXBlID0gKF9iID0gKF9hID0gcm93LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJleHBhbnNpb24tc3ltYm9sXCIpWzBdKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZ2V0QXR0cmlidXRlKFwiZGF0YS1vcmlnaW5hbC10aXRsZVwiKSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnNwbGl0KFwiOlwiKS5wb3AoKTtcbiAgICAgICAgICAgIGlmIChjYXJkX2lkKSB7XG4gICAgICAgICAgICAgICAgKDAsIHNjcnlmYWxsXzEuZ2V0X2NhcmRtYXJrZXQpKGNhcmRfaWQpLnRoZW4oKGNhcmQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhcmQubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmFtZSA9IGNhcmQubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzZXQgPSBjYXJkLnNldF9uYW1lICsgKHNldF90eXBlID09PSBcIkV4dHJhc1wiIHx8IHNldF90eXBlID09PSBcIlByb21vc1wiID8gc2V0X3R5cGUgOiBcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldCA9IHNldC5yZXBsYWNlKFwiU2V0XCIsIFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBhdGggPSAoc2V0ICsgXCIvXCIgKyBuYW1lKS5yZXBsYWNlKC8gXFwvXFwvIC9nLCBcIi1cIikucmVwbGFjZSgvOi9nLCBcIlwiKS5yZXBsYWNlKC9cXHMrL2csIFwiLVwiKS5yZXBsYWNlKC9cXCcvZywgXCJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdXJsID0gXCJodHRwczovL3d3dy5jYXJkbWFya2V0LmNvbS9NYWdpYy9Qcm9kdWN0cy9TaW5nbGVzL1wiICsgcGF0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcmRfZWxlbS5pbm5lckhUTUwgPSBcIjxhIGhyZWY9J1wiICsgdXJsICsgXCInPlwiICsgbmFtZSArIFwiPC9hPjxicj4vIDxhIGhyZWY9J1wiICsgY2FyZC5wdXJjaGFzZV91cmlzLmNhcmRtYXJrZXQgKyBcIic+QWxsIHByaW50aW5nczwvYT5cIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICgwLCBzY3J5ZmFsbF8xLmZldGNoX3NpbmdsZSkoY2FyZF9lbGVtLmlubmVySFRNTC5yZXBsYWNlKC9cXChWXFwuXFxkK1xcKS9nLCAnJykpLnRoZW4oKGNhcmQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXJkX2VsZW0uaW5uZXJIVE1MICs9IFwiPGJyPi8gPGEgaHJlZj0nXCIgKyBjYXJkLnB1cmNoYXNlX3VyaXMuY2FyZG1hcmtldCArIFwiJz5BbGwgcHJpbnRpbmdzPC9hPlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydHMuYWRkTGlua1RvQ2FyZHMgPSBhZGRMaW5rVG9DYXJkcztcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmFkZENoZWNrYm94ZXMgPSBleHBvcnRzLmFkZExpbmtUb1NpbmdsZXMgPSB2b2lkIDA7XG5jb25zdCB1dGlsaXRpZXNfMSA9IHJlcXVpcmUoXCIuLi8uLi9jb21tb24vdXRpbGl0aWVzXCIpO1xuZnVuY3Rpb24gYWRkTGlua1RvU2luZ2xlcygpIHtcbiAgICBmb3IgKGNvbnN0IHVzZXIgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInNlbGxlci1uYW1lXCIpKSB7XG4gICAgICAgIGNvbnN0IHVzZXJfbGluayA9IHVzZXIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJhXCIpWzBdO1xuICAgICAgICB1c2VyX2xpbmsucGFyZW50RWxlbWVudC5pbm5lckhUTUwgKz0gXCImbmJzcDstJm5ic3A7PGEgaHJlZj0nXCIgKyB1c2VyX2xpbmsuaHJlZiArIFwiL09mZmVycy9TaW5nbGVzLyc+U2luZ2xlczwvYT5cIjtcbiAgICB9XG59XG5leHBvcnRzLmFkZExpbmtUb1NpbmdsZXMgPSBhZGRMaW5rVG9TaW5nbGVzO1xuZnVuY3Rpb24gZ2V0UmVmZXJlbmNlKGRlZmF1bHRfcmVmKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KCdyZWZlcmVuY2UnLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLnJlZmVyZW5jZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShkYXRhLnJlZmVyZW5jZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IHJlZmVyZW5jZTogZGVmYXVsdF9yZWYgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKGRlZmF1bHRfcmVmKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gYWRkQ2hlY2tib3hlcygpIHtcbiAgICB2YXIgX2E7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgbGV0IHJlZmVyZW5jZSA9IHlpZWxkIGdldFJlZmVyZW5jZSgxKTtcbiAgICAgICAgY29uc3QgaW5mbyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJpbmZvLWxpc3QtY29udGFpbmVyXCIpWzBdO1xuICAgICAgICBpZiAoaW5mbykge1xuICAgICAgICAgICAgY29uc3Qgcm93cyA9IGluZm8uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJkZFwiKTtcbiAgICAgICAgICAgIGNvbnN0IG5yb3dzID0gNDtcbiAgICAgICAgICAgIGxldCBwcmljZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnJvd3M7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVsZW0gPSByb3dzW3Jvd3MubGVuZ3RoIC0gbnJvd3MgKyBpXTtcbiAgICAgICAgICAgICAgICBwcmljZXMucHVzaChwYXJzZUZsb2F0KGVsZW0uaW5uZXJIVE1MLm1hdGNoKC9cXGQrXFwsXFxkKy8pWzBdLnJlcGxhY2UoXCIsXCIsIFwiLlwiKSkpO1xuICAgICAgICAgICAgICAgIGVsZW0uaW5uZXJIVE1MICs9IFwiJm5ic3A7PGlucHV0IHR5cGU9J3JhZGlvJyBuYW1lPSdyZWZlcmVuY2UnIHZhbHVlPVwiICsgaSArIChpID09IHJlZmVyZW5jZSA/IFwiIGNoZWNrZWRcIiA6IFwiXCIpICsgXCI+XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb2xvclByaWNlcyhwcmljZXNbcmVmZXJlbmNlXSk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJhZGlvIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25hbWU9XCJyZWZlcmVuY2VcIl0nKSkge1xuICAgICAgICAgICAgICAgIHJhZGlvLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IHJlZmVyZW5jZTogdGhpcy52YWx1ZSB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZSA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBjb2xvclByaWNlcyhwcmljZXNbdGhpcy52YWx1ZV0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgKF9hID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkTW9yZUJ1dHRvblwiKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiAoMCwgdXRpbGl0aWVzXzEuc2xlZXApKDMwMDApLnRoZW4oKCkgPT4gY29sb3JQcmljZXMocHJpY2VzW3JlZmVyZW5jZV0pKSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmV4cG9ydHMuYWRkQ2hlY2tib3hlcyA9IGFkZENoZWNrYm94ZXM7XG5mdW5jdGlvbiBjb2xvclByaWNlcyhyZWZlcmVuY2VfcHJpY2UpIHtcbiAgICB2YXIgX2E7XG4gICAgZm9yIChjb25zdCBlbGVtIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwcmljZS1jb250YWluZXJcIikpIHtcbiAgICAgICAgY29uc3QgcHJpY2VfZWxlbSA9IGVsZW0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImZvbnQtd2VpZ2h0LWJvbGRcIilbMF07XG4gICAgICAgIGNvbnN0IHBsYXlzZXRfZWxlbSA9IHByaWNlX2VsZW0ucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJleHRyYS1zbWFsbFwiKTtcbiAgICAgICAgbGV0IHBwdSA9IDA7XG4gICAgICAgIGlmIChwbGF5c2V0X2VsZW0ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcHB1ID0gcGFyc2VGbG9hdCgoX2EgPSBwbGF5c2V0X2VsZW1bMF0uaW5uZXJIVE1MKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubWF0Y2goL1xcZCsoPzpcXCxcXGQrKT8vZylbMF0ucmVwbGFjZShcIixcIiwgXCIuXCIpKTtcbiAgICAgICAgfVxuICAgICAgICBwcmljZV9lbGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJjb2xvci1wcmltYXJ5XCIpO1xuICAgICAgICBpZiAocHJpY2VfZWxlbSkge1xuICAgICAgICAgICAgaWYgKChwcHUgPiAwICYmIHBwdSA8PSByZWZlcmVuY2VfcHJpY2UpIHx8IHBhcnNlRmxvYXQocHJpY2VfZWxlbS5pbm5lckhUTUwucmVwbGFjZShcIiDigqxcIiwgXCJcIikucmVwbGFjZShcIixcIiwgXCIuXCIpKSA8PSByZWZlcmVuY2VfcHJpY2UpIHtcbiAgICAgICAgICAgICAgICBwcmljZV9lbGVtLnN0eWxlLmNvbG9yID0gXCJncmVlblwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcHJpY2VfZWxlbS5zdHlsZS5jb2xvciA9IFwicmVkXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuc2hvd1RyZW5kID0gdm9pZCAwO1xuY29uc3Qgc2NyeWZhbGxfMSA9IHJlcXVpcmUoXCIuLi8uLi9jb21tb24vc2NyeWZhbGxcIik7XG5jb25zdCB1dGlsaXRpZXNfMSA9IHJlcXVpcmUoXCIuLi91dGlsaXRpZXNcIik7XG5mdW5jdGlvbiBzaG93VHJlbmQoKSB7XG4gICAgdmFyIF9hO1xuICAgIGNvbnN0IHRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJVc2VyT2ZmZXJzVGFibGVcIik7XG4gICAgaWYgKHRhYmxlKSB7XG4gICAgICAgIGNvbnN0IGxlZ2VuZGFfZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgbGVnZW5kYV9kaXYuaW5uZXJIVE1MID0gXCI8aHI+PHAgY2xhc3M9J2ZvbnQtd2VpZ2h0LWJvbGQnPkxlZ2VuZGE6IEUgPSBTdGVzc28gc2V0IC8gTCA9IFByZXp6byBwacO5IGJhc3NvXFwgPGJyPkNvbG9yaTogPHNwYW4gc3R5bGU9J2NvbG9yOiBncmVlbic+UHJlenpvIG1pbm9yZTwvc3Bhbj4gLyA8c3BhbiBzdHlsZT0nY29sb3I6IHJlZCc+UHJlenpvIG1hZ2dpb3JlPC9zcGFuPiAvIDxzcGFuIHN0eWxlPSdjb2xvcjogZGFya3Zpb2xldCc+Rm9pbCBbIDxpPm5vbiBzdXBwb3J0YXRvPC9pPiBdPC9zcGFuPiAvIDxzcGFuIGNsYXNzPSdjb2xvci1wcmltYXJ5Jz5QcmV6em8gbm9uIHRyb3ZhdG88L3NwYW48L3A+XCI7XG4gICAgICAgIHRhYmxlLmJlZm9yZShsZWdlbmRhX2Rpdik7XG4gICAgICAgIGNvbnN0IHJvd3MgPSB0YWJsZS5xdWVyeVNlbGVjdG9yQWxsKCdbaWRePWFydGljbGVSb3ddJyk7XG4gICAgICAgIGZvciAoY29uc3Qgcm93IG9mIHJvd3MpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhcmRfdXJsID0gcm93LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjb2wtc2VsbGVyXCIpWzBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYVwiKVswXS5ocmVmLnNwbGl0KFwiP1wiKVswXS5zcGxpdChcIi9cIik7XG4gICAgICAgICAgICBsZXQgY2FyZF9uYW1lID0gKF9hID0gY2FyZF91cmwucG9wKCkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5yZXBsYWNlKC8tVlxcZCsvLCAnJyk7XG4gICAgICAgICAgICBsZXQgY2FyZF9pZCA9ICgwLCB1dGlsaXRpZXNfMS5nZXRfbWttX2lkKShyb3cpO1xuICAgICAgICAgICAgbGV0IGZvaWwgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChyb3cucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtb3JpZ2luYWwtdGl0bGU9XCJGb2lsXCJdJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGZvaWwgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgUHJvbWlzZS5hbGwoWygwLCBzY3J5ZmFsbF8xLmdldF9jaGVhcGVzdCkoY2FyZF9uYW1lKSwgKDAsIHNjcnlmYWxsXzEuZ2V0X2NhcmRtYXJrZXQpKGNhcmRfaWQpXSkudGhlbihyZXNwb25zZXMgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBfYSwgX2IsIF9jLCBfZCwgX2UsIF9mLCBfZztcbiAgICAgICAgICAgICAgICBjb25zdCBjaGVhcGVzdCA9IHJlc3BvbnNlc1swXTtcbiAgICAgICAgICAgICAgICBjb25zdCBleGFjdCA9IHJlc3BvbnNlc1sxXTtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmljZV9lbGVtID0gcm93LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwcmljZS1jb250YWluZXJcIilbMF0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImZvbnQtd2VpZ2h0LWJvbGRcIilbMF07XG4gICAgICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxfcHJpY2UgPSBwYXJzZUZsb2F0KHByaWNlX2VsZW0uaW5uZXJIVE1MLnJlcGxhY2UoXCIg4oKsXCIsIFwiXCIpLnJlcGxhY2UoXCIsXCIsIFwiLlwiKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgcGxheXNldF9lbGVtID0gcHJpY2VfZWxlbS5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImV4dHJhLXNtYWxsXCIpO1xuICAgICAgICAgICAgICAgIGxldCBwcHUgPSAwO1xuICAgICAgICAgICAgICAgIGlmIChwbGF5c2V0X2VsZW0ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBwcHUgPSBwYXJzZUZsb2F0KChfYSA9IHBsYXlzZXRfZWxlbVswXS5pbm5lckhUTUwpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5tYXRjaCgvXFxkKyg/OlxcLFxcZCspPy9nKVswXS5yZXBsYWNlKFwiLFwiLCBcIi5cIikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgY2hlYXBlc3RfY29sb3IgPSBcIlwiLCBleGFjdF9jb2xvciA9IFwiXCI7XG4gICAgICAgICAgICAgICAgbGV0IGNoZWFwZXN0X3ByaWNlID0gMCwgZXhhY3RfcHJpY2UgPSAwO1xuICAgICAgICAgICAgICAgIGlmIChjaGVhcGVzdCkge1xuICAgICAgICAgICAgICAgICAgICBjaGVhcGVzdF9wcmljZSA9IHBhcnNlRmxvYXQoKF9jID0gKF9iID0gY2hlYXBlc3QucHJpY2VzKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuZXVyKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiAoX2QgPSBjaGVhcGVzdC5wcmljZXMpID09PSBudWxsIHx8IF9kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZC5ldXJfZm9pbCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGVhcGVzdF9wcmljZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hlYXBlc3RfY29sb3IgPSAoZm9pbCA/IFwiZGFya3Zpb2xldFwiIDogY29sb3JfZnJvbV9wcmljZShvcmlnaW5hbF9wcmljZSwgY2hlYXBlc3RfcHJpY2UsIHBwdSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChleGFjdCkge1xuICAgICAgICAgICAgICAgICAgICBleGFjdF9wcmljZSA9IHBhcnNlRmxvYXQoKF9mID0gKF9lID0gZXhhY3QucHJpY2VzKSA9PT0gbnVsbCB8fCBfZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2UuZXVyKSAhPT0gbnVsbCAmJiBfZiAhPT0gdm9pZCAwID8gX2YgOiAoX2cgPSBleGFjdC5wcmljZXMpID09PSBudWxsIHx8IF9nID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZy5ldXJfZm9pbCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChleGFjdF9wcmljZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXhhY3RfY29sb3IgPSAoZm9pbCA/IFwiZGFya3Zpb2xldFwiIDogY29sb3JfZnJvbV9wcmljZShvcmlnaW5hbF9wcmljZSwgZXhhY3RfcHJpY2UsIHBwdSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBvcmlnaW5hbF9jb2xvciA9IGV4YWN0X2NvbG9yIHx8IGNoZWFwZXN0X2NvbG9yO1xuICAgICAgICAgICAgICAgIHByaWNlX2VsZW0uaW5uZXJIVE1MID0gXCI8c3BhbiBzdHlsZT0nY29sb3I6IFwiICsgb3JpZ2luYWxfY29sb3IgKyBcIic+XCIgKyBwcmljZV9lbGVtLmlubmVySFRNTCArIFwiPHNwYW4+XCI7XG4gICAgICAgICAgICAgICAgaWYgKCFmb2lsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChleGFjdF9wcmljZSA+IDAgJiYgY2hlYXBlc3Quc2V0ICE9IGV4YWN0LnNldClcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlX2VsZW0uaW5uZXJIVE1MICs9IFwiPGJyPjxzcGFuIHN0eWxlPSdjb2xvcjogXCIgKyBleGFjdF9jb2xvciArIFwiOycgPkUgPC9zcGFuPjxhIHN0eWxlPSdjb2xvcjogYmxhY2snIGhyZWY9J1wiICsgZXhhY3Quc2NyeWZhbGxfdXJpICsgXCInPiBcIiArIGV4YWN0X3ByaWNlLnRvTG9jYWxlU3RyaW5nKFwiaXQtSVRcIiwgeyBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IDIgfSkgKyBcIiDigqw8L2E+XCI7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGVhcGVzdF9wcmljZSA+IDApXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZV9lbGVtLmlubmVySFRNTCArPSBcIjxicj48c3BhbiBzdHlsZT0nY29sb3I6IFwiICsgY2hlYXBlc3RfY29sb3IgKyBcIjsnPlwiICsgKGNoZWFwZXN0LnNldCA9PSBleGFjdC5zZXQgPyBcIkU9XCIgOiBcIlwiKSArIFwiTCA8L3NwYW4+PGEgc3R5bGU9J2NvbG9yOiBibGFjaycgaHJlZj0nXCIgKyBjaGVhcGVzdC5zY3J5ZmFsbF91cmkgKyBcIic+IFwiICsgY2hlYXBlc3RfcHJpY2UudG9Mb2NhbGVTdHJpbmcoXCJpdC1JVFwiLCB7IG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMiB9KSArIFwiIOKCrDwvYT5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydHMuc2hvd1RyZW5kID0gc2hvd1RyZW5kO1xuZnVuY3Rpb24gY29sb3JfZnJvbV9wcmljZShvbGRfcHJpY2UsIG5ld19wcmljZSwgcHB1KSB7XG4gICAgaWYgKChwcHUgPiAwICYmIHBwdSA+IG5ld19wcmljZSkgfHwgb2xkX3ByaWNlID4gbmV3X3ByaWNlKSB7XG4gICAgICAgIHJldHVybiBcInJlZFwiO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFwiZ3JlZW5cIjtcbiAgICB9XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZ2V0X21rbV9pZCA9IHZvaWQgMDtcbmZ1bmN0aW9uIGdldF9ta21faWQocm93KSB7XG4gICAgdmFyIF9hLCBfYjtcbiAgICByZXR1cm4gKChfYiA9IChfYSA9IHJvdy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZm9udGljb24tY2FtZXJhXCIpWzBdKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZ2V0QXR0cmlidXRlKFwiZGF0YS1vcmlnaW5hbC10aXRsZVwiKSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnNwbGl0KC9cXC5qcGcvZylbMF0uc3BsaXQoXCIvXCIpLnNwbGljZSgtMSlbMF0pIHx8IFwiXCI7XG59XG5leHBvcnRzLmdldF9ta21faWQgPSBnZXRfbWttX2lkO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwiY2FyZG1hcmtldC9jb250ZW50X3NjcmlwdFwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZHNbaV1dID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rYm9yaXNcIl0gPSBzZWxmW1wid2VicGFja0NodW5rYm9yaXNcIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvclwiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9jYXJkbWFya2V0L2NvbnRlbnRfc2NyaXB0LnRzXCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
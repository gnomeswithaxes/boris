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
        const playset_elem = price_elem.parentElement.parentElement.getElementsByClassName("text-muted");
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
                const playset_elem = price_elem.parentElement.parentElement.getElementsByClassName("text-muted");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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a0I7Ozs7Ozs7VUNQbEI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOzs7OztXQ3pCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLCtCQUErQix3Q0FBd0M7V0FDdkU7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQkFBaUIscUJBQXFCO1dBQ3RDO1dBQ0E7V0FDQSxrQkFBa0IscUJBQXFCO1dBQ3ZDO1dBQ0E7V0FDQSxLQUFLO1dBQ0w7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQzNCQTs7Ozs7V0NBQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTSxxQkFBcUI7V0FDM0I7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7Ozs7O1VFaERBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ib3Jpcy8uL3NyYy9jYXJkbWFya2V0L2NvbnRlbnRfc2NyaXB0LnRzIiwid2VicGFjazovL2JvcmlzLy4vc3JjL2NhcmRtYXJrZXQvcGFnZXMvU2hvcHBpbmdXaXphcmQudHMiLCJ3ZWJwYWNrOi8vYm9yaXMvLi9zcmMvY2FyZG1hcmtldC9wYWdlcy9TaW5nbGVzLnRzIiwid2VicGFjazovL2JvcmlzLy4vc3JjL2NhcmRtYXJrZXQvcGFnZXMvVXNlcnMudHMiLCJ3ZWJwYWNrOi8vYm9yaXMvLi9zcmMvY2FyZG1hcmtldC91dGlsaXRpZXMudHMiLCJ3ZWJwYWNrOi8vYm9yaXMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYm9yaXMvd2VicGFjay9ydW50aW1lL2NodW5rIGxvYWRlZCIsIndlYnBhY2s6Ly9ib3Jpcy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JvcmlzL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2JvcmlzL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vYm9yaXMvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2JvcmlzL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IFVzZXJzXzEgPSByZXF1aXJlKFwiLi9wYWdlcy9Vc2Vyc1wiKTtcbmNvbnN0IFNpbmdsZXNfMSA9IHJlcXVpcmUoXCIuL3BhZ2VzL1NpbmdsZXNcIik7XG5jb25zdCBTaG9wcGluZ1dpemFyZF8xID0gcmVxdWlyZShcIi4vcGFnZXMvU2hvcHBpbmdXaXphcmRcIik7XG5pZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKFwiVXNlcnNcIikpIHtcbiAgICAoMCwgVXNlcnNfMS5zaG93VHJlbmQpKCk7XG59XG5pZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKFwiUHJvZHVjdHMvU2luZ2xlc1wiKSkge1xuICAgICgwLCBTaW5nbGVzXzEuYWRkTGlua1RvU2luZ2xlcykoKTtcbiAgICAoMCwgU2luZ2xlc18xLmFkZENoZWNrYm94ZXMpKCk7XG59XG5pZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKFwiU2hvcHBpbmdXaXphcmQvUmVzdWx0c1wiKSkge1xuICAgICgwLCBTaG9wcGluZ1dpemFyZF8xLmFkZExpbmtUb0NhcmRzKSgpO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmFkZExpbmtUb0NhcmRzID0gdm9pZCAwO1xuY29uc3Qgc2NyeWZhbGxfMSA9IHJlcXVpcmUoXCIuLi8uLi9jb21tb24vc2NyeWZhbGxcIik7XG5jb25zdCB1dGlsaXRpZXNfMSA9IHJlcXVpcmUoXCIuLi91dGlsaXRpZXNcIik7XG5mdW5jdGlvbiBhZGRMaW5rVG9DYXJkcygpIHtcbiAgICB2YXIgX2EsIF9iO1xuICAgIGZvciAoY29uc3QgdGFibGUgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0Ym9keVwiKSkge1xuICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiB0YWJsZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRyXCIpKSB7XG4gICAgICAgICAgICBjb25zdCBjYXJkX2lkID0gKDAsIHV0aWxpdGllc18xLmdldF9ta21faWQpKHJvdyk7XG4gICAgICAgICAgICBjb25zdCBjYXJkX2VsZW0gPSByb3cuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImNhcmQtbmFtZVwiKVswXTtcbiAgICAgICAgICAgIGNvbnN0IHNldF90eXBlID0gKF9iID0gKF9hID0gcm93LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJleHBhbnNpb24tc3ltYm9sXCIpWzBdKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZ2V0QXR0cmlidXRlKFwiZGF0YS1vcmlnaW5hbC10aXRsZVwiKSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnNwbGl0KFwiOlwiKS5wb3AoKTtcbiAgICAgICAgICAgIGlmIChjYXJkX2lkKSB7XG4gICAgICAgICAgICAgICAgKDAsIHNjcnlmYWxsXzEuZ2V0X2NhcmRtYXJrZXQpKGNhcmRfaWQpLnRoZW4oKGNhcmQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhcmQubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmFtZSA9IGNhcmQubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzZXQgPSBjYXJkLnNldF9uYW1lICsgKHNldF90eXBlID09PSBcIkV4dHJhc1wiIHx8IHNldF90eXBlID09PSBcIlByb21vc1wiID8gc2V0X3R5cGUgOiBcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldCA9IHNldC5yZXBsYWNlKFwiU2V0XCIsIFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBhdGggPSAoc2V0ICsgXCIvXCIgKyBuYW1lKS5yZXBsYWNlKC8gXFwvXFwvIC9nLCBcIi1cIikucmVwbGFjZSgvOi9nLCBcIlwiKS5yZXBsYWNlKC9cXHMrL2csIFwiLVwiKS5yZXBsYWNlKC9cXCcvZywgXCJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdXJsID0gXCJodHRwczovL3d3dy5jYXJkbWFya2V0LmNvbS9NYWdpYy9Qcm9kdWN0cy9TaW5nbGVzL1wiICsgcGF0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcmRfZWxlbS5pbm5lckhUTUwgPSBcIjxhIGhyZWY9J1wiICsgdXJsICsgXCInPlwiICsgbmFtZSArIFwiPC9hPjxicj4vIDxhIGhyZWY9J1wiICsgY2FyZC5wdXJjaGFzZV91cmlzLmNhcmRtYXJrZXQgKyBcIic+QWxsIHByaW50aW5nczwvYT5cIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICgwLCBzY3J5ZmFsbF8xLmZldGNoX3NpbmdsZSkoY2FyZF9lbGVtLmlubmVySFRNTC5yZXBsYWNlKC9cXChWXFwuXFxkK1xcKS9nLCAnJykpLnRoZW4oKGNhcmQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXJkX2VsZW0uaW5uZXJIVE1MICs9IFwiPGJyPi8gPGEgaHJlZj0nXCIgKyBjYXJkLnB1cmNoYXNlX3VyaXMuY2FyZG1hcmtldCArIFwiJz5BbGwgcHJpbnRpbmdzPC9hPlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydHMuYWRkTGlua1RvQ2FyZHMgPSBhZGRMaW5rVG9DYXJkcztcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmFkZENoZWNrYm94ZXMgPSBleHBvcnRzLmFkZExpbmtUb1NpbmdsZXMgPSB2b2lkIDA7XG5jb25zdCB1dGlsaXRpZXNfMSA9IHJlcXVpcmUoXCIuLi8uLi9jb21tb24vdXRpbGl0aWVzXCIpO1xuZnVuY3Rpb24gYWRkTGlua1RvU2luZ2xlcygpIHtcbiAgICBmb3IgKGNvbnN0IHVzZXIgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInNlbGxlci1uYW1lXCIpKSB7XG4gICAgICAgIGNvbnN0IHVzZXJfbGluayA9IHVzZXIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJhXCIpWzBdO1xuICAgICAgICB1c2VyX2xpbmsucGFyZW50RWxlbWVudC5pbm5lckhUTUwgKz0gXCImbmJzcDstJm5ic3A7PGEgaHJlZj0nXCIgKyB1c2VyX2xpbmsuaHJlZiArIFwiL09mZmVycy9TaW5nbGVzLyc+U2luZ2xlczwvYT5cIjtcbiAgICB9XG59XG5leHBvcnRzLmFkZExpbmtUb1NpbmdsZXMgPSBhZGRMaW5rVG9TaW5nbGVzO1xuZnVuY3Rpb24gZ2V0UmVmZXJlbmNlKGRlZmF1bHRfcmVmKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KCdyZWZlcmVuY2UnLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLnJlZmVyZW5jZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShkYXRhLnJlZmVyZW5jZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IHJlZmVyZW5jZTogZGVmYXVsdF9yZWYgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKGRlZmF1bHRfcmVmKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gYWRkQ2hlY2tib3hlcygpIHtcbiAgICB2YXIgX2E7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgbGV0IHJlZmVyZW5jZSA9IHlpZWxkIGdldFJlZmVyZW5jZSgxKTtcbiAgICAgICAgY29uc3QgaW5mbyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJpbmZvLWxpc3QtY29udGFpbmVyXCIpWzBdO1xuICAgICAgICBpZiAoaW5mbykge1xuICAgICAgICAgICAgY29uc3Qgcm93cyA9IGluZm8uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJkZFwiKTtcbiAgICAgICAgICAgIGNvbnN0IG5yb3dzID0gNDtcbiAgICAgICAgICAgIGxldCBwcmljZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnJvd3M7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVsZW0gPSByb3dzW3Jvd3MubGVuZ3RoIC0gbnJvd3MgKyBpXTtcbiAgICAgICAgICAgICAgICBwcmljZXMucHVzaChwYXJzZUZsb2F0KGVsZW0uaW5uZXJIVE1MLm1hdGNoKC9cXGQrXFwsXFxkKy8pWzBdLnJlcGxhY2UoXCIsXCIsIFwiLlwiKSkpO1xuICAgICAgICAgICAgICAgIGVsZW0uaW5uZXJIVE1MICs9IFwiJm5ic3A7PGlucHV0IHR5cGU9J3JhZGlvJyBuYW1lPSdyZWZlcmVuY2UnIHZhbHVlPVwiICsgaSArIChpID09IHJlZmVyZW5jZSA/IFwiIGNoZWNrZWRcIiA6IFwiXCIpICsgXCI+XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb2xvclByaWNlcyhwcmljZXNbcmVmZXJlbmNlXSk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJhZGlvIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25hbWU9XCJyZWZlcmVuY2VcIl0nKSkge1xuICAgICAgICAgICAgICAgIHJhZGlvLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IHJlZmVyZW5jZTogdGhpcy52YWx1ZSB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZSA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBjb2xvclByaWNlcyhwcmljZXNbdGhpcy52YWx1ZV0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgKF9hID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkTW9yZUJ1dHRvblwiKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiAoMCwgdXRpbGl0aWVzXzEuc2xlZXApKDMwMDApLnRoZW4oKCkgPT4gY29sb3JQcmljZXMocHJpY2VzW3JlZmVyZW5jZV0pKSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmV4cG9ydHMuYWRkQ2hlY2tib3hlcyA9IGFkZENoZWNrYm94ZXM7XG5mdW5jdGlvbiBjb2xvclByaWNlcyhyZWZlcmVuY2VfcHJpY2UpIHtcbiAgICB2YXIgX2E7XG4gICAgZm9yIChjb25zdCBlbGVtIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwcmljZS1jb250YWluZXJcIikpIHtcbiAgICAgICAgY29uc3QgcHJpY2VfZWxlbSA9IGVsZW0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImZvbnQtd2VpZ2h0LWJvbGRcIilbMF07XG4gICAgICAgIGNvbnN0IHBsYXlzZXRfZWxlbSA9IHByaWNlX2VsZW0ucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ0ZXh0LW11dGVkXCIpO1xuICAgICAgICBsZXQgcHB1ID0gMDtcbiAgICAgICAgaWYgKHBsYXlzZXRfZWxlbS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBwcHUgPSBwYXJzZUZsb2F0KChfYSA9IHBsYXlzZXRfZWxlbVswXS5pbm5lckhUTUwpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5tYXRjaCgvXFxkKyg/OlxcLFxcZCspPy9nKVswXS5yZXBsYWNlKFwiLFwiLCBcIi5cIikpO1xuICAgICAgICB9XG4gICAgICAgIHByaWNlX2VsZW0uY2xhc3NMaXN0LnJlbW92ZShcImNvbG9yLXByaW1hcnlcIik7XG4gICAgICAgIGlmIChwcmljZV9lbGVtKSB7XG4gICAgICAgICAgICBpZiAoKHBwdSA+IDAgJiYgcHB1IDw9IHJlZmVyZW5jZV9wcmljZSkgfHwgcGFyc2VGbG9hdChwcmljZV9lbGVtLmlubmVySFRNTC5yZXBsYWNlKFwiIOKCrFwiLCBcIlwiKS5yZXBsYWNlKFwiLFwiLCBcIi5cIikpIDw9IHJlZmVyZW5jZV9wcmljZSkge1xuICAgICAgICAgICAgICAgIHByaWNlX2VsZW0uc3R5bGUuY29sb3IgPSBcImdyZWVuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwcmljZV9lbGVtLnN0eWxlLmNvbG9yID0gXCJyZWRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5zaG93VHJlbmQgPSB2b2lkIDA7XG5jb25zdCBzY3J5ZmFsbF8xID0gcmVxdWlyZShcIi4uLy4uL2NvbW1vbi9zY3J5ZmFsbFwiKTtcbmNvbnN0IHV0aWxpdGllc18xID0gcmVxdWlyZShcIi4uL3V0aWxpdGllc1wiKTtcbmZ1bmN0aW9uIHNob3dUcmVuZCgpIHtcbiAgICB2YXIgX2E7XG4gICAgY29uc3QgdGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIlVzZXJPZmZlcnNUYWJsZVwiKTtcbiAgICBpZiAodGFibGUpIHtcbiAgICAgICAgY29uc3QgbGVnZW5kYV9kaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBsZWdlbmRhX2Rpdi5pbm5lckhUTUwgPSBcIjxocj48cCBjbGFzcz0nZm9udC13ZWlnaHQtYm9sZCc+TGVnZW5kYTogRSA9IFN0ZXNzbyBzZXQgLyBMID0gUHJlenpvIHBpw7kgYmFzc29cXCA8YnI+Q29sb3JpOiA8c3BhbiBzdHlsZT0nY29sb3I6IGdyZWVuJz5QcmV6em8gbWlub3JlPC9zcGFuPiAvIDxzcGFuIHN0eWxlPSdjb2xvcjogcmVkJz5QcmV6em8gbWFnZ2lvcmU8L3NwYW4+IC8gPHNwYW4gc3R5bGU9J2NvbG9yOiBkYXJrdmlvbGV0Jz5Gb2lsIFsgPGk+bm9uIHN1cHBvcnRhdG88L2k+IF08L3NwYW4+IC8gPHNwYW4gY2xhc3M9J2NvbG9yLXByaW1hcnknPlByZXp6byBub24gdHJvdmF0bzwvc3BhbjwvcD5cIjtcbiAgICAgICAgdGFibGUuYmVmb3JlKGxlZ2VuZGFfZGl2KTtcbiAgICAgICAgY29uc3Qgcm93cyA9IHRhYmxlLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tpZF49YXJ0aWNsZVJvd10nKTtcbiAgICAgICAgZm9yIChjb25zdCByb3cgb2Ygcm93cykge1xuICAgICAgICAgICAgY29uc3QgY2FyZF91cmwgPSByb3cuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImNvbC1zZWxsZXJcIilbMF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJhXCIpWzBdLmhyZWYuc3BsaXQoXCI/XCIpWzBdLnNwbGl0KFwiL1wiKTtcbiAgICAgICAgICAgIGxldCBjYXJkX25hbWUgPSAoX2EgPSBjYXJkX3VybC5wb3AoKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnJlcGxhY2UoLy1WXFxkKy8sICcnKTtcbiAgICAgICAgICAgIGxldCBjYXJkX2lkID0gKDAsIHV0aWxpdGllc18xLmdldF9ta21faWQpKHJvdyk7XG4gICAgICAgICAgICBsZXQgZm9pbCA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKHJvdy5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1vcmlnaW5hbC10aXRsZT1cIkZvaWxcIl0nKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9pbCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBQcm9taXNlLmFsbChbKDAsIHNjcnlmYWxsXzEuZ2V0X2NoZWFwZXN0KShjYXJkX25hbWUpLCAoMCwgc2NyeWZhbGxfMS5nZXRfY2FyZG1hcmtldCkoY2FyZF9pZCldKS50aGVuKHJlc3BvbnNlcyA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZSwgX2YsIF9nO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNoZWFwZXN0ID0gcmVzcG9uc2VzWzBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4YWN0ID0gcmVzcG9uc2VzWzFdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHByaWNlX2VsZW0gPSByb3cuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInByaWNlLWNvbnRhaW5lclwiKVswXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZm9udC13ZWlnaHQtYm9sZFwiKVswXTtcbiAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW5hbF9wcmljZSA9IHBhcnNlRmxvYXQocHJpY2VfZWxlbS5pbm5lckhUTUwucmVwbGFjZShcIiDigqxcIiwgXCJcIikucmVwbGFjZShcIixcIiwgXCIuXCIpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBwbGF5c2V0X2VsZW0gPSBwcmljZV9lbGVtLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwidGV4dC1tdXRlZFwiKTtcbiAgICAgICAgICAgICAgICBsZXQgcHB1ID0gMDtcbiAgICAgICAgICAgICAgICBpZiAocGxheXNldF9lbGVtLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcHB1ID0gcGFyc2VGbG9hdCgoX2EgPSBwbGF5c2V0X2VsZW1bMF0uaW5uZXJIVE1MKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubWF0Y2goL1xcZCsoPzpcXCxcXGQrKT8vZylbMF0ucmVwbGFjZShcIixcIiwgXCIuXCIpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IGNoZWFwZXN0X2NvbG9yID0gXCJcIiwgZXhhY3RfY29sb3IgPSBcIlwiO1xuICAgICAgICAgICAgICAgIGxldCBjaGVhcGVzdF9wcmljZSA9IDAsIGV4YWN0X3ByaWNlID0gMDtcbiAgICAgICAgICAgICAgICBpZiAoY2hlYXBlc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hlYXBlc3RfcHJpY2UgPSBwYXJzZUZsb2F0KChfYyA9IChfYiA9IGNoZWFwZXN0LnByaWNlcykgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmV1cikgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDogKF9kID0gY2hlYXBlc3QucHJpY2VzKSA9PT0gbnVsbCB8fCBfZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2QuZXVyX2ZvaWwpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hlYXBlc3RfcHJpY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWFwZXN0X2NvbG9yID0gKGZvaWwgPyBcImRhcmt2aW9sZXRcIiA6IGNvbG9yX2Zyb21fcHJpY2Uob3JpZ2luYWxfcHJpY2UsIGNoZWFwZXN0X3ByaWNlLCBwcHUpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZXhhY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgZXhhY3RfcHJpY2UgPSBwYXJzZUZsb2F0KChfZiA9IChfZSA9IGV4YWN0LnByaWNlcykgPT09IG51bGwgfHwgX2UgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9lLmV1cikgIT09IG51bGwgJiYgX2YgIT09IHZvaWQgMCA/IF9mIDogKF9nID0gZXhhY3QucHJpY2VzKSA9PT0gbnVsbCB8fCBfZyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2cuZXVyX2ZvaWwpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXhhY3RfcHJpY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4YWN0X2NvbG9yID0gKGZvaWwgPyBcImRhcmt2aW9sZXRcIiA6IGNvbG9yX2Zyb21fcHJpY2Uob3JpZ2luYWxfcHJpY2UsIGV4YWN0X3ByaWNlLCBwcHUpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgb3JpZ2luYWxfY29sb3IgPSBleGFjdF9jb2xvciB8fCBjaGVhcGVzdF9jb2xvcjtcbiAgICAgICAgICAgICAgICBwcmljZV9lbGVtLmlubmVySFRNTCA9IFwiPHNwYW4gc3R5bGU9J2NvbG9yOiBcIiArIG9yaWdpbmFsX2NvbG9yICsgXCInPlwiICsgcHJpY2VfZWxlbS5pbm5lckhUTUwgKyBcIjxzcGFuPlwiO1xuICAgICAgICAgICAgICAgIGlmICghZm9pbCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXhhY3RfcHJpY2UgPiAwICYmIGNoZWFwZXN0LnNldCAhPSBleGFjdC5zZXQpXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZV9lbGVtLmlubmVySFRNTCArPSBcIjxicj48c3BhbiBzdHlsZT0nY29sb3I6IFwiICsgZXhhY3RfY29sb3IgKyBcIjsnID5FIDwvc3Bhbj48YSBzdHlsZT0nY29sb3I6IGJsYWNrJyBocmVmPSdcIiArIGV4YWN0LnNjcnlmYWxsX3VyaSArIFwiJz4gXCIgKyBleGFjdF9wcmljZS50b0xvY2FsZVN0cmluZyhcIml0LUlUXCIsIHsgbWluaW11bUZyYWN0aW9uRGlnaXRzOiAyIH0pICsgXCIg4oKsPC9hPlwiO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hlYXBlc3RfcHJpY2UgPiAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2VfZWxlbS5pbm5lckhUTUwgKz0gXCI8YnI+PHNwYW4gc3R5bGU9J2NvbG9yOiBcIiArIGNoZWFwZXN0X2NvbG9yICsgXCI7Jz5cIiArIChjaGVhcGVzdC5zZXQgPT0gZXhhY3Quc2V0ID8gXCJFPVwiIDogXCJcIikgKyBcIkwgPC9zcGFuPjxhIHN0eWxlPSdjb2xvcjogYmxhY2snIGhyZWY9J1wiICsgY2hlYXBlc3Quc2NyeWZhbGxfdXJpICsgXCInPiBcIiArIGNoZWFwZXN0X3ByaWNlLnRvTG9jYWxlU3RyaW5nKFwiaXQtSVRcIiwgeyBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IDIgfSkgKyBcIiDigqw8L2E+XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnRzLnNob3dUcmVuZCA9IHNob3dUcmVuZDtcbmZ1bmN0aW9uIGNvbG9yX2Zyb21fcHJpY2Uob2xkX3ByaWNlLCBuZXdfcHJpY2UsIHBwdSkge1xuICAgIGlmICgocHB1ID4gMCAmJiBwcHUgPiBuZXdfcHJpY2UpIHx8IG9sZF9wcmljZSA+IG5ld19wcmljZSkge1xuICAgICAgICByZXR1cm4gXCJyZWRcIjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBcImdyZWVuXCI7XG4gICAgfVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdldF9ta21faWQgPSB2b2lkIDA7XG5mdW5jdGlvbiBnZXRfbWttX2lkKHJvdykge1xuICAgIHZhciBfYSwgX2I7XG4gICAgcmV0dXJuICgoX2IgPSAoX2EgPSByb3cuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImZvbnRpY29uLWNhbWVyYVwiKVswXSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmdldEF0dHJpYnV0ZShcImRhdGEtb3JpZ2luYWwtdGl0bGVcIikpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5zcGxpdCgvXFwuanBnL2cpWzBdLnNwbGl0KFwiL1wiKS5zcGxpY2UoLTEpWzBdKSB8fCBcIlwiO1xufVxuZXhwb3J0cy5nZXRfbWttX2lkID0gZ2V0X21rbV9pZDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcImNhcmRtYXJrZXQvY29udGVudF9zY3JpcHRcIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRzW2ldXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua2JvcmlzXCJdID0gc2VsZltcIndlYnBhY2tDaHVua2JvcmlzXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvY2FyZG1hcmtldC9jb250ZW50X3NjcmlwdC50c1wiKSkpXG5fX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9
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
const Wants_1 = __webpack_require__(/*! ./pages/Wants */ "./src/cardmarket/pages/Wants.ts");
if (window.location.pathname.includes("Users")) {
    (0, Users_1.showTrend)();
}
if (window.location.pathname.includes("Products/Singles")) {
    (0, Singles_1.addLinkToSingles)();
    (0, Singles_1.addCheckboxes)();
}
if (window.location.pathname.includes("Cards/")) {
    (0, Singles_1.addLinkToSingles)();
}
if (window.location.pathname.includes("ShoppingWizard/Results")) {
    (0, Singles_1.addLinkToSingles)();
    chrome.storage.sync.get('shoppingWizard', (data) => {
        if (data.shoppingWizard) {
            (0, ShoppingWizard_1.addDisclaimer)();
            (0, ShoppingWizard_1.addLinkToCards)();
        }
    });
}
if (/\S+\/Wants\/\d+/.test(window.location.pathname)) {
    (0, Wants_1.addPrintListButton)();
    (0, Wants_1.saveAllUrls)();
}


/***/ }),

/***/ "./src/cardmarket/pages/ShoppingWizard.ts":
/*!************************************************!*\
  !*** ./src/cardmarket/pages/ShoppingWizard.ts ***!
  \************************************************/
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
exports.addLinkToCards = exports.addDisclaimer = void 0;
const scryfall_1 = __webpack_require__(/*! ../../common/scryfall */ "./src/common/scryfall.ts");
const utilities_1 = __webpack_require__(/*! ../utilities */ "./src/cardmarket/utilities.ts");
function addDisclaimer() {
    const section = document.getElementsByClassName("card-columns")[0];
    const disclaimer = document.createElement("h4");
    disclaimer.innerHTML = "<i style='color: red;'>Due to some limitations, some links may not work or be wrong</i><hr>";
    section.before(disclaimer);
}
exports.addDisclaimer = addDisclaimer;
function addLinkToCards() {
    chrome.storage.local.get(["urls"], (result) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        let saved_urls = (_a = result.urls) !== null && _a !== void 0 ? _a : [];
        for (const table of document.getElementsByTagName("tbody")) {
            for (const row of table.getElementsByTagName("tr")) {
                const card_id = (0, utilities_1.get_mkm_id)(row);
                const card_version = (0, utilities_1.get_mkm_version)(row);
                const card_elem = row.getElementsByClassName("card-name")[0];
                const set_title = (_b = row.getElementsByClassName("expansion-symbol")[0]) === null || _b === void 0 ? void 0 : _b.getAttribute("data-original-title");
                if (card_id) {
                    yield (0, scryfall_1.get_cardmarket)(card_id).then((card) => __awaiter(this, void 0, void 0, function* () {
                        const saved = saved_urls.filter((u) => u.mkm_id == card_id);
                        const url = saved.length > 0 ? saved[0].url : (yield format_url(card, card_version, set_title || ""));
                        if (url) {
                            card_elem.innerHTML = "<a href='" + url + "' target='_blank'>" + card.name + "</a><br>/ <a href='" + card.purchase_uris.cardmarket + "' target='_blank'>All printings</a>";
                            if (saved_urls.filter((u) => u.mkm_id == card_id).length == 0) {
                                saved_urls.push({ name: card.name, mkm_id: card_id, url: url });
                            }
                        }
                        else {
                            (0, scryfall_1.fetch_single)(card_elem.innerHTML.replace(/\(V\.\d+\)/g, '')).then((card) => {
                                card_elem.innerHTML = "<a href='" + card.purchase_uris.cardmarket + "' target='_blank'>" + card.name + "<br>(All)</a>";
                            });
                        }
                    }));
                }
            }
        }
        chrome.storage.local.set({ "urls": saved_urls });
    }));
}
exports.addLinkToCards = addLinkToCards;
function format_url(card, version, set_title) {
    return __awaiter(this, void 0, void 0, function* () {
        if (card.name) {
            let name = card.name;
            let set = "";
            if (version) {
                set = set_title;
                name += " V" + version;
            }
            else {
                const set_type = set_title === null || set_title === void 0 ? void 0 : set_title.split(":").pop();
                if (!card.set_name.includes("Extras") && !card.set_name.includes("Promos")) {
                    set = card.set_name + ((set_type && (set_type.includes("Extras") || set_type.includes("Promos"))) ? set_type : "");
                }
                else {
                    set = card.set_name;
                }
            }
            set = set.replace(" Set ", " ");
            let path = (set + "/" + name).replace(/ \/\/ /g, "-").replace(/:/g, "").replace(/,/g, "").replace(/\s+/g, "-");
            let url = "https://www.cardmarket.com/Magic/Products/Singles/" + path;
            if (url.includes("\'")) {
                const new_url = url.replace(/\'/g, "");
                return yield fetch(new_url).then((r) => __awaiter(this, void 0, void 0, function* () {
                    if (r.ok && urls_are_equal(r.url, new_url)) {
                        return new_url;
                    }
                    else {
                        const new_url = url.replace(/\'/g, "-");
                        return yield fetch(new_url).then(r => {
                            if (r.ok && urls_are_equal(r.url, new_url)) {
                                return new_url;
                            }
                            else {
                                return "";
                            }
                        });
                    }
                }));
            }
            else {
                return url;
            }
        }
        return "";
    });
}
function urls_are_equal(url1, url2) {
    return url1.split("/").slice(-1)[0] == url2.split("/").slice(-1)[0];
}


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
const utilities_2 = __webpack_require__(/*! ../utilities */ "./src/cardmarket/utilities.ts");
function addLinkToSingles() {
    for (const user of document.getElementsByClassName("seller-name")) {
        const user_link = user.getElementsByTagName("a")[0];
        user_link.parentElement.innerHTML += "&nbsp;-&nbsp;<a href='" + user_link.href + "/Offers/Singles/' target='_blank'>Singles</a>";
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
                prices.push((0, utilities_2.parsePrice)(elem.innerHTML));
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
    for (const elem of document.getElementsByClassName("price-container")) {
        const price_elem = elem.getElementsByClassName("font-weight-bold")[0];
        const playset_elem = price_elem.parentElement.parentElement.getElementsByClassName("text-muted");
        let ppu = 0;
        if (playset_elem.length > 0) {
            ppu = (0, utilities_2.parsePPU)(playset_elem[0].innerHTML);
        }
        price_elem.classList.remove("color-primary");
        if (price_elem) {
            if ((ppu > 0 && ppu <= reference_price) || (0, utilities_2.parsePrice)(price_elem.innerHTML.replace(" €", "")) <= reference_price) {
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
        legenda_div.innerHTML = "<hr><p class='font-weight-bold'>E = Exact set / L = Lowest Availble\ <br><span style='color: green'>Lower price</span> / <span style='color: red'>Higher price</span> / <span style='color: darkviolet'>Foil [ <i>not supported</i> ]</span> / <span class='color-primary'>Price not found</span</p>";
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
                var _a, _b, _c, _d, _e, _f;
                const cheapest = responses[0];
                const exact = responses[1];
                const price_elem = row.getElementsByClassName("price-container")[0].getElementsByClassName("font-weight-bold")[0];
                const original_price = (0, utilities_1.parsePrice)(price_elem.innerHTML.replace(" €", ""));
                const playset_elem = price_elem.parentElement.parentElement.getElementsByClassName("text-muted");
                let ppu = 0;
                if (playset_elem.length > 0) {
                    ppu = (0, utilities_1.parsePPU)(playset_elem[0].innerHTML);
                }
                let cheapest_color = "", exact_color = "";
                let cheapest_price = 0, exact_price = 0;
                if (cheapest) {
                    cheapest_price = parseFloat((_b = (_a = cheapest.prices) === null || _a === void 0 ? void 0 : _a.eur) !== null && _b !== void 0 ? _b : (_c = cheapest.prices) === null || _c === void 0 ? void 0 : _c.eur_foil);
                    if (cheapest_price) {
                        cheapest_color = (foil ? "darkviolet" : color_from_price(original_price, cheapest_price, ppu));
                    }
                }
                if (exact) {
                    exact_price = parseFloat((_e = (_d = exact.prices) === null || _d === void 0 ? void 0 : _d.eur) !== null && _e !== void 0 ? _e : (_f = exact.prices) === null || _f === void 0 ? void 0 : _f.eur_foil);
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

/***/ "./src/cardmarket/pages/Wants.ts":
/*!***************************************!*\
  !*** ./src/cardmarket/pages/Wants.ts ***!
  \***************************************/
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
exports.saveAllUrls = exports.addPrintListButton = void 0;
const scryfall_1 = __webpack_require__(/*! ../../common/scryfall */ "./src/common/scryfall.ts");
const utilities_1 = __webpack_require__(/*! ../../common/utilities */ "./src/common/utilities.ts");
const utilities_2 = __webpack_require__(/*! ../utilities */ "./src/cardmarket/utilities.ts");
function addPrintListButton() {
    const btn = document.querySelectorAll("a[href$='AddDeckList']")[0]; // $= --> ending with
    btn.classList.add("mr-3");
    const printBtn = document.createElement("div");
    printBtn.classList.add("btn");
    printBtn.style.color = "rgb(240, 173, 78)";
    printBtn.style.borderColor = "rgb(240, 173, 78)";
    printBtn.innerHTML = "<span>Save as...</span>";
    printBtn.addEventListener("click", () => {
        chrome.storage.sync.get('printVersion', (data) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const wants_title = document.getElementsByClassName("page-title-container")[0].getElementsByTagName("h1")[0].innerHTML;
            let list = "";
            const printVersion = (_a = data.printVersion) !== null && _a !== void 0 ? _a : false;
            if (printVersion) {
                for (const row of (_b = document.getElementById("WantsListTable")) === null || _b === void 0 ? void 0 : _b.getElementsByTagName("tbody")[0].getElementsByClassName("name")) {
                    let name = row.getElementsByTagName("a")[0].innerHTML;
                    list += name + "\n";
                }
            }
            else {
                for (const row of (_c = document.getElementById("WantsListTable")) === null || _c === void 0 ? void 0 : _c.getElementsByTagName("tbody")[0].getElementsByTagName("tr")) {
                    const card_id = (0, utilities_2.get_mkm_id)(row);
                    if (card_id) {
                        yield (0, scryfall_1.get_cardmarket)(card_id).then((card) => __awaiter(this, void 0, void 0, function* () {
                            var _d;
                            list += ((_d = card.name) !== null && _d !== void 0 ? _d : "") + "\n";
                        }));
                    }
                }
            }
            (0, utilities_1.saveWithFilePicker)(new Blob([list]), wants_title ? wants_title + ".txt" : "wants.txt");
        }));
    });
    btn.after(printBtn);
}
exports.addPrintListButton = addPrintListButton;
function saveAllUrls() {
    chrome.storage.local.get(["urls"], (result) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        let saved_urls = (_a = result.urls) !== null && _a !== void 0 ? _a : [];
        for (const row of (_b = document.getElementById("WantsListTable")) === null || _b === void 0 ? void 0 : _b.getElementsByTagName("tbody")[0].getElementsByTagName("tr")) {
            const card_id = (0, utilities_2.get_mkm_id)(row);
            const card_url = (0, utilities_2.get_mkm_url)(row);
            if (card_id && card_url) {
                yield (0, scryfall_1.get_cardmarket)(card_id).then((card) => __awaiter(this, void 0, void 0, function* () {
                    if (card.name) {
                        if (saved_urls.filter((u) => u.mkm_id == card_id).length == 0) {
                            saved_urls.push({ name: card.name, mkm_id: card_id, url: card_url });
                        }
                    }
                }));
            }
        }
        chrome.storage.local.set({ "urls": saved_urls });
    }));
}
exports.saveAllUrls = saveAllUrls;


/***/ }),

/***/ "./src/cardmarket/utilities.ts":
/*!*************************************!*\
  !*** ./src/cardmarket/utilities.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parsePPU = exports.parsePrice = exports.get_mkm_url = exports.get_mkm_version = exports.get_mkm_id = void 0;
function get_mkm_id(row) {
    var _a, _b;
    return ((_b = (_a = row.getElementsByClassName("fonticon-camera")[0]) === null || _a === void 0 ? void 0 : _a.getAttribute("data-original-title")) === null || _b === void 0 ? void 0 : _b.split(/\.jpg/g)[0].split("/").splice(-1)[0]) || "";
}
exports.get_mkm_id = get_mkm_id;
function get_mkm_version(row) {
    var _a, _b;
    const alt = ((_b = (_a = row.getElementsByClassName("fonticon-camera")[0]) === null || _a === void 0 ? void 0 : _a.getAttribute("data-original-title")) === null || _b === void 0 ? void 0 : _b.match(/alt=\"(.*?)\"/)[1]) || "";
    const version = alt.match(/\(V\.(.*?)\)/);
    return version != null ? version[1] : "";
}
exports.get_mkm_version = get_mkm_version;
function get_mkm_url(row) {
    var _a, _b;
    return (_b = (_a = row.getElementsByClassName("name")[0]) === null || _a === void 0 ? void 0 : _a.getElementsByTagName("a")[0]) === null || _b === void 0 ? void 0 : _b.href.split("?")[0];
}
exports.get_mkm_url = get_mkm_url;
function parsePrice(price) {
    return parseFloat(price.replace(".", "").match(/\d+\,\d+/)[0].replace(",", "."));
}
exports.parsePrice = parsePrice;
function parsePPU(ppu) {
    return parseFloat(ppu.match(/\d*\.?\d+(\,\d+)?/g)[0].replace(".", "").replace(",", "."));
}
exports.parsePPU = parsePPU;


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
/******/ 				installedChunks[chunkId] = 0;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZG1hcmtldC9jb250ZW50X3NjcmlwdC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsZ0JBQWdCLG1CQUFPLENBQUMsc0RBQWU7QUFDdkMsa0JBQWtCLG1CQUFPLENBQUMsMERBQWlCO0FBQzNDLHlCQUF5QixtQkFBTyxDQUFDLHdFQUF3QjtBQUN6RCxnQkFBZ0IsbUJBQU8sQ0FBQyxzREFBZTtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDNUJhO0FBQ2I7QUFDQSw0QkFBNEIsK0RBQStELGlCQUFpQjtBQUM1RztBQUNBLG9DQUFvQyxNQUFNLCtCQUErQixZQUFZO0FBQ3JGLG1DQUFtQyxNQUFNLG1DQUFtQyxZQUFZO0FBQ3hGLGdDQUFnQztBQUNoQztBQUNBLEtBQUs7QUFDTDtBQUNBLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxzQkFBc0IsR0FBRyxxQkFBcUI7QUFDOUMsbUJBQW1CLG1CQUFPLENBQUMsdURBQXVCO0FBQ2xELG9CQUFvQixtQkFBTyxDQUFDLG1EQUFjO0FBQzFDO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRDtBQUNqRDtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0QsNENBQTRDO0FBQzlGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLG9CQUFvQjtBQUN2RCxLQUFLO0FBQ0w7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUN2R2E7QUFDYjtBQUNBLDRCQUE0QiwrREFBK0QsaUJBQWlCO0FBQzVHO0FBQ0Esb0NBQW9DLE1BQU0sK0JBQStCLFlBQVk7QUFDckYsbUNBQW1DLE1BQU0sbUNBQW1DLFlBQVk7QUFDeEYsZ0NBQWdDO0FBQ2hDO0FBQ0EsS0FBSztBQUNMO0FBQ0EsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELHFCQUFxQixHQUFHLHdCQUF3QjtBQUNoRCxvQkFBb0IsbUJBQU8sQ0FBQyx5REFBd0I7QUFDcEQsb0JBQW9CLG1CQUFPLENBQUMsbURBQWM7QUFDMUM7QUFDQTtBQUNBO0FBQ0Esb0RBQW9ELE9BQU87QUFDM0Q7QUFDQTtBQUNBLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLHdCQUF3QjtBQUN0RTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixXQUFXO0FBQ3ZDO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMsdUJBQXVCO0FBQ3JFO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUNuRmE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsaUJBQWlCO0FBQ2pCLG1CQUFtQixtQkFBTyxDQUFDLHVEQUF1QjtBQUNsRCxvQkFBb0IsbUJBQU8sQ0FBQyxtREFBYztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2RkFBNkYsaUhBQWlILDBCQUEwQjtBQUN4TztBQUNBLGdHQUFnRyxxS0FBcUssMEJBQTBCO0FBQy9SO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ2xFYTtBQUNiO0FBQ0EsNEJBQTRCLCtEQUErRCxpQkFBaUI7QUFDNUc7QUFDQSxvQ0FBb0MsTUFBTSwrQkFBK0IsWUFBWTtBQUNyRixtQ0FBbUMsTUFBTSxtQ0FBbUMsWUFBWTtBQUN4RixnQ0FBZ0M7QUFDaEM7QUFDQSxLQUFLO0FBQ0w7QUFDQSw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsbUJBQW1CLEdBQUcsMEJBQTBCO0FBQ2hELG1CQUFtQixtQkFBTyxDQUFDLHVEQUF1QjtBQUNsRCxvQkFBb0IsbUJBQU8sQ0FBQyx5REFBd0I7QUFDcEQsb0JBQW9CLG1CQUFPLENBQUMsbURBQWM7QUFDMUM7QUFDQSx3RUFBd0U7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QyxpREFBaUQ7QUFDL0Y7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsbUNBQW1DLG9CQUFvQjtBQUN2RCxLQUFLO0FBQ0w7QUFDQSxtQkFBbUI7Ozs7Ozs7Ozs7O0FDeEVOO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGdCQUFnQixHQUFHLGtCQUFrQixHQUFHLG1CQUFtQixHQUFHLHVCQUF1QixHQUFHLGtCQUFrQjtBQUMxRztBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjs7Ozs7OztVQzNCaEI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOzs7OztXQ3pCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLCtCQUErQix3Q0FBd0M7V0FDdkU7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQkFBaUIscUJBQXFCO1dBQ3RDO1dBQ0E7V0FDQSxrQkFBa0IscUJBQXFCO1dBQ3ZDO1dBQ0E7V0FDQSxLQUFLO1dBQ0w7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQzNCQTs7Ozs7V0NBQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTSxxQkFBcUI7V0FDM0I7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7Ozs7O1VFaERBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ib3Jpcy8uL3NyYy9jYXJkbWFya2V0L2NvbnRlbnRfc2NyaXB0LnRzIiwid2VicGFjazovL2JvcmlzLy4vc3JjL2NhcmRtYXJrZXQvcGFnZXMvU2hvcHBpbmdXaXphcmQudHMiLCJ3ZWJwYWNrOi8vYm9yaXMvLi9zcmMvY2FyZG1hcmtldC9wYWdlcy9TaW5nbGVzLnRzIiwid2VicGFjazovL2JvcmlzLy4vc3JjL2NhcmRtYXJrZXQvcGFnZXMvVXNlcnMudHMiLCJ3ZWJwYWNrOi8vYm9yaXMvLi9zcmMvY2FyZG1hcmtldC9wYWdlcy9XYW50cy50cyIsIndlYnBhY2s6Ly9ib3Jpcy8uL3NyYy9jYXJkbWFya2V0L3V0aWxpdGllcy50cyIsIndlYnBhY2s6Ly9ib3Jpcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9ib3Jpcy93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL2JvcmlzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYm9yaXMvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vYm9yaXMvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9ib3Jpcy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vYm9yaXMvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgVXNlcnNfMSA9IHJlcXVpcmUoXCIuL3BhZ2VzL1VzZXJzXCIpO1xuY29uc3QgU2luZ2xlc18xID0gcmVxdWlyZShcIi4vcGFnZXMvU2luZ2xlc1wiKTtcbmNvbnN0IFNob3BwaW5nV2l6YXJkXzEgPSByZXF1aXJlKFwiLi9wYWdlcy9TaG9wcGluZ1dpemFyZFwiKTtcbmNvbnN0IFdhbnRzXzEgPSByZXF1aXJlKFwiLi9wYWdlcy9XYW50c1wiKTtcbmlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5jbHVkZXMoXCJVc2Vyc1wiKSkge1xuICAgICgwLCBVc2Vyc18xLnNob3dUcmVuZCkoKTtcbn1cbmlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5jbHVkZXMoXCJQcm9kdWN0cy9TaW5nbGVzXCIpKSB7XG4gICAgKDAsIFNpbmdsZXNfMS5hZGRMaW5rVG9TaW5nbGVzKSgpO1xuICAgICgwLCBTaW5nbGVzXzEuYWRkQ2hlY2tib3hlcykoKTtcbn1cbmlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5jbHVkZXMoXCJDYXJkcy9cIikpIHtcbiAgICAoMCwgU2luZ2xlc18xLmFkZExpbmtUb1NpbmdsZXMpKCk7XG59XG5pZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKFwiU2hvcHBpbmdXaXphcmQvUmVzdWx0c1wiKSkge1xuICAgICgwLCBTaW5nbGVzXzEuYWRkTGlua1RvU2luZ2xlcykoKTtcbiAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldCgnc2hvcHBpbmdXaXphcmQnLCAoZGF0YSkgPT4ge1xuICAgICAgICBpZiAoZGF0YS5zaG9wcGluZ1dpemFyZCkge1xuICAgICAgICAgICAgKDAsIFNob3BwaW5nV2l6YXJkXzEuYWRkRGlzY2xhaW1lcikoKTtcbiAgICAgICAgICAgICgwLCBTaG9wcGluZ1dpemFyZF8xLmFkZExpbmtUb0NhcmRzKSgpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5pZiAoL1xcUytcXC9XYW50c1xcL1xcZCsvLnRlc3Qod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKSkge1xuICAgICgwLCBXYW50c18xLmFkZFByaW50TGlzdEJ1dHRvbikoKTtcbiAgICAoMCwgV2FudHNfMS5zYXZlQWxsVXJscykoKTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmFkZExpbmtUb0NhcmRzID0gZXhwb3J0cy5hZGREaXNjbGFpbWVyID0gdm9pZCAwO1xuY29uc3Qgc2NyeWZhbGxfMSA9IHJlcXVpcmUoXCIuLi8uLi9jb21tb24vc2NyeWZhbGxcIik7XG5jb25zdCB1dGlsaXRpZXNfMSA9IHJlcXVpcmUoXCIuLi91dGlsaXRpZXNcIik7XG5mdW5jdGlvbiBhZGREaXNjbGFpbWVyKCkge1xuICAgIGNvbnN0IHNlY3Rpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiY2FyZC1jb2x1bW5zXCIpWzBdO1xuICAgIGNvbnN0IGRpc2NsYWltZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDRcIik7XG4gICAgZGlzY2xhaW1lci5pbm5lckhUTUwgPSBcIjxpIHN0eWxlPSdjb2xvcjogcmVkOyc+RHVlIHRvIHNvbWUgbGltaXRhdGlvbnMsIHNvbWUgbGlua3MgbWF5IG5vdCB3b3JrIG9yIGJlIHdyb25nPC9pPjxocj5cIjtcbiAgICBzZWN0aW9uLmJlZm9yZShkaXNjbGFpbWVyKTtcbn1cbmV4cG9ydHMuYWRkRGlzY2xhaW1lciA9IGFkZERpc2NsYWltZXI7XG5mdW5jdGlvbiBhZGRMaW5rVG9DYXJkcygpIHtcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoW1widXJsc1wiXSwgKHJlc3VsdCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICBsZXQgc2F2ZWRfdXJscyA9IChfYSA9IHJlc3VsdC51cmxzKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBbXTtcbiAgICAgICAgZm9yIChjb25zdCB0YWJsZSBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRib2R5XCIpKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiB0YWJsZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRyXCIpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2FyZF9pZCA9ICgwLCB1dGlsaXRpZXNfMS5nZXRfbWttX2lkKShyb3cpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNhcmRfdmVyc2lvbiA9ICgwLCB1dGlsaXRpZXNfMS5nZXRfbWttX3ZlcnNpb24pKHJvdyk7XG4gICAgICAgICAgICAgICAgY29uc3QgY2FyZF9lbGVtID0gcm93LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjYXJkLW5hbWVcIilbMF07XG4gICAgICAgICAgICAgICAgY29uc3Qgc2V0X3RpdGxlID0gKF9iID0gcm93LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJleHBhbnNpb24tc3ltYm9sXCIpWzBdKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuZ2V0QXR0cmlidXRlKFwiZGF0YS1vcmlnaW5hbC10aXRsZVwiKTtcbiAgICAgICAgICAgICAgICBpZiAoY2FyZF9pZCkge1xuICAgICAgICAgICAgICAgICAgICB5aWVsZCAoMCwgc2NyeWZhbGxfMS5nZXRfY2FyZG1hcmtldCkoY2FyZF9pZCkudGhlbigoY2FyZCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2F2ZWQgPSBzYXZlZF91cmxzLmZpbHRlcigodSkgPT4gdS5ta21faWQgPT0gY2FyZF9pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1cmwgPSBzYXZlZC5sZW5ndGggPiAwID8gc2F2ZWRbMF0udXJsIDogKHlpZWxkIGZvcm1hdF91cmwoY2FyZCwgY2FyZF92ZXJzaW9uLCBzZXRfdGl0bGUgfHwgXCJcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhcmRfZWxlbS5pbm5lckhUTUwgPSBcIjxhIGhyZWY9J1wiICsgdXJsICsgXCInIHRhcmdldD0nX2JsYW5rJz5cIiArIGNhcmQubmFtZSArIFwiPC9hPjxicj4vIDxhIGhyZWY9J1wiICsgY2FyZC5wdXJjaGFzZV91cmlzLmNhcmRtYXJrZXQgKyBcIicgdGFyZ2V0PSdfYmxhbmsnPkFsbCBwcmludGluZ3M8L2E+XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNhdmVkX3VybHMuZmlsdGVyKCh1KSA9PiB1Lm1rbV9pZCA9PSBjYXJkX2lkKS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYXZlZF91cmxzLnB1c2goeyBuYW1lOiBjYXJkLm5hbWUsIG1rbV9pZDogY2FyZF9pZCwgdXJsOiB1cmwgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKDAsIHNjcnlmYWxsXzEuZmV0Y2hfc2luZ2xlKShjYXJkX2VsZW0uaW5uZXJIVE1MLnJlcGxhY2UoL1xcKFZcXC5cXGQrXFwpL2csICcnKSkudGhlbigoY2FyZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXJkX2VsZW0uaW5uZXJIVE1MID0gXCI8YSBocmVmPSdcIiArIGNhcmQucHVyY2hhc2VfdXJpcy5jYXJkbWFya2V0ICsgXCInIHRhcmdldD0nX2JsYW5rJz5cIiArIGNhcmQubmFtZSArIFwiPGJyPihBbGwpPC9hPlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IFwidXJsc1wiOiBzYXZlZF91cmxzIH0pO1xuICAgIH0pKTtcbn1cbmV4cG9ydHMuYWRkTGlua1RvQ2FyZHMgPSBhZGRMaW5rVG9DYXJkcztcbmZ1bmN0aW9uIGZvcm1hdF91cmwoY2FyZCwgdmVyc2lvbiwgc2V0X3RpdGxlKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgaWYgKGNhcmQubmFtZSkge1xuICAgICAgICAgICAgbGV0IG5hbWUgPSBjYXJkLm5hbWU7XG4gICAgICAgICAgICBsZXQgc2V0ID0gXCJcIjtcbiAgICAgICAgICAgIGlmICh2ZXJzaW9uKSB7XG4gICAgICAgICAgICAgICAgc2V0ID0gc2V0X3RpdGxlO1xuICAgICAgICAgICAgICAgIG5hbWUgKz0gXCIgVlwiICsgdmVyc2lvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNldF90eXBlID0gc2V0X3RpdGxlID09PSBudWxsIHx8IHNldF90aXRsZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogc2V0X3RpdGxlLnNwbGl0KFwiOlwiKS5wb3AoKTtcbiAgICAgICAgICAgICAgICBpZiAoIWNhcmQuc2V0X25hbWUuaW5jbHVkZXMoXCJFeHRyYXNcIikgJiYgIWNhcmQuc2V0X25hbWUuaW5jbHVkZXMoXCJQcm9tb3NcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0ID0gY2FyZC5zZXRfbmFtZSArICgoc2V0X3R5cGUgJiYgKHNldF90eXBlLmluY2x1ZGVzKFwiRXh0cmFzXCIpIHx8IHNldF90eXBlLmluY2x1ZGVzKFwiUHJvbW9zXCIpKSkgPyBzZXRfdHlwZSA6IFwiXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0ID0gY2FyZC5zZXRfbmFtZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXQgPSBzZXQucmVwbGFjZShcIiBTZXQgXCIsIFwiIFwiKTtcbiAgICAgICAgICAgIGxldCBwYXRoID0gKHNldCArIFwiL1wiICsgbmFtZSkucmVwbGFjZSgvIFxcL1xcLyAvZywgXCItXCIpLnJlcGxhY2UoLzovZywgXCJcIikucmVwbGFjZSgvLC9nLCBcIlwiKS5yZXBsYWNlKC9cXHMrL2csIFwiLVwiKTtcbiAgICAgICAgICAgIGxldCB1cmwgPSBcImh0dHBzOi8vd3d3LmNhcmRtYXJrZXQuY29tL01hZ2ljL1Byb2R1Y3RzL1NpbmdsZXMvXCIgKyBwYXRoO1xuICAgICAgICAgICAgaWYgKHVybC5pbmNsdWRlcyhcIlxcJ1wiKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld191cmwgPSB1cmwucmVwbGFjZSgvXFwnL2csIFwiXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCBmZXRjaChuZXdfdXJsKS50aGVuKChyKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyLm9rICYmIHVybHNfYXJlX2VxdWFsKHIudXJsLCBuZXdfdXJsKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ld191cmw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdfdXJsID0gdXJsLnJlcGxhY2UoL1xcJy9nLCBcIi1cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geWllbGQgZmV0Y2gobmV3X3VybCkudGhlbihyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoci5vayAmJiB1cmxzX2FyZV9lcXVhbChyLnVybCwgbmV3X3VybCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ld191cmw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB1cmw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfSk7XG59XG5mdW5jdGlvbiB1cmxzX2FyZV9lcXVhbCh1cmwxLCB1cmwyKSB7XG4gICAgcmV0dXJuIHVybDEuc3BsaXQoXCIvXCIpLnNsaWNlKC0xKVswXSA9PSB1cmwyLnNwbGl0KFwiL1wiKS5zbGljZSgtMSlbMF07XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5hZGRDaGVja2JveGVzID0gZXhwb3J0cy5hZGRMaW5rVG9TaW5nbGVzID0gdm9pZCAwO1xuY29uc3QgdXRpbGl0aWVzXzEgPSByZXF1aXJlKFwiLi4vLi4vY29tbW9uL3V0aWxpdGllc1wiKTtcbmNvbnN0IHV0aWxpdGllc18yID0gcmVxdWlyZShcIi4uL3V0aWxpdGllc1wiKTtcbmZ1bmN0aW9uIGFkZExpbmtUb1NpbmdsZXMoKSB7XG4gICAgZm9yIChjb25zdCB1c2VyIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzZWxsZXItbmFtZVwiKSkge1xuICAgICAgICBjb25zdCB1c2VyX2xpbmsgPSB1c2VyLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYVwiKVswXTtcbiAgICAgICAgdXNlcl9saW5rLnBhcmVudEVsZW1lbnQuaW5uZXJIVE1MICs9IFwiJm5ic3A7LSZuYnNwOzxhIGhyZWY9J1wiICsgdXNlcl9saW5rLmhyZWYgKyBcIi9PZmZlcnMvU2luZ2xlcy8nIHRhcmdldD0nX2JsYW5rJz5TaW5nbGVzPC9hPlwiO1xuICAgIH1cbn1cbmV4cG9ydHMuYWRkTGlua1RvU2luZ2xlcyA9IGFkZExpbmtUb1NpbmdsZXM7XG5mdW5jdGlvbiBnZXRSZWZlcmVuY2UoZGVmYXVsdF9yZWYpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoJ3JlZmVyZW5jZScsIChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEucmVmZXJlbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKGRhdGEucmVmZXJlbmNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHsgcmVmZXJlbmNlOiBkZWZhdWx0X3JlZiB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoZGVmYXVsdF9yZWYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBhZGRDaGVja2JveGVzKCkge1xuICAgIHZhciBfYTtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBsZXQgcmVmZXJlbmNlID0geWllbGQgZ2V0UmVmZXJlbmNlKDEpO1xuICAgICAgICBjb25zdCBpbmZvID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImluZm8tbGlzdC1jb250YWluZXJcIilbMF07XG4gICAgICAgIGlmIChpbmZvKSB7XG4gICAgICAgICAgICBjb25zdCByb3dzID0gaW5mby5nZXRFbGVtZW50c0J5VGFnTmFtZShcImRkXCIpO1xuICAgICAgICAgICAgY29uc3QgbnJvd3MgPSA0O1xuICAgICAgICAgICAgbGV0IHByaWNlcyA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBucm93czsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZWxlbSA9IHJvd3Nbcm93cy5sZW5ndGggLSBucm93cyArIGldO1xuICAgICAgICAgICAgICAgIHByaWNlcy5wdXNoKCgwLCB1dGlsaXRpZXNfMi5wYXJzZVByaWNlKShlbGVtLmlubmVySFRNTCkpO1xuICAgICAgICAgICAgICAgIGVsZW0uaW5uZXJIVE1MICs9IFwiJm5ic3A7PGlucHV0IHR5cGU9J3JhZGlvJyBuYW1lPSdyZWZlcmVuY2UnIHZhbHVlPVwiICsgaSArIChpID09IHJlZmVyZW5jZSA/IFwiIGNoZWNrZWRcIiA6IFwiXCIpICsgXCI+XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb2xvclByaWNlcyhwcmljZXNbcmVmZXJlbmNlXSk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJhZGlvIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25hbWU9XCJyZWZlcmVuY2VcIl0nKSkge1xuICAgICAgICAgICAgICAgIHJhZGlvLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IHJlZmVyZW5jZTogdGhpcy52YWx1ZSB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZSA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBjb2xvclByaWNlcyhwcmljZXNbdGhpcy52YWx1ZV0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgKF9hID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkTW9yZUJ1dHRvblwiKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiAoMCwgdXRpbGl0aWVzXzEuc2xlZXApKDMwMDApLnRoZW4oKCkgPT4gY29sb3JQcmljZXMocHJpY2VzW3JlZmVyZW5jZV0pKSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmV4cG9ydHMuYWRkQ2hlY2tib3hlcyA9IGFkZENoZWNrYm94ZXM7XG5mdW5jdGlvbiBjb2xvclByaWNlcyhyZWZlcmVuY2VfcHJpY2UpIHtcbiAgICBmb3IgKGNvbnN0IGVsZW0gb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInByaWNlLWNvbnRhaW5lclwiKSkge1xuICAgICAgICBjb25zdCBwcmljZV9lbGVtID0gZWxlbS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZm9udC13ZWlnaHQtYm9sZFwiKVswXTtcbiAgICAgICAgY29uc3QgcGxheXNldF9lbGVtID0gcHJpY2VfZWxlbS5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInRleHQtbXV0ZWRcIik7XG4gICAgICAgIGxldCBwcHUgPSAwO1xuICAgICAgICBpZiAocGxheXNldF9lbGVtLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHBwdSA9ICgwLCB1dGlsaXRpZXNfMi5wYXJzZVBQVSkocGxheXNldF9lbGVtWzBdLmlubmVySFRNTCk7XG4gICAgICAgIH1cbiAgICAgICAgcHJpY2VfZWxlbS5jbGFzc0xpc3QucmVtb3ZlKFwiY29sb3ItcHJpbWFyeVwiKTtcbiAgICAgICAgaWYgKHByaWNlX2VsZW0pIHtcbiAgICAgICAgICAgIGlmICgocHB1ID4gMCAmJiBwcHUgPD0gcmVmZXJlbmNlX3ByaWNlKSB8fCAoMCwgdXRpbGl0aWVzXzIucGFyc2VQcmljZSkocHJpY2VfZWxlbS5pbm5lckhUTUwucmVwbGFjZShcIiDigqxcIiwgXCJcIikpIDw9IHJlZmVyZW5jZV9wcmljZSkge1xuICAgICAgICAgICAgICAgIHByaWNlX2VsZW0uc3R5bGUuY29sb3IgPSBcImdyZWVuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwcmljZV9lbGVtLnN0eWxlLmNvbG9yID0gXCJyZWRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5zaG93VHJlbmQgPSB2b2lkIDA7XG5jb25zdCBzY3J5ZmFsbF8xID0gcmVxdWlyZShcIi4uLy4uL2NvbW1vbi9zY3J5ZmFsbFwiKTtcbmNvbnN0IHV0aWxpdGllc18xID0gcmVxdWlyZShcIi4uL3V0aWxpdGllc1wiKTtcbmZ1bmN0aW9uIHNob3dUcmVuZCgpIHtcbiAgICB2YXIgX2E7XG4gICAgY29uc3QgdGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIlVzZXJPZmZlcnNUYWJsZVwiKTtcbiAgICBpZiAodGFibGUpIHtcbiAgICAgICAgY29uc3QgbGVnZW5kYV9kaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBsZWdlbmRhX2Rpdi5pbm5lckhUTUwgPSBcIjxocj48cCBjbGFzcz0nZm9udC13ZWlnaHQtYm9sZCc+RSA9IEV4YWN0IHNldCAvIEwgPSBMb3dlc3QgQXZhaWxibGVcXCA8YnI+PHNwYW4gc3R5bGU9J2NvbG9yOiBncmVlbic+TG93ZXIgcHJpY2U8L3NwYW4+IC8gPHNwYW4gc3R5bGU9J2NvbG9yOiByZWQnPkhpZ2hlciBwcmljZTwvc3Bhbj4gLyA8c3BhbiBzdHlsZT0nY29sb3I6IGRhcmt2aW9sZXQnPkZvaWwgWyA8aT5ub3Qgc3VwcG9ydGVkPC9pPiBdPC9zcGFuPiAvIDxzcGFuIGNsYXNzPSdjb2xvci1wcmltYXJ5Jz5QcmljZSBub3QgZm91bmQ8L3NwYW48L3A+XCI7XG4gICAgICAgIHRhYmxlLmJlZm9yZShsZWdlbmRhX2Rpdik7XG4gICAgICAgIGNvbnN0IHJvd3MgPSB0YWJsZS5xdWVyeVNlbGVjdG9yQWxsKCdbaWRePWFydGljbGVSb3ddJyk7XG4gICAgICAgIGZvciAoY29uc3Qgcm93IG9mIHJvd3MpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhcmRfdXJsID0gcm93LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjb2wtc2VsbGVyXCIpWzBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYVwiKVswXS5ocmVmLnNwbGl0KFwiP1wiKVswXS5zcGxpdChcIi9cIik7XG4gICAgICAgICAgICBsZXQgY2FyZF9uYW1lID0gKF9hID0gY2FyZF91cmwucG9wKCkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5yZXBsYWNlKC8tVlxcZCsvLCAnJyk7XG4gICAgICAgICAgICBsZXQgY2FyZF9pZCA9ICgwLCB1dGlsaXRpZXNfMS5nZXRfbWttX2lkKShyb3cpO1xuICAgICAgICAgICAgbGV0IGZvaWwgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChyb3cucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtb3JpZ2luYWwtdGl0bGU9XCJGb2lsXCJdJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGZvaWwgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgUHJvbWlzZS5hbGwoWygwLCBzY3J5ZmFsbF8xLmdldF9jaGVhcGVzdCkoY2FyZF9uYW1lKSwgKDAsIHNjcnlmYWxsXzEuZ2V0X2NhcmRtYXJrZXQpKGNhcmRfaWQpXSkudGhlbihyZXNwb25zZXMgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBfYSwgX2IsIF9jLCBfZCwgX2UsIF9mO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNoZWFwZXN0ID0gcmVzcG9uc2VzWzBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4YWN0ID0gcmVzcG9uc2VzWzFdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHByaWNlX2VsZW0gPSByb3cuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInByaWNlLWNvbnRhaW5lclwiKVswXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZm9udC13ZWlnaHQtYm9sZFwiKVswXTtcbiAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW5hbF9wcmljZSA9ICgwLCB1dGlsaXRpZXNfMS5wYXJzZVByaWNlKShwcmljZV9lbGVtLmlubmVySFRNTC5yZXBsYWNlKFwiIOKCrFwiLCBcIlwiKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgcGxheXNldF9lbGVtID0gcHJpY2VfZWxlbS5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInRleHQtbXV0ZWRcIik7XG4gICAgICAgICAgICAgICAgbGV0IHBwdSA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKHBsYXlzZXRfZWxlbS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHBwdSA9ICgwLCB1dGlsaXRpZXNfMS5wYXJzZVBQVSkocGxheXNldF9lbGVtWzBdLmlubmVySFRNTCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBjaGVhcGVzdF9jb2xvciA9IFwiXCIsIGV4YWN0X2NvbG9yID0gXCJcIjtcbiAgICAgICAgICAgICAgICBsZXQgY2hlYXBlc3RfcHJpY2UgPSAwLCBleGFjdF9wcmljZSA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKGNoZWFwZXN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNoZWFwZXN0X3ByaWNlID0gcGFyc2VGbG9hdCgoX2IgPSAoX2EgPSBjaGVhcGVzdC5wcmljZXMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5ldXIpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IChfYyA9IGNoZWFwZXN0LnByaWNlcykgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLmV1cl9mb2lsKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWFwZXN0X3ByaWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVhcGVzdF9jb2xvciA9IChmb2lsID8gXCJkYXJrdmlvbGV0XCIgOiBjb2xvcl9mcm9tX3ByaWNlKG9yaWdpbmFsX3ByaWNlLCBjaGVhcGVzdF9wcmljZSwgcHB1KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGV4YWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGV4YWN0X3ByaWNlID0gcGFyc2VGbG9hdCgoX2UgPSAoX2QgPSBleGFjdC5wcmljZXMpID09PSBudWxsIHx8IF9kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZC5ldXIpICE9PSBudWxsICYmIF9lICE9PSB2b2lkIDAgPyBfZSA6IChfZiA9IGV4YWN0LnByaWNlcykgPT09IG51bGwgfHwgX2YgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9mLmV1cl9mb2lsKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4YWN0X3ByaWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleGFjdF9jb2xvciA9IChmb2lsID8gXCJkYXJrdmlvbGV0XCIgOiBjb2xvcl9mcm9tX3ByaWNlKG9yaWdpbmFsX3ByaWNlLCBleGFjdF9wcmljZSwgcHB1KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IG9yaWdpbmFsX2NvbG9yID0gZXhhY3RfY29sb3IgfHwgY2hlYXBlc3RfY29sb3I7XG4gICAgICAgICAgICAgICAgcHJpY2VfZWxlbS5pbm5lckhUTUwgPSBcIjxzcGFuIHN0eWxlPSdjb2xvcjogXCIgKyBvcmlnaW5hbF9jb2xvciArIFwiJz5cIiArIHByaWNlX2VsZW0uaW5uZXJIVE1MICsgXCI8c3Bhbj5cIjtcbiAgICAgICAgICAgICAgICBpZiAoIWZvaWwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4YWN0X3ByaWNlID4gMCAmJiBjaGVhcGVzdC5zZXQgIT0gZXhhY3Quc2V0KVxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2VfZWxlbS5pbm5lckhUTUwgKz0gXCI8YnI+PHNwYW4gc3R5bGU9J2NvbG9yOiBcIiArIGV4YWN0X2NvbG9yICsgXCI7JyA+RSA8L3NwYW4+PGEgc3R5bGU9J2NvbG9yOiBibGFjaycgaHJlZj0nXCIgKyBleGFjdC5zY3J5ZmFsbF91cmkgKyBcIic+IFwiICsgZXhhY3RfcHJpY2UudG9Mb2NhbGVTdHJpbmcoXCJpdC1JVFwiLCB7IG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMiB9KSArIFwiIOKCrDwvYT5cIjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWFwZXN0X3ByaWNlID4gMClcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlX2VsZW0uaW5uZXJIVE1MICs9IFwiPGJyPjxzcGFuIHN0eWxlPSdjb2xvcjogXCIgKyBjaGVhcGVzdF9jb2xvciArIFwiOyc+XCIgKyAoY2hlYXBlc3Quc2V0ID09IGV4YWN0LnNldCA/IFwiRT1cIiA6IFwiXCIpICsgXCJMIDwvc3Bhbj48YSBzdHlsZT0nY29sb3I6IGJsYWNrJyBocmVmPSdcIiArIGNoZWFwZXN0LnNjcnlmYWxsX3VyaSArIFwiJz4gXCIgKyBjaGVhcGVzdF9wcmljZS50b0xvY2FsZVN0cmluZyhcIml0LUlUXCIsIHsgbWluaW11bUZyYWN0aW9uRGlnaXRzOiAyIH0pICsgXCIg4oKsPC9hPlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0cy5zaG93VHJlbmQgPSBzaG93VHJlbmQ7XG5mdW5jdGlvbiBjb2xvcl9mcm9tX3ByaWNlKG9sZF9wcmljZSwgbmV3X3ByaWNlLCBwcHUpIHtcbiAgICBpZiAoKHBwdSA+IDAgJiYgcHB1ID4gbmV3X3ByaWNlKSB8fCBvbGRfcHJpY2UgPiBuZXdfcHJpY2UpIHtcbiAgICAgICAgcmV0dXJuIFwicmVkXCI7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gXCJncmVlblwiO1xuICAgIH1cbn1cbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnNhdmVBbGxVcmxzID0gZXhwb3J0cy5hZGRQcmludExpc3RCdXR0b24gPSB2b2lkIDA7XG5jb25zdCBzY3J5ZmFsbF8xID0gcmVxdWlyZShcIi4uLy4uL2NvbW1vbi9zY3J5ZmFsbFwiKTtcbmNvbnN0IHV0aWxpdGllc18xID0gcmVxdWlyZShcIi4uLy4uL2NvbW1vbi91dGlsaXRpZXNcIik7XG5jb25zdCB1dGlsaXRpZXNfMiA9IHJlcXVpcmUoXCIuLi91dGlsaXRpZXNcIik7XG5mdW5jdGlvbiBhZGRQcmludExpc3RCdXR0b24oKSB7XG4gICAgY29uc3QgYnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImFbaHJlZiQ9J0FkZERlY2tMaXN0J11cIilbMF07IC8vICQ9IC0tPiBlbmRpbmcgd2l0aFxuICAgIGJ0bi5jbGFzc0xpc3QuYWRkKFwibXItM1wiKTtcbiAgICBjb25zdCBwcmludEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgcHJpbnRCdG4uY2xhc3NMaXN0LmFkZChcImJ0blwiKTtcbiAgICBwcmludEJ0bi5zdHlsZS5jb2xvciA9IFwicmdiKDI0MCwgMTczLCA3OClcIjtcbiAgICBwcmludEJ0bi5zdHlsZS5ib3JkZXJDb2xvciA9IFwicmdiKDI0MCwgMTczLCA3OClcIjtcbiAgICBwcmludEJ0bi5pbm5lckhUTUwgPSBcIjxzcGFuPlNhdmUgYXMuLi48L3NwYW4+XCI7XG4gICAgcHJpbnRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoJ3ByaW50VmVyc2lvbicsIChkYXRhKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB2YXIgX2EsIF9iLCBfYztcbiAgICAgICAgICAgIGNvbnN0IHdhbnRzX3RpdGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInBhZ2UtdGl0bGUtY29udGFpbmVyXCIpWzBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaDFcIilbMF0uaW5uZXJIVE1MO1xuICAgICAgICAgICAgbGV0IGxpc3QgPSBcIlwiO1xuICAgICAgICAgICAgY29uc3QgcHJpbnRWZXJzaW9uID0gKF9hID0gZGF0YS5wcmludFZlcnNpb24pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IGZhbHNlO1xuICAgICAgICAgICAgaWYgKHByaW50VmVyc2lvbikge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgcm93IG9mIChfYiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiV2FudHNMaXN0VGFibGVcIikpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRib2R5XCIpWzBdLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJuYW1lXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBuYW1lID0gcm93LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYVwiKVswXS5pbm5lckhUTUw7XG4gICAgICAgICAgICAgICAgICAgIGxpc3QgKz0gbmFtZSArIFwiXFxuXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCByb3cgb2YgKF9jID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJXYW50c0xpc3RUYWJsZVwiKSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGJvZHlcIilbMF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0clwiKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYXJkX2lkID0gKDAsIHV0aWxpdGllc18yLmdldF9ta21faWQpKHJvdyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYXJkX2lkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB5aWVsZCAoMCwgc2NyeWZhbGxfMS5nZXRfY2FyZG1hcmtldCkoY2FyZF9pZCkudGhlbigoY2FyZCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0ICs9ICgoX2QgPSBjYXJkLm5hbWUpICE9PSBudWxsICYmIF9kICE9PSB2b2lkIDAgPyBfZCA6IFwiXCIpICsgXCJcXG5cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICgwLCB1dGlsaXRpZXNfMS5zYXZlV2l0aEZpbGVQaWNrZXIpKG5ldyBCbG9iKFtsaXN0XSksIHdhbnRzX3RpdGxlID8gd2FudHNfdGl0bGUgKyBcIi50eHRcIiA6IFwid2FudHMudHh0XCIpO1xuICAgICAgICB9KSk7XG4gICAgfSk7XG4gICAgYnRuLmFmdGVyKHByaW50QnRuKTtcbn1cbmV4cG9ydHMuYWRkUHJpbnRMaXN0QnV0dG9uID0gYWRkUHJpbnRMaXN0QnV0dG9uO1xuZnVuY3Rpb24gc2F2ZUFsbFVybHMoKSB7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtcInVybHNcIl0sIChyZXN1bHQpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgbGV0IHNhdmVkX3VybHMgPSAoX2EgPSByZXN1bHQudXJscykgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogW107XG4gICAgICAgIGZvciAoY29uc3Qgcm93IG9mIChfYiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiV2FudHNMaXN0VGFibGVcIikpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRib2R5XCIpWzBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidHJcIikpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhcmRfaWQgPSAoMCwgdXRpbGl0aWVzXzIuZ2V0X21rbV9pZCkocm93KTtcbiAgICAgICAgICAgIGNvbnN0IGNhcmRfdXJsID0gKDAsIHV0aWxpdGllc18yLmdldF9ta21fdXJsKShyb3cpO1xuICAgICAgICAgICAgaWYgKGNhcmRfaWQgJiYgY2FyZF91cmwpIHtcbiAgICAgICAgICAgICAgICB5aWVsZCAoMCwgc2NyeWZhbGxfMS5nZXRfY2FyZG1hcmtldCkoY2FyZF9pZCkudGhlbigoY2FyZCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2FyZC5uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2F2ZWRfdXJscy5maWx0ZXIoKHUpID0+IHUubWttX2lkID09IGNhcmRfaWQpLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZWRfdXJscy5wdXNoKHsgbmFtZTogY2FyZC5uYW1lLCBta21faWQ6IGNhcmRfaWQsIHVybDogY2FyZF91cmwgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgXCJ1cmxzXCI6IHNhdmVkX3VybHMgfSk7XG4gICAgfSkpO1xufVxuZXhwb3J0cy5zYXZlQWxsVXJscyA9IHNhdmVBbGxVcmxzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnBhcnNlUFBVID0gZXhwb3J0cy5wYXJzZVByaWNlID0gZXhwb3J0cy5nZXRfbWttX3VybCA9IGV4cG9ydHMuZ2V0X21rbV92ZXJzaW9uID0gZXhwb3J0cy5nZXRfbWttX2lkID0gdm9pZCAwO1xuZnVuY3Rpb24gZ2V0X21rbV9pZChyb3cpIHtcbiAgICB2YXIgX2EsIF9iO1xuICAgIHJldHVybiAoKF9iID0gKF9hID0gcm93LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJmb250aWNvbi1jYW1lcmFcIilbMF0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5nZXRBdHRyaWJ1dGUoXCJkYXRhLW9yaWdpbmFsLXRpdGxlXCIpKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Iuc3BsaXQoL1xcLmpwZy9nKVswXS5zcGxpdChcIi9cIikuc3BsaWNlKC0xKVswXSkgfHwgXCJcIjtcbn1cbmV4cG9ydHMuZ2V0X21rbV9pZCA9IGdldF9ta21faWQ7XG5mdW5jdGlvbiBnZXRfbWttX3ZlcnNpb24ocm93KSB7XG4gICAgdmFyIF9hLCBfYjtcbiAgICBjb25zdCBhbHQgPSAoKF9iID0gKF9hID0gcm93LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJmb250aWNvbi1jYW1lcmFcIilbMF0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5nZXRBdHRyaWJ1dGUoXCJkYXRhLW9yaWdpbmFsLXRpdGxlXCIpKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IubWF0Y2goL2FsdD1cXFwiKC4qPylcXFwiLylbMV0pIHx8IFwiXCI7XG4gICAgY29uc3QgdmVyc2lvbiA9IGFsdC5tYXRjaCgvXFwoVlxcLiguKj8pXFwpLyk7XG4gICAgcmV0dXJuIHZlcnNpb24gIT0gbnVsbCA/IHZlcnNpb25bMV0gOiBcIlwiO1xufVxuZXhwb3J0cy5nZXRfbWttX3ZlcnNpb24gPSBnZXRfbWttX3ZlcnNpb247XG5mdW5jdGlvbiBnZXRfbWttX3VybChyb3cpIHtcbiAgICB2YXIgX2EsIF9iO1xuICAgIHJldHVybiAoX2IgPSAoX2EgPSByb3cuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIm5hbWVcIilbMF0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImFcIilbMF0pID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5ocmVmLnNwbGl0KFwiP1wiKVswXTtcbn1cbmV4cG9ydHMuZ2V0X21rbV91cmwgPSBnZXRfbWttX3VybDtcbmZ1bmN0aW9uIHBhcnNlUHJpY2UocHJpY2UpIHtcbiAgICByZXR1cm4gcGFyc2VGbG9hdChwcmljZS5yZXBsYWNlKFwiLlwiLCBcIlwiKS5tYXRjaCgvXFxkK1xcLFxcZCsvKVswXS5yZXBsYWNlKFwiLFwiLCBcIi5cIikpO1xufVxuZXhwb3J0cy5wYXJzZVByaWNlID0gcGFyc2VQcmljZTtcbmZ1bmN0aW9uIHBhcnNlUFBVKHBwdSkge1xuICAgIHJldHVybiBwYXJzZUZsb2F0KHBwdS5tYXRjaCgvXFxkKlxcLj9cXGQrKFxcLFxcZCspPy9nKVswXS5yZXBsYWNlKFwiLlwiLCBcIlwiKS5yZXBsYWNlKFwiLFwiLCBcIi5cIikpO1xufVxuZXhwb3J0cy5wYXJzZVBQVSA9IHBhcnNlUFBVO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwiY2FyZG1hcmtldC9jb250ZW50X3NjcmlwdFwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtib3Jpc1wiXSA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtib3Jpc1wiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9yXCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2NhcmRtYXJrZXQvY29udGVudF9zY3JpcHQudHNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
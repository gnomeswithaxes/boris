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
if (window.location.pathname.includes("Magic/Users")) {
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
    if (window.location.pathname.includes("/Magic/Wants")) {
        chrome.storage.sync.get('shoppingWizard', (data) => {
            if (data.shoppingWizard) {
                (0, ShoppingWizard_1.addDisclaimer)();
                (0, ShoppingWizard_1.addLinkToCards)();
            }
        });
    }
}
if (/\S+\/Wants\/\d+/.test(window.location.pathname)) {
    (0, Wants_1.addPrintListButton)();
    if (window.location.pathname.includes("/Magic/Wants")) {
        (0, Wants_1.saveAllUrls)();
    }
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
        legenda_div.innerHTML = "<hr><p class='font-weight-bold'>E = Exact set / L = Lowest Availble <br><span style='color: green'>Lower price</span> / <span style='color: red'>Higher price</span> / <span style='color: darkviolet'>Foil [ <i>not supported</i> ]</span> / <span class='color-primary'>Price not found</span</p>";
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
                let cheapest_color = "", cheapest_price = 0;
                let exact_color = "", exact_price = 0;
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
                let original_color = cheapest_color && exact_color;
                price_elem.innerHTML = "<span style='color: " + original_color + "'>" + price_elem.innerHTML + "<span>";
                if (!foil) {
                    if (exact_price > 0 && cheapest.id != exact.id)
                        price_elem.innerHTML += "<br><span style='color: " + exact_color + ";' >E </span><a style='color: black' href='" + exact.scryfall_uri + "'> " + exact_price.toLocaleString("it-IT", { minimumFractionDigits: 2 }) + " €</a>";
                    if (cheapest_price > 0)
                        price_elem.innerHTML += "<br><span style='color: " + cheapest_color + ";'>" + (cheapest.id == exact.id ? "E=" : "") + "L </span><a style='color: black' href='" + cheapest.scryfall_uri + "'> " + cheapest_price.toLocaleString("it-IT", { minimumFractionDigits: 2 }) + " €</a>";
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
    var _a;
    const table = (_a = document.getElementById("WantsListTable")) === null || _a === void 0 ? void 0 : _a.getElementsByTagName("tbody")[0];
    if (table) {
        const btn = document.querySelectorAll("a[href$='AddDeckList']")[0]; // $= --> ending with
        btn.classList.add("mr-3");
        const printBtn = document.createElement("div");
        printBtn.classList.add("btn");
        printBtn.style.color = "rgb(240, 173, 78)";
        printBtn.style.borderColor = "rgb(240, 173, 78)";
        printBtn.innerHTML = "<span>Save as...</span>";
        printBtn.addEventListener("click", () => {
            chrome.storage.sync.get('printVersion', (data) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const wants_title = document.getElementsByClassName("page-title-container")[0].getElementsByTagName("h1")[0].innerHTML;
                let list = "";
                const printVersion = (_a = data.printVersion) !== null && _a !== void 0 ? _a : false;
                if (printVersion) {
                    for (const row of table.getElementsByClassName("name")) {
                        let name = row.getElementsByTagName("a")[0].innerHTML;
                        list += name + "\n";
                    }
                }
                else {
                    for (const row of table.getElementsByTagName("tr")) {
                        const card_id = (0, utilities_2.get_mkm_id)(row);
                        if (card_id) {
                            yield (0, scryfall_1.get_cardmarket)(card_id).then((card) => __awaiter(this, void 0, void 0, function* () {
                                var _b;
                                list += ((_b = card.name) !== null && _b !== void 0 ? _b : "") + "\n";
                            }));
                        }
                    }
                }
                (0, utilities_1.saveWithFilePicker)(new Blob([list]), wants_title ? wants_title + ".txt" : "wants.txt");
            }));
        });
        btn.after(printBtn);
    }
}
exports.addPrintListButton = addPrintListButton;
function saveAllUrls() {
    chrome.storage.local.get(["urls"], (result) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        let saved_urls = (_a = result.urls) !== null && _a !== void 0 ? _a : [];
        const rows = (_b = document.getElementById("WantsListTable")) === null || _b === void 0 ? void 0 : _b.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
        if (rows) {
            for (const row of rows) {
                const card_url = (0, utilities_2.get_mkm_url)(row);
                if (card_url && card_url.includes("/Products/Singles/")) {
                    const card_id = (0, utilities_2.get_mkm_id)(row);
                    if (card_id) {
                        yield (0, scryfall_1.get_cardmarket)(card_id).then((card) => __awaiter(this, void 0, void 0, function* () {
                            if (card.name) {
                                if (saved_urls.filter((u) => u.mkm_id == card_id).length == 0) {
                                    saved_urls.push({ name: card.name, mkm_id: card_id, url: card_url });
                                }
                            }
                        }));
                    }
                }
            }
            chrome.storage.local.set({ "urls": saved_urls });
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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V0FDdkM7V0FDQTtXQUNBLEtBQUs7V0FDTDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDM0JBOzs7OztXQ0FBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNLHFCQUFxQjtXQUMzQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7Ozs7VUVoREE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2JvcmlzLy4vc3JjL2NhcmRtYXJrZXQvY29udGVudF9zY3JpcHQudHMiLCJ3ZWJwYWNrOi8vYm9yaXMvLi9zcmMvY2FyZG1hcmtldC9wYWdlcy9TaG9wcGluZ1dpemFyZC50cyIsIndlYnBhY2s6Ly9ib3Jpcy8uL3NyYy9jYXJkbWFya2V0L3BhZ2VzL1NpbmdsZXMudHMiLCJ3ZWJwYWNrOi8vYm9yaXMvLi9zcmMvY2FyZG1hcmtldC9wYWdlcy9Vc2Vycy50cyIsIndlYnBhY2s6Ly9ib3Jpcy8uL3NyYy9jYXJkbWFya2V0L3BhZ2VzL1dhbnRzLnRzIiwid2VicGFjazovL2JvcmlzLy4vc3JjL2NhcmRtYXJrZXQvdXRpbGl0aWVzLnRzIiwid2VicGFjazovL2JvcmlzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JvcmlzL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vYm9yaXMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9ib3Jpcy93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9ib3Jpcy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2JvcmlzL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9ib3Jpcy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBVc2Vyc18xID0gcmVxdWlyZShcIi4vcGFnZXMvVXNlcnNcIik7XG5jb25zdCBTaW5nbGVzXzEgPSByZXF1aXJlKFwiLi9wYWdlcy9TaW5nbGVzXCIpO1xuY29uc3QgU2hvcHBpbmdXaXphcmRfMSA9IHJlcXVpcmUoXCIuL3BhZ2VzL1Nob3BwaW5nV2l6YXJkXCIpO1xuY29uc3QgV2FudHNfMSA9IHJlcXVpcmUoXCIuL3BhZ2VzL1dhbnRzXCIpO1xuaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmNsdWRlcyhcIk1hZ2ljL1VzZXJzXCIpKSB7XG4gICAgKDAsIFVzZXJzXzEuc2hvd1RyZW5kKSgpO1xufVxuaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmNsdWRlcyhcIlByb2R1Y3RzL1NpbmdsZXNcIikpIHtcbiAgICAoMCwgU2luZ2xlc18xLmFkZExpbmtUb1NpbmdsZXMpKCk7XG4gICAgKDAsIFNpbmdsZXNfMS5hZGRDaGVja2JveGVzKSgpO1xufVxuaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmNsdWRlcyhcIkNhcmRzL1wiKSkge1xuICAgICgwLCBTaW5nbGVzXzEuYWRkTGlua1RvU2luZ2xlcykoKTtcbn1cbmlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5jbHVkZXMoXCJTaG9wcGluZ1dpemFyZC9SZXN1bHRzXCIpKSB7XG4gICAgKDAsIFNpbmdsZXNfMS5hZGRMaW5rVG9TaW5nbGVzKSgpO1xuICAgIGlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5jbHVkZXMoXCIvTWFnaWMvV2FudHNcIikpIHtcbiAgICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoJ3Nob3BwaW5nV2l6YXJkJywgKGRhdGEpID0+IHtcbiAgICAgICAgICAgIGlmIChkYXRhLnNob3BwaW5nV2l6YXJkKSB7XG4gICAgICAgICAgICAgICAgKDAsIFNob3BwaW5nV2l6YXJkXzEuYWRkRGlzY2xhaW1lcikoKTtcbiAgICAgICAgICAgICAgICAoMCwgU2hvcHBpbmdXaXphcmRfMS5hZGRMaW5rVG9DYXJkcykoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuaWYgKC9cXFMrXFwvV2FudHNcXC9cXGQrLy50ZXN0KHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSkpIHtcbiAgICAoMCwgV2FudHNfMS5hZGRQcmludExpc3RCdXR0b24pKCk7XG4gICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmNsdWRlcyhcIi9NYWdpYy9XYW50c1wiKSkge1xuICAgICAgICAoMCwgV2FudHNfMS5zYXZlQWxsVXJscykoKTtcbiAgICB9XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5hZGRMaW5rVG9DYXJkcyA9IGV4cG9ydHMuYWRkRGlzY2xhaW1lciA9IHZvaWQgMDtcbmNvbnN0IHNjcnlmYWxsXzEgPSByZXF1aXJlKFwiLi4vLi4vY29tbW9uL3NjcnlmYWxsXCIpO1xuY29uc3QgdXRpbGl0aWVzXzEgPSByZXF1aXJlKFwiLi4vdXRpbGl0aWVzXCIpO1xuZnVuY3Rpb24gYWRkRGlzY2xhaW1lcigpIHtcbiAgICBjb25zdCBzZWN0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImNhcmQtY29sdW1uc1wiKVswXTtcbiAgICBjb25zdCBkaXNjbGFpbWVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImg0XCIpO1xuICAgIGRpc2NsYWltZXIuaW5uZXJIVE1MID0gXCI8aSBzdHlsZT0nY29sb3I6IHJlZDsnPkR1ZSB0byBzb21lIGxpbWl0YXRpb25zLCBzb21lIGxpbmtzIG1heSBub3Qgd29yayBvciBiZSB3cm9uZzwvaT48aHI+XCI7XG4gICAgc2VjdGlvbi5iZWZvcmUoZGlzY2xhaW1lcik7XG59XG5leHBvcnRzLmFkZERpc2NsYWltZXIgPSBhZGREaXNjbGFpbWVyO1xuZnVuY3Rpb24gYWRkTGlua1RvQ2FyZHMoKSB7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtcInVybHNcIl0sIChyZXN1bHQpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgbGV0IHNhdmVkX3VybHMgPSAoX2EgPSByZXN1bHQudXJscykgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogW107XG4gICAgICAgIGZvciAoY29uc3QgdGFibGUgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0Ym9keVwiKSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCByb3cgb2YgdGFibGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0clwiKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNhcmRfaWQgPSAoMCwgdXRpbGl0aWVzXzEuZ2V0X21rbV9pZCkocm93KTtcbiAgICAgICAgICAgICAgICBjb25zdCBjYXJkX3ZlcnNpb24gPSAoMCwgdXRpbGl0aWVzXzEuZ2V0X21rbV92ZXJzaW9uKShyb3cpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNhcmRfZWxlbSA9IHJvdy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiY2FyZC1uYW1lXCIpWzBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNldF90aXRsZSA9IChfYiA9IHJvdy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZXhwYW5zaW9uLXN5bWJvbFwiKVswXSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmdldEF0dHJpYnV0ZShcImRhdGEtb3JpZ2luYWwtdGl0bGVcIik7XG4gICAgICAgICAgICAgICAgaWYgKGNhcmRfaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgeWllbGQgKDAsIHNjcnlmYWxsXzEuZ2V0X2NhcmRtYXJrZXQpKGNhcmRfaWQpLnRoZW4oKGNhcmQpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNhdmVkID0gc2F2ZWRfdXJscy5maWx0ZXIoKHUpID0+IHUubWttX2lkID09IGNhcmRfaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdXJsID0gc2F2ZWQubGVuZ3RoID4gMCA/IHNhdmVkWzBdLnVybCA6ICh5aWVsZCBmb3JtYXRfdXJsKGNhcmQsIGNhcmRfdmVyc2lvbiwgc2V0X3RpdGxlIHx8IFwiXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXJkX2VsZW0uaW5uZXJIVE1MID0gXCI8YSBocmVmPSdcIiArIHVybCArIFwiJyB0YXJnZXQ9J19ibGFuayc+XCIgKyBjYXJkLm5hbWUgKyBcIjwvYT48YnI+LyA8YSBocmVmPSdcIiArIGNhcmQucHVyY2hhc2VfdXJpcy5jYXJkbWFya2V0ICsgXCInIHRhcmdldD0nX2JsYW5rJz5BbGwgcHJpbnRpbmdzPC9hPlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzYXZlZF91cmxzLmZpbHRlcigodSkgPT4gdS5ta21faWQgPT0gY2FyZF9pZCkubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZWRfdXJscy5wdXNoKHsgbmFtZTogY2FyZC5uYW1lLCBta21faWQ6IGNhcmRfaWQsIHVybDogdXJsIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgwLCBzY3J5ZmFsbF8xLmZldGNoX3NpbmdsZSkoY2FyZF9lbGVtLmlubmVySFRNTC5yZXBsYWNlKC9cXChWXFwuXFxkK1xcKS9nLCAnJykpLnRoZW4oKGNhcmQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FyZF9lbGVtLmlubmVySFRNTCA9IFwiPGEgaHJlZj0nXCIgKyBjYXJkLnB1cmNoYXNlX3VyaXMuY2FyZG1hcmtldCArIFwiJyB0YXJnZXQ9J19ibGFuayc+XCIgKyBjYXJkLm5hbWUgKyBcIjxicj4oQWxsKTwvYT5cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBcInVybHNcIjogc2F2ZWRfdXJscyB9KTtcbiAgICB9KSk7XG59XG5leHBvcnRzLmFkZExpbmtUb0NhcmRzID0gYWRkTGlua1RvQ2FyZHM7XG5mdW5jdGlvbiBmb3JtYXRfdXJsKGNhcmQsIHZlcnNpb24sIHNldF90aXRsZSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGlmIChjYXJkLm5hbWUpIHtcbiAgICAgICAgICAgIGxldCBuYW1lID0gY2FyZC5uYW1lO1xuICAgICAgICAgICAgbGV0IHNldCA9IFwiXCI7XG4gICAgICAgICAgICBpZiAodmVyc2lvbikge1xuICAgICAgICAgICAgICAgIHNldCA9IHNldF90aXRsZTtcbiAgICAgICAgICAgICAgICBuYW1lICs9IFwiIFZcIiArIHZlcnNpb247XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzZXRfdHlwZSA9IHNldF90aXRsZSA9PT0gbnVsbCB8fCBzZXRfdGl0bGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHNldF90aXRsZS5zcGxpdChcIjpcIikucG9wKCk7XG4gICAgICAgICAgICAgICAgaWYgKCFjYXJkLnNldF9uYW1lLmluY2x1ZGVzKFwiRXh0cmFzXCIpICYmICFjYXJkLnNldF9uYW1lLmluY2x1ZGVzKFwiUHJvbW9zXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldCA9IGNhcmQuc2V0X25hbWUgKyAoKHNldF90eXBlICYmIChzZXRfdHlwZS5pbmNsdWRlcyhcIkV4dHJhc1wiKSB8fCBzZXRfdHlwZS5pbmNsdWRlcyhcIlByb21vc1wiKSkpID8gc2V0X3R5cGUgOiBcIlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNldCA9IGNhcmQuc2V0X25hbWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0ID0gc2V0LnJlcGxhY2UoXCIgU2V0IFwiLCBcIiBcIik7XG4gICAgICAgICAgICBsZXQgcGF0aCA9IChzZXQgKyBcIi9cIiArIG5hbWUpLnJlcGxhY2UoLyBcXC9cXC8gL2csIFwiLVwiKS5yZXBsYWNlKC86L2csIFwiXCIpLnJlcGxhY2UoLywvZywgXCJcIikucmVwbGFjZSgvXFxzKy9nLCBcIi1cIik7XG4gICAgICAgICAgICBsZXQgdXJsID0gXCJodHRwczovL3d3dy5jYXJkbWFya2V0LmNvbS9NYWdpYy9Qcm9kdWN0cy9TaW5nbGVzL1wiICsgcGF0aDtcbiAgICAgICAgICAgIGlmICh1cmwuaW5jbHVkZXMoXCJcXCdcIikpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdfdXJsID0gdXJsLnJlcGxhY2UoL1xcJy9nLCBcIlwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4geWllbGQgZmV0Y2gobmV3X3VybCkudGhlbigocikgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoci5vayAmJiB1cmxzX2FyZV9lcXVhbChyLnVybCwgbmV3X3VybCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXdfdXJsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3X3VybCA9IHVybC5yZXBsYWNlKC9cXCcvZywgXCItXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHlpZWxkIGZldGNoKG5ld191cmwpLnRoZW4ociA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHIub2sgJiYgdXJsc19hcmVfZXF1YWwoci51cmwsIG5ld191cmwpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXdfdXJsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdXJsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gdXJsc19hcmVfZXF1YWwodXJsMSwgdXJsMikge1xuICAgIHJldHVybiB1cmwxLnNwbGl0KFwiL1wiKS5zbGljZSgtMSlbMF0gPT0gdXJsMi5zcGxpdChcIi9cIikuc2xpY2UoLTEpWzBdO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYWRkQ2hlY2tib3hlcyA9IGV4cG9ydHMuYWRkTGlua1RvU2luZ2xlcyA9IHZvaWQgMDtcbmNvbnN0IHV0aWxpdGllc18xID0gcmVxdWlyZShcIi4uLy4uL2NvbW1vbi91dGlsaXRpZXNcIik7XG5jb25zdCB1dGlsaXRpZXNfMiA9IHJlcXVpcmUoXCIuLi91dGlsaXRpZXNcIik7XG5mdW5jdGlvbiBhZGRMaW5rVG9TaW5nbGVzKCkge1xuICAgIGZvciAoY29uc3QgdXNlciBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic2VsbGVyLW5hbWVcIikpIHtcbiAgICAgICAgY29uc3QgdXNlcl9saW5rID0gdXNlci5nZXRFbGVtZW50c0J5VGFnTmFtZShcImFcIilbMF07XG4gICAgICAgIHVzZXJfbGluay5wYXJlbnRFbGVtZW50LmlubmVySFRNTCArPSBcIiZuYnNwOy0mbmJzcDs8YSBocmVmPSdcIiArIHVzZXJfbGluay5ocmVmICsgXCIvT2ZmZXJzL1NpbmdsZXMvJyB0YXJnZXQ9J19ibGFuayc+U2luZ2xlczwvYT5cIjtcbiAgICB9XG59XG5leHBvcnRzLmFkZExpbmtUb1NpbmdsZXMgPSBhZGRMaW5rVG9TaW5nbGVzO1xuZnVuY3Rpb24gZ2V0UmVmZXJlbmNlKGRlZmF1bHRfcmVmKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KCdyZWZlcmVuY2UnLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLnJlZmVyZW5jZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShkYXRhLnJlZmVyZW5jZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IHJlZmVyZW5jZTogZGVmYXVsdF9yZWYgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKGRlZmF1bHRfcmVmKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gYWRkQ2hlY2tib3hlcygpIHtcbiAgICB2YXIgX2E7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgbGV0IHJlZmVyZW5jZSA9IHlpZWxkIGdldFJlZmVyZW5jZSgxKTtcbiAgICAgICAgY29uc3QgaW5mbyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJpbmZvLWxpc3QtY29udGFpbmVyXCIpWzBdO1xuICAgICAgICBpZiAoaW5mbykge1xuICAgICAgICAgICAgY29uc3Qgcm93cyA9IGluZm8uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJkZFwiKTtcbiAgICAgICAgICAgIGNvbnN0IG5yb3dzID0gNDtcbiAgICAgICAgICAgIGxldCBwcmljZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnJvd3M7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVsZW0gPSByb3dzW3Jvd3MubGVuZ3RoIC0gbnJvd3MgKyBpXTtcbiAgICAgICAgICAgICAgICBwcmljZXMucHVzaCgoMCwgdXRpbGl0aWVzXzIucGFyc2VQcmljZSkoZWxlbS5pbm5lckhUTUwpKTtcbiAgICAgICAgICAgICAgICBlbGVtLmlubmVySFRNTCArPSBcIiZuYnNwOzxpbnB1dCB0eXBlPSdyYWRpbycgbmFtZT0ncmVmZXJlbmNlJyB2YWx1ZT1cIiArIGkgKyAoaSA9PSByZWZlcmVuY2UgPyBcIiBjaGVja2VkXCIgOiBcIlwiKSArIFwiPlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29sb3JQcmljZXMocHJpY2VzW3JlZmVyZW5jZV0pO1xuICAgICAgICAgICAgZm9yIChjb25zdCByYWRpbyBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtuYW1lPVwicmVmZXJlbmNlXCJdJykpIHtcbiAgICAgICAgICAgICAgICByYWRpby5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyByZWZlcmVuY2U6IHRoaXMudmFsdWUgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2UgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgY29sb3JQcmljZXMocHJpY2VzW3RoaXMudmFsdWVdKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIChfYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZE1vcmVCdXR0b25cIikpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gKDAsIHV0aWxpdGllc18xLnNsZWVwKSgzMDAwKS50aGVuKCgpID0+IGNvbG9yUHJpY2VzKHByaWNlc1tyZWZlcmVuY2VdKSkpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5leHBvcnRzLmFkZENoZWNrYm94ZXMgPSBhZGRDaGVja2JveGVzO1xuZnVuY3Rpb24gY29sb3JQcmljZXMocmVmZXJlbmNlX3ByaWNlKSB7XG4gICAgZm9yIChjb25zdCBlbGVtIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwcmljZS1jb250YWluZXJcIikpIHtcbiAgICAgICAgY29uc3QgcHJpY2VfZWxlbSA9IGVsZW0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImZvbnQtd2VpZ2h0LWJvbGRcIilbMF07XG4gICAgICAgIGNvbnN0IHBsYXlzZXRfZWxlbSA9IHByaWNlX2VsZW0ucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ0ZXh0LW11dGVkXCIpO1xuICAgICAgICBsZXQgcHB1ID0gMDtcbiAgICAgICAgaWYgKHBsYXlzZXRfZWxlbS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBwcHUgPSAoMCwgdXRpbGl0aWVzXzIucGFyc2VQUFUpKHBsYXlzZXRfZWxlbVswXS5pbm5lckhUTUwpO1xuICAgICAgICB9XG4gICAgICAgIHByaWNlX2VsZW0uY2xhc3NMaXN0LnJlbW92ZShcImNvbG9yLXByaW1hcnlcIik7XG4gICAgICAgIGlmIChwcmljZV9lbGVtKSB7XG4gICAgICAgICAgICBpZiAoKHBwdSA+IDAgJiYgcHB1IDw9IHJlZmVyZW5jZV9wcmljZSkgfHwgKDAsIHV0aWxpdGllc18yLnBhcnNlUHJpY2UpKHByaWNlX2VsZW0uaW5uZXJIVE1MLnJlcGxhY2UoXCIg4oKsXCIsIFwiXCIpKSA8PSByZWZlcmVuY2VfcHJpY2UpIHtcbiAgICAgICAgICAgICAgICBwcmljZV9lbGVtLnN0eWxlLmNvbG9yID0gXCJncmVlblwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcHJpY2VfZWxlbS5zdHlsZS5jb2xvciA9IFwicmVkXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuc2hvd1RyZW5kID0gdm9pZCAwO1xuY29uc3Qgc2NyeWZhbGxfMSA9IHJlcXVpcmUoXCIuLi8uLi9jb21tb24vc2NyeWZhbGxcIik7XG5jb25zdCB1dGlsaXRpZXNfMSA9IHJlcXVpcmUoXCIuLi91dGlsaXRpZXNcIik7XG5mdW5jdGlvbiBzaG93VHJlbmQoKSB7XG4gICAgdmFyIF9hO1xuICAgIGNvbnN0IHRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJVc2VyT2ZmZXJzVGFibGVcIik7XG4gICAgaWYgKHRhYmxlKSB7XG4gICAgICAgIGNvbnN0IGxlZ2VuZGFfZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgbGVnZW5kYV9kaXYuaW5uZXJIVE1MID0gXCI8aHI+PHAgY2xhc3M9J2ZvbnQtd2VpZ2h0LWJvbGQnPkUgPSBFeGFjdCBzZXQgLyBMID0gTG93ZXN0IEF2YWlsYmxlIDxicj48c3BhbiBzdHlsZT0nY29sb3I6IGdyZWVuJz5Mb3dlciBwcmljZTwvc3Bhbj4gLyA8c3BhbiBzdHlsZT0nY29sb3I6IHJlZCc+SGlnaGVyIHByaWNlPC9zcGFuPiAvIDxzcGFuIHN0eWxlPSdjb2xvcjogZGFya3Zpb2xldCc+Rm9pbCBbIDxpPm5vdCBzdXBwb3J0ZWQ8L2k+IF08L3NwYW4+IC8gPHNwYW4gY2xhc3M9J2NvbG9yLXByaW1hcnknPlByaWNlIG5vdCBmb3VuZDwvc3BhbjwvcD5cIjtcbiAgICAgICAgdGFibGUuYmVmb3JlKGxlZ2VuZGFfZGl2KTtcbiAgICAgICAgY29uc3Qgcm93cyA9IHRhYmxlLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tpZF49YXJ0aWNsZVJvd10nKTtcbiAgICAgICAgZm9yIChjb25zdCByb3cgb2Ygcm93cykge1xuICAgICAgICAgICAgY29uc3QgY2FyZF91cmwgPSByb3cuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImNvbC1zZWxsZXJcIilbMF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJhXCIpWzBdLmhyZWYuc3BsaXQoXCI/XCIpWzBdLnNwbGl0KFwiL1wiKTtcbiAgICAgICAgICAgIGxldCBjYXJkX25hbWUgPSAoX2EgPSBjYXJkX3VybC5wb3AoKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnJlcGxhY2UoLy1WXFxkKy8sICcnKTtcbiAgICAgICAgICAgIGxldCBjYXJkX2lkID0gKDAsIHV0aWxpdGllc18xLmdldF9ta21faWQpKHJvdyk7XG4gICAgICAgICAgICBsZXQgZm9pbCA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKHJvdy5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1vcmlnaW5hbC10aXRsZT1cIkZvaWxcIl0nKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9pbCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBQcm9taXNlLmFsbChbKDAsIHNjcnlmYWxsXzEuZ2V0X2NoZWFwZXN0KShjYXJkX25hbWUpLCAoMCwgc2NyeWZhbGxfMS5nZXRfY2FyZG1hcmtldCkoY2FyZF9pZCldKS50aGVuKHJlc3BvbnNlcyA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZSwgX2Y7XG4gICAgICAgICAgICAgICAgY29uc3QgY2hlYXBlc3QgPSByZXNwb25zZXNbMF07XG4gICAgICAgICAgICAgICAgY29uc3QgZXhhY3QgPSByZXNwb25zZXNbMV07XG4gICAgICAgICAgICAgICAgY29uc3QgcHJpY2VfZWxlbSA9IHJvdy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicHJpY2UtY29udGFpbmVyXCIpWzBdLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJmb250LXdlaWdodC1ib2xkXCIpWzBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsX3ByaWNlID0gKDAsIHV0aWxpdGllc18xLnBhcnNlUHJpY2UpKHByaWNlX2VsZW0uaW5uZXJIVE1MLnJlcGxhY2UoXCIg4oKsXCIsIFwiXCIpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBwbGF5c2V0X2VsZW0gPSBwcmljZV9lbGVtLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwidGV4dC1tdXRlZFwiKTtcbiAgICAgICAgICAgICAgICBsZXQgcHB1ID0gMDtcbiAgICAgICAgICAgICAgICBpZiAocGxheXNldF9lbGVtLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcHB1ID0gKDAsIHV0aWxpdGllc18xLnBhcnNlUFBVKShwbGF5c2V0X2VsZW1bMF0uaW5uZXJIVE1MKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IGNoZWFwZXN0X2NvbG9yID0gXCJcIiwgY2hlYXBlc3RfcHJpY2UgPSAwO1xuICAgICAgICAgICAgICAgIGxldCBleGFjdF9jb2xvciA9IFwiXCIsIGV4YWN0X3ByaWNlID0gMDtcbiAgICAgICAgICAgICAgICBpZiAoY2hlYXBlc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hlYXBlc3RfcHJpY2UgPSBwYXJzZUZsb2F0KChfYiA9IChfYSA9IGNoZWFwZXN0LnByaWNlcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmV1cikgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogKF9jID0gY2hlYXBlc3QucHJpY2VzKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MuZXVyX2ZvaWwpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hlYXBlc3RfcHJpY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWFwZXN0X2NvbG9yID0gKGZvaWwgPyBcImRhcmt2aW9sZXRcIiA6IGNvbG9yX2Zyb21fcHJpY2Uob3JpZ2luYWxfcHJpY2UsIGNoZWFwZXN0X3ByaWNlLCBwcHUpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZXhhY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgZXhhY3RfcHJpY2UgPSBwYXJzZUZsb2F0KChfZSA9IChfZCA9IGV4YWN0LnByaWNlcykgPT09IG51bGwgfHwgX2QgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9kLmV1cikgIT09IG51bGwgJiYgX2UgIT09IHZvaWQgMCA/IF9lIDogKF9mID0gZXhhY3QucHJpY2VzKSA9PT0gbnVsbCB8fCBfZiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2YuZXVyX2ZvaWwpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXhhY3RfcHJpY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4YWN0X2NvbG9yID0gKGZvaWwgPyBcImRhcmt2aW9sZXRcIiA6IGNvbG9yX2Zyb21fcHJpY2Uob3JpZ2luYWxfcHJpY2UsIGV4YWN0X3ByaWNlLCBwcHUpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgb3JpZ2luYWxfY29sb3IgPSBjaGVhcGVzdF9jb2xvciAmJiBleGFjdF9jb2xvcjtcbiAgICAgICAgICAgICAgICBwcmljZV9lbGVtLmlubmVySFRNTCA9IFwiPHNwYW4gc3R5bGU9J2NvbG9yOiBcIiArIG9yaWdpbmFsX2NvbG9yICsgXCInPlwiICsgcHJpY2VfZWxlbS5pbm5lckhUTUwgKyBcIjxzcGFuPlwiO1xuICAgICAgICAgICAgICAgIGlmICghZm9pbCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXhhY3RfcHJpY2UgPiAwICYmIGNoZWFwZXN0LmlkICE9IGV4YWN0LmlkKVxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2VfZWxlbS5pbm5lckhUTUwgKz0gXCI8YnI+PHNwYW4gc3R5bGU9J2NvbG9yOiBcIiArIGV4YWN0X2NvbG9yICsgXCI7JyA+RSA8L3NwYW4+PGEgc3R5bGU9J2NvbG9yOiBibGFjaycgaHJlZj0nXCIgKyBleGFjdC5zY3J5ZmFsbF91cmkgKyBcIic+IFwiICsgZXhhY3RfcHJpY2UudG9Mb2NhbGVTdHJpbmcoXCJpdC1JVFwiLCB7IG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMiB9KSArIFwiIOKCrDwvYT5cIjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWFwZXN0X3ByaWNlID4gMClcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlX2VsZW0uaW5uZXJIVE1MICs9IFwiPGJyPjxzcGFuIHN0eWxlPSdjb2xvcjogXCIgKyBjaGVhcGVzdF9jb2xvciArIFwiOyc+XCIgKyAoY2hlYXBlc3QuaWQgPT0gZXhhY3QuaWQgPyBcIkU9XCIgOiBcIlwiKSArIFwiTCA8L3NwYW4+PGEgc3R5bGU9J2NvbG9yOiBibGFjaycgaHJlZj0nXCIgKyBjaGVhcGVzdC5zY3J5ZmFsbF91cmkgKyBcIic+IFwiICsgY2hlYXBlc3RfcHJpY2UudG9Mb2NhbGVTdHJpbmcoXCJpdC1JVFwiLCB7IG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMiB9KSArIFwiIOKCrDwvYT5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydHMuc2hvd1RyZW5kID0gc2hvd1RyZW5kO1xuZnVuY3Rpb24gY29sb3JfZnJvbV9wcmljZShvbGRfcHJpY2UsIG5ld19wcmljZSwgcHB1KSB7XG4gICAgaWYgKChwcHUgPiAwICYmIHBwdSA+IG5ld19wcmljZSkgfHwgb2xkX3ByaWNlID4gbmV3X3ByaWNlKSB7XG4gICAgICAgIHJldHVybiBcInJlZFwiO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFwiZ3JlZW5cIjtcbiAgICB9XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5zYXZlQWxsVXJscyA9IGV4cG9ydHMuYWRkUHJpbnRMaXN0QnV0dG9uID0gdm9pZCAwO1xuY29uc3Qgc2NyeWZhbGxfMSA9IHJlcXVpcmUoXCIuLi8uLi9jb21tb24vc2NyeWZhbGxcIik7XG5jb25zdCB1dGlsaXRpZXNfMSA9IHJlcXVpcmUoXCIuLi8uLi9jb21tb24vdXRpbGl0aWVzXCIpO1xuY29uc3QgdXRpbGl0aWVzXzIgPSByZXF1aXJlKFwiLi4vdXRpbGl0aWVzXCIpO1xuZnVuY3Rpb24gYWRkUHJpbnRMaXN0QnV0dG9uKCkge1xuICAgIHZhciBfYTtcbiAgICBjb25zdCB0YWJsZSA9IChfYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiV2FudHNMaXN0VGFibGVcIikpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRib2R5XCIpWzBdO1xuICAgIGlmICh0YWJsZSkge1xuICAgICAgICBjb25zdCBidG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiYVtocmVmJD0nQWRkRGVja0xpc3QnXVwiKVswXTsgLy8gJD0gLS0+IGVuZGluZyB3aXRoXG4gICAgICAgIGJ0bi5jbGFzc0xpc3QuYWRkKFwibXItM1wiKTtcbiAgICAgICAgY29uc3QgcHJpbnRCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBwcmludEJ0bi5jbGFzc0xpc3QuYWRkKFwiYnRuXCIpO1xuICAgICAgICBwcmludEJ0bi5zdHlsZS5jb2xvciA9IFwicmdiKDI0MCwgMTczLCA3OClcIjtcbiAgICAgICAgcHJpbnRCdG4uc3R5bGUuYm9yZGVyQ29sb3IgPSBcInJnYigyNDAsIDE3MywgNzgpXCI7XG4gICAgICAgIHByaW50QnRuLmlubmVySFRNTCA9IFwiPHNwYW4+U2F2ZSBhcy4uLjwvc3Bhbj5cIjtcbiAgICAgICAgcHJpbnRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KCdwcmludFZlcnNpb24nLCAoZGF0YSkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgICAgICBjb25zdCB3YW50c190aXRsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwYWdlLXRpdGxlLWNvbnRhaW5lclwiKVswXS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImgxXCIpWzBdLmlubmVySFRNTDtcbiAgICAgICAgICAgICAgICBsZXQgbGlzdCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJpbnRWZXJzaW9uID0gKF9hID0gZGF0YS5wcmludFZlcnNpb24pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmIChwcmludFZlcnNpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCByb3cgb2YgdGFibGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIm5hbWVcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuYW1lID0gcm93LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYVwiKVswXS5pbm5lckhUTUw7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0ICs9IG5hbWUgKyBcIlxcblwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiB0YWJsZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRyXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjYXJkX2lkID0gKDAsIHV0aWxpdGllc18yLmdldF9ta21faWQpKHJvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FyZF9pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHlpZWxkICgwLCBzY3J5ZmFsbF8xLmdldF9jYXJkbWFya2V0KShjYXJkX2lkKS50aGVuKChjYXJkKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfYjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdCArPSAoKF9iID0gY2FyZC5uYW1lKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBcIlwiKSArIFwiXFxuXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICgwLCB1dGlsaXRpZXNfMS5zYXZlV2l0aEZpbGVQaWNrZXIpKG5ldyBCbG9iKFtsaXN0XSksIHdhbnRzX3RpdGxlID8gd2FudHNfdGl0bGUgKyBcIi50eHRcIiA6IFwid2FudHMudHh0XCIpO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9KTtcbiAgICAgICAgYnRuLmFmdGVyKHByaW50QnRuKTtcbiAgICB9XG59XG5leHBvcnRzLmFkZFByaW50TGlzdEJ1dHRvbiA9IGFkZFByaW50TGlzdEJ1dHRvbjtcbmZ1bmN0aW9uIHNhdmVBbGxVcmxzKCkge1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbXCJ1cmxzXCJdLCAocmVzdWx0KSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIGxldCBzYXZlZF91cmxzID0gKF9hID0gcmVzdWx0LnVybHMpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IFtdO1xuICAgICAgICBjb25zdCByb3dzID0gKF9iID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJXYW50c0xpc3RUYWJsZVwiKSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGJvZHlcIilbMF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0clwiKTtcbiAgICAgICAgaWYgKHJvd3MpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qgcm93IG9mIHJvd3MpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjYXJkX3VybCA9ICgwLCB1dGlsaXRpZXNfMi5nZXRfbWttX3VybCkocm93KTtcbiAgICAgICAgICAgICAgICBpZiAoY2FyZF91cmwgJiYgY2FyZF91cmwuaW5jbHVkZXMoXCIvUHJvZHVjdHMvU2luZ2xlcy9cIikpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2FyZF9pZCA9ICgwLCB1dGlsaXRpZXNfMi5nZXRfbWttX2lkKShyb3cpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2FyZF9pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgeWllbGQgKDAsIHNjcnlmYWxsXzEuZ2V0X2NhcmRtYXJrZXQpKGNhcmRfaWQpLnRoZW4oKGNhcmQpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FyZC5uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzYXZlZF91cmxzLmZpbHRlcigodSkgPT4gdS5ta21faWQgPT0gY2FyZF9pZCkubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVkX3VybHMucHVzaCh7IG5hbWU6IGNhcmQubmFtZSwgbWttX2lkOiBjYXJkX2lkLCB1cmw6IGNhcmRfdXJsIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgXCJ1cmxzXCI6IHNhdmVkX3VybHMgfSk7XG4gICAgICAgIH1cbiAgICB9KSk7XG59XG5leHBvcnRzLnNhdmVBbGxVcmxzID0gc2F2ZUFsbFVybHM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMucGFyc2VQUFUgPSBleHBvcnRzLnBhcnNlUHJpY2UgPSBleHBvcnRzLmdldF9ta21fdXJsID0gZXhwb3J0cy5nZXRfbWttX3ZlcnNpb24gPSBleHBvcnRzLmdldF9ta21faWQgPSB2b2lkIDA7XG5mdW5jdGlvbiBnZXRfbWttX2lkKHJvdykge1xuICAgIHZhciBfYSwgX2I7XG4gICAgcmV0dXJuICgoX2IgPSAoX2EgPSByb3cuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImZvbnRpY29uLWNhbWVyYVwiKVswXSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmdldEF0dHJpYnV0ZShcImRhdGEtb3JpZ2luYWwtdGl0bGVcIikpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5zcGxpdCgvXFwuanBnL2cpWzBdLnNwbGl0KFwiL1wiKS5zcGxpY2UoLTEpWzBdKSB8fCBcIlwiO1xufVxuZXhwb3J0cy5nZXRfbWttX2lkID0gZ2V0X21rbV9pZDtcbmZ1bmN0aW9uIGdldF9ta21fdmVyc2lvbihyb3cpIHtcbiAgICB2YXIgX2EsIF9iO1xuICAgIGNvbnN0IGFsdCA9ICgoX2IgPSAoX2EgPSByb3cuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImZvbnRpY29uLWNhbWVyYVwiKVswXSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmdldEF0dHJpYnV0ZShcImRhdGEtb3JpZ2luYWwtdGl0bGVcIikpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5tYXRjaCgvYWx0PVxcXCIoLio/KVxcXCIvKVsxXSkgfHwgXCJcIjtcbiAgICBjb25zdCB2ZXJzaW9uID0gYWx0Lm1hdGNoKC9cXChWXFwuKC4qPylcXCkvKTtcbiAgICByZXR1cm4gdmVyc2lvbiAhPSBudWxsID8gdmVyc2lvblsxXSA6IFwiXCI7XG59XG5leHBvcnRzLmdldF9ta21fdmVyc2lvbiA9IGdldF9ta21fdmVyc2lvbjtcbmZ1bmN0aW9uIGdldF9ta21fdXJsKHJvdykge1xuICAgIHZhciBfYSwgX2I7XG4gICAgcmV0dXJuIChfYiA9IChfYSA9IHJvdy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwibmFtZVwiKVswXSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYVwiKVswXSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmhyZWYuc3BsaXQoXCI/XCIpWzBdO1xufVxuZXhwb3J0cy5nZXRfbWttX3VybCA9IGdldF9ta21fdXJsO1xuZnVuY3Rpb24gcGFyc2VQcmljZShwcmljZSkge1xuICAgIHJldHVybiBwYXJzZUZsb2F0KHByaWNlLnJlcGxhY2UoXCIuXCIsIFwiXCIpLm1hdGNoKC9cXGQrXFwsXFxkKy8pWzBdLnJlcGxhY2UoXCIsXCIsIFwiLlwiKSk7XG59XG5leHBvcnRzLnBhcnNlUHJpY2UgPSBwYXJzZVByaWNlO1xuZnVuY3Rpb24gcGFyc2VQUFUocHB1KSB7XG4gICAgcmV0dXJuIHBhcnNlRmxvYXQocHB1Lm1hdGNoKC9cXGQqXFwuP1xcZCsoXFwsXFxkKyk/L2cpWzBdLnJlcGxhY2UoXCIuXCIsIFwiXCIpLnJlcGxhY2UoXCIsXCIsIFwiLlwiKSk7XG59XG5leHBvcnRzLnBhcnNlUFBVID0gcGFyc2VQUFU7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHZhciByID0gZm4oKTtcblx0XHRcdGlmIChyICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJjYXJkbWFya2V0L2NvbnRlbnRfc2NyaXB0XCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbl9fd2VicGFja19yZXF1aXJlX18uTy5qID0gKGNodW5rSWQpID0+IChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApO1xuXG4vLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbnZhciB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiwgZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcblx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG5cdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDA7XG5cdGlmKGNodW5rSWRzLnNvbWUoKGlkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2lkXSAhPT0gMCkpKSB7XG5cdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihydW50aW1lKSB2YXIgcmVzdWx0ID0gcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0fVxuXHRpZihwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbikgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua2JvcmlzXCJdID0gc2VsZltcIndlYnBhY2tDaHVua2JvcmlzXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvY2FyZG1hcmtldC9jb250ZW50X3NjcmlwdC50c1wiKSkpXG5fX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9
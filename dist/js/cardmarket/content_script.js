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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZG1hcmtldC9jb250ZW50X3NjcmlwdC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsZ0JBQWdCLG1CQUFPLENBQUMsc0RBQWU7QUFDdkMsa0JBQWtCLG1CQUFPLENBQUMsMERBQWlCO0FBQzNDLHlCQUF5QixtQkFBTyxDQUFDLHdFQUF3QjtBQUN6RCxnQkFBZ0IsbUJBQU8sQ0FBQyxzREFBZTtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDNUJhO0FBQ2I7QUFDQSw0QkFBNEIsK0RBQStELGlCQUFpQjtBQUM1RztBQUNBLG9DQUFvQyxNQUFNLCtCQUErQixZQUFZO0FBQ3JGLG1DQUFtQyxNQUFNLG1DQUFtQyxZQUFZO0FBQ3hGLGdDQUFnQztBQUNoQztBQUNBLEtBQUs7QUFDTDtBQUNBLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxzQkFBc0IsR0FBRyxxQkFBcUI7QUFDOUMsbUJBQW1CLG1CQUFPLENBQUMsdURBQXVCO0FBQ2xELG9CQUFvQixtQkFBTyxDQUFDLG1EQUFjO0FBQzFDO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRDtBQUNqRDtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0QsNENBQTRDO0FBQzlGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLG9CQUFvQjtBQUN2RCxLQUFLO0FBQ0w7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUN2R2E7QUFDYjtBQUNBLDRCQUE0QiwrREFBK0QsaUJBQWlCO0FBQzVHO0FBQ0Esb0NBQW9DLE1BQU0sK0JBQStCLFlBQVk7QUFDckYsbUNBQW1DLE1BQU0sbUNBQW1DLFlBQVk7QUFDeEYsZ0NBQWdDO0FBQ2hDO0FBQ0EsS0FBSztBQUNMO0FBQ0EsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELHFCQUFxQixHQUFHLHdCQUF3QjtBQUNoRCxvQkFBb0IsbUJBQU8sQ0FBQyx5REFBd0I7QUFDcEQsb0JBQW9CLG1CQUFPLENBQUMsbURBQWM7QUFDMUM7QUFDQTtBQUNBO0FBQ0Esb0RBQW9ELE9BQU87QUFDM0Q7QUFDQTtBQUNBLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLHdCQUF3QjtBQUN0RTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixXQUFXO0FBQ3ZDO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMsdUJBQXVCO0FBQ3JFO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUNuRmE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsaUJBQWlCO0FBQ2pCLG1CQUFtQixtQkFBTyxDQUFDLHVEQUF1QjtBQUNsRCxvQkFBb0IsbUJBQU8sQ0FBQyxtREFBYztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2RkFBNkYsaUhBQWlILDBCQUEwQjtBQUN4TztBQUNBLGdHQUFnRyxxS0FBcUssMEJBQTBCO0FBQy9SO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ2xFYTtBQUNiO0FBQ0EsNEJBQTRCLCtEQUErRCxpQkFBaUI7QUFDNUc7QUFDQSxvQ0FBb0MsTUFBTSwrQkFBK0IsWUFBWTtBQUNyRixtQ0FBbUMsTUFBTSxtQ0FBbUMsWUFBWTtBQUN4RixnQ0FBZ0M7QUFDaEM7QUFDQSxLQUFLO0FBQ0w7QUFDQSw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsbUJBQW1CLEdBQUcsMEJBQTBCO0FBQ2hELG1CQUFtQixtQkFBTyxDQUFDLHVEQUF1QjtBQUNsRCxvQkFBb0IsbUJBQU8sQ0FBQyx5REFBd0I7QUFDcEQsb0JBQW9CLG1CQUFPLENBQUMsbURBQWM7QUFDMUM7QUFDQSx3RUFBd0U7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtELGlEQUFpRDtBQUNuRztBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxvQkFBb0I7QUFDdkQsS0FBSztBQUNMO0FBQ0EsbUJBQW1COzs7Ozs7Ozs7OztBQzFFTjtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxnQkFBZ0IsR0FBRyxrQkFBa0IsR0FBRyxtQkFBbUIsR0FBRyx1QkFBdUIsR0FBRyxrQkFBa0I7QUFDMUc7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7Ozs7Ozs7VUMzQmhCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7Ozs7V0N6QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSwrQkFBK0Isd0NBQXdDO1dBQ3ZFO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUJBQWlCLHFCQUFxQjtXQUN0QztXQUNBO1dBQ0Esa0JBQWtCLHFCQUFxQjtXQUN2QztXQUNBO1dBQ0EsS0FBSztXQUNMO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0MzQkE7Ozs7O1dDQUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYm9yaXMvLi9zcmMvY2FyZG1hcmtldC9jb250ZW50X3NjcmlwdC50cyIsIndlYnBhY2s6Ly9ib3Jpcy8uL3NyYy9jYXJkbWFya2V0L3BhZ2VzL1Nob3BwaW5nV2l6YXJkLnRzIiwid2VicGFjazovL2JvcmlzLy4vc3JjL2NhcmRtYXJrZXQvcGFnZXMvU2luZ2xlcy50cyIsIndlYnBhY2s6Ly9ib3Jpcy8uL3NyYy9jYXJkbWFya2V0L3BhZ2VzL1VzZXJzLnRzIiwid2VicGFjazovL2JvcmlzLy4vc3JjL2NhcmRtYXJrZXQvcGFnZXMvV2FudHMudHMiLCJ3ZWJwYWNrOi8vYm9yaXMvLi9zcmMvY2FyZG1hcmtldC91dGlsaXRpZXMudHMiLCJ3ZWJwYWNrOi8vYm9yaXMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYm9yaXMvd2VicGFjay9ydW50aW1lL2NodW5rIGxvYWRlZCIsIndlYnBhY2s6Ly9ib3Jpcy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JvcmlzL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2JvcmlzL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vYm9yaXMvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2JvcmlzL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IFVzZXJzXzEgPSByZXF1aXJlKFwiLi9wYWdlcy9Vc2Vyc1wiKTtcbmNvbnN0IFNpbmdsZXNfMSA9IHJlcXVpcmUoXCIuL3BhZ2VzL1NpbmdsZXNcIik7XG5jb25zdCBTaG9wcGluZ1dpemFyZF8xID0gcmVxdWlyZShcIi4vcGFnZXMvU2hvcHBpbmdXaXphcmRcIik7XG5jb25zdCBXYW50c18xID0gcmVxdWlyZShcIi4vcGFnZXMvV2FudHNcIik7XG5pZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKFwiVXNlcnNcIikpIHtcbiAgICAoMCwgVXNlcnNfMS5zaG93VHJlbmQpKCk7XG59XG5pZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKFwiUHJvZHVjdHMvU2luZ2xlc1wiKSkge1xuICAgICgwLCBTaW5nbGVzXzEuYWRkTGlua1RvU2luZ2xlcykoKTtcbiAgICAoMCwgU2luZ2xlc18xLmFkZENoZWNrYm94ZXMpKCk7XG59XG5pZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKFwiQ2FyZHMvXCIpKSB7XG4gICAgKDAsIFNpbmdsZXNfMS5hZGRMaW5rVG9TaW5nbGVzKSgpO1xufVxuaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmNsdWRlcyhcIlNob3BwaW5nV2l6YXJkL1Jlc3VsdHNcIikpIHtcbiAgICAoMCwgU2luZ2xlc18xLmFkZExpbmtUb1NpbmdsZXMpKCk7XG4gICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoJ3Nob3BwaW5nV2l6YXJkJywgKGRhdGEpID0+IHtcbiAgICAgICAgaWYgKGRhdGEuc2hvcHBpbmdXaXphcmQpIHtcbiAgICAgICAgICAgICgwLCBTaG9wcGluZ1dpemFyZF8xLmFkZERpc2NsYWltZXIpKCk7XG4gICAgICAgICAgICAoMCwgU2hvcHBpbmdXaXphcmRfMS5hZGRMaW5rVG9DYXJkcykoKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuaWYgKC9cXFMrXFwvV2FudHNcXC9cXGQrLy50ZXN0KHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSkpIHtcbiAgICAoMCwgV2FudHNfMS5hZGRQcmludExpc3RCdXR0b24pKCk7XG4gICAgKDAsIFdhbnRzXzEuc2F2ZUFsbFVybHMpKCk7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5hZGRMaW5rVG9DYXJkcyA9IGV4cG9ydHMuYWRkRGlzY2xhaW1lciA9IHZvaWQgMDtcbmNvbnN0IHNjcnlmYWxsXzEgPSByZXF1aXJlKFwiLi4vLi4vY29tbW9uL3NjcnlmYWxsXCIpO1xuY29uc3QgdXRpbGl0aWVzXzEgPSByZXF1aXJlKFwiLi4vdXRpbGl0aWVzXCIpO1xuZnVuY3Rpb24gYWRkRGlzY2xhaW1lcigpIHtcbiAgICBjb25zdCBzZWN0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImNhcmQtY29sdW1uc1wiKVswXTtcbiAgICBjb25zdCBkaXNjbGFpbWVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImg0XCIpO1xuICAgIGRpc2NsYWltZXIuaW5uZXJIVE1MID0gXCI8aSBzdHlsZT0nY29sb3I6IHJlZDsnPkR1ZSB0byBzb21lIGxpbWl0YXRpb25zLCBzb21lIGxpbmtzIG1heSBub3Qgd29yayBvciBiZSB3cm9uZzwvaT48aHI+XCI7XG4gICAgc2VjdGlvbi5iZWZvcmUoZGlzY2xhaW1lcik7XG59XG5leHBvcnRzLmFkZERpc2NsYWltZXIgPSBhZGREaXNjbGFpbWVyO1xuZnVuY3Rpb24gYWRkTGlua1RvQ2FyZHMoKSB7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtcInVybHNcIl0sIChyZXN1bHQpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgbGV0IHNhdmVkX3VybHMgPSAoX2EgPSByZXN1bHQudXJscykgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogW107XG4gICAgICAgIGZvciAoY29uc3QgdGFibGUgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0Ym9keVwiKSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCByb3cgb2YgdGFibGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0clwiKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNhcmRfaWQgPSAoMCwgdXRpbGl0aWVzXzEuZ2V0X21rbV9pZCkocm93KTtcbiAgICAgICAgICAgICAgICBjb25zdCBjYXJkX3ZlcnNpb24gPSAoMCwgdXRpbGl0aWVzXzEuZ2V0X21rbV92ZXJzaW9uKShyb3cpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNhcmRfZWxlbSA9IHJvdy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiY2FyZC1uYW1lXCIpWzBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNldF90aXRsZSA9IChfYiA9IHJvdy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZXhwYW5zaW9uLXN5bWJvbFwiKVswXSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmdldEF0dHJpYnV0ZShcImRhdGEtb3JpZ2luYWwtdGl0bGVcIik7XG4gICAgICAgICAgICAgICAgaWYgKGNhcmRfaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgeWllbGQgKDAsIHNjcnlmYWxsXzEuZ2V0X2NhcmRtYXJrZXQpKGNhcmRfaWQpLnRoZW4oKGNhcmQpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNhdmVkID0gc2F2ZWRfdXJscy5maWx0ZXIoKHUpID0+IHUubWttX2lkID09IGNhcmRfaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdXJsID0gc2F2ZWQubGVuZ3RoID4gMCA/IHNhdmVkWzBdLnVybCA6ICh5aWVsZCBmb3JtYXRfdXJsKGNhcmQsIGNhcmRfdmVyc2lvbiwgc2V0X3RpdGxlIHx8IFwiXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXJkX2VsZW0uaW5uZXJIVE1MID0gXCI8YSBocmVmPSdcIiArIHVybCArIFwiJyB0YXJnZXQ9J19ibGFuayc+XCIgKyBjYXJkLm5hbWUgKyBcIjwvYT48YnI+LyA8YSBocmVmPSdcIiArIGNhcmQucHVyY2hhc2VfdXJpcy5jYXJkbWFya2V0ICsgXCInIHRhcmdldD0nX2JsYW5rJz5BbGwgcHJpbnRpbmdzPC9hPlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzYXZlZF91cmxzLmZpbHRlcigodSkgPT4gdS5ta21faWQgPT0gY2FyZF9pZCkubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZWRfdXJscy5wdXNoKHsgbmFtZTogY2FyZC5uYW1lLCBta21faWQ6IGNhcmRfaWQsIHVybDogdXJsIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgwLCBzY3J5ZmFsbF8xLmZldGNoX3NpbmdsZSkoY2FyZF9lbGVtLmlubmVySFRNTC5yZXBsYWNlKC9cXChWXFwuXFxkK1xcKS9nLCAnJykpLnRoZW4oKGNhcmQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FyZF9lbGVtLmlubmVySFRNTCA9IFwiPGEgaHJlZj0nXCIgKyBjYXJkLnB1cmNoYXNlX3VyaXMuY2FyZG1hcmtldCArIFwiJyB0YXJnZXQ9J19ibGFuayc+XCIgKyBjYXJkLm5hbWUgKyBcIjxicj4oQWxsKTwvYT5cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBcInVybHNcIjogc2F2ZWRfdXJscyB9KTtcbiAgICB9KSk7XG59XG5leHBvcnRzLmFkZExpbmtUb0NhcmRzID0gYWRkTGlua1RvQ2FyZHM7XG5mdW5jdGlvbiBmb3JtYXRfdXJsKGNhcmQsIHZlcnNpb24sIHNldF90aXRsZSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGlmIChjYXJkLm5hbWUpIHtcbiAgICAgICAgICAgIGxldCBuYW1lID0gY2FyZC5uYW1lO1xuICAgICAgICAgICAgbGV0IHNldCA9IFwiXCI7XG4gICAgICAgICAgICBpZiAodmVyc2lvbikge1xuICAgICAgICAgICAgICAgIHNldCA9IHNldF90aXRsZTtcbiAgICAgICAgICAgICAgICBuYW1lICs9IFwiIFZcIiArIHZlcnNpb247XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzZXRfdHlwZSA9IHNldF90aXRsZSA9PT0gbnVsbCB8fCBzZXRfdGl0bGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHNldF90aXRsZS5zcGxpdChcIjpcIikucG9wKCk7XG4gICAgICAgICAgICAgICAgaWYgKCFjYXJkLnNldF9uYW1lLmluY2x1ZGVzKFwiRXh0cmFzXCIpICYmICFjYXJkLnNldF9uYW1lLmluY2x1ZGVzKFwiUHJvbW9zXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldCA9IGNhcmQuc2V0X25hbWUgKyAoKHNldF90eXBlICYmIChzZXRfdHlwZS5pbmNsdWRlcyhcIkV4dHJhc1wiKSB8fCBzZXRfdHlwZS5pbmNsdWRlcyhcIlByb21vc1wiKSkpID8gc2V0X3R5cGUgOiBcIlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNldCA9IGNhcmQuc2V0X25hbWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0ID0gc2V0LnJlcGxhY2UoXCIgU2V0IFwiLCBcIiBcIik7XG4gICAgICAgICAgICBsZXQgcGF0aCA9IChzZXQgKyBcIi9cIiArIG5hbWUpLnJlcGxhY2UoLyBcXC9cXC8gL2csIFwiLVwiKS5yZXBsYWNlKC86L2csIFwiXCIpLnJlcGxhY2UoLywvZywgXCJcIikucmVwbGFjZSgvXFxzKy9nLCBcIi1cIik7XG4gICAgICAgICAgICBsZXQgdXJsID0gXCJodHRwczovL3d3dy5jYXJkbWFya2V0LmNvbS9NYWdpYy9Qcm9kdWN0cy9TaW5nbGVzL1wiICsgcGF0aDtcbiAgICAgICAgICAgIGlmICh1cmwuaW5jbHVkZXMoXCJcXCdcIikpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdfdXJsID0gdXJsLnJlcGxhY2UoL1xcJy9nLCBcIlwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4geWllbGQgZmV0Y2gobmV3X3VybCkudGhlbigocikgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoci5vayAmJiB1cmxzX2FyZV9lcXVhbChyLnVybCwgbmV3X3VybCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXdfdXJsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3X3VybCA9IHVybC5yZXBsYWNlKC9cXCcvZywgXCItXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHlpZWxkIGZldGNoKG5ld191cmwpLnRoZW4ociA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHIub2sgJiYgdXJsc19hcmVfZXF1YWwoci51cmwsIG5ld191cmwpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXdfdXJsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdXJsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gdXJsc19hcmVfZXF1YWwodXJsMSwgdXJsMikge1xuICAgIHJldHVybiB1cmwxLnNwbGl0KFwiL1wiKS5zbGljZSgtMSlbMF0gPT0gdXJsMi5zcGxpdChcIi9cIikuc2xpY2UoLTEpWzBdO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYWRkQ2hlY2tib3hlcyA9IGV4cG9ydHMuYWRkTGlua1RvU2luZ2xlcyA9IHZvaWQgMDtcbmNvbnN0IHV0aWxpdGllc18xID0gcmVxdWlyZShcIi4uLy4uL2NvbW1vbi91dGlsaXRpZXNcIik7XG5jb25zdCB1dGlsaXRpZXNfMiA9IHJlcXVpcmUoXCIuLi91dGlsaXRpZXNcIik7XG5mdW5jdGlvbiBhZGRMaW5rVG9TaW5nbGVzKCkge1xuICAgIGZvciAoY29uc3QgdXNlciBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic2VsbGVyLW5hbWVcIikpIHtcbiAgICAgICAgY29uc3QgdXNlcl9saW5rID0gdXNlci5nZXRFbGVtZW50c0J5VGFnTmFtZShcImFcIilbMF07XG4gICAgICAgIHVzZXJfbGluay5wYXJlbnRFbGVtZW50LmlubmVySFRNTCArPSBcIiZuYnNwOy0mbmJzcDs8YSBocmVmPSdcIiArIHVzZXJfbGluay5ocmVmICsgXCIvT2ZmZXJzL1NpbmdsZXMvJyB0YXJnZXQ9J19ibGFuayc+U2luZ2xlczwvYT5cIjtcbiAgICB9XG59XG5leHBvcnRzLmFkZExpbmtUb1NpbmdsZXMgPSBhZGRMaW5rVG9TaW5nbGVzO1xuZnVuY3Rpb24gZ2V0UmVmZXJlbmNlKGRlZmF1bHRfcmVmKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KCdyZWZlcmVuY2UnLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLnJlZmVyZW5jZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShkYXRhLnJlZmVyZW5jZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IHJlZmVyZW5jZTogZGVmYXVsdF9yZWYgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKGRlZmF1bHRfcmVmKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gYWRkQ2hlY2tib3hlcygpIHtcbiAgICB2YXIgX2E7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgbGV0IHJlZmVyZW5jZSA9IHlpZWxkIGdldFJlZmVyZW5jZSgxKTtcbiAgICAgICAgY29uc3QgaW5mbyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJpbmZvLWxpc3QtY29udGFpbmVyXCIpWzBdO1xuICAgICAgICBpZiAoaW5mbykge1xuICAgICAgICAgICAgY29uc3Qgcm93cyA9IGluZm8uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJkZFwiKTtcbiAgICAgICAgICAgIGNvbnN0IG5yb3dzID0gNDtcbiAgICAgICAgICAgIGxldCBwcmljZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnJvd3M7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVsZW0gPSByb3dzW3Jvd3MubGVuZ3RoIC0gbnJvd3MgKyBpXTtcbiAgICAgICAgICAgICAgICBwcmljZXMucHVzaCgoMCwgdXRpbGl0aWVzXzIucGFyc2VQcmljZSkoZWxlbS5pbm5lckhUTUwpKTtcbiAgICAgICAgICAgICAgICBlbGVtLmlubmVySFRNTCArPSBcIiZuYnNwOzxpbnB1dCB0eXBlPSdyYWRpbycgbmFtZT0ncmVmZXJlbmNlJyB2YWx1ZT1cIiArIGkgKyAoaSA9PSByZWZlcmVuY2UgPyBcIiBjaGVja2VkXCIgOiBcIlwiKSArIFwiPlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29sb3JQcmljZXMocHJpY2VzW3JlZmVyZW5jZV0pO1xuICAgICAgICAgICAgZm9yIChjb25zdCByYWRpbyBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtuYW1lPVwicmVmZXJlbmNlXCJdJykpIHtcbiAgICAgICAgICAgICAgICByYWRpby5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyByZWZlcmVuY2U6IHRoaXMudmFsdWUgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2UgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgY29sb3JQcmljZXMocHJpY2VzW3RoaXMudmFsdWVdKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIChfYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZE1vcmVCdXR0b25cIikpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gKDAsIHV0aWxpdGllc18xLnNsZWVwKSgzMDAwKS50aGVuKCgpID0+IGNvbG9yUHJpY2VzKHByaWNlc1tyZWZlcmVuY2VdKSkpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5leHBvcnRzLmFkZENoZWNrYm94ZXMgPSBhZGRDaGVja2JveGVzO1xuZnVuY3Rpb24gY29sb3JQcmljZXMocmVmZXJlbmNlX3ByaWNlKSB7XG4gICAgZm9yIChjb25zdCBlbGVtIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwcmljZS1jb250YWluZXJcIikpIHtcbiAgICAgICAgY29uc3QgcHJpY2VfZWxlbSA9IGVsZW0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImZvbnQtd2VpZ2h0LWJvbGRcIilbMF07XG4gICAgICAgIGNvbnN0IHBsYXlzZXRfZWxlbSA9IHByaWNlX2VsZW0ucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ0ZXh0LW11dGVkXCIpO1xuICAgICAgICBsZXQgcHB1ID0gMDtcbiAgICAgICAgaWYgKHBsYXlzZXRfZWxlbS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBwcHUgPSAoMCwgdXRpbGl0aWVzXzIucGFyc2VQUFUpKHBsYXlzZXRfZWxlbVswXS5pbm5lckhUTUwpO1xuICAgICAgICB9XG4gICAgICAgIHByaWNlX2VsZW0uY2xhc3NMaXN0LnJlbW92ZShcImNvbG9yLXByaW1hcnlcIik7XG4gICAgICAgIGlmIChwcmljZV9lbGVtKSB7XG4gICAgICAgICAgICBpZiAoKHBwdSA+IDAgJiYgcHB1IDw9IHJlZmVyZW5jZV9wcmljZSkgfHwgKDAsIHV0aWxpdGllc18yLnBhcnNlUHJpY2UpKHByaWNlX2VsZW0uaW5uZXJIVE1MLnJlcGxhY2UoXCIg4oKsXCIsIFwiXCIpKSA8PSByZWZlcmVuY2VfcHJpY2UpIHtcbiAgICAgICAgICAgICAgICBwcmljZV9lbGVtLnN0eWxlLmNvbG9yID0gXCJncmVlblwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcHJpY2VfZWxlbS5zdHlsZS5jb2xvciA9IFwicmVkXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuc2hvd1RyZW5kID0gdm9pZCAwO1xuY29uc3Qgc2NyeWZhbGxfMSA9IHJlcXVpcmUoXCIuLi8uLi9jb21tb24vc2NyeWZhbGxcIik7XG5jb25zdCB1dGlsaXRpZXNfMSA9IHJlcXVpcmUoXCIuLi91dGlsaXRpZXNcIik7XG5mdW5jdGlvbiBzaG93VHJlbmQoKSB7XG4gICAgdmFyIF9hO1xuICAgIGNvbnN0IHRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJVc2VyT2ZmZXJzVGFibGVcIik7XG4gICAgaWYgKHRhYmxlKSB7XG4gICAgICAgIGNvbnN0IGxlZ2VuZGFfZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgbGVnZW5kYV9kaXYuaW5uZXJIVE1MID0gXCI8aHI+PHAgY2xhc3M9J2ZvbnQtd2VpZ2h0LWJvbGQnPkUgPSBFeGFjdCBzZXQgLyBMID0gTG93ZXN0IEF2YWlsYmxlXFwgPGJyPjxzcGFuIHN0eWxlPSdjb2xvcjogZ3JlZW4nPkxvd2VyIHByaWNlPC9zcGFuPiAvIDxzcGFuIHN0eWxlPSdjb2xvcjogcmVkJz5IaWdoZXIgcHJpY2U8L3NwYW4+IC8gPHNwYW4gc3R5bGU9J2NvbG9yOiBkYXJrdmlvbGV0Jz5Gb2lsIFsgPGk+bm90IHN1cHBvcnRlZDwvaT4gXTwvc3Bhbj4gLyA8c3BhbiBjbGFzcz0nY29sb3ItcHJpbWFyeSc+UHJpY2Ugbm90IGZvdW5kPC9zcGFuPC9wPlwiO1xuICAgICAgICB0YWJsZS5iZWZvcmUobGVnZW5kYV9kaXYpO1xuICAgICAgICBjb25zdCByb3dzID0gdGFibGUucXVlcnlTZWxlY3RvckFsbCgnW2lkXj1hcnRpY2xlUm93XScpO1xuICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiByb3dzKSB7XG4gICAgICAgICAgICBjb25zdCBjYXJkX3VybCA9IHJvdy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiY29sLXNlbGxlclwiKVswXS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImFcIilbMF0uaHJlZi5zcGxpdChcIj9cIilbMF0uc3BsaXQoXCIvXCIpO1xuICAgICAgICAgICAgbGV0IGNhcmRfbmFtZSA9IChfYSA9IGNhcmRfdXJsLnBvcCgpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucmVwbGFjZSgvLVZcXGQrLywgJycpO1xuICAgICAgICAgICAgbGV0IGNhcmRfaWQgPSAoMCwgdXRpbGl0aWVzXzEuZ2V0X21rbV9pZCkocm93KTtcbiAgICAgICAgICAgIGxldCBmb2lsID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAocm93LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW9yaWdpbmFsLXRpdGxlPVwiRm9pbFwiXScpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBmb2lsID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFByb21pc2UuYWxsKFsoMCwgc2NyeWZhbGxfMS5nZXRfY2hlYXBlc3QpKGNhcmRfbmFtZSksICgwLCBzY3J5ZmFsbF8xLmdldF9jYXJkbWFya2V0KShjYXJkX2lkKV0pLnRoZW4ocmVzcG9uc2VzID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgX2EsIF9iLCBfYywgX2QsIF9lLCBfZjtcbiAgICAgICAgICAgICAgICBjb25zdCBjaGVhcGVzdCA9IHJlc3BvbnNlc1swXTtcbiAgICAgICAgICAgICAgICBjb25zdCBleGFjdCA9IHJlc3BvbnNlc1sxXTtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmljZV9lbGVtID0gcm93LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwcmljZS1jb250YWluZXJcIilbMF0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImZvbnQtd2VpZ2h0LWJvbGRcIilbMF07XG4gICAgICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxfcHJpY2UgPSAoMCwgdXRpbGl0aWVzXzEucGFyc2VQcmljZSkocHJpY2VfZWxlbS5pbm5lckhUTUwucmVwbGFjZShcIiDigqxcIiwgXCJcIikpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHBsYXlzZXRfZWxlbSA9IHByaWNlX2VsZW0ucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ0ZXh0LW11dGVkXCIpO1xuICAgICAgICAgICAgICAgIGxldCBwcHUgPSAwO1xuICAgICAgICAgICAgICAgIGlmIChwbGF5c2V0X2VsZW0ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBwcHUgPSAoMCwgdXRpbGl0aWVzXzEucGFyc2VQUFUpKHBsYXlzZXRfZWxlbVswXS5pbm5lckhUTUwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgY2hlYXBlc3RfY29sb3IgPSBcIlwiLCBleGFjdF9jb2xvciA9IFwiXCI7XG4gICAgICAgICAgICAgICAgbGV0IGNoZWFwZXN0X3ByaWNlID0gMCwgZXhhY3RfcHJpY2UgPSAwO1xuICAgICAgICAgICAgICAgIGlmIChjaGVhcGVzdCkge1xuICAgICAgICAgICAgICAgICAgICBjaGVhcGVzdF9wcmljZSA9IHBhcnNlRmxvYXQoKF9iID0gKF9hID0gY2hlYXBlc3QucHJpY2VzKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZXVyKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiAoX2MgPSBjaGVhcGVzdC5wcmljZXMpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5ldXJfZm9pbCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGVhcGVzdF9wcmljZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hlYXBlc3RfY29sb3IgPSAoZm9pbCA/IFwiZGFya3Zpb2xldFwiIDogY29sb3JfZnJvbV9wcmljZShvcmlnaW5hbF9wcmljZSwgY2hlYXBlc3RfcHJpY2UsIHBwdSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChleGFjdCkge1xuICAgICAgICAgICAgICAgICAgICBleGFjdF9wcmljZSA9IHBhcnNlRmxvYXQoKF9lID0gKF9kID0gZXhhY3QucHJpY2VzKSA9PT0gbnVsbCB8fCBfZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2QuZXVyKSAhPT0gbnVsbCAmJiBfZSAhPT0gdm9pZCAwID8gX2UgOiAoX2YgPSBleGFjdC5wcmljZXMpID09PSBudWxsIHx8IF9mID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZi5ldXJfZm9pbCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChleGFjdF9wcmljZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXhhY3RfY29sb3IgPSAoZm9pbCA/IFwiZGFya3Zpb2xldFwiIDogY29sb3JfZnJvbV9wcmljZShvcmlnaW5hbF9wcmljZSwgZXhhY3RfcHJpY2UsIHBwdSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBvcmlnaW5hbF9jb2xvciA9IGV4YWN0X2NvbG9yIHx8IGNoZWFwZXN0X2NvbG9yO1xuICAgICAgICAgICAgICAgIHByaWNlX2VsZW0uaW5uZXJIVE1MID0gXCI8c3BhbiBzdHlsZT0nY29sb3I6IFwiICsgb3JpZ2luYWxfY29sb3IgKyBcIic+XCIgKyBwcmljZV9lbGVtLmlubmVySFRNTCArIFwiPHNwYW4+XCI7XG4gICAgICAgICAgICAgICAgaWYgKCFmb2lsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChleGFjdF9wcmljZSA+IDAgJiYgY2hlYXBlc3Quc2V0ICE9IGV4YWN0LnNldClcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlX2VsZW0uaW5uZXJIVE1MICs9IFwiPGJyPjxzcGFuIHN0eWxlPSdjb2xvcjogXCIgKyBleGFjdF9jb2xvciArIFwiOycgPkUgPC9zcGFuPjxhIHN0eWxlPSdjb2xvcjogYmxhY2snIGhyZWY9J1wiICsgZXhhY3Quc2NyeWZhbGxfdXJpICsgXCInPiBcIiArIGV4YWN0X3ByaWNlLnRvTG9jYWxlU3RyaW5nKFwiaXQtSVRcIiwgeyBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IDIgfSkgKyBcIiDigqw8L2E+XCI7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGVhcGVzdF9wcmljZSA+IDApXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZV9lbGVtLmlubmVySFRNTCArPSBcIjxicj48c3BhbiBzdHlsZT0nY29sb3I6IFwiICsgY2hlYXBlc3RfY29sb3IgKyBcIjsnPlwiICsgKGNoZWFwZXN0LnNldCA9PSBleGFjdC5zZXQgPyBcIkU9XCIgOiBcIlwiKSArIFwiTCA8L3NwYW4+PGEgc3R5bGU9J2NvbG9yOiBibGFjaycgaHJlZj0nXCIgKyBjaGVhcGVzdC5zY3J5ZmFsbF91cmkgKyBcIic+IFwiICsgY2hlYXBlc3RfcHJpY2UudG9Mb2NhbGVTdHJpbmcoXCJpdC1JVFwiLCB7IG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMiB9KSArIFwiIOKCrDwvYT5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydHMuc2hvd1RyZW5kID0gc2hvd1RyZW5kO1xuZnVuY3Rpb24gY29sb3JfZnJvbV9wcmljZShvbGRfcHJpY2UsIG5ld19wcmljZSwgcHB1KSB7XG4gICAgaWYgKChwcHUgPiAwICYmIHBwdSA+IG5ld19wcmljZSkgfHwgb2xkX3ByaWNlID4gbmV3X3ByaWNlKSB7XG4gICAgICAgIHJldHVybiBcInJlZFwiO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFwiZ3JlZW5cIjtcbiAgICB9XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5zYXZlQWxsVXJscyA9IGV4cG9ydHMuYWRkUHJpbnRMaXN0QnV0dG9uID0gdm9pZCAwO1xuY29uc3Qgc2NyeWZhbGxfMSA9IHJlcXVpcmUoXCIuLi8uLi9jb21tb24vc2NyeWZhbGxcIik7XG5jb25zdCB1dGlsaXRpZXNfMSA9IHJlcXVpcmUoXCIuLi8uLi9jb21tb24vdXRpbGl0aWVzXCIpO1xuY29uc3QgdXRpbGl0aWVzXzIgPSByZXF1aXJlKFwiLi4vdXRpbGl0aWVzXCIpO1xuZnVuY3Rpb24gYWRkUHJpbnRMaXN0QnV0dG9uKCkge1xuICAgIGNvbnN0IGJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJhW2hyZWYkPSdBZGREZWNrTGlzdCddXCIpWzBdOyAvLyAkPSAtLT4gZW5kaW5nIHdpdGhcbiAgICBidG4uY2xhc3NMaXN0LmFkZChcIm1yLTNcIik7XG4gICAgY29uc3QgcHJpbnRCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHByaW50QnRuLmNsYXNzTGlzdC5hZGQoXCJidG5cIik7XG4gICAgcHJpbnRCdG4uc3R5bGUuY29sb3IgPSBcInJnYigyNDAsIDE3MywgNzgpXCI7XG4gICAgcHJpbnRCdG4uc3R5bGUuYm9yZGVyQ29sb3IgPSBcInJnYigyNDAsIDE3MywgNzgpXCI7XG4gICAgcHJpbnRCdG4uaW5uZXJIVE1MID0gXCI8c3Bhbj5TYXZlIGFzLi4uPC9zcGFuPlwiO1xuICAgIHByaW50QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KCdwcmludFZlcnNpb24nLCAoZGF0YSkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgdmFyIF9hLCBfYiwgX2M7XG4gICAgICAgICAgICBjb25zdCB3YW50c190aXRsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwYWdlLXRpdGxlLWNvbnRhaW5lclwiKVswXS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImgxXCIpWzBdLmlubmVySFRNTDtcbiAgICAgICAgICAgIGxldCBsaXN0ID0gXCJcIjtcbiAgICAgICAgICAgIGNvbnN0IHByaW50VmVyc2lvbiA9IChfYSA9IGRhdGEucHJpbnRWZXJzaW9uKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBmYWxzZTtcbiAgICAgICAgICAgIGlmIChwcmludFZlcnNpb24pIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiAoX2IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIldhbnRzTGlzdFRhYmxlXCIpKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0Ym9keVwiKVswXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwibmFtZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IHJvdy5nZXRFbGVtZW50c0J5VGFnTmFtZShcImFcIilbMF0uaW5uZXJIVE1MO1xuICAgICAgICAgICAgICAgICAgICBsaXN0ICs9IG5hbWUgKyBcIlxcblwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgcm93IG9mIChfYyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiV2FudHNMaXN0VGFibGVcIikpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRib2R5XCIpWzBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidHJcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2FyZF9pZCA9ICgwLCB1dGlsaXRpZXNfMi5nZXRfbWttX2lkKShyb3cpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2FyZF9pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgeWllbGQgKDAsIHNjcnlmYWxsXzEuZ2V0X2NhcmRtYXJrZXQpKGNhcmRfaWQpLnRoZW4oKGNhcmQpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgX2Q7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdCArPSAoKF9kID0gY2FyZC5uYW1lKSAhPT0gbnVsbCAmJiBfZCAhPT0gdm9pZCAwID8gX2QgOiBcIlwiKSArIFwiXFxuXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAoMCwgdXRpbGl0aWVzXzEuc2F2ZVdpdGhGaWxlUGlja2VyKShuZXcgQmxvYihbbGlzdF0pLCB3YW50c190aXRsZSA/IHdhbnRzX3RpdGxlICsgXCIudHh0XCIgOiBcIndhbnRzLnR4dFwiKTtcbiAgICAgICAgfSkpO1xuICAgIH0pO1xuICAgIGJ0bi5hZnRlcihwcmludEJ0bik7XG59XG5leHBvcnRzLmFkZFByaW50TGlzdEJ1dHRvbiA9IGFkZFByaW50TGlzdEJ1dHRvbjtcbmZ1bmN0aW9uIHNhdmVBbGxVcmxzKCkge1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbXCJ1cmxzXCJdLCAocmVzdWx0KSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIGxldCBzYXZlZF91cmxzID0gKF9hID0gcmVzdWx0LnVybHMpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiAoX2IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIldhbnRzTGlzdFRhYmxlXCIpKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0Ym9keVwiKVswXS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRyXCIpKSB7XG4gICAgICAgICAgICBjb25zdCBjYXJkX3VybCA9ICgwLCB1dGlsaXRpZXNfMi5nZXRfbWttX3VybCkocm93KTtcbiAgICAgICAgICAgIGlmIChjYXJkX3VybCAmJiBjYXJkX3VybC5pbmNsdWRlcyhcIi9Qcm9kdWN0cy9TaW5nbGVzL1wiKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNhcmRfaWQgPSAoMCwgdXRpbGl0aWVzXzIuZ2V0X21rbV9pZCkocm93KTtcbiAgICAgICAgICAgICAgICBpZiAoY2FyZF9pZCkge1xuICAgICAgICAgICAgICAgICAgICB5aWVsZCAoMCwgc2NyeWZhbGxfMS5nZXRfY2FyZG1hcmtldCkoY2FyZF9pZCkudGhlbigoY2FyZCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhcmQubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzYXZlZF91cmxzLmZpbHRlcigodSkgPT4gdS5ta21faWQgPT0gY2FyZF9pZCkubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZWRfdXJscy5wdXNoKHsgbmFtZTogY2FyZC5uYW1lLCBta21faWQ6IGNhcmRfaWQsIHVybDogY2FyZF91cmwgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IFwidXJsc1wiOiBzYXZlZF91cmxzIH0pO1xuICAgIH0pKTtcbn1cbmV4cG9ydHMuc2F2ZUFsbFVybHMgPSBzYXZlQWxsVXJscztcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5wYXJzZVBQVSA9IGV4cG9ydHMucGFyc2VQcmljZSA9IGV4cG9ydHMuZ2V0X21rbV91cmwgPSBleHBvcnRzLmdldF9ta21fdmVyc2lvbiA9IGV4cG9ydHMuZ2V0X21rbV9pZCA9IHZvaWQgMDtcbmZ1bmN0aW9uIGdldF9ta21faWQocm93KSB7XG4gICAgdmFyIF9hLCBfYjtcbiAgICByZXR1cm4gKChfYiA9IChfYSA9IHJvdy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZm9udGljb24tY2FtZXJhXCIpWzBdKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZ2V0QXR0cmlidXRlKFwiZGF0YS1vcmlnaW5hbC10aXRsZVwiKSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnNwbGl0KC9cXC5qcGcvZylbMF0uc3BsaXQoXCIvXCIpLnNwbGljZSgtMSlbMF0pIHx8IFwiXCI7XG59XG5leHBvcnRzLmdldF9ta21faWQgPSBnZXRfbWttX2lkO1xuZnVuY3Rpb24gZ2V0X21rbV92ZXJzaW9uKHJvdykge1xuICAgIHZhciBfYSwgX2I7XG4gICAgY29uc3QgYWx0ID0gKChfYiA9IChfYSA9IHJvdy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZm9udGljb24tY2FtZXJhXCIpWzBdKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZ2V0QXR0cmlidXRlKFwiZGF0YS1vcmlnaW5hbC10aXRsZVwiKSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLm1hdGNoKC9hbHQ9XFxcIiguKj8pXFxcIi8pWzFdKSB8fCBcIlwiO1xuICAgIGNvbnN0IHZlcnNpb24gPSBhbHQubWF0Y2goL1xcKFZcXC4oLio/KVxcKS8pO1xuICAgIHJldHVybiB2ZXJzaW9uICE9IG51bGwgPyB2ZXJzaW9uWzFdIDogXCJcIjtcbn1cbmV4cG9ydHMuZ2V0X21rbV92ZXJzaW9uID0gZ2V0X21rbV92ZXJzaW9uO1xuZnVuY3Rpb24gZ2V0X21rbV91cmwocm93KSB7XG4gICAgdmFyIF9hLCBfYjtcbiAgICByZXR1cm4gKF9iID0gKF9hID0gcm93LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJuYW1lXCIpWzBdKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJhXCIpWzBdKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuaHJlZi5zcGxpdChcIj9cIilbMF07XG59XG5leHBvcnRzLmdldF9ta21fdXJsID0gZ2V0X21rbV91cmw7XG5mdW5jdGlvbiBwYXJzZVByaWNlKHByaWNlKSB7XG4gICAgcmV0dXJuIHBhcnNlRmxvYXQocHJpY2UucmVwbGFjZShcIi5cIiwgXCJcIikubWF0Y2goL1xcZCtcXCxcXGQrLylbMF0ucmVwbGFjZShcIixcIiwgXCIuXCIpKTtcbn1cbmV4cG9ydHMucGFyc2VQcmljZSA9IHBhcnNlUHJpY2U7XG5mdW5jdGlvbiBwYXJzZVBQVShwcHUpIHtcbiAgICByZXR1cm4gcGFyc2VGbG9hdChwcHUubWF0Y2goL1xcZCpcXC4/XFxkKyhcXCxcXGQrKT8vZylbMF0ucmVwbGFjZShcIi5cIiwgXCJcIikucmVwbGFjZShcIixcIiwgXCIuXCIpKTtcbn1cbmV4cG9ydHMucGFyc2VQUFUgPSBwYXJzZVBQVTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcImNhcmRtYXJrZXQvY29udGVudF9zY3JpcHRcIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rYm9yaXNcIl0gPSBzZWxmW1wid2VicGFja0NodW5rYm9yaXNcIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvclwiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9jYXJkbWFya2V0L2NvbnRlbnRfc2NyaXB0LnRzXCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
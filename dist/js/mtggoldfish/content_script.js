/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/mtggoldfish/components.ts":
/*!***************************************!*\
  !*** ./src/mtggoldfish/components.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.newDropdownItem = exports.setCheapestTotal = exports.setTotal = exports.navButtonFactory = void 0;
function navButtonFactory(text) {
    const li = document.createElement("li");
    li.classList.add("nav-item");
    li.style.padding = "0.5em";
    const a = document.createElement("a");
    a.classList.add("nav-link");
    a.innerHTML = text;
    a.href = "javascript:void(0)";
    li.appendChild(a);
    return li;
}
exports.navButtonFactory = navButtonFactory;
function totalFactory(total, boris_class) {
    const div = document.createElement("div");
    div.classList.add("deck-price-v2", boris_class);
    const locale_total = total.toLocaleString("en-us", { minimumFractionDigits: 2 }).split(".");
    div.innerHTML = " €&nbsp;" + locale_total[0] + "<span class='cents'>." + locale_total[1] + "</span>";
    return div;
}
function setTotal(total) {
    var _a, _b;
    (_a = document.querySelector(".boris-price")) === null || _a === void 0 ? void 0 : _a.remove();
    const price_div = totalFactory(total, "boris-price");
    document.head.insertAdjacentHTML("beforeend", `<style>.boris-price:before {content: "Boris";}</style>`);
    price_div.style.color = "#f0ad4e";
    (_b = document.querySelector(".header-prices-boris")) === null || _b === void 0 ? void 0 : _b.prepend(price_div);
}
exports.setTotal = setTotal;
function setCheapestTotal(total) {
    var _a, _b;
    (_a = document.querySelector(".boris-cheapest")) === null || _a === void 0 ? void 0 : _a.remove();
    const price_div = totalFactory(total, "boris-cheapest");
    document.head.insertAdjacentHTML("beforeend", `<style>.boris-cheapest:before {content: "Cheapest";}</style>`);
    price_div.style.color = "darkviolet";
    (_b = document.querySelector(".header-prices-boris")) === null || _b === void 0 ? void 0 : _b.prepend(price_div);
}
exports.setCheapestTotal = setCheapestTotal;
function newDropdownItem(list, deleteFunction) {
    const div = document.createElement("div");
    div.classList.add("dropdown-item");
    const link = document.createElement("a");
    link.style.color = "black";
    link.style.paddingLeft = "1em";
    link.innerHTML = list.title;
    link.href = list.url;
    const deleter = document.createElement("a");
    deleter.innerHTML = "<strong>X</strong>&nbsp;";
    deleter.style.color = "red";
    deleter.href = "javascript:void(0)";
    deleter.addEventListener("click", () => deleteFunction(list.url));
    div.appendChild(deleter);
    div.appendChild(link);
    return div;
}
exports.newDropdownItem = newDropdownItem;


/***/ }),

/***/ "./src/mtggoldfish/content_script.ts":
/*!*******************************************!*\
  !*** ./src/mtggoldfish/content_script.ts ***!
  \*******************************************/
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
const scryfall_1 = __webpack_require__(/*! ../common/scryfall */ "./src/common/scryfall.ts");
const components_1 = __webpack_require__(/*! ./components */ "./src/mtggoldfish/components.ts");
const utilities_1 = __webpack_require__(/*! ./utilities */ "./src/mtggoldfish/utilities.ts");
const utilities_2 = __webpack_require__(/*! ../common/utilities */ "./src/common/utilities.ts");
let page_values = {
    total: 0,
    sizeToggle: true,
    card_list: [],
};
let borisPrices;
let borisNav;
let borisToggleOuterButton;
let borisToggleButton;
let borisToClipboardButton;
let borisSaveAsButton;
let borisCheapestButton;
let borisPinDeckButton;
let borisUnpinDeckButton;
function removePinnedList(to_delete) {
    chrome.storage.sync.get('pinned_lists', (result) => {
        var _a;
        if (to_delete === window.location.href) {
            borisNav.appendChild(borisPinDeckButton);
            borisPinDeckButton.addEventListener("click", addToPinnedDecksList);
            borisUnpinDeckButton.remove();
        }
        const list = result.pinned_lists.filter((l) => l.url !== to_delete);
        if (!list.length)
            (_a = document.getElementById("saved-lists-dropdown")) === null || _a === void 0 ? void 0 : _a.remove();
        chrome.storage.sync.set({ pinned_lists: list }, () => updatePinnedListsDropdown());
    });
}
function togglePinDeck() {
    borisPinDeckButton.remove();
    borisNav.appendChild(borisUnpinDeckButton);
    borisUnpinDeckButton.addEventListener("click", () => removePinnedList(window.location.href));
}
function updatePinnedListsDropdown() {
    chrome.storage.sync.get('pinned_lists', (result) => {
        var _a, _b;
        if (((_a = result.pinned_lists) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            if (result.pinned_lists.filter((l) => l.url === window.location.href).length) {
                togglePinDeck();
            }
            (_b = document.getElementById("saved-lists-dropdown")) === null || _b === void 0 ? void 0 : _b.remove();
            const li = document.createElement("li");
            li.style.padding = "0.5em";
            li.id = "saved-lists-dropdown";
            li.classList.add("dropdown", "nav-item");
            const a = document.createElement("a");
            a.classList.add("nav-link", "dropdown-toggle");
            a.innerHTML = "Pinned Lists";
            a.href = "#";
            a.setAttribute("data-toggle", "dropdown");
            const div = document.createElement("div");
            div.classList.add("dropdown-menu");
            document.head.insertAdjacentHTML("beforeend", `<style>.dropdown-item:hover, .dropdown-item:focus { background-color: #d6d6d6; }</style>`);
            for (const list of result.pinned_lists) {
                div.appendChild((0, components_1.newDropdownItem)(list, removePinnedList));
            }
            li.appendChild(a);
            li.appendChild(div);
            borisNav.appendChild(li);
        }
    });
}
function convertPrice(row, card) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    return __awaiter(this, void 0, void 0, function* () {
        let eur_price;
        if ((((_a = card.prices) === null || _a === void 0 ? void 0 : _a.eur) === null && ((_b = card.prices) === null || _b === void 0 ? void 0 : _b.eur_foil) === null) || card.border_color === "gold") {
            const cheap = yield (0, scryfall_1.get_cheapest)(card.name);
            eur_price = parseFloat((_d = (_c = cheap.prices) === null || _c === void 0 ? void 0 : _c.eur) !== null && _d !== void 0 ? _d : (_e = cheap.prices) === null || _e === void 0 ? void 0 : _e.eur_foil) * row.amount;
        }
        else {
            eur_price = parseFloat((_g = (_f = card.prices) === null || _f === void 0 ? void 0 : _f.eur) !== null && _g !== void 0 ? _g : (_h = card.prices) === null || _h === void 0 ? void 0 : _h.eur_foil) * row.amount;
        }
        const card_uri = (_j = card.purchase_uris.cardmarket) !== null && _j !== void 0 ? _j : card.scryfall_uri;
        row.price.innerHTML =
            "<a style='color: inherit;' href=\"" + card_uri + "\">" +
                "<span class='boris-usd-price'" + (!page_values.sizeToggle ? " style='font-size: 0'" : "") + ">" + row.price.innerHTML + "</span>" +
                "<span class='boris-eur-price' " + (page_values.sizeToggle ? " style='font-size: 0'" : "") + "> €&nbsp;" + eur_price.toLocaleString("en-us", { minimumFractionDigits: 2 }) + "</span>" +
                "</a>";
        page_values.total += eur_price;
    });
}
function convertAllPrices() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const card_list = page_values.card_list;
        const table_rows = (_a = document.querySelector("table.deck-view-deck-table")) === null || _a === void 0 ? void 0 : _a.querySelectorAll("tr:not(.deck-category-header)");
        if (table_rows === null || table_rows === void 0 ? void 0 : table_rows.length) {
            for (const tr of table_rows) {
                const row = (0, utilities_1.parse_row)(tr.querySelectorAll("td"));
                if (row) {
                    let card = card_list.find(c => c.name.toLowerCase().includes(row.name.toLowerCase()));
                    if (card) {
                        yield convertPrice(row, card);
                    }
                    else {
                        row.price.innerHTML = "<span style='color: orange''>" + row.price.innerHTML + "</span>";
                    }
                }
            }
        }
    });
}
function addCheapestPrices() {
    return __awaiter(this, void 0, void 0, function* () {
        borisCheapestButton.remove();
        if (page_values.card_list.length) {
            yield Promise.all(page_values.card_list.map((card) => (0, scryfall_1.get_cheapest)(card.name))).then((cheapest_cards) => {
                var _a, _b, _c, _d, _e;
                let card_list = [];
                for (const c of cheapest_cards) {
                    card_list.push(c);
                }
                document.querySelectorAll("tr.deck-category-header>th").forEach((th) => th.colSpan = 5);
                let total = 0;
                for (const e of document.querySelectorAll(".boris")) {
                    const row_element = e.parentElement;
                    const row = (0, utilities_1.parse_row)(row_element.querySelectorAll("td"));
                    if (row) {
                        let card = card_list.find(c => { var _a; return (_a = c.name) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(row.name.toLowerCase()); });
                        const td = document.createElement("td");
                        td.classList.add("text-right");
                        if (card) {
                            const eur_price = parseFloat((_d = ((_b = (_a = card.prices) === null || _a === void 0 ? void 0 : _a.eur) !== null && _b !== void 0 ? _b : (_c = card.prices) === null || _c === void 0 ? void 0 : _c.eur_foil)) !== null && _d !== void 0 ? _d : 0) * row.amount;
                            const card_uri = (_e = card.scryfall_uri) !== null && _e !== void 0 ? _e : "javascript:void(0)";
                            total += eur_price;
                            td.innerHTML =
                                "<a style='color: darkviolet;' href=\"" + card_uri + "\">" +
                                    "<span> €&nbsp;" + eur_price.toLocaleString("en-us", { minimumFractionDigits: 2 }) + "</span></a>";
                        }
                        else {
                            td.innerHTML = "<span style='color: orange;'> €&nbsp;XX.XX </span>";
                        }
                        row_element.appendChild(td);
                    }
                }
                (0, components_1.setCheapestTotal)(total);
            });
        }
    });
}
const togglePrices = () => {
    if (page_values.sizeToggle)
        document.querySelectorAll(".boris").forEach(e => {
            var _a, _b;
            (_a = e.querySelector("span.boris-usd-price")) === null || _a === void 0 ? void 0 : _a.setAttribute("style", "font-size: 0");
            (_b = e.querySelector("span.boris-eur-price")) === null || _b === void 0 ? void 0 : _b.setAttribute("style", "font-size: ");
            borisToggleButton.classList.remove("btn-online-muted");
            borisToggleButton.classList.add("btn-online");
        });
    else {
        document.querySelectorAll(".boris").forEach(e => {
            var _a, _b;
            (_a = e.querySelector("span.boris-usd-price")) === null || _a === void 0 ? void 0 : _a.setAttribute("style", "font-size: ");
            (_b = e.querySelector("span.boris-eur-price")) === null || _b === void 0 ? void 0 : _b.setAttribute("style", "font-size: 0");
            borisToggleButton.classList.remove("btn-online");
            borisToggleButton.classList.add("btn-online-muted");
        });
    }
    page_values.sizeToggle = !page_values.sizeToggle;
};
const copyToClipboard = () => __awaiter(void 0, void 0, void 0, function* () {
    borisToClipboardButton.children[0].classList.add("btn-paper");
    const clipboardItem = new ClipboardItem({
        'text/plain': (0, utilities_1.get_printable_list_blob)().then((result) => {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                resolve(new Blob([(result ? result : "Errore")], { type: 'text/plain' }));
            }));
        }),
    });
    navigator.clipboard.write([clipboardItem]).then(() => {
        borisToClipboardButton.children[0].classList.remove("btn-paper");
    });
});
const addToPinnedDecksList = () => {
    chrome.storage.sync.get('pinned_lists', (result) => {
        var _a, _b, _c;
        if (result.pinned_lists)
            var savedLists = result.pinned_lists;
        else
            var savedLists = [];
        const url = window.location.href;
        if (!savedLists.filter(u => u.url === url).length) {
            const format_text = (_a = document.querySelector("p.deck-container-information")) === null || _a === void 0 ? void 0 : _a.innerHTML;
            const format = format_text.slice(format_text.search("Format: ") + 8, format_text.search("<br>"));
            savedLists.push({ url: url, title: (_c = ((_b = "<strong>" + format + "</strong> | ") !== null && _b !== void 0 ? _b : "") + (0, utilities_1.get_title)()) !== null && _c !== void 0 ? _c : url });
        }
        chrome.storage.sync.set({ pinned_lists: savedLists.sort((a, b) => a.title.localeCompare(b.title)) }, () => updatePinnedListsDropdown());
    });
};
function createBorisComponents() {
    var _a, _b;
    borisPrices = document.createElement("div");
    borisPrices.classList.add("header-prices-boris", "header-prices-currency");
    (_a = document.querySelector("div.header-prices-currency")) === null || _a === void 0 ? void 0 : _a.after(borisPrices);
    borisNav = document.createElement("ul");
    borisNav.classList.add("nav", "nav-pills", "deck-type-menu");
    borisNav.style.justifyContent = "start";
    (_b = document.querySelector("ul.deck-type-menu")) === null || _b === void 0 ? void 0 : _b.after(borisNav);
    borisToggleOuterButton = (0, components_1.navButtonFactory)("Boris");
    borisToggleButton = borisToggleOuterButton.children[0];
    borisToClipboardButton = (0, components_1.navButtonFactory)("Copy");
    borisSaveAsButton = (0, components_1.navButtonFactory)("Save as...");
    borisCheapestButton = (0, components_1.navButtonFactory)("Cheapest");
    borisPinDeckButton = (0, components_1.navButtonFactory)("Pin");
    borisUnpinDeckButton = (0, components_1.navButtonFactory)("Pinned");
    borisToggleButton.classList.add("btn-online-muted");
    borisUnpinDeckButton.classList.add("show");
}
function addButtons() {
    borisNav.appendChild(borisToggleOuterButton);
    borisNav.appendChild(borisCheapestButton);
    borisNav.appendChild(borisToClipboardButton);
    borisNav.appendChild(borisSaveAsButton);
    borisNav.appendChild(borisPinDeckButton);
    borisToggleButton.addEventListener("click", togglePrices);
    borisToClipboardButton.addEventListener("click", copyToClipboard);
    borisSaveAsButton.addEventListener("click", utilities_1.saveToPC);
    borisCheapestButton.addEventListener("click", addCheapestPrices);
    borisPinDeckButton.addEventListener("click", addToPinnedDecksList);
}
function removeBorisComponents() {
    borisToggleOuterButton.remove();
    borisToggleButton.remove();
    borisCheapestButton.remove();
    borisToClipboardButton.remove();
    borisSaveAsButton.remove();
    borisPinDeckButton.remove();
    borisUnpinDeckButton.remove();
    borisPrices.remove();
    borisNav.remove();
}
function borisDecklist() {
    (0, scryfall_1.fetch_cards)().then((list) => __awaiter(this, void 0, void 0, function* () {
        page_values.card_list = list;
        yield convertAllPrices();
        (0, components_1.setTotal)(page_values.total);
        togglePrices();
    })).then(() => {
        var _a;
        if ((_a = chrome.runtime) === null || _a === void 0 ? void 0 : _a.id) {
            chrome.storage.sync.get(['auto'], (data) => {
                data.auto ? addCheapestPrices() : chrome.storage.sync.set({ auto: false });
            });
        }
        updatePinnedListsDropdown();
        addButtons();
    });
}
function borisDeckeditor() {
    var _a;
    (_a = document.getElementById("preview")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
        page_values.total = 0;
        page_values.sizeToggle = true;
        page_values.card_list = [];
        (0, utilities_2.sleep)(2000).then(() => {
            removeBorisComponents();
            createBorisComponents();
            borisDecklist();
        });
    }));
}
if (window.location.hostname.includes("mtggoldfish.com")) { // controllo inutile?
    const page_url = window.location.pathname;
    if (page_url.includes("decks")) {
        borisDeckeditor();
    }
    if (page_url.includes("deck") || page_url.includes("archetype")) {
        createBorisComponents();
        borisDecklist();
    }
}
// TODO controllo prezzo foil più basso => colore diverso


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
/******/ 			"mtggoldfish/content_script": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor"], () => (__webpack_require__("./src/mtggoldfish/content_script.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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cUI7V0FDdkM7V0FDQTtXQUNBLEtBQUs7V0FDTDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDM0JBOzs7OztXQ0FBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNLHFCQUFxQjtXQUMzQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7Ozs7VUVoREE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2JvcmlzLy4vc3JjL210Z2dvbGRmaXNoL2NvbXBvbmVudHMudHMiLCJ3ZWJwYWNrOi8vYm9yaXMvLi9zcmMvbXRnZ29sZGZpc2gvY29udGVudF9zY3JpcHQudHMiLCJ3ZWJwYWNrOi8vYm9yaXMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYm9yaXMvd2VicGFjay9ydW50aW1lL2NodW5rIGxvYWRlZCIsIndlYnBhY2s6Ly9ib3Jpcy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JvcmlzL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2JvcmlzL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vYm9yaXMvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2JvcmlzL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMubmV3RHJvcGRvd25JdGVtID0gZXhwb3J0cy5zZXRDaGVhcGVzdFRvdGFsID0gZXhwb3J0cy5zZXRUb3RhbCA9IGV4cG9ydHMubmF2QnV0dG9uRmFjdG9yeSA9IHZvaWQgMDtcbmZ1bmN0aW9uIG5hdkJ1dHRvbkZhY3RvcnkodGV4dCkge1xuICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuICAgIGxpLmNsYXNzTGlzdC5hZGQoXCJuYXYtaXRlbVwiKTtcbiAgICBsaS5zdHlsZS5wYWRkaW5nID0gXCIwLjVlbVwiO1xuICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICBhLmNsYXNzTGlzdC5hZGQoXCJuYXYtbGlua1wiKTtcbiAgICBhLmlubmVySFRNTCA9IHRleHQ7XG4gICAgYS5ocmVmID0gXCJqYXZhc2NyaXB0OnZvaWQoMClcIjtcbiAgICBsaS5hcHBlbmRDaGlsZChhKTtcbiAgICByZXR1cm4gbGk7XG59XG5leHBvcnRzLm5hdkJ1dHRvbkZhY3RvcnkgPSBuYXZCdXR0b25GYWN0b3J5O1xuZnVuY3Rpb24gdG90YWxGYWN0b3J5KHRvdGFsLCBib3Jpc19jbGFzcykge1xuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgZGl2LmNsYXNzTGlzdC5hZGQoXCJkZWNrLXByaWNlLXYyXCIsIGJvcmlzX2NsYXNzKTtcbiAgICBjb25zdCBsb2NhbGVfdG90YWwgPSB0b3RhbC50b0xvY2FsZVN0cmluZyhcImVuLXVzXCIsIHsgbWluaW11bUZyYWN0aW9uRGlnaXRzOiAyIH0pLnNwbGl0KFwiLlwiKTtcbiAgICBkaXYuaW5uZXJIVE1MID0gXCIg4oKsJm5ic3A7XCIgKyBsb2NhbGVfdG90YWxbMF0gKyBcIjxzcGFuIGNsYXNzPSdjZW50cyc+LlwiICsgbG9jYWxlX3RvdGFsWzFdICsgXCI8L3NwYW4+XCI7XG4gICAgcmV0dXJuIGRpdjtcbn1cbmZ1bmN0aW9uIHNldFRvdGFsKHRvdGFsKSB7XG4gICAgdmFyIF9hLCBfYjtcbiAgICAoX2EgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJvcmlzLXByaWNlXCIpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucmVtb3ZlKCk7XG4gICAgY29uc3QgcHJpY2VfZGl2ID0gdG90YWxGYWN0b3J5KHRvdGFsLCBcImJvcmlzLXByaWNlXCIpO1xuICAgIGRvY3VtZW50LmhlYWQuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlZW5kXCIsIGA8c3R5bGU+LmJvcmlzLXByaWNlOmJlZm9yZSB7Y29udGVudDogXCJCb3Jpc1wiO308L3N0eWxlPmApO1xuICAgIHByaWNlX2Rpdi5zdHlsZS5jb2xvciA9IFwiI2YwYWQ0ZVwiO1xuICAgIChfYiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuaGVhZGVyLXByaWNlcy1ib3Jpc1wiKSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnByZXBlbmQocHJpY2VfZGl2KTtcbn1cbmV4cG9ydHMuc2V0VG90YWwgPSBzZXRUb3RhbDtcbmZ1bmN0aW9uIHNldENoZWFwZXN0VG90YWwodG90YWwpIHtcbiAgICB2YXIgX2EsIF9iO1xuICAgIChfYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYm9yaXMtY2hlYXBlc3RcIikpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5yZW1vdmUoKTtcbiAgICBjb25zdCBwcmljZV9kaXYgPSB0b3RhbEZhY3RvcnkodG90YWwsIFwiYm9yaXMtY2hlYXBlc3RcIik7XG4gICAgZG9jdW1lbnQuaGVhZC5pbnNlcnRBZGphY2VudEhUTUwoXCJiZWZvcmVlbmRcIiwgYDxzdHlsZT4uYm9yaXMtY2hlYXBlc3Q6YmVmb3JlIHtjb250ZW50OiBcIkNoZWFwZXN0XCI7fTwvc3R5bGU+YCk7XG4gICAgcHJpY2VfZGl2LnN0eWxlLmNvbG9yID0gXCJkYXJrdmlvbGV0XCI7XG4gICAgKF9iID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5oZWFkZXItcHJpY2VzLWJvcmlzXCIpKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IucHJlcGVuZChwcmljZV9kaXYpO1xufVxuZXhwb3J0cy5zZXRDaGVhcGVzdFRvdGFsID0gc2V0Q2hlYXBlc3RUb3RhbDtcbmZ1bmN0aW9uIG5ld0Ryb3Bkb3duSXRlbShsaXN0LCBkZWxldGVGdW5jdGlvbikge1xuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgZGl2LmNsYXNzTGlzdC5hZGQoXCJkcm9wZG93bi1pdGVtXCIpO1xuICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICBsaW5rLnN0eWxlLmNvbG9yID0gXCJibGFja1wiO1xuICAgIGxpbmsuc3R5bGUucGFkZGluZ0xlZnQgPSBcIjFlbVwiO1xuICAgIGxpbmsuaW5uZXJIVE1MID0gbGlzdC50aXRsZTtcbiAgICBsaW5rLmhyZWYgPSBsaXN0LnVybDtcbiAgICBjb25zdCBkZWxldGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgZGVsZXRlci5pbm5lckhUTUwgPSBcIjxzdHJvbmc+WDwvc3Ryb25nPiZuYnNwO1wiO1xuICAgIGRlbGV0ZXIuc3R5bGUuY29sb3IgPSBcInJlZFwiO1xuICAgIGRlbGV0ZXIuaHJlZiA9IFwiamF2YXNjcmlwdDp2b2lkKDApXCI7XG4gICAgZGVsZXRlci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gZGVsZXRlRnVuY3Rpb24obGlzdC51cmwpKTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoZGVsZXRlcik7XG4gICAgZGl2LmFwcGVuZENoaWxkKGxpbmspO1xuICAgIHJldHVybiBkaXY7XG59XG5leHBvcnRzLm5ld0Ryb3Bkb3duSXRlbSA9IG5ld0Ryb3Bkb3duSXRlbTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBzY3J5ZmFsbF8xID0gcmVxdWlyZShcIi4uL2NvbW1vbi9zY3J5ZmFsbFwiKTtcbmNvbnN0IGNvbXBvbmVudHNfMSA9IHJlcXVpcmUoXCIuL2NvbXBvbmVudHNcIik7XG5jb25zdCB1dGlsaXRpZXNfMSA9IHJlcXVpcmUoXCIuL3V0aWxpdGllc1wiKTtcbmNvbnN0IHV0aWxpdGllc18yID0gcmVxdWlyZShcIi4uL2NvbW1vbi91dGlsaXRpZXNcIik7XG5sZXQgcGFnZV92YWx1ZXMgPSB7XG4gICAgdG90YWw6IDAsXG4gICAgc2l6ZVRvZ2dsZTogdHJ1ZSxcbiAgICBjYXJkX2xpc3Q6IFtdLFxufTtcbmxldCBib3Jpc1ByaWNlcztcbmxldCBib3Jpc05hdjtcbmxldCBib3Jpc1RvZ2dsZU91dGVyQnV0dG9uO1xubGV0IGJvcmlzVG9nZ2xlQnV0dG9uO1xubGV0IGJvcmlzVG9DbGlwYm9hcmRCdXR0b247XG5sZXQgYm9yaXNTYXZlQXNCdXR0b247XG5sZXQgYm9yaXNDaGVhcGVzdEJ1dHRvbjtcbmxldCBib3Jpc1BpbkRlY2tCdXR0b247XG5sZXQgYm9yaXNVbnBpbkRlY2tCdXR0b247XG5mdW5jdGlvbiByZW1vdmVQaW5uZWRMaXN0KHRvX2RlbGV0ZSkge1xuICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KCdwaW5uZWRfbGlzdHMnLCAocmVzdWx0KSA9PiB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgaWYgKHRvX2RlbGV0ZSA9PT0gd2luZG93LmxvY2F0aW9uLmhyZWYpIHtcbiAgICAgICAgICAgIGJvcmlzTmF2LmFwcGVuZENoaWxkKGJvcmlzUGluRGVja0J1dHRvbik7XG4gICAgICAgICAgICBib3Jpc1BpbkRlY2tCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFkZFRvUGlubmVkRGVja3NMaXN0KTtcbiAgICAgICAgICAgIGJvcmlzVW5waW5EZWNrQnV0dG9uLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxpc3QgPSByZXN1bHQucGlubmVkX2xpc3RzLmZpbHRlcigobCkgPT4gbC51cmwgIT09IHRvX2RlbGV0ZSk7XG4gICAgICAgIGlmICghbGlzdC5sZW5ndGgpXG4gICAgICAgICAgICAoX2EgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNhdmVkLWxpc3RzLWRyb3Bkb3duXCIpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucmVtb3ZlKCk7XG4gICAgICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHsgcGlubmVkX2xpc3RzOiBsaXN0IH0sICgpID0+IHVwZGF0ZVBpbm5lZExpc3RzRHJvcGRvd24oKSk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiB0b2dnbGVQaW5EZWNrKCkge1xuICAgIGJvcmlzUGluRGVja0J1dHRvbi5yZW1vdmUoKTtcbiAgICBib3Jpc05hdi5hcHBlbmRDaGlsZChib3Jpc1VucGluRGVja0J1dHRvbik7XG4gICAgYm9yaXNVbnBpbkRlY2tCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHJlbW92ZVBpbm5lZExpc3Qod2luZG93LmxvY2F0aW9uLmhyZWYpKTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZVBpbm5lZExpc3RzRHJvcGRvd24oKSB7XG4gICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoJ3Bpbm5lZF9saXN0cycsIChyZXN1bHQpID0+IHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgaWYgKCgoX2EgPSByZXN1bHQucGlubmVkX2xpc3RzKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubGVuZ3RoKSA+IDApIHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQucGlubmVkX2xpc3RzLmZpbHRlcigobCkgPT4gbC51cmwgPT09IHdpbmRvdy5sb2NhdGlvbi5ocmVmKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0b2dnbGVQaW5EZWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAoX2IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNhdmVkLWxpc3RzLWRyb3Bkb3duXCIpKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IucmVtb3ZlKCk7XG4gICAgICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgICAgICAgICAgIGxpLnN0eWxlLnBhZGRpbmcgPSBcIjAuNWVtXCI7XG4gICAgICAgICAgICBsaS5pZCA9IFwic2F2ZWQtbGlzdHMtZHJvcGRvd25cIjtcbiAgICAgICAgICAgIGxpLmNsYXNzTGlzdC5hZGQoXCJkcm9wZG93blwiLCBcIm5hdi1pdGVtXCIpO1xuICAgICAgICAgICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICAgICAgYS5jbGFzc0xpc3QuYWRkKFwibmF2LWxpbmtcIiwgXCJkcm9wZG93bi10b2dnbGVcIik7XG4gICAgICAgICAgICBhLmlubmVySFRNTCA9IFwiUGlubmVkIExpc3RzXCI7XG4gICAgICAgICAgICBhLmhyZWYgPSBcIiNcIjtcbiAgICAgICAgICAgIGEuc2V0QXR0cmlidXRlKFwiZGF0YS10b2dnbGVcIiwgXCJkcm9wZG93blwiKTtcbiAgICAgICAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBkaXYuY2xhc3NMaXN0LmFkZChcImRyb3Bkb3duLW1lbnVcIik7XG4gICAgICAgICAgICBkb2N1bWVudC5oZWFkLmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWVuZFwiLCBgPHN0eWxlPi5kcm9wZG93bi1pdGVtOmhvdmVyLCAuZHJvcGRvd24taXRlbTpmb2N1cyB7IGJhY2tncm91bmQtY29sb3I6ICNkNmQ2ZDY7IH08L3N0eWxlPmApO1xuICAgICAgICAgICAgZm9yIChjb25zdCBsaXN0IG9mIHJlc3VsdC5waW5uZWRfbGlzdHMpIHtcbiAgICAgICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoKDAsIGNvbXBvbmVudHNfMS5uZXdEcm9wZG93bkl0ZW0pKGxpc3QsIHJlbW92ZVBpbm5lZExpc3QpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxpLmFwcGVuZENoaWxkKGEpO1xuICAgICAgICAgICAgbGkuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICAgICAgICAgIGJvcmlzTmF2LmFwcGVuZENoaWxkKGxpKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuZnVuY3Rpb24gY29udmVydFByaWNlKHJvdywgY2FyZCkge1xuICAgIHZhciBfYSwgX2IsIF9jLCBfZCwgX2UsIF9mLCBfZywgX2gsIF9qO1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGxldCBldXJfcHJpY2U7XG4gICAgICAgIGlmICgoKChfYSA9IGNhcmQucHJpY2VzKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZXVyKSA9PT0gbnVsbCAmJiAoKF9iID0gY2FyZC5wcmljZXMpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5ldXJfZm9pbCkgPT09IG51bGwpIHx8IGNhcmQuYm9yZGVyX2NvbG9yID09PSBcImdvbGRcIikge1xuICAgICAgICAgICAgY29uc3QgY2hlYXAgPSB5aWVsZCAoMCwgc2NyeWZhbGxfMS5nZXRfY2hlYXBlc3QpKGNhcmQubmFtZSk7XG4gICAgICAgICAgICBldXJfcHJpY2UgPSBwYXJzZUZsb2F0KChfZCA9IChfYyA9IGNoZWFwLnByaWNlcykgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLmV1cikgIT09IG51bGwgJiYgX2QgIT09IHZvaWQgMCA/IF9kIDogKF9lID0gY2hlYXAucHJpY2VzKSA9PT0gbnVsbCB8fCBfZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2UuZXVyX2ZvaWwpICogcm93LmFtb3VudDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGV1cl9wcmljZSA9IHBhcnNlRmxvYXQoKF9nID0gKF9mID0gY2FyZC5wcmljZXMpID09PSBudWxsIHx8IF9mID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZi5ldXIpICE9PSBudWxsICYmIF9nICE9PSB2b2lkIDAgPyBfZyA6IChfaCA9IGNhcmQucHJpY2VzKSA9PT0gbnVsbCB8fCBfaCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2guZXVyX2ZvaWwpICogcm93LmFtb3VudDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjYXJkX3VyaSA9IChfaiA9IGNhcmQucHVyY2hhc2VfdXJpcy5jYXJkbWFya2V0KSAhPT0gbnVsbCAmJiBfaiAhPT0gdm9pZCAwID8gX2ogOiBjYXJkLnNjcnlmYWxsX3VyaTtcbiAgICAgICAgcm93LnByaWNlLmlubmVySFRNTCA9XG4gICAgICAgICAgICBcIjxhIHN0eWxlPSdjb2xvcjogaW5oZXJpdDsnIGhyZWY9XFxcIlwiICsgY2FyZF91cmkgKyBcIlxcXCI+XCIgK1xuICAgICAgICAgICAgICAgIFwiPHNwYW4gY2xhc3M9J2JvcmlzLXVzZC1wcmljZSdcIiArICghcGFnZV92YWx1ZXMuc2l6ZVRvZ2dsZSA/IFwiIHN0eWxlPSdmb250LXNpemU6IDAnXCIgOiBcIlwiKSArIFwiPlwiICsgcm93LnByaWNlLmlubmVySFRNTCArIFwiPC9zcGFuPlwiICtcbiAgICAgICAgICAgICAgICBcIjxzcGFuIGNsYXNzPSdib3Jpcy1ldXItcHJpY2UnIFwiICsgKHBhZ2VfdmFsdWVzLnNpemVUb2dnbGUgPyBcIiBzdHlsZT0nZm9udC1zaXplOiAwJ1wiIDogXCJcIikgKyBcIj4g4oKsJm5ic3A7XCIgKyBldXJfcHJpY2UudG9Mb2NhbGVTdHJpbmcoXCJlbi11c1wiLCB7IG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMiB9KSArIFwiPC9zcGFuPlwiICtcbiAgICAgICAgICAgICAgICBcIjwvYT5cIjtcbiAgICAgICAgcGFnZV92YWx1ZXMudG90YWwgKz0gZXVyX3ByaWNlO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gY29udmVydEFsbFByaWNlcygpIHtcbiAgICB2YXIgX2E7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgY29uc3QgY2FyZF9saXN0ID0gcGFnZV92YWx1ZXMuY2FyZF9saXN0O1xuICAgICAgICBjb25zdCB0YWJsZV9yb3dzID0gKF9hID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInRhYmxlLmRlY2stdmlldy1kZWNrLXRhYmxlXCIpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucXVlcnlTZWxlY3RvckFsbChcInRyOm5vdCguZGVjay1jYXRlZ29yeS1oZWFkZXIpXCIpO1xuICAgICAgICBpZiAodGFibGVfcm93cyA9PT0gbnVsbCB8fCB0YWJsZV9yb3dzID09PSB2b2lkIDAgPyB2b2lkIDAgOiB0YWJsZV9yb3dzLmxlbmd0aCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCB0ciBvZiB0YWJsZV9yb3dzKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgcm93ID0gKDAsIHV0aWxpdGllc18xLnBhcnNlX3JvdykodHIucXVlcnlTZWxlY3RvckFsbChcInRkXCIpKTtcbiAgICAgICAgICAgICAgICBpZiAocm93KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjYXJkID0gY2FyZF9saXN0LmZpbmQoYyA9PiBjLm5hbWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhyb3cubmFtZS50b0xvd2VyQ2FzZSgpKSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYXJkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB5aWVsZCBjb252ZXJ0UHJpY2Uocm93LCBjYXJkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdy5wcmljZS5pbm5lckhUTUwgPSBcIjxzcGFuIHN0eWxlPSdjb2xvcjogb3JhbmdlJyc+XCIgKyByb3cucHJpY2UuaW5uZXJIVE1MICsgXCI8L3NwYW4+XCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGFkZENoZWFwZXN0UHJpY2VzKCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGJvcmlzQ2hlYXBlc3RCdXR0b24ucmVtb3ZlKCk7XG4gICAgICAgIGlmIChwYWdlX3ZhbHVlcy5jYXJkX2xpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICB5aWVsZCBQcm9taXNlLmFsbChwYWdlX3ZhbHVlcy5jYXJkX2xpc3QubWFwKChjYXJkKSA9PiAoMCwgc2NyeWZhbGxfMS5nZXRfY2hlYXBlc3QpKGNhcmQubmFtZSkpKS50aGVuKChjaGVhcGVzdF9jYXJkcykgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBfYSwgX2IsIF9jLCBfZCwgX2U7XG4gICAgICAgICAgICAgICAgbGV0IGNhcmRfbGlzdCA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYyBvZiBjaGVhcGVzdF9jYXJkcykge1xuICAgICAgICAgICAgICAgICAgICBjYXJkX2xpc3QucHVzaChjKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcInRyLmRlY2stY2F0ZWdvcnktaGVhZGVyPnRoXCIpLmZvckVhY2goKHRoKSA9PiB0aC5jb2xTcGFuID0gNSk7XG4gICAgICAgICAgICAgICAgbGV0IHRvdGFsID0gMDtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGUgb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ib3Jpc1wiKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByb3dfZWxlbWVudCA9IGUucGFyZW50RWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgcm93ID0gKDAsIHV0aWxpdGllc18xLnBhcnNlX3Jvdykocm93X2VsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcInRkXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvdykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNhcmQgPSBjYXJkX2xpc3QuZmluZChjID0+IHsgdmFyIF9hOyByZXR1cm4gKF9hID0gYy5uYW1lKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhyb3cubmFtZS50b0xvd2VyQ2FzZSgpKTsgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRkLmNsYXNzTGlzdC5hZGQoXCJ0ZXh0LXJpZ2h0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBldXJfcHJpY2UgPSBwYXJzZUZsb2F0KChfZCA9ICgoX2IgPSAoX2EgPSBjYXJkLnByaWNlcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmV1cikgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogKF9jID0gY2FyZC5wcmljZXMpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5ldXJfZm9pbCkpICE9PSBudWxsICYmIF9kICE9PSB2b2lkIDAgPyBfZCA6IDApICogcm93LmFtb3VudDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjYXJkX3VyaSA9IChfZSA9IGNhcmQuc2NyeWZhbGxfdXJpKSAhPT0gbnVsbCAmJiBfZSAhPT0gdm9pZCAwID8gX2UgOiBcImphdmFzY3JpcHQ6dm9pZCgwKVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsICs9IGV1cl9wcmljZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZC5pbm5lckhUTUwgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIjxhIHN0eWxlPSdjb2xvcjogZGFya3Zpb2xldDsnIGhyZWY9XFxcIlwiICsgY2FyZF91cmkgKyBcIlxcXCI+XCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCI8c3Bhbj4g4oKsJm5ic3A7XCIgKyBldXJfcHJpY2UudG9Mb2NhbGVTdHJpbmcoXCJlbi11c1wiLCB7IG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMiB9KSArIFwiPC9zcGFuPjwvYT5cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRkLmlubmVySFRNTCA9IFwiPHNwYW4gc3R5bGU9J2NvbG9yOiBvcmFuZ2U7Jz4g4oKsJm5ic3A7WFguWFggPC9zcGFuPlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcm93X2VsZW1lbnQuYXBwZW5kQ2hpbGQodGQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICgwLCBjb21wb25lbnRzXzEuc2V0Q2hlYXBlc3RUb3RhbCkodG90YWwpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmNvbnN0IHRvZ2dsZVByaWNlcyA9ICgpID0+IHtcbiAgICBpZiAocGFnZV92YWx1ZXMuc2l6ZVRvZ2dsZSlcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ib3Jpc1wiKS5mb3JFYWNoKGUgPT4ge1xuICAgICAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgICAgIChfYSA9IGUucXVlcnlTZWxlY3RvcihcInNwYW4uYm9yaXMtdXNkLXByaWNlXCIpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Euc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJmb250LXNpemU6IDBcIik7XG4gICAgICAgICAgICAoX2IgPSBlLnF1ZXJ5U2VsZWN0b3IoXCJzcGFuLmJvcmlzLWV1ci1wcmljZVwiKSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIFwiZm9udC1zaXplOiBcIik7XG4gICAgICAgICAgICBib3Jpc1RvZ2dsZUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKFwiYnRuLW9ubGluZS1tdXRlZFwiKTtcbiAgICAgICAgICAgIGJvcmlzVG9nZ2xlQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJidG4tb25saW5lXCIpO1xuICAgICAgICB9KTtcbiAgICBlbHNlIHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ib3Jpc1wiKS5mb3JFYWNoKGUgPT4ge1xuICAgICAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgICAgIChfYSA9IGUucXVlcnlTZWxlY3RvcihcInNwYW4uYm9yaXMtdXNkLXByaWNlXCIpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Euc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJmb250LXNpemU6IFwiKTtcbiAgICAgICAgICAgIChfYiA9IGUucXVlcnlTZWxlY3RvcihcInNwYW4uYm9yaXMtZXVyLXByaWNlXCIpKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Iuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJmb250LXNpemU6IDBcIik7XG4gICAgICAgICAgICBib3Jpc1RvZ2dsZUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKFwiYnRuLW9ubGluZVwiKTtcbiAgICAgICAgICAgIGJvcmlzVG9nZ2xlQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJidG4tb25saW5lLW11dGVkXCIpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcGFnZV92YWx1ZXMuc2l6ZVRvZ2dsZSA9ICFwYWdlX3ZhbHVlcy5zaXplVG9nZ2xlO1xufTtcbmNvbnN0IGNvcHlUb0NsaXBib2FyZCA9ICgpID0+IF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgIGJvcmlzVG9DbGlwYm9hcmRCdXR0b24uY2hpbGRyZW5bMF0uY2xhc3NMaXN0LmFkZChcImJ0bi1wYXBlclwiKTtcbiAgICBjb25zdCBjbGlwYm9hcmRJdGVtID0gbmV3IENsaXBib2FyZEl0ZW0oe1xuICAgICAgICAndGV4dC9wbGFpbic6ICgwLCB1dGlsaXRpZXNfMS5nZXRfcHJpbnRhYmxlX2xpc3RfYmxvYikoKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShuZXcgQmxvYihbKHJlc3VsdCA/IHJlc3VsdCA6IFwiRXJyb3JlXCIpXSwgeyB0eXBlOiAndGV4dC9wbGFpbicgfSkpO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9KSxcbiAgICB9KTtcbiAgICBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlKFtjbGlwYm9hcmRJdGVtXSkudGhlbigoKSA9PiB7XG4gICAgICAgIGJvcmlzVG9DbGlwYm9hcmRCdXR0b24uY2hpbGRyZW5bMF0uY2xhc3NMaXN0LnJlbW92ZShcImJ0bi1wYXBlclwiKTtcbiAgICB9KTtcbn0pO1xuY29uc3QgYWRkVG9QaW5uZWREZWNrc0xpc3QgPSAoKSA9PiB7XG4gICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoJ3Bpbm5lZF9saXN0cycsIChyZXN1bHQpID0+IHtcbiAgICAgICAgdmFyIF9hLCBfYiwgX2M7XG4gICAgICAgIGlmIChyZXN1bHQucGlubmVkX2xpc3RzKVxuICAgICAgICAgICAgdmFyIHNhdmVkTGlzdHMgPSByZXN1bHQucGlubmVkX2xpc3RzO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB2YXIgc2F2ZWRMaXN0cyA9IFtdO1xuICAgICAgICBjb25zdCB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICAgICAgaWYgKCFzYXZlZExpc3RzLmZpbHRlcih1ID0+IHUudXJsID09PSB1cmwpLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgZm9ybWF0X3RleHQgPSAoX2EgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwicC5kZWNrLWNvbnRhaW5lci1pbmZvcm1hdGlvblwiKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmlubmVySFRNTDtcbiAgICAgICAgICAgIGNvbnN0IGZvcm1hdCA9IGZvcm1hdF90ZXh0LnNsaWNlKGZvcm1hdF90ZXh0LnNlYXJjaChcIkZvcm1hdDogXCIpICsgOCwgZm9ybWF0X3RleHQuc2VhcmNoKFwiPGJyPlwiKSk7XG4gICAgICAgICAgICBzYXZlZExpc3RzLnB1c2goeyB1cmw6IHVybCwgdGl0bGU6IChfYyA9ICgoX2IgPSBcIjxzdHJvbmc+XCIgKyBmb3JtYXQgKyBcIjwvc3Ryb25nPiB8IFwiKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBcIlwiKSArICgwLCB1dGlsaXRpZXNfMS5nZXRfdGl0bGUpKCkpICE9PSBudWxsICYmIF9jICE9PSB2b2lkIDAgPyBfYyA6IHVybCB9KTtcbiAgICAgICAgfVxuICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IHBpbm5lZF9saXN0czogc2F2ZWRMaXN0cy5zb3J0KChhLCBiKSA9PiBhLnRpdGxlLmxvY2FsZUNvbXBhcmUoYi50aXRsZSkpIH0sICgpID0+IHVwZGF0ZVBpbm5lZExpc3RzRHJvcGRvd24oKSk7XG4gICAgfSk7XG59O1xuZnVuY3Rpb24gY3JlYXRlQm9yaXNDb21wb25lbnRzKCkge1xuICAgIHZhciBfYSwgX2I7XG4gICAgYm9yaXNQcmljZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGJvcmlzUHJpY2VzLmNsYXNzTGlzdC5hZGQoXCJoZWFkZXItcHJpY2VzLWJvcmlzXCIsIFwiaGVhZGVyLXByaWNlcy1jdXJyZW5jeVwiKTtcbiAgICAoX2EgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2LmhlYWRlci1wcmljZXMtY3VycmVuY3lcIikpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5hZnRlcihib3Jpc1ByaWNlcyk7XG4gICAgYm9yaXNOYXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIik7XG4gICAgYm9yaXNOYXYuY2xhc3NMaXN0LmFkZChcIm5hdlwiLCBcIm5hdi1waWxsc1wiLCBcImRlY2stdHlwZS1tZW51XCIpO1xuICAgIGJvcmlzTmF2LnN0eWxlLmp1c3RpZnlDb250ZW50ID0gXCJzdGFydFwiO1xuICAgIChfYiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ1bC5kZWNrLXR5cGUtbWVudVwiKSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmFmdGVyKGJvcmlzTmF2KTtcbiAgICBib3Jpc1RvZ2dsZU91dGVyQnV0dG9uID0gKDAsIGNvbXBvbmVudHNfMS5uYXZCdXR0b25GYWN0b3J5KShcIkJvcmlzXCIpO1xuICAgIGJvcmlzVG9nZ2xlQnV0dG9uID0gYm9yaXNUb2dnbGVPdXRlckJ1dHRvbi5jaGlsZHJlblswXTtcbiAgICBib3Jpc1RvQ2xpcGJvYXJkQnV0dG9uID0gKDAsIGNvbXBvbmVudHNfMS5uYXZCdXR0b25GYWN0b3J5KShcIkNvcHlcIik7XG4gICAgYm9yaXNTYXZlQXNCdXR0b24gPSAoMCwgY29tcG9uZW50c18xLm5hdkJ1dHRvbkZhY3RvcnkpKFwiU2F2ZSBhcy4uLlwiKTtcbiAgICBib3Jpc0NoZWFwZXN0QnV0dG9uID0gKDAsIGNvbXBvbmVudHNfMS5uYXZCdXR0b25GYWN0b3J5KShcIkNoZWFwZXN0XCIpO1xuICAgIGJvcmlzUGluRGVja0J1dHRvbiA9ICgwLCBjb21wb25lbnRzXzEubmF2QnV0dG9uRmFjdG9yeSkoXCJQaW5cIik7XG4gICAgYm9yaXNVbnBpbkRlY2tCdXR0b24gPSAoMCwgY29tcG9uZW50c18xLm5hdkJ1dHRvbkZhY3RvcnkpKFwiUGlubmVkXCIpO1xuICAgIGJvcmlzVG9nZ2xlQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJidG4tb25saW5lLW11dGVkXCIpO1xuICAgIGJvcmlzVW5waW5EZWNrQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJzaG93XCIpO1xufVxuZnVuY3Rpb24gYWRkQnV0dG9ucygpIHtcbiAgICBib3Jpc05hdi5hcHBlbmRDaGlsZChib3Jpc1RvZ2dsZU91dGVyQnV0dG9uKTtcbiAgICBib3Jpc05hdi5hcHBlbmRDaGlsZChib3Jpc0NoZWFwZXN0QnV0dG9uKTtcbiAgICBib3Jpc05hdi5hcHBlbmRDaGlsZChib3Jpc1RvQ2xpcGJvYXJkQnV0dG9uKTtcbiAgICBib3Jpc05hdi5hcHBlbmRDaGlsZChib3Jpc1NhdmVBc0J1dHRvbik7XG4gICAgYm9yaXNOYXYuYXBwZW5kQ2hpbGQoYm9yaXNQaW5EZWNrQnV0dG9uKTtcbiAgICBib3Jpc1RvZ2dsZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdG9nZ2xlUHJpY2VzKTtcbiAgICBib3Jpc1RvQ2xpcGJvYXJkQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjb3B5VG9DbGlwYm9hcmQpO1xuICAgIGJvcmlzU2F2ZUFzQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB1dGlsaXRpZXNfMS5zYXZlVG9QQyk7XG4gICAgYm9yaXNDaGVhcGVzdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYWRkQ2hlYXBlc3RQcmljZXMpO1xuICAgIGJvcmlzUGluRGVja0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYWRkVG9QaW5uZWREZWNrc0xpc3QpO1xufVxuZnVuY3Rpb24gcmVtb3ZlQm9yaXNDb21wb25lbnRzKCkge1xuICAgIGJvcmlzVG9nZ2xlT3V0ZXJCdXR0b24ucmVtb3ZlKCk7XG4gICAgYm9yaXNUb2dnbGVCdXR0b24ucmVtb3ZlKCk7XG4gICAgYm9yaXNDaGVhcGVzdEJ1dHRvbi5yZW1vdmUoKTtcbiAgICBib3Jpc1RvQ2xpcGJvYXJkQnV0dG9uLnJlbW92ZSgpO1xuICAgIGJvcmlzU2F2ZUFzQnV0dG9uLnJlbW92ZSgpO1xuICAgIGJvcmlzUGluRGVja0J1dHRvbi5yZW1vdmUoKTtcbiAgICBib3Jpc1VucGluRGVja0J1dHRvbi5yZW1vdmUoKTtcbiAgICBib3Jpc1ByaWNlcy5yZW1vdmUoKTtcbiAgICBib3Jpc05hdi5yZW1vdmUoKTtcbn1cbmZ1bmN0aW9uIGJvcmlzRGVja2xpc3QoKSB7XG4gICAgKDAsIHNjcnlmYWxsXzEuZmV0Y2hfY2FyZHMpKCkudGhlbigobGlzdCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBwYWdlX3ZhbHVlcy5jYXJkX2xpc3QgPSBsaXN0O1xuICAgICAgICB5aWVsZCBjb252ZXJ0QWxsUHJpY2VzKCk7XG4gICAgICAgICgwLCBjb21wb25lbnRzXzEuc2V0VG90YWwpKHBhZ2VfdmFsdWVzLnRvdGFsKTtcbiAgICAgICAgdG9nZ2xlUHJpY2VzKCk7XG4gICAgfSkpLnRoZW4oKCkgPT4ge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGlmICgoX2EgPSBjaHJvbWUucnVudGltZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmlkKSB7XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldChbJ2F1dG8nXSwgKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBkYXRhLmF1dG8gPyBhZGRDaGVhcGVzdFByaWNlcygpIDogY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyBhdXRvOiBmYWxzZSB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHVwZGF0ZVBpbm5lZExpc3RzRHJvcGRvd24oKTtcbiAgICAgICAgYWRkQnV0dG9ucygpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gYm9yaXNEZWNrZWRpdG9yKCkge1xuICAgIHZhciBfYTtcbiAgICAoX2EgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByZXZpZXdcIikpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBwYWdlX3ZhbHVlcy50b3RhbCA9IDA7XG4gICAgICAgIHBhZ2VfdmFsdWVzLnNpemVUb2dnbGUgPSB0cnVlO1xuICAgICAgICBwYWdlX3ZhbHVlcy5jYXJkX2xpc3QgPSBbXTtcbiAgICAgICAgKDAsIHV0aWxpdGllc18yLnNsZWVwKSgyMDAwKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJlbW92ZUJvcmlzQ29tcG9uZW50cygpO1xuICAgICAgICAgICAgY3JlYXRlQm9yaXNDb21wb25lbnRzKCk7XG4gICAgICAgICAgICBib3Jpc0RlY2tsaXN0KCk7XG4gICAgICAgIH0pO1xuICAgIH0pKTtcbn1cbmlmICh3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUuaW5jbHVkZXMoXCJtdGdnb2xkZmlzaC5jb21cIikpIHsgLy8gY29udHJvbGxvIGludXRpbGU/XG4gICAgY29uc3QgcGFnZV91cmwgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG4gICAgaWYgKHBhZ2VfdXJsLmluY2x1ZGVzKFwiZGVja3NcIikpIHtcbiAgICAgICAgYm9yaXNEZWNrZWRpdG9yKCk7XG4gICAgfVxuICAgIGlmIChwYWdlX3VybC5pbmNsdWRlcyhcImRlY2tcIikgfHwgcGFnZV91cmwuaW5jbHVkZXMoXCJhcmNoZXR5cGVcIikpIHtcbiAgICAgICAgY3JlYXRlQm9yaXNDb21wb25lbnRzKCk7XG4gICAgICAgIGJvcmlzRGVja2xpc3QoKTtcbiAgICB9XG59XG4vLyBUT0RPIGNvbnRyb2xsbyBwcmV6em8gZm9pbCBwacO5IGJhc3NvID0+IGNvbG9yZSBkaXZlcnNvXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHZhciByID0gZm4oKTtcblx0XHRcdGlmIChyICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtdGdnb2xkZmlzaC9jb250ZW50X3NjcmlwdFwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtib3Jpc1wiXSA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtib3Jpc1wiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9yXCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL210Z2dvbGRmaXNoL2NvbnRlbnRfc2NyaXB0LnRzXCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
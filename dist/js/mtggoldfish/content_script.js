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
let borisCockatriceButton;
let borisCheapestButton;
let borisSaveDeckButton;
let borisRemoveDeckButton;
function removeSavedList(to_delete) {
    chrome.storage.sync.get('saved_lists', (result) => {
        var _a;
        if (to_delete === window.location.href) {
            borisNav.appendChild(borisSaveDeckButton);
            borisSaveDeckButton.addEventListener("click", addToSavedDecksList);
            borisRemoveDeckButton.remove();
        }
        const list = result.saved_lists.filter((l) => l.url !== to_delete);
        if (!list.length)
            (_a = document.getElementById("saved-lists-dropdown")) === null || _a === void 0 ? void 0 : _a.remove();
        chrome.storage.sync.set({ saved_lists: list }, () => updateSavedListsDropdown());
    });
}
function toggleSaveDeck() {
    borisSaveDeckButton.remove();
    borisNav.appendChild(borisRemoveDeckButton);
    borisRemoveDeckButton.addEventListener("click", () => removeSavedList(window.location.href));
}
function updateSavedListsDropdown() {
    chrome.storage.sync.get('saved_lists', (result) => {
        var _a, _b;
        if (((_a = result.saved_lists) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            if (result.saved_lists.filter((l) => l.url === window.location.href).length) {
                toggleSaveDeck();
            }
            (_b = document.getElementById("saved-lists-dropdown")) === null || _b === void 0 ? void 0 : _b.remove();
            const li = document.createElement("li");
            li.style.padding = "0.5em";
            li.id = "saved-lists-dropdown";
            li.classList.add("dropdown", "nav-item");
            const a = document.createElement("a");
            a.classList.add("nav-link", "dropdown-toggle");
            a.innerHTML = "Saved Lists";
            a.href = "#";
            a.setAttribute("data-toggle", "dropdown");
            const div = document.createElement("div");
            div.classList.add("dropdown-menu");
            document.head.insertAdjacentHTML("beforeend", `<style>.dropdown-item:hover, .dropdown-item:focus { background-color: #d6d6d6; }</style>`);
            for (const list of result.saved_lists) {
                div.appendChild((0, components_1.newDropdownItem)(list, removeSavedList));
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
                let card = card_list.find(c => c.name.toLowerCase().includes(row.name.toLowerCase()));
                if (card) {
                    yield convertPrice(row, card);
                }
                else {
                    row.price.innerHTML = "<span style='color: orange''>" + row.price.innerHTML + "</span>";
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
const addToSavedDecksList = () => {
    chrome.storage.sync.get('saved_lists', (result) => {
        var _a, _b, _c;
        if (result.saved_lists)
            var savedLists = result.saved_lists;
        else
            var savedLists = [];
        const url = window.location.href;
        if (!savedLists.filter(u => u.url === url).length) {
            const format_text = (_a = document.querySelector("p.deck-container-information")) === null || _a === void 0 ? void 0 : _a.innerHTML;
            const format = format_text.slice(format_text.search("Format: ") + 8, format_text.search("<br>"));
            savedLists.push({ url: url, title: (_c = ((_b = "<strong>" + format + "</strong> | ") !== null && _b !== void 0 ? _b : "") + (0, utilities_1.get_title)()) !== null && _c !== void 0 ? _c : url });
        }
        chrome.storage.sync.set({ saved_lists: savedLists.sort((a, b) => a.title.localeCompare(b.title)) }, () => updateSavedListsDropdown());
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
    borisCockatriceButton = (0, components_1.navButtonFactory)("Cockatrice");
    borisCheapestButton = (0, components_1.navButtonFactory)("Cheapest");
    borisSaveDeckButton = (0, components_1.navButtonFactory)("Save");
    borisRemoveDeckButton = (0, components_1.navButtonFactory)("Saved");
    borisToggleButton.classList.add("btn-online-muted");
    borisRemoveDeckButton.classList.add("show");
}
function addButtons() {
    borisNav.appendChild(borisToggleOuterButton);
    borisNav.appendChild(borisToClipboardButton);
    borisNav.appendChild(borisCockatriceButton);
    borisNav.appendChild(borisCheapestButton);
    borisNav.appendChild(borisSaveDeckButton);
    borisToggleButton.addEventListener("click", togglePrices);
    borisToClipboardButton.addEventListener("click", copyToClipboard);
    borisCockatriceButton.addEventListener("click", utilities_1.saveToCockatrice);
    borisCheapestButton.addEventListener("click", addCheapestPrices);
    borisSaveDeckButton.addEventListener("click", addToSavedDecksList);
}
function removeBorisComponents() {
    borisToggleOuterButton.remove();
    borisToggleButton.remove();
    borisToClipboardButton.remove();
    borisCockatriceButton.remove();
    borisCheapestButton.remove();
    borisSaveDeckButton.remove();
    borisRemoveDeckButton.remove();
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
        updateSavedListsDropdown();
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor"], () => (__webpack_require__("./src/mtggoldfish/content_script.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFLO1dBQ0w7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQzNCQTs7Ozs7V0NBQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTSxxQkFBcUI7V0FDM0I7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7Ozs7O1VFaERBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ib3Jpcy8uL3NyYy9tdGdnb2xkZmlzaC9jb21wb25lbnRzLnRzIiwid2VicGFjazovL2JvcmlzLy4vc3JjL210Z2dvbGRmaXNoL2NvbnRlbnRfc2NyaXB0LnRzIiwid2VicGFjazovL2JvcmlzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JvcmlzL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vYm9yaXMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9ib3Jpcy93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9ib3Jpcy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2JvcmlzL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9ib3Jpcy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLm5ld0Ryb3Bkb3duSXRlbSA9IGV4cG9ydHMuc2V0Q2hlYXBlc3RUb3RhbCA9IGV4cG9ydHMuc2V0VG90YWwgPSBleHBvcnRzLm5hdkJ1dHRvbkZhY3RvcnkgPSB2b2lkIDA7XG5mdW5jdGlvbiBuYXZCdXR0b25GYWN0b3J5KHRleHQpIHtcbiAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgICBsaS5jbGFzc0xpc3QuYWRkKFwibmF2LWl0ZW1cIik7XG4gICAgbGkuc3R5bGUucGFkZGluZyA9IFwiMC41ZW1cIjtcbiAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgYS5jbGFzc0xpc3QuYWRkKFwibmF2LWxpbmtcIik7XG4gICAgYS5pbm5lckhUTUwgPSB0ZXh0O1xuICAgIGEuaHJlZiA9IFwiamF2YXNjcmlwdDp2b2lkKDApXCI7XG4gICAgbGkuYXBwZW5kQ2hpbGQoYSk7XG4gICAgcmV0dXJuIGxpO1xufVxuZXhwb3J0cy5uYXZCdXR0b25GYWN0b3J5ID0gbmF2QnV0dG9uRmFjdG9yeTtcbmZ1bmN0aW9uIHRvdGFsRmFjdG9yeSh0b3RhbCwgYm9yaXNfY2xhc3MpIHtcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGRpdi5jbGFzc0xpc3QuYWRkKFwiZGVjay1wcmljZS12MlwiLCBib3Jpc19jbGFzcyk7XG4gICAgY29uc3QgbG9jYWxlX3RvdGFsID0gdG90YWwudG9Mb2NhbGVTdHJpbmcoXCJlbi11c1wiLCB7IG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMiB9KS5zcGxpdChcIi5cIik7XG4gICAgZGl2LmlubmVySFRNTCA9IFwiIOKCrCZuYnNwO1wiICsgbG9jYWxlX3RvdGFsWzBdICsgXCI8c3BhbiBjbGFzcz0nY2VudHMnPi5cIiArIGxvY2FsZV90b3RhbFsxXSArIFwiPC9zcGFuPlwiO1xuICAgIHJldHVybiBkaXY7XG59XG5mdW5jdGlvbiBzZXRUb3RhbCh0b3RhbCkge1xuICAgIHZhciBfYSwgX2I7XG4gICAgKF9hID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ib3Jpcy1wcmljZVwiKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnJlbW92ZSgpO1xuICAgIGNvbnN0IHByaWNlX2RpdiA9IHRvdGFsRmFjdG9yeSh0b3RhbCwgXCJib3Jpcy1wcmljZVwiKTtcbiAgICBkb2N1bWVudC5oZWFkLmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWVuZFwiLCBgPHN0eWxlPi5ib3Jpcy1wcmljZTpiZWZvcmUge2NvbnRlbnQ6IFwiQm9yaXNcIjt9PC9zdHlsZT5gKTtcbiAgICBwcmljZV9kaXYuc3R5bGUuY29sb3IgPSBcIiNmMGFkNGVcIjtcbiAgICAoX2IgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmhlYWRlci1wcmljZXMtYm9yaXNcIikpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5wcmVwZW5kKHByaWNlX2Rpdik7XG59XG5leHBvcnRzLnNldFRvdGFsID0gc2V0VG90YWw7XG5mdW5jdGlvbiBzZXRDaGVhcGVzdFRvdGFsKHRvdGFsKSB7XG4gICAgdmFyIF9hLCBfYjtcbiAgICAoX2EgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJvcmlzLWNoZWFwZXN0XCIpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucmVtb3ZlKCk7XG4gICAgY29uc3QgcHJpY2VfZGl2ID0gdG90YWxGYWN0b3J5KHRvdGFsLCBcImJvcmlzLWNoZWFwZXN0XCIpO1xuICAgIGRvY3VtZW50LmhlYWQuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlZW5kXCIsIGA8c3R5bGU+LmJvcmlzLWNoZWFwZXN0OmJlZm9yZSB7Y29udGVudDogXCJDaGVhcGVzdFwiO308L3N0eWxlPmApO1xuICAgIHByaWNlX2Rpdi5zdHlsZS5jb2xvciA9IFwiZGFya3Zpb2xldFwiO1xuICAgIChfYiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuaGVhZGVyLXByaWNlcy1ib3Jpc1wiKSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnByZXBlbmQocHJpY2VfZGl2KTtcbn1cbmV4cG9ydHMuc2V0Q2hlYXBlc3RUb3RhbCA9IHNldENoZWFwZXN0VG90YWw7XG5mdW5jdGlvbiBuZXdEcm9wZG93bkl0ZW0obGlzdCwgZGVsZXRlRnVuY3Rpb24pIHtcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGRpdi5jbGFzc0xpc3QuYWRkKFwiZHJvcGRvd24taXRlbVwiKTtcbiAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgbGluay5zdHlsZS5jb2xvciA9IFwiYmxhY2tcIjtcbiAgICBsaW5rLnN0eWxlLnBhZGRpbmdMZWZ0ID0gXCIxZW1cIjtcbiAgICBsaW5rLmlubmVySFRNTCA9IGxpc3QudGl0bGU7XG4gICAgbGluay5ocmVmID0gbGlzdC51cmw7XG4gICAgY29uc3QgZGVsZXRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgIGRlbGV0ZXIuaW5uZXJIVE1MID0gXCI8c3Ryb25nPlg8L3N0cm9uZz4mbmJzcDtcIjtcbiAgICBkZWxldGVyLnN0eWxlLmNvbG9yID0gXCJyZWRcIjtcbiAgICBkZWxldGVyLmhyZWYgPSBcImphdmFzY3JpcHQ6dm9pZCgwKVwiO1xuICAgIGRlbGV0ZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IGRlbGV0ZUZ1bmN0aW9uKGxpc3QudXJsKSk7XG4gICAgZGl2LmFwcGVuZENoaWxkKGRlbGV0ZXIpO1xuICAgIGRpdi5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICByZXR1cm4gZGl2O1xufVxuZXhwb3J0cy5uZXdEcm9wZG93bkl0ZW0gPSBuZXdEcm9wZG93bkl0ZW07XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3Qgc2NyeWZhbGxfMSA9IHJlcXVpcmUoXCIuLi9jb21tb24vc2NyeWZhbGxcIik7XG5jb25zdCBjb21wb25lbnRzXzEgPSByZXF1aXJlKFwiLi9jb21wb25lbnRzXCIpO1xuY29uc3QgdXRpbGl0aWVzXzEgPSByZXF1aXJlKFwiLi91dGlsaXRpZXNcIik7XG5jb25zdCB1dGlsaXRpZXNfMiA9IHJlcXVpcmUoXCIuLi9jb21tb24vdXRpbGl0aWVzXCIpO1xubGV0IHBhZ2VfdmFsdWVzID0ge1xuICAgIHRvdGFsOiAwLFxuICAgIHNpemVUb2dnbGU6IHRydWUsXG4gICAgY2FyZF9saXN0OiBbXSxcbn07XG5sZXQgYm9yaXNQcmljZXM7XG5sZXQgYm9yaXNOYXY7XG5sZXQgYm9yaXNUb2dnbGVPdXRlckJ1dHRvbjtcbmxldCBib3Jpc1RvZ2dsZUJ1dHRvbjtcbmxldCBib3Jpc1RvQ2xpcGJvYXJkQnV0dG9uO1xubGV0IGJvcmlzQ29ja2F0cmljZUJ1dHRvbjtcbmxldCBib3Jpc0NoZWFwZXN0QnV0dG9uO1xubGV0IGJvcmlzU2F2ZURlY2tCdXR0b247XG5sZXQgYm9yaXNSZW1vdmVEZWNrQnV0dG9uO1xuZnVuY3Rpb24gcmVtb3ZlU2F2ZWRMaXN0KHRvX2RlbGV0ZSkge1xuICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KCdzYXZlZF9saXN0cycsIChyZXN1bHQpID0+IHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBpZiAodG9fZGVsZXRlID09PSB3aW5kb3cubG9jYXRpb24uaHJlZikge1xuICAgICAgICAgICAgYm9yaXNOYXYuYXBwZW5kQ2hpbGQoYm9yaXNTYXZlRGVja0J1dHRvbik7XG4gICAgICAgICAgICBib3Jpc1NhdmVEZWNrQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhZGRUb1NhdmVkRGVja3NMaXN0KTtcbiAgICAgICAgICAgIGJvcmlzUmVtb3ZlRGVja0J1dHRvbi5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsaXN0ID0gcmVzdWx0LnNhdmVkX2xpc3RzLmZpbHRlcigobCkgPT4gbC51cmwgIT09IHRvX2RlbGV0ZSk7XG4gICAgICAgIGlmICghbGlzdC5sZW5ndGgpXG4gICAgICAgICAgICAoX2EgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNhdmVkLWxpc3RzLWRyb3Bkb3duXCIpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucmVtb3ZlKCk7XG4gICAgICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHsgc2F2ZWRfbGlzdHM6IGxpc3QgfSwgKCkgPT4gdXBkYXRlU2F2ZWRMaXN0c0Ryb3Bkb3duKCkpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gdG9nZ2xlU2F2ZURlY2soKSB7XG4gICAgYm9yaXNTYXZlRGVja0J1dHRvbi5yZW1vdmUoKTtcbiAgICBib3Jpc05hdi5hcHBlbmRDaGlsZChib3Jpc1JlbW92ZURlY2tCdXR0b24pO1xuICAgIGJvcmlzUmVtb3ZlRGVja0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gcmVtb3ZlU2F2ZWRMaXN0KHdpbmRvdy5sb2NhdGlvbi5ocmVmKSk7XG59XG5mdW5jdGlvbiB1cGRhdGVTYXZlZExpc3RzRHJvcGRvd24oKSB7XG4gICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoJ3NhdmVkX2xpc3RzJywgKHJlc3VsdCkgPT4ge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICBpZiAoKChfYSA9IHJlc3VsdC5zYXZlZF9saXN0cykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmxlbmd0aCkgPiAwKSB7XG4gICAgICAgICAgICBpZiAocmVzdWx0LnNhdmVkX2xpc3RzLmZpbHRlcigobCkgPT4gbC51cmwgPT09IHdpbmRvdy5sb2NhdGlvbi5ocmVmKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0b2dnbGVTYXZlRGVjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgKF9iID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXZlZC1saXN0cy1kcm9wZG93blwiKSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnJlbW92ZSgpO1xuICAgICAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgICAgICAgICBsaS5zdHlsZS5wYWRkaW5nID0gXCIwLjVlbVwiO1xuICAgICAgICAgICAgbGkuaWQgPSBcInNhdmVkLWxpc3RzLWRyb3Bkb3duXCI7XG4gICAgICAgICAgICBsaS5jbGFzc0xpc3QuYWRkKFwiZHJvcGRvd25cIiwgXCJuYXYtaXRlbVwiKTtcbiAgICAgICAgICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICAgICAgICAgIGEuY2xhc3NMaXN0LmFkZChcIm5hdi1saW5rXCIsIFwiZHJvcGRvd24tdG9nZ2xlXCIpO1xuICAgICAgICAgICAgYS5pbm5lckhUTUwgPSBcIlNhdmVkIExpc3RzXCI7XG4gICAgICAgICAgICBhLmhyZWYgPSBcIiNcIjtcbiAgICAgICAgICAgIGEuc2V0QXR0cmlidXRlKFwiZGF0YS10b2dnbGVcIiwgXCJkcm9wZG93blwiKTtcbiAgICAgICAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBkaXYuY2xhc3NMaXN0LmFkZChcImRyb3Bkb3duLW1lbnVcIik7XG4gICAgICAgICAgICBkb2N1bWVudC5oZWFkLmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWVuZFwiLCBgPHN0eWxlPi5kcm9wZG93bi1pdGVtOmhvdmVyLCAuZHJvcGRvd24taXRlbTpmb2N1cyB7IGJhY2tncm91bmQtY29sb3I6ICNkNmQ2ZDY7IH08L3N0eWxlPmApO1xuICAgICAgICAgICAgZm9yIChjb25zdCBsaXN0IG9mIHJlc3VsdC5zYXZlZF9saXN0cykge1xuICAgICAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZCgoMCwgY29tcG9uZW50c18xLm5ld0Ryb3Bkb3duSXRlbSkobGlzdCwgcmVtb3ZlU2F2ZWRMaXN0KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsaS5hcHBlbmRDaGlsZChhKTtcbiAgICAgICAgICAgIGxpLmFwcGVuZENoaWxkKGRpdik7XG4gICAgICAgICAgICBib3Jpc05hdi5hcHBlbmRDaGlsZChsaSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGNvbnZlcnRQcmljZShyb3csIGNhcmQpIHtcbiAgICB2YXIgX2EsIF9iLCBfYywgX2QsIF9lLCBfZiwgX2csIF9oLCBfajtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBsZXQgZXVyX3ByaWNlO1xuICAgICAgICBpZiAoKCgoX2EgPSBjYXJkLnByaWNlcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmV1cikgPT09IG51bGwgJiYgKChfYiA9IGNhcmQucHJpY2VzKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuZXVyX2ZvaWwpID09PSBudWxsKSB8fCBjYXJkLmJvcmRlcl9jb2xvciA9PT0gXCJnb2xkXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IGNoZWFwID0geWllbGQgKDAsIHNjcnlmYWxsXzEuZ2V0X2NoZWFwZXN0KShjYXJkLm5hbWUpO1xuICAgICAgICAgICAgZXVyX3ByaWNlID0gcGFyc2VGbG9hdCgoX2QgPSAoX2MgPSBjaGVhcC5wcmljZXMpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5ldXIpICE9PSBudWxsICYmIF9kICE9PSB2b2lkIDAgPyBfZCA6IChfZSA9IGNoZWFwLnByaWNlcykgPT09IG51bGwgfHwgX2UgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9lLmV1cl9mb2lsKSAqIHJvdy5hbW91bnQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBldXJfcHJpY2UgPSBwYXJzZUZsb2F0KChfZyA9IChfZiA9IGNhcmQucHJpY2VzKSA9PT0gbnVsbCB8fCBfZiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2YuZXVyKSAhPT0gbnVsbCAmJiBfZyAhPT0gdm9pZCAwID8gX2cgOiAoX2ggPSBjYXJkLnByaWNlcykgPT09IG51bGwgfHwgX2ggPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9oLmV1cl9mb2lsKSAqIHJvdy5hbW91bnQ7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY2FyZF91cmkgPSAoX2ogPSBjYXJkLnB1cmNoYXNlX3VyaXMuY2FyZG1hcmtldCkgIT09IG51bGwgJiYgX2ogIT09IHZvaWQgMCA/IF9qIDogY2FyZC5zY3J5ZmFsbF91cmk7XG4gICAgICAgIHJvdy5wcmljZS5pbm5lckhUTUwgPVxuICAgICAgICAgICAgXCI8YSBzdHlsZT0nY29sb3I6IGluaGVyaXQ7JyBocmVmPVxcXCJcIiArIGNhcmRfdXJpICsgXCJcXFwiPlwiICtcbiAgICAgICAgICAgICAgICBcIjxzcGFuIGNsYXNzPSdib3Jpcy11c2QtcHJpY2UnXCIgKyAoIXBhZ2VfdmFsdWVzLnNpemVUb2dnbGUgPyBcIiBzdHlsZT0nZm9udC1zaXplOiAwJ1wiIDogXCJcIikgKyBcIj5cIiArIHJvdy5wcmljZS5pbm5lckhUTUwgKyBcIjwvc3Bhbj5cIiArXG4gICAgICAgICAgICAgICAgXCI8c3BhbiBjbGFzcz0nYm9yaXMtZXVyLXByaWNlJyBcIiArIChwYWdlX3ZhbHVlcy5zaXplVG9nZ2xlID8gXCIgc3R5bGU9J2ZvbnQtc2l6ZTogMCdcIiA6IFwiXCIpICsgXCI+IOKCrCZuYnNwO1wiICsgZXVyX3ByaWNlLnRvTG9jYWxlU3RyaW5nKFwiZW4tdXNcIiwgeyBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IDIgfSkgKyBcIjwvc3Bhbj5cIiArXG4gICAgICAgICAgICAgICAgXCI8L2E+XCI7XG4gICAgICAgIHBhZ2VfdmFsdWVzLnRvdGFsICs9IGV1cl9wcmljZTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGNvbnZlcnRBbGxQcmljZXMoKSB7XG4gICAgdmFyIF9hO1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGNvbnN0IGNhcmRfbGlzdCA9IHBhZ2VfdmFsdWVzLmNhcmRfbGlzdDtcbiAgICAgICAgY29uc3QgdGFibGVfcm93cyA9IChfYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ0YWJsZS5kZWNrLXZpZXctZGVjay10YWJsZVwiKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0cjpub3QoLmRlY2stY2F0ZWdvcnktaGVhZGVyKVwiKTtcbiAgICAgICAgaWYgKHRhYmxlX3Jvd3MgPT09IG51bGwgfHwgdGFibGVfcm93cyA9PT0gdm9pZCAwID8gdm9pZCAwIDogdGFibGVfcm93cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgdHIgb2YgdGFibGVfcm93cykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJvdyA9ICgwLCB1dGlsaXRpZXNfMS5wYXJzZV9yb3cpKHRyLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0ZFwiKSk7XG4gICAgICAgICAgICAgICAgbGV0IGNhcmQgPSBjYXJkX2xpc3QuZmluZChjID0+IGMubmFtZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHJvdy5uYW1lLnRvTG93ZXJDYXNlKCkpKTtcbiAgICAgICAgICAgICAgICBpZiAoY2FyZCkge1xuICAgICAgICAgICAgICAgICAgICB5aWVsZCBjb252ZXJ0UHJpY2Uocm93LCBjYXJkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJvdy5wcmljZS5pbm5lckhUTUwgPSBcIjxzcGFuIHN0eWxlPSdjb2xvcjogb3JhbmdlJyc+XCIgKyByb3cucHJpY2UuaW5uZXJIVE1MICsgXCI8L3NwYW4+XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59XG5mdW5jdGlvbiBhZGRDaGVhcGVzdFByaWNlcygpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBib3Jpc0NoZWFwZXN0QnV0dG9uLnJlbW92ZSgpO1xuICAgICAgICBpZiAocGFnZV92YWx1ZXMuY2FyZF9saXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgeWllbGQgUHJvbWlzZS5hbGwocGFnZV92YWx1ZXMuY2FyZF9saXN0Lm1hcCgoY2FyZCkgPT4gKDAsIHNjcnlmYWxsXzEuZ2V0X2NoZWFwZXN0KShjYXJkLm5hbWUpKSkudGhlbigoY2hlYXBlc3RfY2FyZHMpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgX2EsIF9iLCBfYywgX2QsIF9lO1xuICAgICAgICAgICAgICAgIGxldCBjYXJkX2xpc3QgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGMgb2YgY2hlYXBlc3RfY2FyZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FyZF9saXN0LnB1c2goYyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0ci5kZWNrLWNhdGVnb3J5LWhlYWRlcj50aFwiKS5mb3JFYWNoKCh0aCkgPT4gdGguY29sU3BhbiA9IDUpO1xuICAgICAgICAgICAgICAgIGxldCB0b3RhbCA9IDA7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBlIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYm9yaXNcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgcm93X2VsZW1lbnQgPSBlLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvdyA9ICgwLCB1dGlsaXRpZXNfMS5wYXJzZV9yb3cpKHJvd19lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0ZFwiKSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjYXJkID0gY2FyZF9saXN0LmZpbmQoYyA9PiB7IHZhciBfYTsgcmV0dXJuIChfYSA9IGMubmFtZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocm93Lm5hbWUudG9Mb3dlckNhc2UoKSk7IH0pO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGQuY2xhc3NMaXN0LmFkZChcInRleHQtcmlnaHRcIik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYXJkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBldXJfcHJpY2UgPSBwYXJzZUZsb2F0KChfZCA9ICgoX2IgPSAoX2EgPSBjYXJkLnByaWNlcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmV1cikgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogKF9jID0gY2FyZC5wcmljZXMpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5ldXJfZm9pbCkpICE9PSBudWxsICYmIF9kICE9PSB2b2lkIDAgPyBfZCA6IDApICogcm93LmFtb3VudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhcmRfdXJpID0gKF9lID0gY2FyZC5zY3J5ZmFsbF91cmkpICE9PSBudWxsICYmIF9lICE9PSB2b2lkIDAgPyBfZSA6IFwiamF2YXNjcmlwdDp2b2lkKDApXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbCArPSBldXJfcHJpY2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZC5pbm5lckhUTUwgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiPGEgc3R5bGU9J2NvbG9yOiBkYXJrdmlvbGV0OycgaHJlZj1cXFwiXCIgKyBjYXJkX3VyaSArIFwiXFxcIj5cIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiPHNwYW4+IOKCrCZuYnNwO1wiICsgZXVyX3ByaWNlLnRvTG9jYWxlU3RyaW5nKFwiZW4tdXNcIiwgeyBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IDIgfSkgKyBcIjwvc3Bhbj48L2E+XCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZC5pbm5lckhUTUwgPSBcIjxzcGFuIHN0eWxlPSdjb2xvcjogb3JhbmdlOyc+IOKCrCZuYnNwO1hYLlhYIDwvc3Bhbj5cIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByb3dfZWxlbWVudC5hcHBlbmRDaGlsZCh0ZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICgwLCBjb21wb25lbnRzXzEuc2V0Q2hlYXBlc3RUb3RhbCkodG90YWwpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmNvbnN0IHRvZ2dsZVByaWNlcyA9ICgpID0+IHtcbiAgICBpZiAocGFnZV92YWx1ZXMuc2l6ZVRvZ2dsZSlcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ib3Jpc1wiKS5mb3JFYWNoKGUgPT4ge1xuICAgICAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgICAgIChfYSA9IGUucXVlcnlTZWxlY3RvcihcInNwYW4uYm9yaXMtdXNkLXByaWNlXCIpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Euc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJmb250LXNpemU6IDBcIik7XG4gICAgICAgICAgICAoX2IgPSBlLnF1ZXJ5U2VsZWN0b3IoXCJzcGFuLmJvcmlzLWV1ci1wcmljZVwiKSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIFwiZm9udC1zaXplOiBcIik7XG4gICAgICAgICAgICBib3Jpc1RvZ2dsZUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKFwiYnRuLW9ubGluZS1tdXRlZFwiKTtcbiAgICAgICAgICAgIGJvcmlzVG9nZ2xlQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJidG4tb25saW5lXCIpO1xuICAgICAgICB9KTtcbiAgICBlbHNlIHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ib3Jpc1wiKS5mb3JFYWNoKGUgPT4ge1xuICAgICAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgICAgIChfYSA9IGUucXVlcnlTZWxlY3RvcihcInNwYW4uYm9yaXMtdXNkLXByaWNlXCIpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Euc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJmb250LXNpemU6IFwiKTtcbiAgICAgICAgICAgIChfYiA9IGUucXVlcnlTZWxlY3RvcihcInNwYW4uYm9yaXMtZXVyLXByaWNlXCIpKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Iuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJmb250LXNpemU6IDBcIik7XG4gICAgICAgICAgICBib3Jpc1RvZ2dsZUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKFwiYnRuLW9ubGluZVwiKTtcbiAgICAgICAgICAgIGJvcmlzVG9nZ2xlQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJidG4tb25saW5lLW11dGVkXCIpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcGFnZV92YWx1ZXMuc2l6ZVRvZ2dsZSA9ICFwYWdlX3ZhbHVlcy5zaXplVG9nZ2xlO1xufTtcbmNvbnN0IGNvcHlUb0NsaXBib2FyZCA9ICgpID0+IF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgIGJvcmlzVG9DbGlwYm9hcmRCdXR0b24uY2hpbGRyZW5bMF0uY2xhc3NMaXN0LmFkZChcImJ0bi1wYXBlclwiKTtcbiAgICBjb25zdCBjbGlwYm9hcmRJdGVtID0gbmV3IENsaXBib2FyZEl0ZW0oe1xuICAgICAgICAndGV4dC9wbGFpbic6ICgwLCB1dGlsaXRpZXNfMS5nZXRfcHJpbnRhYmxlX2xpc3RfYmxvYikoKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShuZXcgQmxvYihbKHJlc3VsdCA/IHJlc3VsdCA6IFwiRXJyb3JlXCIpXSwgeyB0eXBlOiAndGV4dC9wbGFpbicgfSkpO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9KSxcbiAgICB9KTtcbiAgICBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlKFtjbGlwYm9hcmRJdGVtXSkudGhlbigoKSA9PiB7XG4gICAgICAgIGJvcmlzVG9DbGlwYm9hcmRCdXR0b24uY2hpbGRyZW5bMF0uY2xhc3NMaXN0LnJlbW92ZShcImJ0bi1wYXBlclwiKTtcbiAgICB9KTtcbn0pO1xuY29uc3QgYWRkVG9TYXZlZERlY2tzTGlzdCA9ICgpID0+IHtcbiAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldCgnc2F2ZWRfbGlzdHMnLCAocmVzdWx0KSA9PiB7XG4gICAgICAgIHZhciBfYSwgX2IsIF9jO1xuICAgICAgICBpZiAocmVzdWx0LnNhdmVkX2xpc3RzKVxuICAgICAgICAgICAgdmFyIHNhdmVkTGlzdHMgPSByZXN1bHQuc2F2ZWRfbGlzdHM7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHZhciBzYXZlZExpc3RzID0gW107XG4gICAgICAgIGNvbnN0IHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgICAgICBpZiAoIXNhdmVkTGlzdHMuZmlsdGVyKHUgPT4gdS51cmwgPT09IHVybCkubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBmb3JtYXRfdGV4dCA9IChfYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJwLmRlY2stY29udGFpbmVyLWluZm9ybWF0aW9uXCIpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuaW5uZXJIVE1MO1xuICAgICAgICAgICAgY29uc3QgZm9ybWF0ID0gZm9ybWF0X3RleHQuc2xpY2UoZm9ybWF0X3RleHQuc2VhcmNoKFwiRm9ybWF0OiBcIikgKyA4LCBmb3JtYXRfdGV4dC5zZWFyY2goXCI8YnI+XCIpKTtcbiAgICAgICAgICAgIHNhdmVkTGlzdHMucHVzaCh7IHVybDogdXJsLCB0aXRsZTogKF9jID0gKChfYiA9IFwiPHN0cm9uZz5cIiArIGZvcm1hdCArIFwiPC9zdHJvbmc+IHwgXCIpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IFwiXCIpICsgKDAsIHV0aWxpdGllc18xLmdldF90aXRsZSkoKSkgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDogdXJsIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHsgc2F2ZWRfbGlzdHM6IHNhdmVkTGlzdHMuc29ydCgoYSwgYikgPT4gYS50aXRsZS5sb2NhbGVDb21wYXJlKGIudGl0bGUpKSB9LCAoKSA9PiB1cGRhdGVTYXZlZExpc3RzRHJvcGRvd24oKSk7XG4gICAgfSk7XG59O1xuZnVuY3Rpb24gY3JlYXRlQm9yaXNDb21wb25lbnRzKCkge1xuICAgIHZhciBfYSwgX2I7XG4gICAgYm9yaXNQcmljZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGJvcmlzUHJpY2VzLmNsYXNzTGlzdC5hZGQoXCJoZWFkZXItcHJpY2VzLWJvcmlzXCIsIFwiaGVhZGVyLXByaWNlcy1jdXJyZW5jeVwiKTtcbiAgICAoX2EgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2LmhlYWRlci1wcmljZXMtY3VycmVuY3lcIikpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5hZnRlcihib3Jpc1ByaWNlcyk7XG4gICAgYm9yaXNOYXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIik7XG4gICAgYm9yaXNOYXYuY2xhc3NMaXN0LmFkZChcIm5hdlwiLCBcIm5hdi1waWxsc1wiLCBcImRlY2stdHlwZS1tZW51XCIpO1xuICAgIGJvcmlzTmF2LnN0eWxlLmp1c3RpZnlDb250ZW50ID0gXCJzdGFydFwiO1xuICAgIChfYiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ1bC5kZWNrLXR5cGUtbWVudVwiKSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmFmdGVyKGJvcmlzTmF2KTtcbiAgICBib3Jpc1RvZ2dsZU91dGVyQnV0dG9uID0gKDAsIGNvbXBvbmVudHNfMS5uYXZCdXR0b25GYWN0b3J5KShcIkJvcmlzXCIpO1xuICAgIGJvcmlzVG9nZ2xlQnV0dG9uID0gYm9yaXNUb2dnbGVPdXRlckJ1dHRvbi5jaGlsZHJlblswXTtcbiAgICBib3Jpc1RvQ2xpcGJvYXJkQnV0dG9uID0gKDAsIGNvbXBvbmVudHNfMS5uYXZCdXR0b25GYWN0b3J5KShcIkNvcHlcIik7XG4gICAgYm9yaXNDb2NrYXRyaWNlQnV0dG9uID0gKDAsIGNvbXBvbmVudHNfMS5uYXZCdXR0b25GYWN0b3J5KShcIkNvY2thdHJpY2VcIik7XG4gICAgYm9yaXNDaGVhcGVzdEJ1dHRvbiA9ICgwLCBjb21wb25lbnRzXzEubmF2QnV0dG9uRmFjdG9yeSkoXCJDaGVhcGVzdFwiKTtcbiAgICBib3Jpc1NhdmVEZWNrQnV0dG9uID0gKDAsIGNvbXBvbmVudHNfMS5uYXZCdXR0b25GYWN0b3J5KShcIlNhdmVcIik7XG4gICAgYm9yaXNSZW1vdmVEZWNrQnV0dG9uID0gKDAsIGNvbXBvbmVudHNfMS5uYXZCdXR0b25GYWN0b3J5KShcIlNhdmVkXCIpO1xuICAgIGJvcmlzVG9nZ2xlQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJidG4tb25saW5lLW11dGVkXCIpO1xuICAgIGJvcmlzUmVtb3ZlRGVja0J1dHRvbi5jbGFzc0xpc3QuYWRkKFwic2hvd1wiKTtcbn1cbmZ1bmN0aW9uIGFkZEJ1dHRvbnMoKSB7XG4gICAgYm9yaXNOYXYuYXBwZW5kQ2hpbGQoYm9yaXNUb2dnbGVPdXRlckJ1dHRvbik7XG4gICAgYm9yaXNOYXYuYXBwZW5kQ2hpbGQoYm9yaXNUb0NsaXBib2FyZEJ1dHRvbik7XG4gICAgYm9yaXNOYXYuYXBwZW5kQ2hpbGQoYm9yaXNDb2NrYXRyaWNlQnV0dG9uKTtcbiAgICBib3Jpc05hdi5hcHBlbmRDaGlsZChib3Jpc0NoZWFwZXN0QnV0dG9uKTtcbiAgICBib3Jpc05hdi5hcHBlbmRDaGlsZChib3Jpc1NhdmVEZWNrQnV0dG9uKTtcbiAgICBib3Jpc1RvZ2dsZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdG9nZ2xlUHJpY2VzKTtcbiAgICBib3Jpc1RvQ2xpcGJvYXJkQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjb3B5VG9DbGlwYm9hcmQpO1xuICAgIGJvcmlzQ29ja2F0cmljZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdXRpbGl0aWVzXzEuc2F2ZVRvQ29ja2F0cmljZSk7XG4gICAgYm9yaXNDaGVhcGVzdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYWRkQ2hlYXBlc3RQcmljZXMpO1xuICAgIGJvcmlzU2F2ZURlY2tCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFkZFRvU2F2ZWREZWNrc0xpc3QpO1xufVxuZnVuY3Rpb24gcmVtb3ZlQm9yaXNDb21wb25lbnRzKCkge1xuICAgIGJvcmlzVG9nZ2xlT3V0ZXJCdXR0b24ucmVtb3ZlKCk7XG4gICAgYm9yaXNUb2dnbGVCdXR0b24ucmVtb3ZlKCk7XG4gICAgYm9yaXNUb0NsaXBib2FyZEJ1dHRvbi5yZW1vdmUoKTtcbiAgICBib3Jpc0NvY2thdHJpY2VCdXR0b24ucmVtb3ZlKCk7XG4gICAgYm9yaXNDaGVhcGVzdEJ1dHRvbi5yZW1vdmUoKTtcbiAgICBib3Jpc1NhdmVEZWNrQnV0dG9uLnJlbW92ZSgpO1xuICAgIGJvcmlzUmVtb3ZlRGVja0J1dHRvbi5yZW1vdmUoKTtcbiAgICBib3Jpc1ByaWNlcy5yZW1vdmUoKTtcbiAgICBib3Jpc05hdi5yZW1vdmUoKTtcbn1cbmZ1bmN0aW9uIGJvcmlzRGVja2xpc3QoKSB7XG4gICAgKDAsIHNjcnlmYWxsXzEuZmV0Y2hfY2FyZHMpKCkudGhlbigobGlzdCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBwYWdlX3ZhbHVlcy5jYXJkX2xpc3QgPSBsaXN0O1xuICAgICAgICB5aWVsZCBjb252ZXJ0QWxsUHJpY2VzKCk7XG4gICAgICAgICgwLCBjb21wb25lbnRzXzEuc2V0VG90YWwpKHBhZ2VfdmFsdWVzLnRvdGFsKTtcbiAgICAgICAgdG9nZ2xlUHJpY2VzKCk7XG4gICAgfSkpLnRoZW4oKCkgPT4ge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGlmICgoX2EgPSBjaHJvbWUucnVudGltZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmlkKSB7XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldChbJ2F1dG8nXSwgKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBkYXRhLmF1dG8gPyBhZGRDaGVhcGVzdFByaWNlcygpIDogY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyBhdXRvOiBmYWxzZSB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHVwZGF0ZVNhdmVkTGlzdHNEcm9wZG93bigpO1xuICAgICAgICBhZGRCdXR0b25zKCk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBib3Jpc0RlY2tlZGl0b3IoKSB7XG4gICAgdmFyIF9hO1xuICAgIChfYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJldmlld1wiKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHBhZ2VfdmFsdWVzLnRvdGFsID0gMDtcbiAgICAgICAgcGFnZV92YWx1ZXMuc2l6ZVRvZ2dsZSA9IHRydWU7XG4gICAgICAgIHBhZ2VfdmFsdWVzLmNhcmRfbGlzdCA9IFtdO1xuICAgICAgICAoMCwgdXRpbGl0aWVzXzIuc2xlZXApKDIwMDApLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcmVtb3ZlQm9yaXNDb21wb25lbnRzKCk7XG4gICAgICAgICAgICBjcmVhdGVCb3Jpc0NvbXBvbmVudHMoKTtcbiAgICAgICAgICAgIGJvcmlzRGVja2xpc3QoKTtcbiAgICAgICAgfSk7XG4gICAgfSkpO1xufVxuaWYgKHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZS5pbmNsdWRlcyhcIm10Z2dvbGRmaXNoLmNvbVwiKSkgeyAvLyBjb250cm9sbG8gaW51dGlsZT9cbiAgICBjb25zdCBwYWdlX3VybCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcbiAgICBpZiAocGFnZV91cmwuaW5jbHVkZXMoXCJkZWNrc1wiKSkge1xuICAgICAgICBib3Jpc0RlY2tlZGl0b3IoKTtcbiAgICB9XG4gICAgaWYgKHBhZ2VfdXJsLmluY2x1ZGVzKFwiZGVja1wiKSB8fCBwYWdlX3VybC5pbmNsdWRlcyhcImFyY2hldHlwZVwiKSkge1xuICAgICAgICBjcmVhdGVCb3Jpc0NvbXBvbmVudHMoKTtcbiAgICAgICAgYm9yaXNEZWNrbGlzdCgpO1xuICAgIH1cbn1cbi8vIFRPRE8gY29udHJvbGxvIHByZXp6byBmb2lsIHBpw7kgYmFzc28gPT4gY29sb3JlIGRpdmVyc29cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm10Z2dvbGRmaXNoL2NvbnRlbnRfc2NyaXB0XCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbl9fd2VicGFja19yZXF1aXJlX18uTy5qID0gKGNodW5rSWQpID0+IChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApO1xuXG4vLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbnZhciB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiwgZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcblx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG5cdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDA7XG5cdGlmKGNodW5rSWRzLnNvbWUoKGlkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2lkXSAhPT0gMCkpKSB7XG5cdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihydW50aW1lKSB2YXIgcmVzdWx0ID0gcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0fVxuXHRpZihwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbikgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkc1tpXV0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtib3Jpc1wiXSA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtib3Jpc1wiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9yXCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL210Z2dvbGRmaXNoL2NvbnRlbnRfc2NyaXB0LnRzXCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
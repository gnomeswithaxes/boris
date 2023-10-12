/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/cardmarket/content_script.ts":
/*!******************************************!*\
  !*** ./src/cardmarket/content_script.ts ***!
  \******************************************/
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
const Users_1 = __webpack_require__(/*! ./pages/Users */ "./src/cardmarket/pages/Users.ts");
const Singles_1 = __webpack_require__(/*! ./pages/Singles */ "./src/cardmarket/pages/Singles.ts");
const ShoppingWizard_1 = __webpack_require__(/*! ./pages/ShoppingWizard */ "./src/cardmarket/pages/ShoppingWizard.ts");
const Wants_1 = __webpack_require__(/*! ./pages/Wants */ "./src/cardmarket/pages/Wants.ts");
const Sitewide_1 = __webpack_require__(/*! ./pages/Sitewide */ "./src/cardmarket/pages/Sitewide.ts");
chrome.storage.sync.get("images", (result) => __awaiter(void 0, void 0, void 0, function* () {
    if (result.images
        && !window.location.pathname.includes("ShoppingWizard/Results")
        && !window.location.pathname.includes("Magic/Orders")
        && !window.location.pathname.includes("Magic/ShoppingCart")) {
        // TODO fix these locations
        (0, Sitewide_1.addImages)();
    }
}));
if (window.location.pathname.includes("Magic/Users")) {
    // addImages();
    (0, Users_1.showTrend)();
}
if (window.location.pathname.includes("Products/Singles/")) {
    (0, Singles_1.addLinkToSingles)();
    (0, Singles_1.addCheckboxes)();
}
if (/\S+\/Products\/(Singles\/?[^\/]*\/?$|Search\/?)/.test(window.location.pathname)) {
    // addImages();
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

/***/ "./src/cardmarket/page_elements.ts":
/*!*****************************************!*\
  !*** ./src/cardmarket/page_elements.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.camera_icon_classlist = exports.col_camera_icon_classlist = exports.table_row_selector = exports.icon_selector = exports.header_selector = exports.title_attribute = exports.camera_icon = exports.camera_class = exports.autocomplete_row_classes = exports.autocomplete_results = exports.autocomplete_wrapper = exports.boris_img_class = void 0;
exports.boris_img_class = "boris-image";
exports.autocomplete_wrapper = "autoCompWrapper";
exports.autocomplete_results = "AutoCompleteResult";
exports.autocomplete_row_classes = ["col"];
exports.camera_class = "thumbnail-icon";
exports.camera_icon = "fonticon-camera";
exports.title_attribute = "data-original-title";
exports.header_selector = ".table-header>.row>.col-thumbnail";
exports.icon_selector = ".table-header>.row>.col-icon";
exports.table_row_selector = ".table-body>div";
exports.col_camera_icon_classlist = ["col-thumbnail"];
exports.camera_icon_classlist = [exports.camera_class, "icon", "is-24x24"];


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
    disclaimer.innerHTML = "<i style='color: red;'>Experimental feature, some links may be wrong</i><hr>";
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
        user_link.parentElement.innerHTML += "&nbsp;-&nbsp;<a href='" + user_link.href + "/Offers/Singles' target='_blank'>Singles</a>";
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
        const price_elem = elem.getElementsByClassName("fw-bold")[0];
        const playset_elem = elem.getElementsByClassName("text-muted");
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

/***/ "./src/cardmarket/pages/Sitewide.ts":
/*!******************************************!*\
  !*** ./src/cardmarket/pages/Sitewide.ts ***!
  \******************************************/
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
exports.addImages = exports.addAutocompleteImages = void 0;
const page_elements_1 = __webpack_require__(/*! ../page_elements */ "./src/cardmarket/page_elements.ts");
const utilities_1 = __webpack_require__(/*! ../utilities */ "./src/cardmarket/utilities.ts");
// Options for the observer (which mutations to observe)
const config = { childList: true };
// Callback function to execute when mutations are observed
const callback = function (mutationList, observer) {
    for (const mutation of mutationList) {
        if (mutation.type === 'childList') {
            const results = document.getElementById(page_elements_1.autocomplete_results);
            if (results) {
                const icon_spans = results.getElementsByClassName(page_elements_1.camera_class);
                // The span collection gets smaller after every upgrade, so the original length must be saved
                const spans_length = icon_spans.length;
                for (let i = 0; i < spans_length; i++) {
                    // always take the first one, that hasn't changed yet
                    const span = icon_spans[0];
                    let src = (0, utilities_1.get_mkm_src)(span);
                    if (src != "") {
                        (0, utilities_1.replaceCamera)(span, src);
                    }
                }
            }
        }
    }
};
function addAutocompleteImages() {
    chrome.storage.sync.get("images", (result) => __awaiter(this, void 0, void 0, function* () {
        if (result.images) {
            const results = document.getElementById(page_elements_1.autocomplete_results);
            if (results) {
                const observer = new MutationObserver(callback);
                observer.observe(results, config);
            }
        }
    }));
}
exports.addAutocompleteImages = addAutocompleteImages;
function addImages() {
    var _a;
    const header = document.querySelector(page_elements_1.header_selector);
    if (header) {
        header.classList.add(page_elements_1.boris_img_class);
    }
    else {
        (_a = document.querySelector(page_elements_1.icon_selector)) === null || _a === void 0 ? void 0 : _a.classList.add(page_elements_1.boris_img_class);
    }
    const icon_spans = document.getElementsByClassName(page_elements_1.camera_class);
    // The span collection gets smaller after every upgrade, so the original length must be saved
    const spans_length = icon_spans.length;
    for (let i = 0; i < spans_length; i++) {
        // always take the first one, that hasn't changed yet
        const span = icon_spans[0];
        let src = (0, utilities_1.get_mkm_src)(span);
        if (src != "") {
            (0, utilities_1.replaceCamera)(span, src);
            const div = span === null || span === void 0 ? void 0 : span.parentElement;
            div === null || div === void 0 ? void 0 : div.classList.remove(...page_elements_1.col_camera_icon_classlist);
            div === null || div === void 0 ? void 0 : div.appendChild(span);
        }
    }
}
exports.addImages = addImages;


/***/ }),

/***/ "./src/cardmarket/pages/Users.ts":
/*!***************************************!*\
  !*** ./src/cardmarket/pages/Users.ts ***!
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
exports.showTrend = void 0;
const scryfall_1 = __webpack_require__(/*! ../../common/scryfall */ "./src/common/scryfall.ts");
const utilities_1 = __webpack_require__(/*! ../utilities */ "./src/cardmarket/utilities.ts");
function showTrend() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
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
                Promise.all([(0, scryfall_1.get_cheapest)(card_name), (0, scryfall_1.get_cardmarket)(card_id)]).then(responses => {
                    var _a, _b, _c, _d, _e, _f;
                    let cheapest = responses[0];
                    let exact = responses[1];
                    const price_elem = row.getElementsByClassName("price-container")[0].getElementsByClassName("fw-bold")[0];
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
                            cheapest_color = color_from_price(original_price, cheapest_price, ppu);
                        }
                    }
                    else {
                        cheapest = { name: "not_found", id: -1 };
                    }
                    if (exact) {
                        exact_price = parseFloat((_e = (_d = exact.prices) === null || _d === void 0 ? void 0 : _d.eur) !== null && _e !== void 0 ? _e : (_f = exact.prices) === null || _f === void 0 ? void 0 : _f.eur_foil);
                        if (exact_price) {
                            exact_color = color_from_price(original_price, exact_price, ppu);
                        }
                    }
                    else {
                        exact = { name: "not_found", id: -2 };
                    }
                    const foil = (row.querySelectorAll('[data-original-title="Foil"]').length > 0);
                    const main_color = foil ? "darkviolet" : cheapest_color && exact_color;
                    price_elem.innerHTML = "<span style='color: " + main_color + "'>" + price_elem.innerHTML + "<span>";
                    if (!foil) {
                        if (exact_price > 0 && cheapest.id != exact.id) {
                            price_elem.innerHTML += "<br><span style='color: " + exact_color + ";' >E </span><a style='color: black' href='" + exact.scryfall_uri + "'> " + exact_price.toLocaleString("it-IT", { minimumFractionDigits: 2 }) + " €</a>";
                        }
                        if (cheapest_price > 0) {
                            price_elem.innerHTML += "<br><span style='color: " + cheapest_color + ";'>" + (cheapest.id == exact.id ? "E=" : "") + "L </span><a style='color: black' href='" + cheapest.scryfall_uri + "'> " + cheapest_price.toLocaleString("it-IT", { minimumFractionDigits: 2 }) + " €</a>";
                        }
                    }
                });
            }
        }
    });
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
                var _a, _b;
                const wants_title = document.getElementsByClassName("page-title-container")[0].getElementsByTagName("h1")[0].innerHTML;
                let list = "";
                const printVersion = (_a = data.printVersion) !== null && _a !== void 0 ? _a : false;
                for (const row of table.getElementsByTagName("tr")) {
                    let amount = (_b = row.querySelector("td.amount").getAttribute("data-amount")) !== null && _b !== void 0 ? _b : "1";
                    let name = row.querySelector("td.name a").innerHTML;
                    if (printVersion) {
                        list += amount + " " + name + "\n";
                    }
                    else {
                        const card_id = (0, utilities_2.get_mkm_id)(row);
                        if (card_id) {
                            yield (0, scryfall_1.get_cardmarket)(card_id).then((card) => __awaiter(this, void 0, void 0, function* () {
                                if (card.name) {
                                    list += amount + " " + card.name + "\n";
                                }
                                else {
                                    list += amount + " " + name + "\n";
                                }
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
                                const already_in = saved_urls.filter((u) => u.mkm_id == card_id);
                                if (already_in.length == 0) {
                                    saved_urls.push({ name: card.name, mkm_id: card_id, url: card_url });
                                }
                                else {
                                    already_in[0].url = card_url;
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
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.replaceCamera = exports.parseUrl = exports.get_card_src = exports.parsePPU = exports.parsePrice = exports.get_mkm_url = exports.get_mkm_version = exports.get_mkm_src = exports.get_mkm_id = void 0;
const page_elements_1 = __webpack_require__(/*! ./page_elements */ "./src/cardmarket/page_elements.ts");
function get_mkm_id(row) {
    var _a;
    const camera_span = row.getElementsByClassName(page_elements_1.camera_class)[0] || row.getElementsByClassName(page_elements_1.boris_img_class)[0];
    return ((_a = camera_span === null || camera_span === void 0 ? void 0 : camera_span.getAttribute(page_elements_1.title_attribute)) === null || _a === void 0 ? void 0 : _a.split(/\.jpg/g)[0].split("/").splice(-1)[0]) || "";
}
exports.get_mkm_id = get_mkm_id;
function get_mkm_src(row) {
    var _a;
    return ((_a = row.getAttribute(page_elements_1.title_attribute)) === null || _a === void 0 ? void 0 : _a.match(/src=\"(.*?)\"/)[1]) || "";
}
exports.get_mkm_src = get_mkm_src;
function get_mkm_version(row) {
    var _a, _b;
    const alt = ((_b = (_a = row.getElementsByClassName(page_elements_1.camera_class)[0]) === null || _a === void 0 ? void 0 : _a.getAttribute(page_elements_1.title_attribute)) === null || _b === void 0 ? void 0 : _b.match(/alt=\"(.*?)\"/)[1]) || "";
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
function get_card_src(card) {
    let src = "";
    if (card) {
        if (card.image_uris) {
            src = card.image_uris.small;
        }
        else if (card.card_faces) {
            src = card.card_faces[0].image_uris.small;
        }
    }
    return src;
}
exports.get_card_src = get_card_src;
function parseUrl(data) {
    const url = data.match(/"*"/);
    return url;
}
exports.parseUrl = parseUrl;
function replaceCamera(span, src) {
    const card_img = document.createElement("img");
    card_img.src = src;
    card_img.style.width = "100%";
    card_img.style.height = "100%";
    span.classList.remove(...page_elements_1.camera_icon_classlist);
    span.classList.add(page_elements_1.boris_img_class);
    span.appendChild(card_img);
    span.getElementsByClassName(page_elements_1.camera_icon)[0].remove();
}
exports.replaceCamera = replaceCamera;


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYm9yaXMvLi9zcmMvY2FyZG1hcmtldC9jb250ZW50X3NjcmlwdC50cyIsIndlYnBhY2s6Ly9ib3Jpcy8uL3NyYy9jYXJkbWFya2V0L3BhZ2VfZWxlbWVudHMudHMiLCJ3ZWJwYWNrOi8vYm9yaXMvLi9zcmMvY2FyZG1hcmtldC9wYWdlcy9TaG9wcGluZ1dpemFyZC50cyIsIndlYnBhY2s6Ly9ib3Jpcy8uL3NyYy9jYXJkbWFya2V0L3BhZ2VzL1NpbmdsZXMudHMiLCJ3ZWJwYWNrOi8vYm9yaXMvLi9zcmMvY2FyZG1hcmtldC9wYWdlcy9TaXRld2lkZS50cyIsIndlYnBhY2s6Ly9ib3Jpcy8uL3NyYy9jYXJkbWFya2V0L3BhZ2VzL1VzZXJzLnRzIiwid2VicGFjazovL2JvcmlzLy4vc3JjL2NhcmRtYXJrZXQvcGFnZXMvV2FudHMudHMiLCJ3ZWJwYWNrOi8vYm9yaXMvLi9zcmMvY2FyZG1hcmtldC91dGlsaXRpZXMudHMiLCJ3ZWJwYWNrOi8vYm9yaXMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYm9yaXMvd2VicGFjay9ydW50aW1lL2NodW5rIGxvYWRlZCIsIndlYnBhY2s6Ly9ib3Jpcy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JvcmlzL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2JvcmlzL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vYm9yaXMvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2JvcmlzL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgVXNlcnNfMSA9IHJlcXVpcmUoXCIuL3BhZ2VzL1VzZXJzXCIpO1xuY29uc3QgU2luZ2xlc18xID0gcmVxdWlyZShcIi4vcGFnZXMvU2luZ2xlc1wiKTtcbmNvbnN0IFNob3BwaW5nV2l6YXJkXzEgPSByZXF1aXJlKFwiLi9wYWdlcy9TaG9wcGluZ1dpemFyZFwiKTtcbmNvbnN0IFdhbnRzXzEgPSByZXF1aXJlKFwiLi9wYWdlcy9XYW50c1wiKTtcbmNvbnN0IFNpdGV3aWRlXzEgPSByZXF1aXJlKFwiLi9wYWdlcy9TaXRld2lkZVwiKTtcbmNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFwiaW1hZ2VzXCIsIChyZXN1bHQpID0+IF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgIGlmIChyZXN1bHQuaW1hZ2VzXG4gICAgICAgICYmICF3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5jbHVkZXMoXCJTaG9wcGluZ1dpemFyZC9SZXN1bHRzXCIpXG4gICAgICAgICYmICF3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5jbHVkZXMoXCJNYWdpYy9PcmRlcnNcIilcbiAgICAgICAgJiYgIXdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmNsdWRlcyhcIk1hZ2ljL1Nob3BwaW5nQ2FydFwiKSkge1xuICAgICAgICAvLyBUT0RPIGZpeCB0aGVzZSBsb2NhdGlvbnNcbiAgICAgICAgKDAsIFNpdGV3aWRlXzEuYWRkSW1hZ2VzKSgpO1xuICAgIH1cbn0pKTtcbmlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5jbHVkZXMoXCJNYWdpYy9Vc2Vyc1wiKSkge1xuICAgIC8vIGFkZEltYWdlcygpO1xuICAgICgwLCBVc2Vyc18xLnNob3dUcmVuZCkoKTtcbn1cbmlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5jbHVkZXMoXCJQcm9kdWN0cy9TaW5nbGVzL1wiKSkge1xuICAgICgwLCBTaW5nbGVzXzEuYWRkTGlua1RvU2luZ2xlcykoKTtcbiAgICAoMCwgU2luZ2xlc18xLmFkZENoZWNrYm94ZXMpKCk7XG59XG5pZiAoL1xcUytcXC9Qcm9kdWN0c1xcLyhTaW5nbGVzXFwvP1teXFwvXSpcXC8/JHxTZWFyY2hcXC8/KS8udGVzdCh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUpKSB7XG4gICAgLy8gYWRkSW1hZ2VzKCk7XG59XG5pZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKFwiQ2FyZHMvXCIpKSB7XG4gICAgKDAsIFNpbmdsZXNfMS5hZGRMaW5rVG9TaW5nbGVzKSgpO1xufVxuaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmNsdWRlcyhcIlNob3BwaW5nV2l6YXJkL1Jlc3VsdHNcIikpIHtcbiAgICAoMCwgU2luZ2xlc18xLmFkZExpbmtUb1NpbmdsZXMpKCk7XG4gICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmNsdWRlcyhcIi9NYWdpYy9XYW50c1wiKSkge1xuICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldCgnc2hvcHBpbmdXaXphcmQnLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYgKGRhdGEuc2hvcHBpbmdXaXphcmQpIHtcbiAgICAgICAgICAgICAgICAoMCwgU2hvcHBpbmdXaXphcmRfMS5hZGREaXNjbGFpbWVyKSgpO1xuICAgICAgICAgICAgICAgICgwLCBTaG9wcGluZ1dpemFyZF8xLmFkZExpbmtUb0NhcmRzKSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5pZiAoL1xcUytcXC9XYW50c1xcL1xcZCsvLnRlc3Qod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKSkge1xuICAgICgwLCBXYW50c18xLmFkZFByaW50TGlzdEJ1dHRvbikoKTtcbiAgICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKFwiL01hZ2ljL1dhbnRzXCIpKSB7XG4gICAgICAgICgwLCBXYW50c18xLnNhdmVBbGxVcmxzKSgpO1xuICAgIH1cbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5jYW1lcmFfaWNvbl9jbGFzc2xpc3QgPSBleHBvcnRzLmNvbF9jYW1lcmFfaWNvbl9jbGFzc2xpc3QgPSBleHBvcnRzLnRhYmxlX3Jvd19zZWxlY3RvciA9IGV4cG9ydHMuaWNvbl9zZWxlY3RvciA9IGV4cG9ydHMuaGVhZGVyX3NlbGVjdG9yID0gZXhwb3J0cy50aXRsZV9hdHRyaWJ1dGUgPSBleHBvcnRzLmNhbWVyYV9pY29uID0gZXhwb3J0cy5jYW1lcmFfY2xhc3MgPSBleHBvcnRzLmF1dG9jb21wbGV0ZV9yb3dfY2xhc3NlcyA9IGV4cG9ydHMuYXV0b2NvbXBsZXRlX3Jlc3VsdHMgPSBleHBvcnRzLmF1dG9jb21wbGV0ZV93cmFwcGVyID0gZXhwb3J0cy5ib3Jpc19pbWdfY2xhc3MgPSB2b2lkIDA7XG5leHBvcnRzLmJvcmlzX2ltZ19jbGFzcyA9IFwiYm9yaXMtaW1hZ2VcIjtcbmV4cG9ydHMuYXV0b2NvbXBsZXRlX3dyYXBwZXIgPSBcImF1dG9Db21wV3JhcHBlclwiO1xuZXhwb3J0cy5hdXRvY29tcGxldGVfcmVzdWx0cyA9IFwiQXV0b0NvbXBsZXRlUmVzdWx0XCI7XG5leHBvcnRzLmF1dG9jb21wbGV0ZV9yb3dfY2xhc3NlcyA9IFtcImNvbFwiXTtcbmV4cG9ydHMuY2FtZXJhX2NsYXNzID0gXCJ0aHVtYm5haWwtaWNvblwiO1xuZXhwb3J0cy5jYW1lcmFfaWNvbiA9IFwiZm9udGljb24tY2FtZXJhXCI7XG5leHBvcnRzLnRpdGxlX2F0dHJpYnV0ZSA9IFwiZGF0YS1vcmlnaW5hbC10aXRsZVwiO1xuZXhwb3J0cy5oZWFkZXJfc2VsZWN0b3IgPSBcIi50YWJsZS1oZWFkZXI+LnJvdz4uY29sLXRodW1ibmFpbFwiO1xuZXhwb3J0cy5pY29uX3NlbGVjdG9yID0gXCIudGFibGUtaGVhZGVyPi5yb3c+LmNvbC1pY29uXCI7XG5leHBvcnRzLnRhYmxlX3Jvd19zZWxlY3RvciA9IFwiLnRhYmxlLWJvZHk+ZGl2XCI7XG5leHBvcnRzLmNvbF9jYW1lcmFfaWNvbl9jbGFzc2xpc3QgPSBbXCJjb2wtdGh1bWJuYWlsXCJdO1xuZXhwb3J0cy5jYW1lcmFfaWNvbl9jbGFzc2xpc3QgPSBbZXhwb3J0cy5jYW1lcmFfY2xhc3MsIFwiaWNvblwiLCBcImlzLTI0eDI0XCJdO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYWRkTGlua1RvQ2FyZHMgPSBleHBvcnRzLmFkZERpc2NsYWltZXIgPSB2b2lkIDA7XG5jb25zdCBzY3J5ZmFsbF8xID0gcmVxdWlyZShcIi4uLy4uL2NvbW1vbi9zY3J5ZmFsbFwiKTtcbmNvbnN0IHV0aWxpdGllc18xID0gcmVxdWlyZShcIi4uL3V0aWxpdGllc1wiKTtcbmZ1bmN0aW9uIGFkZERpc2NsYWltZXIoKSB7XG4gICAgY29uc3Qgc2VjdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjYXJkLWNvbHVtbnNcIilbMF07XG4gICAgY29uc3QgZGlzY2xhaW1lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoNFwiKTtcbiAgICBkaXNjbGFpbWVyLmlubmVySFRNTCA9IFwiPGkgc3R5bGU9J2NvbG9yOiByZWQ7Jz5FeHBlcmltZW50YWwgZmVhdHVyZSwgc29tZSBsaW5rcyBtYXkgYmUgd3Jvbmc8L2k+PGhyPlwiO1xuICAgIHNlY3Rpb24uYmVmb3JlKGRpc2NsYWltZXIpO1xufVxuZXhwb3J0cy5hZGREaXNjbGFpbWVyID0gYWRkRGlzY2xhaW1lcjtcbmZ1bmN0aW9uIGFkZExpbmtUb0NhcmRzKCkge1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbXCJ1cmxzXCJdLCAocmVzdWx0KSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIGxldCBzYXZlZF91cmxzID0gKF9hID0gcmVzdWx0LnVybHMpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHRhYmxlIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGJvZHlcIikpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qgcm93IG9mIHRhYmxlLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidHJcIikpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjYXJkX2lkID0gKDAsIHV0aWxpdGllc18xLmdldF9ta21faWQpKHJvdyk7XG4gICAgICAgICAgICAgICAgY29uc3QgY2FyZF92ZXJzaW9uID0gKDAsIHV0aWxpdGllc18xLmdldF9ta21fdmVyc2lvbikocm93KTtcbiAgICAgICAgICAgICAgICBjb25zdCBjYXJkX2VsZW0gPSByb3cuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImNhcmQtbmFtZVwiKVswXTtcbiAgICAgICAgICAgICAgICBjb25zdCBzZXRfdGl0bGUgPSAoX2IgPSByb3cuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImV4cGFuc2lvbi1zeW1ib2xcIilbMF0pID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5nZXRBdHRyaWJ1dGUoXCJkYXRhLW9yaWdpbmFsLXRpdGxlXCIpO1xuICAgICAgICAgICAgICAgIGlmIChjYXJkX2lkKSB7XG4gICAgICAgICAgICAgICAgICAgIHlpZWxkICgwLCBzY3J5ZmFsbF8xLmdldF9jYXJkbWFya2V0KShjYXJkX2lkKS50aGVuKChjYXJkKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzYXZlZCA9IHNhdmVkX3VybHMuZmlsdGVyKCh1KSA9PiB1Lm1rbV9pZCA9PSBjYXJkX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVybCA9IHNhdmVkLmxlbmd0aCA+IDAgPyBzYXZlZFswXS51cmwgOiAoeWllbGQgZm9ybWF0X3VybChjYXJkLCBjYXJkX3ZlcnNpb24sIHNldF90aXRsZSB8fCBcIlwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FyZF9lbGVtLmlubmVySFRNTCA9IFwiPGEgaHJlZj0nXCIgKyB1cmwgKyBcIicgdGFyZ2V0PSdfYmxhbmsnPlwiICsgY2FyZC5uYW1lICsgXCI8L2E+PGJyPi8gPGEgaHJlZj0nXCIgKyBjYXJkLnB1cmNoYXNlX3VyaXMuY2FyZG1hcmtldCArIFwiJyB0YXJnZXQ9J19ibGFuayc+QWxsIHByaW50aW5nczwvYT5cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2F2ZWRfdXJscy5maWx0ZXIoKHUpID0+IHUubWttX2lkID09IGNhcmRfaWQpLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVkX3VybHMucHVzaCh7IG5hbWU6IGNhcmQubmFtZSwgbWttX2lkOiBjYXJkX2lkLCB1cmw6IHVybCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoMCwgc2NyeWZhbGxfMS5mZXRjaF9zaW5nbGUpKGNhcmRfZWxlbS5pbm5lckhUTUwucmVwbGFjZSgvXFwoVlxcLlxcZCtcXCkvZywgJycpKS50aGVuKChjYXJkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhcmRfZWxlbS5pbm5lckhUTUwgPSBcIjxhIGhyZWY9J1wiICsgY2FyZC5wdXJjaGFzZV91cmlzLmNhcmRtYXJrZXQgKyBcIicgdGFyZ2V0PSdfYmxhbmsnPlwiICsgY2FyZC5uYW1lICsgXCI8YnI+KEFsbCk8L2E+XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgXCJ1cmxzXCI6IHNhdmVkX3VybHMgfSk7XG4gICAgfSkpO1xufVxuZXhwb3J0cy5hZGRMaW5rVG9DYXJkcyA9IGFkZExpbmtUb0NhcmRzO1xuZnVuY3Rpb24gZm9ybWF0X3VybChjYXJkLCB2ZXJzaW9uLCBzZXRfdGl0bGUpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBpZiAoY2FyZC5uYW1lKSB7XG4gICAgICAgICAgICBsZXQgbmFtZSA9IGNhcmQubmFtZTtcbiAgICAgICAgICAgIGxldCBzZXQgPSBcIlwiO1xuICAgICAgICAgICAgaWYgKHZlcnNpb24pIHtcbiAgICAgICAgICAgICAgICBzZXQgPSBzZXRfdGl0bGU7XG4gICAgICAgICAgICAgICAgbmFtZSArPSBcIiBWXCIgKyB2ZXJzaW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2V0X3R5cGUgPSBzZXRfdGl0bGUgPT09IG51bGwgfHwgc2V0X3RpdGxlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBzZXRfdGl0bGUuc3BsaXQoXCI6XCIpLnBvcCgpO1xuICAgICAgICAgICAgICAgIGlmICghY2FyZC5zZXRfbmFtZS5pbmNsdWRlcyhcIkV4dHJhc1wiKSAmJiAhY2FyZC5zZXRfbmFtZS5pbmNsdWRlcyhcIlByb21vc1wiKSkge1xuICAgICAgICAgICAgICAgICAgICBzZXQgPSBjYXJkLnNldF9uYW1lICsgKChzZXRfdHlwZSAmJiAoc2V0X3R5cGUuaW5jbHVkZXMoXCJFeHRyYXNcIikgfHwgc2V0X3R5cGUuaW5jbHVkZXMoXCJQcm9tb3NcIikpKSA/IHNldF90eXBlIDogXCJcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZXQgPSBjYXJkLnNldF9uYW1lO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNldCA9IHNldC5yZXBsYWNlKFwiIFNldCBcIiwgXCIgXCIpO1xuICAgICAgICAgICAgbGV0IHBhdGggPSAoc2V0ICsgXCIvXCIgKyBuYW1lKS5yZXBsYWNlKC8gXFwvXFwvIC9nLCBcIi1cIikucmVwbGFjZSgvOi9nLCBcIlwiKS5yZXBsYWNlKC8sL2csIFwiXCIpLnJlcGxhY2UoL1xccysvZywgXCItXCIpO1xuICAgICAgICAgICAgbGV0IHVybCA9IFwiaHR0cHM6Ly93d3cuY2FyZG1hcmtldC5jb20vTWFnaWMvUHJvZHVjdHMvU2luZ2xlcy9cIiArIHBhdGg7XG4gICAgICAgICAgICBpZiAodXJsLmluY2x1ZGVzKFwiXFwnXCIpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3X3VybCA9IHVybC5yZXBsYWNlKC9cXCcvZywgXCJcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHlpZWxkIGZldGNoKG5ld191cmwpLnRoZW4oKHIpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHIub2sgJiYgdXJsc19hcmVfZXF1YWwoci51cmwsIG5ld191cmwpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3X3VybDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld191cmwgPSB1cmwucmVwbGFjZSgvXFwnL2csIFwiLVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCBmZXRjaChuZXdfdXJsKS50aGVuKHIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyLm9rICYmIHVybHNfYXJlX2VxdWFsKHIudXJsLCBuZXdfdXJsKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3X3VybDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVybDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIHVybHNfYXJlX2VxdWFsKHVybDEsIHVybDIpIHtcbiAgICByZXR1cm4gdXJsMS5zcGxpdChcIi9cIikuc2xpY2UoLTEpWzBdID09IHVybDIuc3BsaXQoXCIvXCIpLnNsaWNlKC0xKVswXTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmFkZENoZWNrYm94ZXMgPSBleHBvcnRzLmFkZExpbmtUb1NpbmdsZXMgPSB2b2lkIDA7XG5jb25zdCB1dGlsaXRpZXNfMSA9IHJlcXVpcmUoXCIuLi8uLi9jb21tb24vdXRpbGl0aWVzXCIpO1xuY29uc3QgdXRpbGl0aWVzXzIgPSByZXF1aXJlKFwiLi4vdXRpbGl0aWVzXCIpO1xuZnVuY3Rpb24gYWRkTGlua1RvU2luZ2xlcygpIHtcbiAgICBmb3IgKGNvbnN0IHVzZXIgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInNlbGxlci1uYW1lXCIpKSB7XG4gICAgICAgIGNvbnN0IHVzZXJfbGluayA9IHVzZXIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJhXCIpWzBdO1xuICAgICAgICB1c2VyX2xpbmsucGFyZW50RWxlbWVudC5pbm5lckhUTUwgKz0gXCImbmJzcDstJm5ic3A7PGEgaHJlZj0nXCIgKyB1c2VyX2xpbmsuaHJlZiArIFwiL09mZmVycy9TaW5nbGVzJyB0YXJnZXQ9J19ibGFuayc+U2luZ2xlczwvYT5cIjtcbiAgICB9XG59XG5leHBvcnRzLmFkZExpbmtUb1NpbmdsZXMgPSBhZGRMaW5rVG9TaW5nbGVzO1xuZnVuY3Rpb24gZ2V0UmVmZXJlbmNlKGRlZmF1bHRfcmVmKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KCdyZWZlcmVuY2UnLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLnJlZmVyZW5jZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShkYXRhLnJlZmVyZW5jZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IHJlZmVyZW5jZTogZGVmYXVsdF9yZWYgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKGRlZmF1bHRfcmVmKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gYWRkQ2hlY2tib3hlcygpIHtcbiAgICB2YXIgX2E7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgbGV0IHJlZmVyZW5jZSA9IHlpZWxkIGdldFJlZmVyZW5jZSgxKTtcbiAgICAgICAgY29uc3QgaW5mbyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJpbmZvLWxpc3QtY29udGFpbmVyXCIpWzBdO1xuICAgICAgICBpZiAoaW5mbykge1xuICAgICAgICAgICAgY29uc3Qgcm93cyA9IGluZm8uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJkZFwiKTtcbiAgICAgICAgICAgIGNvbnN0IG5yb3dzID0gNDtcbiAgICAgICAgICAgIGxldCBwcmljZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnJvd3M7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVsZW0gPSByb3dzW3Jvd3MubGVuZ3RoIC0gbnJvd3MgKyBpXTtcbiAgICAgICAgICAgICAgICBwcmljZXMucHVzaCgoMCwgdXRpbGl0aWVzXzIucGFyc2VQcmljZSkoZWxlbS5pbm5lckhUTUwpKTtcbiAgICAgICAgICAgICAgICBlbGVtLmlubmVySFRNTCArPSBcIiZuYnNwOzxpbnB1dCB0eXBlPSdyYWRpbycgbmFtZT0ncmVmZXJlbmNlJyB2YWx1ZT1cIiArIGkgKyAoaSA9PSByZWZlcmVuY2UgPyBcIiBjaGVja2VkXCIgOiBcIlwiKSArIFwiPlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29sb3JQcmljZXMocHJpY2VzW3JlZmVyZW5jZV0pO1xuICAgICAgICAgICAgZm9yIChjb25zdCByYWRpbyBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtuYW1lPVwicmVmZXJlbmNlXCJdJykpIHtcbiAgICAgICAgICAgICAgICByYWRpby5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyByZWZlcmVuY2U6IHRoaXMudmFsdWUgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2UgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgY29sb3JQcmljZXMocHJpY2VzW3RoaXMudmFsdWVdKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIChfYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZE1vcmVCdXR0b25cIikpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gKDAsIHV0aWxpdGllc18xLnNsZWVwKSgzMDAwKS50aGVuKCgpID0+IGNvbG9yUHJpY2VzKHByaWNlc1tyZWZlcmVuY2VdKSkpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5leHBvcnRzLmFkZENoZWNrYm94ZXMgPSBhZGRDaGVja2JveGVzO1xuZnVuY3Rpb24gY29sb3JQcmljZXMocmVmZXJlbmNlX3ByaWNlKSB7XG4gICAgZm9yIChjb25zdCBlbGVtIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwcmljZS1jb250YWluZXJcIikpIHtcbiAgICAgICAgY29uc3QgcHJpY2VfZWxlbSA9IGVsZW0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImZ3LWJvbGRcIilbMF07XG4gICAgICAgIGNvbnN0IHBsYXlzZXRfZWxlbSA9IGVsZW0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInRleHQtbXV0ZWRcIik7XG4gICAgICAgIGxldCBwcHUgPSAwO1xuICAgICAgICBpZiAocGxheXNldF9lbGVtLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHBwdSA9ICgwLCB1dGlsaXRpZXNfMi5wYXJzZVBQVSkocGxheXNldF9lbGVtWzBdLmlubmVySFRNTCk7XG4gICAgICAgIH1cbiAgICAgICAgcHJpY2VfZWxlbS5jbGFzc0xpc3QucmVtb3ZlKFwiY29sb3ItcHJpbWFyeVwiKTtcbiAgICAgICAgaWYgKHByaWNlX2VsZW0pIHtcbiAgICAgICAgICAgIGlmICgocHB1ID4gMCAmJiBwcHUgPD0gcmVmZXJlbmNlX3ByaWNlKSB8fCAoMCwgdXRpbGl0aWVzXzIucGFyc2VQcmljZSkocHJpY2VfZWxlbS5pbm5lckhUTUwucmVwbGFjZShcIiDigqxcIiwgXCJcIikpIDw9IHJlZmVyZW5jZV9wcmljZSkge1xuICAgICAgICAgICAgICAgIHByaWNlX2VsZW0uc3R5bGUuY29sb3IgPSBcImdyZWVuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwcmljZV9lbGVtLnN0eWxlLmNvbG9yID0gXCJyZWRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmFkZEltYWdlcyA9IGV4cG9ydHMuYWRkQXV0b2NvbXBsZXRlSW1hZ2VzID0gdm9pZCAwO1xuY29uc3QgcGFnZV9lbGVtZW50c18xID0gcmVxdWlyZShcIi4uL3BhZ2VfZWxlbWVudHNcIik7XG5jb25zdCB1dGlsaXRpZXNfMSA9IHJlcXVpcmUoXCIuLi91dGlsaXRpZXNcIik7XG4vLyBPcHRpb25zIGZvciB0aGUgb2JzZXJ2ZXIgKHdoaWNoIG11dGF0aW9ucyB0byBvYnNlcnZlKVxuY29uc3QgY29uZmlnID0geyBjaGlsZExpc3Q6IHRydWUgfTtcbi8vIENhbGxiYWNrIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiBtdXRhdGlvbnMgYXJlIG9ic2VydmVkXG5jb25zdCBjYWxsYmFjayA9IGZ1bmN0aW9uIChtdXRhdGlvbkxpc3QsIG9ic2VydmVyKSB7XG4gICAgZm9yIChjb25zdCBtdXRhdGlvbiBvZiBtdXRhdGlvbkxpc3QpIHtcbiAgICAgICAgaWYgKG11dGF0aW9uLnR5cGUgPT09ICdjaGlsZExpc3QnKSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocGFnZV9lbGVtZW50c18xLmF1dG9jb21wbGV0ZV9yZXN1bHRzKTtcbiAgICAgICAgICAgIGlmIChyZXN1bHRzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaWNvbl9zcGFucyA9IHJlc3VsdHMuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShwYWdlX2VsZW1lbnRzXzEuY2FtZXJhX2NsYXNzKTtcbiAgICAgICAgICAgICAgICAvLyBUaGUgc3BhbiBjb2xsZWN0aW9uIGdldHMgc21hbGxlciBhZnRlciBldmVyeSB1cGdyYWRlLCBzbyB0aGUgb3JpZ2luYWwgbGVuZ3RoIG11c3QgYmUgc2F2ZWRcbiAgICAgICAgICAgICAgICBjb25zdCBzcGFuc19sZW5ndGggPSBpY29uX3NwYW5zLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNwYW5zX2xlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGFsd2F5cyB0YWtlIHRoZSBmaXJzdCBvbmUsIHRoYXQgaGFzbid0IGNoYW5nZWQgeWV0XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNwYW4gPSBpY29uX3NwYW5zWzBdO1xuICAgICAgICAgICAgICAgICAgICBsZXQgc3JjID0gKDAsIHV0aWxpdGllc18xLmdldF9ta21fc3JjKShzcGFuKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNyYyAhPSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAoMCwgdXRpbGl0aWVzXzEucmVwbGFjZUNhbWVyYSkoc3Bhbiwgc3JjKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5mdW5jdGlvbiBhZGRBdXRvY29tcGxldGVJbWFnZXMoKSB7XG4gICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoXCJpbWFnZXNcIiwgKHJlc3VsdCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBpZiAocmVzdWx0LmltYWdlcykge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHBhZ2VfZWxlbWVudHNfMS5hdXRvY29tcGxldGVfcmVzdWx0cyk7XG4gICAgICAgICAgICBpZiAocmVzdWx0cykge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIG9ic2VydmVyLm9ic2VydmUocmVzdWx0cywgY29uZmlnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pKTtcbn1cbmV4cG9ydHMuYWRkQXV0b2NvbXBsZXRlSW1hZ2VzID0gYWRkQXV0b2NvbXBsZXRlSW1hZ2VzO1xuZnVuY3Rpb24gYWRkSW1hZ2VzKCkge1xuICAgIHZhciBfYTtcbiAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHBhZ2VfZWxlbWVudHNfMS5oZWFkZXJfc2VsZWN0b3IpO1xuICAgIGlmIChoZWFkZXIpIHtcbiAgICAgICAgaGVhZGVyLmNsYXNzTGlzdC5hZGQocGFnZV9lbGVtZW50c18xLmJvcmlzX2ltZ19jbGFzcyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAoX2EgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHBhZ2VfZWxlbWVudHNfMS5pY29uX3NlbGVjdG9yKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNsYXNzTGlzdC5hZGQocGFnZV9lbGVtZW50c18xLmJvcmlzX2ltZ19jbGFzcyk7XG4gICAgfVxuICAgIGNvbnN0IGljb25fc3BhbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHBhZ2VfZWxlbWVudHNfMS5jYW1lcmFfY2xhc3MpO1xuICAgIC8vIFRoZSBzcGFuIGNvbGxlY3Rpb24gZ2V0cyBzbWFsbGVyIGFmdGVyIGV2ZXJ5IHVwZ3JhZGUsIHNvIHRoZSBvcmlnaW5hbCBsZW5ndGggbXVzdCBiZSBzYXZlZFxuICAgIGNvbnN0IHNwYW5zX2xlbmd0aCA9IGljb25fc3BhbnMubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3BhbnNfbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gYWx3YXlzIHRha2UgdGhlIGZpcnN0IG9uZSwgdGhhdCBoYXNuJ3QgY2hhbmdlZCB5ZXRcbiAgICAgICAgY29uc3Qgc3BhbiA9IGljb25fc3BhbnNbMF07XG4gICAgICAgIGxldCBzcmMgPSAoMCwgdXRpbGl0aWVzXzEuZ2V0X21rbV9zcmMpKHNwYW4pO1xuICAgICAgICBpZiAoc3JjICE9IFwiXCIpIHtcbiAgICAgICAgICAgICgwLCB1dGlsaXRpZXNfMS5yZXBsYWNlQ2FtZXJhKShzcGFuLCBzcmMpO1xuICAgICAgICAgICAgY29uc3QgZGl2ID0gc3BhbiA9PT0gbnVsbCB8fCBzcGFuID09PSB2b2lkIDAgPyB2b2lkIDAgOiBzcGFuLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICBkaXYgPT09IG51bGwgfHwgZGl2ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkaXYuY2xhc3NMaXN0LnJlbW92ZSguLi5wYWdlX2VsZW1lbnRzXzEuY29sX2NhbWVyYV9pY29uX2NsYXNzbGlzdCk7XG4gICAgICAgICAgICBkaXYgPT09IG51bGwgfHwgZGl2ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkaXYuYXBwZW5kQ2hpbGQoc3Bhbik7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnRzLmFkZEltYWdlcyA9IGFkZEltYWdlcztcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnNob3dUcmVuZCA9IHZvaWQgMDtcbmNvbnN0IHNjcnlmYWxsXzEgPSByZXF1aXJlKFwiLi4vLi4vY29tbW9uL3NjcnlmYWxsXCIpO1xuY29uc3QgdXRpbGl0aWVzXzEgPSByZXF1aXJlKFwiLi4vdXRpbGl0aWVzXCIpO1xuZnVuY3Rpb24gc2hvd1RyZW5kKCkge1xuICAgIHZhciBfYTtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBjb25zdCB0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiVXNlck9mZmVyc1RhYmxlXCIpO1xuICAgICAgICBpZiAodGFibGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGxlZ2VuZGFfZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIGxlZ2VuZGFfZGl2LmlubmVySFRNTCA9IFwiPGhyPjxwIGNsYXNzPSdmb250LXdlaWdodC1ib2xkJz5FID0gRXhhY3Qgc2V0IC8gTCA9IExvd2VzdCBBdmFpbGJsZSA8YnI+PHNwYW4gc3R5bGU9J2NvbG9yOiBncmVlbic+TG93ZXIgcHJpY2U8L3NwYW4+IC8gPHNwYW4gc3R5bGU9J2NvbG9yOiByZWQnPkhpZ2hlciBwcmljZTwvc3Bhbj4gLyA8c3BhbiBzdHlsZT0nY29sb3I6IGRhcmt2aW9sZXQnPkZvaWwgWyA8aT5ub3Qgc3VwcG9ydGVkPC9pPiBdPC9zcGFuPiAvIDxzcGFuIGNsYXNzPSdjb2xvci1wcmltYXJ5Jz5QcmljZSBub3QgZm91bmQ8L3NwYW48L3A+XCI7XG4gICAgICAgICAgICB0YWJsZS5iZWZvcmUobGVnZW5kYV9kaXYpO1xuICAgICAgICAgICAgY29uc3Qgcm93cyA9IHRhYmxlLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tpZF49YXJ0aWNsZVJvd10nKTtcbiAgICAgICAgICAgIGZvciAoY29uc3Qgcm93IG9mIHJvd3MpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjYXJkX3VybCA9IHJvdy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiY29sLXNlbGxlclwiKVswXS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImFcIilbMF0uaHJlZi5zcGxpdChcIj9cIilbMF0uc3BsaXQoXCIvXCIpO1xuICAgICAgICAgICAgICAgIGxldCBjYXJkX25hbWUgPSAoX2EgPSBjYXJkX3VybC5wb3AoKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnJlcGxhY2UoLy1WXFxkKy8sICcnKTtcbiAgICAgICAgICAgICAgICBsZXQgY2FyZF9pZCA9ICgwLCB1dGlsaXRpZXNfMS5nZXRfbWttX2lkKShyb3cpO1xuICAgICAgICAgICAgICAgIFByb21pc2UuYWxsKFsoMCwgc2NyeWZhbGxfMS5nZXRfY2hlYXBlc3QpKGNhcmRfbmFtZSksICgwLCBzY3J5ZmFsbF8xLmdldF9jYXJkbWFya2V0KShjYXJkX2lkKV0pLnRoZW4ocmVzcG9uc2VzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZSwgX2Y7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGVhcGVzdCA9IHJlc3BvbnNlc1swXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGV4YWN0ID0gcmVzcG9uc2VzWzFdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcmljZV9lbGVtID0gcm93LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwcmljZS1jb250YWluZXJcIilbMF0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImZ3LWJvbGRcIilbMF07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsX3ByaWNlID0gKDAsIHV0aWxpdGllc18xLnBhcnNlUHJpY2UpKHByaWNlX2VsZW0uaW5uZXJIVE1MLnJlcGxhY2UoXCIg4oKsXCIsIFwiXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGxheXNldF9lbGVtID0gcHJpY2VfZWxlbS5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInRleHQtbXV0ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwcHUgPSAwO1xuICAgICAgICAgICAgICAgICAgICBpZiAocGxheXNldF9lbGVtLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBwdSA9ICgwLCB1dGlsaXRpZXNfMS5wYXJzZVBQVSkocGxheXNldF9lbGVtWzBdLmlubmVySFRNTCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoZWFwZXN0X2NvbG9yID0gXCJcIiwgY2hlYXBlc3RfcHJpY2UgPSAwO1xuICAgICAgICAgICAgICAgICAgICBsZXQgZXhhY3RfY29sb3IgPSBcIlwiLCBleGFjdF9wcmljZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGVhcGVzdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hlYXBlc3RfcHJpY2UgPSBwYXJzZUZsb2F0KChfYiA9IChfYSA9IGNoZWFwZXN0LnByaWNlcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmV1cikgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogKF9jID0gY2hlYXBlc3QucHJpY2VzKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MuZXVyX2ZvaWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWFwZXN0X3ByaWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hlYXBlc3RfY29sb3IgPSBjb2xvcl9mcm9tX3ByaWNlKG9yaWdpbmFsX3ByaWNlLCBjaGVhcGVzdF9wcmljZSwgcHB1KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWFwZXN0ID0geyBuYW1lOiBcIm5vdF9mb3VuZFwiLCBpZDogLTEgfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZXhhY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4YWN0X3ByaWNlID0gcGFyc2VGbG9hdCgoX2UgPSAoX2QgPSBleGFjdC5wcmljZXMpID09PSBudWxsIHx8IF9kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZC5ldXIpICE9PSBudWxsICYmIF9lICE9PSB2b2lkIDAgPyBfZSA6IChfZiA9IGV4YWN0LnByaWNlcykgPT09IG51bGwgfHwgX2YgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9mLmV1cl9mb2lsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleGFjdF9wcmljZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4YWN0X2NvbG9yID0gY29sb3JfZnJvbV9wcmljZShvcmlnaW5hbF9wcmljZSwgZXhhY3RfcHJpY2UsIHBwdSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleGFjdCA9IHsgbmFtZTogXCJub3RfZm91bmRcIiwgaWQ6IC0yIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm9pbCA9IChyb3cucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtb3JpZ2luYWwtdGl0bGU9XCJGb2lsXCJdJykubGVuZ3RoID4gMCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1haW5fY29sb3IgPSBmb2lsID8gXCJkYXJrdmlvbGV0XCIgOiBjaGVhcGVzdF9jb2xvciAmJiBleGFjdF9jb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgcHJpY2VfZWxlbS5pbm5lckhUTUwgPSBcIjxzcGFuIHN0eWxlPSdjb2xvcjogXCIgKyBtYWluX2NvbG9yICsgXCInPlwiICsgcHJpY2VfZWxlbS5pbm5lckhUTUwgKyBcIjxzcGFuPlwiO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWZvaWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleGFjdF9wcmljZSA+IDAgJiYgY2hlYXBlc3QuaWQgIT0gZXhhY3QuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZV9lbGVtLmlubmVySFRNTCArPSBcIjxicj48c3BhbiBzdHlsZT0nY29sb3I6IFwiICsgZXhhY3RfY29sb3IgKyBcIjsnID5FIDwvc3Bhbj48YSBzdHlsZT0nY29sb3I6IGJsYWNrJyBocmVmPSdcIiArIGV4YWN0LnNjcnlmYWxsX3VyaSArIFwiJz4gXCIgKyBleGFjdF9wcmljZS50b0xvY2FsZVN0cmluZyhcIml0LUlUXCIsIHsgbWluaW11bUZyYWN0aW9uRGlnaXRzOiAyIH0pICsgXCIg4oKsPC9hPlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWFwZXN0X3ByaWNlID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlX2VsZW0uaW5uZXJIVE1MICs9IFwiPGJyPjxzcGFuIHN0eWxlPSdjb2xvcjogXCIgKyBjaGVhcGVzdF9jb2xvciArIFwiOyc+XCIgKyAoY2hlYXBlc3QuaWQgPT0gZXhhY3QuaWQgPyBcIkU9XCIgOiBcIlwiKSArIFwiTCA8L3NwYW4+PGEgc3R5bGU9J2NvbG9yOiBibGFjaycgaHJlZj0nXCIgKyBjaGVhcGVzdC5zY3J5ZmFsbF91cmkgKyBcIic+IFwiICsgY2hlYXBlc3RfcHJpY2UudG9Mb2NhbGVTdHJpbmcoXCJpdC1JVFwiLCB7IG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMiB9KSArIFwiIOKCrDwvYT5cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59XG5leHBvcnRzLnNob3dUcmVuZCA9IHNob3dUcmVuZDtcbmZ1bmN0aW9uIGNvbG9yX2Zyb21fcHJpY2Uob2xkX3ByaWNlLCBuZXdfcHJpY2UsIHBwdSkge1xuICAgIGlmICgocHB1ID4gMCAmJiBwcHUgPiBuZXdfcHJpY2UpIHx8IG9sZF9wcmljZSA+IG5ld19wcmljZSkge1xuICAgICAgICByZXR1cm4gXCJyZWRcIjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBcImdyZWVuXCI7XG4gICAgfVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuc2F2ZUFsbFVybHMgPSBleHBvcnRzLmFkZFByaW50TGlzdEJ1dHRvbiA9IHZvaWQgMDtcbmNvbnN0IHNjcnlmYWxsXzEgPSByZXF1aXJlKFwiLi4vLi4vY29tbW9uL3NjcnlmYWxsXCIpO1xuY29uc3QgdXRpbGl0aWVzXzEgPSByZXF1aXJlKFwiLi4vLi4vY29tbW9uL3V0aWxpdGllc1wiKTtcbmNvbnN0IHV0aWxpdGllc18yID0gcmVxdWlyZShcIi4uL3V0aWxpdGllc1wiKTtcbmZ1bmN0aW9uIGFkZFByaW50TGlzdEJ1dHRvbigpIHtcbiAgICB2YXIgX2E7XG4gICAgY29uc3QgdGFibGUgPSAoX2EgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIldhbnRzTGlzdFRhYmxlXCIpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0Ym9keVwiKVswXTtcbiAgICBpZiAodGFibGUpIHtcbiAgICAgICAgY29uc3QgYnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImFbaHJlZiQ9J0FkZERlY2tMaXN0J11cIilbMF07IC8vICQ9IC0tPiBlbmRpbmcgd2l0aFxuICAgICAgICBidG4uY2xhc3NMaXN0LmFkZChcIm1yLTNcIik7XG4gICAgICAgIGNvbnN0IHByaW50QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgcHJpbnRCdG4uY2xhc3NMaXN0LmFkZChcImJ0blwiKTtcbiAgICAgICAgcHJpbnRCdG4uc3R5bGUuY29sb3IgPSBcInJnYigyNDAsIDE3MywgNzgpXCI7XG4gICAgICAgIHByaW50QnRuLnN0eWxlLmJvcmRlckNvbG9yID0gXCJyZ2IoMjQwLCAxNzMsIDc4KVwiO1xuICAgICAgICBwcmludEJ0bi5pbm5lckhUTUwgPSBcIjxzcGFuPlNhdmUgYXMuLi48L3NwYW4+XCI7XG4gICAgICAgIHByaW50QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldCgncHJpbnRWZXJzaW9uJywgKGRhdGEpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICAgICAgICAgIGNvbnN0IHdhbnRzX3RpdGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInBhZ2UtdGl0bGUtY29udGFpbmVyXCIpWzBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaDFcIilbMF0uaW5uZXJIVE1MO1xuICAgICAgICAgICAgICAgIGxldCBsaXN0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmludFZlcnNpb24gPSAoX2EgPSBkYXRhLnByaW50VmVyc2lvbikgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogZmFsc2U7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCByb3cgb2YgdGFibGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0clwiKSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgYW1vdW50ID0gKF9iID0gcm93LnF1ZXJ5U2VsZWN0b3IoXCJ0ZC5hbW91bnRcIikuZ2V0QXR0cmlidXRlKFwiZGF0YS1hbW91bnRcIikpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IFwiMVwiO1xuICAgICAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IHJvdy5xdWVyeVNlbGVjdG9yKFwidGQubmFtZSBhXCIpLmlubmVySFRNTDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByaW50VmVyc2lvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdCArPSBhbW91bnQgKyBcIiBcIiArIG5hbWUgKyBcIlxcblwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY2FyZF9pZCA9ICgwLCB1dGlsaXRpZXNfMi5nZXRfbWttX2lkKShyb3cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhcmRfaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5aWVsZCAoMCwgc2NyeWZhbGxfMS5nZXRfY2FyZG1hcmtldCkoY2FyZF9pZCkudGhlbigoY2FyZCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FyZC5uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0ICs9IGFtb3VudCArIFwiIFwiICsgY2FyZC5uYW1lICsgXCJcXG5cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QgKz0gYW1vdW50ICsgXCIgXCIgKyBuYW1lICsgXCJcXG5cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAoMCwgdXRpbGl0aWVzXzEuc2F2ZVdpdGhGaWxlUGlja2VyKShuZXcgQmxvYihbbGlzdF0pLCB3YW50c190aXRsZSA/IHdhbnRzX3RpdGxlICsgXCIudHh0XCIgOiBcIndhbnRzLnR4dFwiKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGJ0bi5hZnRlcihwcmludEJ0bik7XG4gICAgfVxufVxuZXhwb3J0cy5hZGRQcmludExpc3RCdXR0b24gPSBhZGRQcmludExpc3RCdXR0b247XG5mdW5jdGlvbiBzYXZlQWxsVXJscygpIHtcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoW1widXJsc1wiXSwgKHJlc3VsdCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICBsZXQgc2F2ZWRfdXJscyA9IChfYSA9IHJlc3VsdC51cmxzKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBbXTtcbiAgICAgICAgY29uc3Qgcm93cyA9IChfYiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiV2FudHNMaXN0VGFibGVcIikpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRib2R5XCIpWzBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidHJcIik7XG4gICAgICAgIGlmIChyb3dzKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiByb3dzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2FyZF91cmwgPSAoMCwgdXRpbGl0aWVzXzIuZ2V0X21rbV91cmwpKHJvdyk7XG4gICAgICAgICAgICAgICAgaWYgKGNhcmRfdXJsICYmIGNhcmRfdXJsLmluY2x1ZGVzKFwiL1Byb2R1Y3RzL1NpbmdsZXMvXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhcmRfaWQgPSAoMCwgdXRpbGl0aWVzXzIuZ2V0X21rbV9pZCkocm93KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhcmRfaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHlpZWxkICgwLCBzY3J5ZmFsbF8xLmdldF9jYXJkbWFya2V0KShjYXJkX2lkKS50aGVuKChjYXJkKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhcmQubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhbHJlYWR5X2luID0gc2F2ZWRfdXJscy5maWx0ZXIoKHUpID0+IHUubWttX2lkID09IGNhcmRfaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWxyZWFkeV9pbi5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZWRfdXJscy5wdXNoKHsgbmFtZTogY2FyZC5uYW1lLCBta21faWQ6IGNhcmRfaWQsIHVybDogY2FyZF91cmwgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbHJlYWR5X2luWzBdLnVybCA9IGNhcmRfdXJsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgXCJ1cmxzXCI6IHNhdmVkX3VybHMgfSk7XG4gICAgICAgIH1cbiAgICB9KSk7XG59XG5leHBvcnRzLnNhdmVBbGxVcmxzID0gc2F2ZUFsbFVybHM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMucmVwbGFjZUNhbWVyYSA9IGV4cG9ydHMucGFyc2VVcmwgPSBleHBvcnRzLmdldF9jYXJkX3NyYyA9IGV4cG9ydHMucGFyc2VQUFUgPSBleHBvcnRzLnBhcnNlUHJpY2UgPSBleHBvcnRzLmdldF9ta21fdXJsID0gZXhwb3J0cy5nZXRfbWttX3ZlcnNpb24gPSBleHBvcnRzLmdldF9ta21fc3JjID0gZXhwb3J0cy5nZXRfbWttX2lkID0gdm9pZCAwO1xuY29uc3QgcGFnZV9lbGVtZW50c18xID0gcmVxdWlyZShcIi4vcGFnZV9lbGVtZW50c1wiKTtcbmZ1bmN0aW9uIGdldF9ta21faWQocm93KSB7XG4gICAgdmFyIF9hO1xuICAgIGNvbnN0IGNhbWVyYV9zcGFuID0gcm93LmdldEVsZW1lbnRzQnlDbGFzc05hbWUocGFnZV9lbGVtZW50c18xLmNhbWVyYV9jbGFzcylbMF0gfHwgcm93LmdldEVsZW1lbnRzQnlDbGFzc05hbWUocGFnZV9lbGVtZW50c18xLmJvcmlzX2ltZ19jbGFzcylbMF07XG4gICAgcmV0dXJuICgoX2EgPSBjYW1lcmFfc3BhbiA9PT0gbnVsbCB8fCBjYW1lcmFfc3BhbiA9PT0gdm9pZCAwID8gdm9pZCAwIDogY2FtZXJhX3NwYW4uZ2V0QXR0cmlidXRlKHBhZ2VfZWxlbWVudHNfMS50aXRsZV9hdHRyaWJ1dGUpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Euc3BsaXQoL1xcLmpwZy9nKVswXS5zcGxpdChcIi9cIikuc3BsaWNlKC0xKVswXSkgfHwgXCJcIjtcbn1cbmV4cG9ydHMuZ2V0X21rbV9pZCA9IGdldF9ta21faWQ7XG5mdW5jdGlvbiBnZXRfbWttX3NyYyhyb3cpIHtcbiAgICB2YXIgX2E7XG4gICAgcmV0dXJuICgoX2EgPSByb3cuZ2V0QXR0cmlidXRlKHBhZ2VfZWxlbWVudHNfMS50aXRsZV9hdHRyaWJ1dGUpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubWF0Y2goL3NyYz1cXFwiKC4qPylcXFwiLylbMV0pIHx8IFwiXCI7XG59XG5leHBvcnRzLmdldF9ta21fc3JjID0gZ2V0X21rbV9zcmM7XG5mdW5jdGlvbiBnZXRfbWttX3ZlcnNpb24ocm93KSB7XG4gICAgdmFyIF9hLCBfYjtcbiAgICBjb25zdCBhbHQgPSAoKF9iID0gKF9hID0gcm93LmdldEVsZW1lbnRzQnlDbGFzc05hbWUocGFnZV9lbGVtZW50c18xLmNhbWVyYV9jbGFzcylbMF0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5nZXRBdHRyaWJ1dGUocGFnZV9lbGVtZW50c18xLnRpdGxlX2F0dHJpYnV0ZSkpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5tYXRjaCgvYWx0PVxcXCIoLio/KVxcXCIvKVsxXSkgfHwgXCJcIjtcbiAgICBjb25zdCB2ZXJzaW9uID0gYWx0Lm1hdGNoKC9cXChWXFwuKC4qPylcXCkvKTtcbiAgICByZXR1cm4gdmVyc2lvbiAhPSBudWxsID8gdmVyc2lvblsxXSA6IFwiXCI7XG59XG5leHBvcnRzLmdldF9ta21fdmVyc2lvbiA9IGdldF9ta21fdmVyc2lvbjtcbmZ1bmN0aW9uIGdldF9ta21fdXJsKHJvdykge1xuICAgIHZhciBfYSwgX2I7XG4gICAgcmV0dXJuIChfYiA9IChfYSA9IHJvdy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwibmFtZVwiKVswXSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYVwiKVswXSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmhyZWYuc3BsaXQoXCI/XCIpWzBdO1xufVxuZXhwb3J0cy5nZXRfbWttX3VybCA9IGdldF9ta21fdXJsO1xuZnVuY3Rpb24gcGFyc2VQcmljZShwcmljZSkge1xuICAgIHJldHVybiBwYXJzZUZsb2F0KHByaWNlLnJlcGxhY2UoXCIuXCIsIFwiXCIpLm1hdGNoKC9cXGQrXFwsXFxkKy8pWzBdLnJlcGxhY2UoXCIsXCIsIFwiLlwiKSk7XG59XG5leHBvcnRzLnBhcnNlUHJpY2UgPSBwYXJzZVByaWNlO1xuZnVuY3Rpb24gcGFyc2VQUFUocHB1KSB7XG4gICAgcmV0dXJuIHBhcnNlRmxvYXQocHB1Lm1hdGNoKC9cXGQqXFwuP1xcZCsoXFwsXFxkKyk/L2cpWzBdLnJlcGxhY2UoXCIuXCIsIFwiXCIpLnJlcGxhY2UoXCIsXCIsIFwiLlwiKSk7XG59XG5leHBvcnRzLnBhcnNlUFBVID0gcGFyc2VQUFU7XG5mdW5jdGlvbiBnZXRfY2FyZF9zcmMoY2FyZCkge1xuICAgIGxldCBzcmMgPSBcIlwiO1xuICAgIGlmIChjYXJkKSB7XG4gICAgICAgIGlmIChjYXJkLmltYWdlX3VyaXMpIHtcbiAgICAgICAgICAgIHNyYyA9IGNhcmQuaW1hZ2VfdXJpcy5zbWFsbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjYXJkLmNhcmRfZmFjZXMpIHtcbiAgICAgICAgICAgIHNyYyA9IGNhcmQuY2FyZF9mYWNlc1swXS5pbWFnZV91cmlzLnNtYWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzcmM7XG59XG5leHBvcnRzLmdldF9jYXJkX3NyYyA9IGdldF9jYXJkX3NyYztcbmZ1bmN0aW9uIHBhcnNlVXJsKGRhdGEpIHtcbiAgICBjb25zdCB1cmwgPSBkYXRhLm1hdGNoKC9cIipcIi8pO1xuICAgIHJldHVybiB1cmw7XG59XG5leHBvcnRzLnBhcnNlVXJsID0gcGFyc2VVcmw7XG5mdW5jdGlvbiByZXBsYWNlQ2FtZXJhKHNwYW4sIHNyYykge1xuICAgIGNvbnN0IGNhcmRfaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICBjYXJkX2ltZy5zcmMgPSBzcmM7XG4gICAgY2FyZF9pbWcuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICBjYXJkX2ltZy5zdHlsZS5oZWlnaHQgPSBcIjEwMCVcIjtcbiAgICBzcGFuLmNsYXNzTGlzdC5yZW1vdmUoLi4ucGFnZV9lbGVtZW50c18xLmNhbWVyYV9pY29uX2NsYXNzbGlzdCk7XG4gICAgc3Bhbi5jbGFzc0xpc3QuYWRkKHBhZ2VfZWxlbWVudHNfMS5ib3Jpc19pbWdfY2xhc3MpO1xuICAgIHNwYW4uYXBwZW5kQ2hpbGQoY2FyZF9pbWcpO1xuICAgIHNwYW4uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShwYWdlX2VsZW1lbnRzXzEuY2FtZXJhX2ljb24pWzBdLnJlbW92ZSgpO1xufVxuZXhwb3J0cy5yZXBsYWNlQ2FtZXJhID0gcmVwbGFjZUNhbWVyYTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcImNhcmRtYXJrZXQvY29udGVudF9zY3JpcHRcIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rYm9yaXNcIl0gPSBzZWxmW1wid2VicGFja0NodW5rYm9yaXNcIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvclwiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9jYXJkbWFya2V0L2NvbnRlbnRfc2NyaXB0LnRzXCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
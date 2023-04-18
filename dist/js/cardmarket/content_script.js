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
const Product_1 = __webpack_require__(/*! ./pages/Product */ "./src/cardmarket/pages/Product.ts");
if (window.location.pathname.includes("Magic/Users")) {
    (0, Users_1.showTrend)();
    (0, Product_1.addImages)(1.6); // TODO execute when all trends have been added
}
if (window.location.pathname.includes("Products/Singles/")) {
    (0, Singles_1.addLinkToSingles)();
    (0, Singles_1.addCheckboxes)();
}
if (window.location.pathname.includes("Products")) {
    (0, Product_1.addImages)(1.4);
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

/***/ "./src/cardmarket/pages/Product.ts":
/*!*****************************************!*\
  !*** ./src/cardmarket/pages/Product.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.addImages = void 0;
const scryfall_1 = __webpack_require__(/*! ../../common/scryfall */ "./src/common/scryfall.ts");
const utilities_1 = __webpack_require__(/*! ../utilities */ "./src/cardmarket/utilities.ts");
function addImages(mul) {
    chrome.storage.sync.get("images", (result) => {
        if (result.images) {
            let height = 0;
            let max_height = 0;
            for (const elem of document.querySelectorAll(".col-offer")) {
                height = elem.clientHeight;
                if (height > max_height) {
                    max_height = height;
                }
            }
            for (const row of document.querySelectorAll(".table-body>div")) {
                if (row.getElementsByClassName("fonticon-camera").length > 0) {
                    (0, scryfall_1.get_cardmarket)((0, utilities_1.get_mkm_id)(row)).then((card) => {
                        const span = row.getElementsByClassName("fonticon-camera")[0];
                        if (card.name)
                            (0, utilities_1.replaceCamera)(row, card, mul, max_height);
                        const div = span === null || span === void 0 ? void 0 : span.parentElement;
                        const cell = document.createElement("div");
                        div === null || div === void 0 ? void 0 : div.classList.add("col-1");
                        cell.appendChild(span);
                        div === null || div === void 0 ? void 0 : div.appendChild(cell);
                    });
                }
            }
        }
    });
}
exports.addImages = addImages;


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
    return __awaiter(this, void 0, void 0, function* () {
        const table = document.getElementById("UserOffersTable");
        if (table) {
            chrome.storage.sync.get("images", (result) => {
                var _a;
                const convert_images = result.images;
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
                        let cheapest = responses[0];
                        let exact = responses[1];
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
                        else {
                            cheapest = { name: "not_found", id: -1 };
                        }
                        if (exact) {
                            exact_price = parseFloat((_e = (_d = exact.prices) === null || _d === void 0 ? void 0 : _d.eur) !== null && _e !== void 0 ? _e : (_f = exact.prices) === null || _f === void 0 ? void 0 : _f.eur_foil);
                            if (exact_price) {
                                exact_color = (foil ? "darkviolet" : color_from_price(original_price, exact_price, ppu));
                            }
                            if (convert_images) {
                                // replaceCamera(row, exact);
                            }
                        }
                        else {
                            exact = { name: "not_found", id: -2 };
                        }
                        let original_color = cheapest_color && exact_color;
                        price_elem.innerHTML = "<span style='color: " + original_color + "'>" + price_elem.innerHTML + "<span>";
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
            });
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
exports.replaceCamera = exports.parsePPU = exports.parsePrice = exports.get_mkm_url = exports.get_mkm_version = exports.get_mkm_id = void 0;
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
function replaceCamera(row, card, mul, max_height = 0) {
    var _a;
    let src;
    if (card) {
        if (card.image_uris) {
            src = card.image_uris.art_crop;
        }
        else if (card.card_faces) {
            src = card.card_faces[0].image_uris.art_crop;
        }
        else {
            src = "";
        }
    }
    const span = row.getElementsByClassName("fonticon-camera")[0];
    const card_img = document.createElement("img");
    card_img.src = src;
    card_img.style.width = "auto";
    const height = max_height != 0 ? max_height : (((_a = span.parentElement) === null || _a === void 0 ? void 0 : _a.offsetHeight) || 0);
    card_img.style.height = height != 0 ? (height * mul).toString() + "px" : "110%";
    span.classList.remove("fonticon-camera");
    span.appendChild(card_img);
    return span;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNLHFCQUFxQjtXQUMzQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7Ozs7VUVoREE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2JvcmlzLy4vc3JjL2NhcmRtYXJrZXQvY29udGVudF9zY3JpcHQudHMiLCJ3ZWJwYWNrOi8vYm9yaXMvLi9zcmMvY2FyZG1hcmtldC9wYWdlcy9Qcm9kdWN0LnRzIiwid2VicGFjazovL2JvcmlzLy4vc3JjL2NhcmRtYXJrZXQvcGFnZXMvU2hvcHBpbmdXaXphcmQudHMiLCJ3ZWJwYWNrOi8vYm9yaXMvLi9zcmMvY2FyZG1hcmtldC9wYWdlcy9TaW5nbGVzLnRzIiwid2VicGFjazovL2JvcmlzLy4vc3JjL2NhcmRtYXJrZXQvcGFnZXMvVXNlcnMudHMiLCJ3ZWJwYWNrOi8vYm9yaXMvLi9zcmMvY2FyZG1hcmtldC9wYWdlcy9XYW50cy50cyIsIndlYnBhY2s6Ly9ib3Jpcy8uL3NyYy9jYXJkbWFya2V0L3V0aWxpdGllcy50cyIsIndlYnBhY2s6Ly9ib3Jpcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9ib3Jpcy93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL2JvcmlzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYm9yaXMvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vYm9yaXMvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9ib3Jpcy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vYm9yaXMvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgVXNlcnNfMSA9IHJlcXVpcmUoXCIuL3BhZ2VzL1VzZXJzXCIpO1xuY29uc3QgU2luZ2xlc18xID0gcmVxdWlyZShcIi4vcGFnZXMvU2luZ2xlc1wiKTtcbmNvbnN0IFNob3BwaW5nV2l6YXJkXzEgPSByZXF1aXJlKFwiLi9wYWdlcy9TaG9wcGluZ1dpemFyZFwiKTtcbmNvbnN0IFdhbnRzXzEgPSByZXF1aXJlKFwiLi9wYWdlcy9XYW50c1wiKTtcbmNvbnN0IFByb2R1Y3RfMSA9IHJlcXVpcmUoXCIuL3BhZ2VzL1Byb2R1Y3RcIik7XG5pZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKFwiTWFnaWMvVXNlcnNcIikpIHtcbiAgICAoMCwgVXNlcnNfMS5zaG93VHJlbmQpKCk7XG4gICAgKDAsIFByb2R1Y3RfMS5hZGRJbWFnZXMpKDEuNik7IC8vIFRPRE8gZXhlY3V0ZSB3aGVuIGFsbCB0cmVuZHMgaGF2ZSBiZWVuIGFkZGVkXG59XG5pZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKFwiUHJvZHVjdHMvU2luZ2xlcy9cIikpIHtcbiAgICAoMCwgU2luZ2xlc18xLmFkZExpbmtUb1NpbmdsZXMpKCk7XG4gICAgKDAsIFNpbmdsZXNfMS5hZGRDaGVja2JveGVzKSgpO1xufVxuaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmNsdWRlcyhcIlByb2R1Y3RzXCIpKSB7XG4gICAgKDAsIFByb2R1Y3RfMS5hZGRJbWFnZXMpKDEuNCk7XG59XG5pZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKFwiQ2FyZHMvXCIpKSB7XG4gICAgKDAsIFNpbmdsZXNfMS5hZGRMaW5rVG9TaW5nbGVzKSgpO1xufVxuaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmNsdWRlcyhcIlNob3BwaW5nV2l6YXJkL1Jlc3VsdHNcIikpIHtcbiAgICAoMCwgU2luZ2xlc18xLmFkZExpbmtUb1NpbmdsZXMpKCk7XG4gICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmNsdWRlcyhcIi9NYWdpYy9XYW50c1wiKSkge1xuICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldCgnc2hvcHBpbmdXaXphcmQnLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYgKGRhdGEuc2hvcHBpbmdXaXphcmQpIHtcbiAgICAgICAgICAgICAgICAoMCwgU2hvcHBpbmdXaXphcmRfMS5hZGREaXNjbGFpbWVyKSgpO1xuICAgICAgICAgICAgICAgICgwLCBTaG9wcGluZ1dpemFyZF8xLmFkZExpbmtUb0NhcmRzKSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5pZiAoL1xcUytcXC9XYW50c1xcL1xcZCsvLnRlc3Qod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKSkge1xuICAgICgwLCBXYW50c18xLmFkZFByaW50TGlzdEJ1dHRvbikoKTtcbiAgICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKFwiL01hZ2ljL1dhbnRzXCIpKSB7XG4gICAgICAgICgwLCBXYW50c18xLnNhdmVBbGxVcmxzKSgpO1xuICAgIH1cbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5hZGRJbWFnZXMgPSB2b2lkIDA7XG5jb25zdCBzY3J5ZmFsbF8xID0gcmVxdWlyZShcIi4uLy4uL2NvbW1vbi9zY3J5ZmFsbFwiKTtcbmNvbnN0IHV0aWxpdGllc18xID0gcmVxdWlyZShcIi4uL3V0aWxpdGllc1wiKTtcbmZ1bmN0aW9uIGFkZEltYWdlcyhtdWwpIHtcbiAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldChcImltYWdlc1wiLCAocmVzdWx0KSA9PiB7XG4gICAgICAgIGlmIChyZXN1bHQuaW1hZ2VzKSB7XG4gICAgICAgICAgICBsZXQgaGVpZ2h0ID0gMDtcbiAgICAgICAgICAgIGxldCBtYXhfaGVpZ2h0ID0gMDtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZWxlbSBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNvbC1vZmZlclwiKSkge1xuICAgICAgICAgICAgICAgIGhlaWdodCA9IGVsZW0uY2xpZW50SGVpZ2h0O1xuICAgICAgICAgICAgICAgIGlmIChoZWlnaHQgPiBtYXhfaGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIG1heF9oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChjb25zdCByb3cgb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50YWJsZS1ib2R5PmRpdlwiKSkge1xuICAgICAgICAgICAgICAgIGlmIChyb3cuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImZvbnRpY29uLWNhbWVyYVwiKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICgwLCBzY3J5ZmFsbF8xLmdldF9jYXJkbWFya2V0KSgoMCwgdXRpbGl0aWVzXzEuZ2V0X21rbV9pZCkocm93KSkudGhlbigoY2FyZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3BhbiA9IHJvdy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZm9udGljb24tY2FtZXJhXCIpWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhcmQubmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoMCwgdXRpbGl0aWVzXzEucmVwbGFjZUNhbWVyYSkocm93LCBjYXJkLCBtdWwsIG1heF9oZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGl2ID0gc3BhbiA9PT0gbnVsbCB8fCBzcGFuID09PSB2b2lkIDAgPyB2b2lkIDAgOiBzcGFuLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdiA9PT0gbnVsbCB8fCBkaXYgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGRpdi5jbGFzc0xpc3QuYWRkKFwiY29sLTFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsLmFwcGVuZENoaWxkKHNwYW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGl2ID09PSBudWxsIHx8IGRpdiA9PT0gdm9pZCAwID8gdm9pZCAwIDogZGl2LmFwcGVuZENoaWxkKGNlbGwpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmV4cG9ydHMuYWRkSW1hZ2VzID0gYWRkSW1hZ2VzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYWRkTGlua1RvQ2FyZHMgPSBleHBvcnRzLmFkZERpc2NsYWltZXIgPSB2b2lkIDA7XG5jb25zdCBzY3J5ZmFsbF8xID0gcmVxdWlyZShcIi4uLy4uL2NvbW1vbi9zY3J5ZmFsbFwiKTtcbmNvbnN0IHV0aWxpdGllc18xID0gcmVxdWlyZShcIi4uL3V0aWxpdGllc1wiKTtcbmZ1bmN0aW9uIGFkZERpc2NsYWltZXIoKSB7XG4gICAgY29uc3Qgc2VjdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjYXJkLWNvbHVtbnNcIilbMF07XG4gICAgY29uc3QgZGlzY2xhaW1lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoNFwiKTtcbiAgICBkaXNjbGFpbWVyLmlubmVySFRNTCA9IFwiPGkgc3R5bGU9J2NvbG9yOiByZWQ7Jz5EdWUgdG8gc29tZSBsaW1pdGF0aW9ucywgc29tZSBsaW5rcyBtYXkgbm90IHdvcmsgb3IgYmUgd3Jvbmc8L2k+PGhyPlwiO1xuICAgIHNlY3Rpb24uYmVmb3JlKGRpc2NsYWltZXIpO1xufVxuZXhwb3J0cy5hZGREaXNjbGFpbWVyID0gYWRkRGlzY2xhaW1lcjtcbmZ1bmN0aW9uIGFkZExpbmtUb0NhcmRzKCkge1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbXCJ1cmxzXCJdLCAocmVzdWx0KSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIGxldCBzYXZlZF91cmxzID0gKF9hID0gcmVzdWx0LnVybHMpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHRhYmxlIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGJvZHlcIikpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qgcm93IG9mIHRhYmxlLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidHJcIikpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjYXJkX2lkID0gKDAsIHV0aWxpdGllc18xLmdldF9ta21faWQpKHJvdyk7XG4gICAgICAgICAgICAgICAgY29uc3QgY2FyZF92ZXJzaW9uID0gKDAsIHV0aWxpdGllc18xLmdldF9ta21fdmVyc2lvbikocm93KTtcbiAgICAgICAgICAgICAgICBjb25zdCBjYXJkX2VsZW0gPSByb3cuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImNhcmQtbmFtZVwiKVswXTtcbiAgICAgICAgICAgICAgICBjb25zdCBzZXRfdGl0bGUgPSAoX2IgPSByb3cuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImV4cGFuc2lvbi1zeW1ib2xcIilbMF0pID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5nZXRBdHRyaWJ1dGUoXCJkYXRhLW9yaWdpbmFsLXRpdGxlXCIpO1xuICAgICAgICAgICAgICAgIGlmIChjYXJkX2lkKSB7XG4gICAgICAgICAgICAgICAgICAgIHlpZWxkICgwLCBzY3J5ZmFsbF8xLmdldF9jYXJkbWFya2V0KShjYXJkX2lkKS50aGVuKChjYXJkKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzYXZlZCA9IHNhdmVkX3VybHMuZmlsdGVyKCh1KSA9PiB1Lm1rbV9pZCA9PSBjYXJkX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVybCA9IHNhdmVkLmxlbmd0aCA+IDAgPyBzYXZlZFswXS51cmwgOiAoeWllbGQgZm9ybWF0X3VybChjYXJkLCBjYXJkX3ZlcnNpb24sIHNldF90aXRsZSB8fCBcIlwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FyZF9lbGVtLmlubmVySFRNTCA9IFwiPGEgaHJlZj0nXCIgKyB1cmwgKyBcIicgdGFyZ2V0PSdfYmxhbmsnPlwiICsgY2FyZC5uYW1lICsgXCI8L2E+PGJyPi8gPGEgaHJlZj0nXCIgKyBjYXJkLnB1cmNoYXNlX3VyaXMuY2FyZG1hcmtldCArIFwiJyB0YXJnZXQ9J19ibGFuayc+QWxsIHByaW50aW5nczwvYT5cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2F2ZWRfdXJscy5maWx0ZXIoKHUpID0+IHUubWttX2lkID09IGNhcmRfaWQpLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVkX3VybHMucHVzaCh7IG5hbWU6IGNhcmQubmFtZSwgbWttX2lkOiBjYXJkX2lkLCB1cmw6IHVybCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoMCwgc2NyeWZhbGxfMS5mZXRjaF9zaW5nbGUpKGNhcmRfZWxlbS5pbm5lckhUTUwucmVwbGFjZSgvXFwoVlxcLlxcZCtcXCkvZywgJycpKS50aGVuKChjYXJkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhcmRfZWxlbS5pbm5lckhUTUwgPSBcIjxhIGhyZWY9J1wiICsgY2FyZC5wdXJjaGFzZV91cmlzLmNhcmRtYXJrZXQgKyBcIicgdGFyZ2V0PSdfYmxhbmsnPlwiICsgY2FyZC5uYW1lICsgXCI8YnI+KEFsbCk8L2E+XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgXCJ1cmxzXCI6IHNhdmVkX3VybHMgfSk7XG4gICAgfSkpO1xufVxuZXhwb3J0cy5hZGRMaW5rVG9DYXJkcyA9IGFkZExpbmtUb0NhcmRzO1xuZnVuY3Rpb24gZm9ybWF0X3VybChjYXJkLCB2ZXJzaW9uLCBzZXRfdGl0bGUpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBpZiAoY2FyZC5uYW1lKSB7XG4gICAgICAgICAgICBsZXQgbmFtZSA9IGNhcmQubmFtZTtcbiAgICAgICAgICAgIGxldCBzZXQgPSBcIlwiO1xuICAgICAgICAgICAgaWYgKHZlcnNpb24pIHtcbiAgICAgICAgICAgICAgICBzZXQgPSBzZXRfdGl0bGU7XG4gICAgICAgICAgICAgICAgbmFtZSArPSBcIiBWXCIgKyB2ZXJzaW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2V0X3R5cGUgPSBzZXRfdGl0bGUgPT09IG51bGwgfHwgc2V0X3RpdGxlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBzZXRfdGl0bGUuc3BsaXQoXCI6XCIpLnBvcCgpO1xuICAgICAgICAgICAgICAgIGlmICghY2FyZC5zZXRfbmFtZS5pbmNsdWRlcyhcIkV4dHJhc1wiKSAmJiAhY2FyZC5zZXRfbmFtZS5pbmNsdWRlcyhcIlByb21vc1wiKSkge1xuICAgICAgICAgICAgICAgICAgICBzZXQgPSBjYXJkLnNldF9uYW1lICsgKChzZXRfdHlwZSAmJiAoc2V0X3R5cGUuaW5jbHVkZXMoXCJFeHRyYXNcIikgfHwgc2V0X3R5cGUuaW5jbHVkZXMoXCJQcm9tb3NcIikpKSA/IHNldF90eXBlIDogXCJcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZXQgPSBjYXJkLnNldF9uYW1lO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNldCA9IHNldC5yZXBsYWNlKFwiIFNldCBcIiwgXCIgXCIpO1xuICAgICAgICAgICAgbGV0IHBhdGggPSAoc2V0ICsgXCIvXCIgKyBuYW1lKS5yZXBsYWNlKC8gXFwvXFwvIC9nLCBcIi1cIikucmVwbGFjZSgvOi9nLCBcIlwiKS5yZXBsYWNlKC8sL2csIFwiXCIpLnJlcGxhY2UoL1xccysvZywgXCItXCIpO1xuICAgICAgICAgICAgbGV0IHVybCA9IFwiaHR0cHM6Ly93d3cuY2FyZG1hcmtldC5jb20vTWFnaWMvUHJvZHVjdHMvU2luZ2xlcy9cIiArIHBhdGg7XG4gICAgICAgICAgICBpZiAodXJsLmluY2x1ZGVzKFwiXFwnXCIpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3X3VybCA9IHVybC5yZXBsYWNlKC9cXCcvZywgXCJcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHlpZWxkIGZldGNoKG5ld191cmwpLnRoZW4oKHIpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHIub2sgJiYgdXJsc19hcmVfZXF1YWwoci51cmwsIG5ld191cmwpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3X3VybDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld191cmwgPSB1cmwucmVwbGFjZSgvXFwnL2csIFwiLVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCBmZXRjaChuZXdfdXJsKS50aGVuKHIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyLm9rICYmIHVybHNfYXJlX2VxdWFsKHIudXJsLCBuZXdfdXJsKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3X3VybDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVybDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIHVybHNfYXJlX2VxdWFsKHVybDEsIHVybDIpIHtcbiAgICByZXR1cm4gdXJsMS5zcGxpdChcIi9cIikuc2xpY2UoLTEpWzBdID09IHVybDIuc3BsaXQoXCIvXCIpLnNsaWNlKC0xKVswXTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmFkZENoZWNrYm94ZXMgPSBleHBvcnRzLmFkZExpbmtUb1NpbmdsZXMgPSB2b2lkIDA7XG5jb25zdCB1dGlsaXRpZXNfMSA9IHJlcXVpcmUoXCIuLi8uLi9jb21tb24vdXRpbGl0aWVzXCIpO1xuY29uc3QgdXRpbGl0aWVzXzIgPSByZXF1aXJlKFwiLi4vdXRpbGl0aWVzXCIpO1xuZnVuY3Rpb24gYWRkTGlua1RvU2luZ2xlcygpIHtcbiAgICBmb3IgKGNvbnN0IHVzZXIgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInNlbGxlci1uYW1lXCIpKSB7XG4gICAgICAgIGNvbnN0IHVzZXJfbGluayA9IHVzZXIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJhXCIpWzBdO1xuICAgICAgICB1c2VyX2xpbmsucGFyZW50RWxlbWVudC5pbm5lckhUTUwgKz0gXCImbmJzcDstJm5ic3A7PGEgaHJlZj0nXCIgKyB1c2VyX2xpbmsuaHJlZiArIFwiL09mZmVycy9TaW5nbGVzLycgdGFyZ2V0PSdfYmxhbmsnPlNpbmdsZXM8L2E+XCI7XG4gICAgfVxufVxuZXhwb3J0cy5hZGRMaW5rVG9TaW5nbGVzID0gYWRkTGlua1RvU2luZ2xlcztcbmZ1bmN0aW9uIGdldFJlZmVyZW5jZShkZWZhdWx0X3JlZikge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldCgncmVmZXJlbmNlJywgKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5yZWZlcmVuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoZGF0YS5yZWZlcmVuY2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyByZWZlcmVuY2U6IGRlZmF1bHRfcmVmIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShkZWZhdWx0X3JlZik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGFkZENoZWNrYm94ZXMoKSB7XG4gICAgdmFyIF9hO1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGxldCByZWZlcmVuY2UgPSB5aWVsZCBnZXRSZWZlcmVuY2UoMSk7XG4gICAgICAgIGNvbnN0IGluZm8gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiaW5mby1saXN0LWNvbnRhaW5lclwiKVswXTtcbiAgICAgICAgaWYgKGluZm8pIHtcbiAgICAgICAgICAgIGNvbnN0IHJvd3MgPSBpbmZvLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiZGRcIik7XG4gICAgICAgICAgICBjb25zdCBucm93cyA9IDQ7XG4gICAgICAgICAgICBsZXQgcHJpY2VzID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5yb3dzOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbGVtID0gcm93c1tyb3dzLmxlbmd0aCAtIG5yb3dzICsgaV07XG4gICAgICAgICAgICAgICAgcHJpY2VzLnB1c2goKDAsIHV0aWxpdGllc18yLnBhcnNlUHJpY2UpKGVsZW0uaW5uZXJIVE1MKSk7XG4gICAgICAgICAgICAgICAgZWxlbS5pbm5lckhUTUwgKz0gXCImbmJzcDs8aW5wdXQgdHlwZT0ncmFkaW8nIG5hbWU9J3JlZmVyZW5jZScgdmFsdWU9XCIgKyBpICsgKGkgPT0gcmVmZXJlbmNlID8gXCIgY2hlY2tlZFwiIDogXCJcIikgKyBcIj5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbG9yUHJpY2VzKHByaWNlc1tyZWZlcmVuY2VdKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcmFkaW8gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbbmFtZT1cInJlZmVyZW5jZVwiXScpKSB7XG4gICAgICAgICAgICAgICAgcmFkaW8uYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHsgcmVmZXJlbmNlOiB0aGlzLnZhbHVlIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yUHJpY2VzKHByaWNlc1t0aGlzLnZhbHVlXSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAoX2EgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWRNb3JlQnV0dG9uXCIpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+ICgwLCB1dGlsaXRpZXNfMS5zbGVlcCkoMzAwMCkudGhlbigoKSA9PiBjb2xvclByaWNlcyhwcmljZXNbcmVmZXJlbmNlXSkpKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuZXhwb3J0cy5hZGRDaGVja2JveGVzID0gYWRkQ2hlY2tib3hlcztcbmZ1bmN0aW9uIGNvbG9yUHJpY2VzKHJlZmVyZW5jZV9wcmljZSkge1xuICAgIGZvciAoY29uc3QgZWxlbSBvZiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicHJpY2UtY29udGFpbmVyXCIpKSB7XG4gICAgICAgIGNvbnN0IHByaWNlX2VsZW0gPSBlbGVtLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJmb250LXdlaWdodC1ib2xkXCIpWzBdO1xuICAgICAgICBjb25zdCBwbGF5c2V0X2VsZW0gPSBwcmljZV9lbGVtLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwidGV4dC1tdXRlZFwiKTtcbiAgICAgICAgbGV0IHBwdSA9IDA7XG4gICAgICAgIGlmIChwbGF5c2V0X2VsZW0ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcHB1ID0gKDAsIHV0aWxpdGllc18yLnBhcnNlUFBVKShwbGF5c2V0X2VsZW1bMF0uaW5uZXJIVE1MKTtcbiAgICAgICAgfVxuICAgICAgICBwcmljZV9lbGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJjb2xvci1wcmltYXJ5XCIpO1xuICAgICAgICBpZiAocHJpY2VfZWxlbSkge1xuICAgICAgICAgICAgaWYgKChwcHUgPiAwICYmIHBwdSA8PSByZWZlcmVuY2VfcHJpY2UpIHx8ICgwLCB1dGlsaXRpZXNfMi5wYXJzZVByaWNlKShwcmljZV9lbGVtLmlubmVySFRNTC5yZXBsYWNlKFwiIOKCrFwiLCBcIlwiKSkgPD0gcmVmZXJlbmNlX3ByaWNlKSB7XG4gICAgICAgICAgICAgICAgcHJpY2VfZWxlbS5zdHlsZS5jb2xvciA9IFwiZ3JlZW5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHByaWNlX2VsZW0uc3R5bGUuY29sb3IgPSBcInJlZFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuc2hvd1RyZW5kID0gdm9pZCAwO1xuY29uc3Qgc2NyeWZhbGxfMSA9IHJlcXVpcmUoXCIuLi8uLi9jb21tb24vc2NyeWZhbGxcIik7XG5jb25zdCB1dGlsaXRpZXNfMSA9IHJlcXVpcmUoXCIuLi91dGlsaXRpZXNcIik7XG5mdW5jdGlvbiBzaG93VHJlbmQoKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgY29uc3QgdGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIlVzZXJPZmZlcnNUYWJsZVwiKTtcbiAgICAgICAgaWYgKHRhYmxlKSB7XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldChcImltYWdlc1wiLCAocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnZlcnRfaW1hZ2VzID0gcmVzdWx0LmltYWdlcztcbiAgICAgICAgICAgICAgICBjb25zdCBsZWdlbmRhX2RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgbGVnZW5kYV9kaXYuaW5uZXJIVE1MID0gXCI8aHI+PHAgY2xhc3M9J2ZvbnQtd2VpZ2h0LWJvbGQnPkUgPSBFeGFjdCBzZXQgLyBMID0gTG93ZXN0IEF2YWlsYmxlIDxicj48c3BhbiBzdHlsZT0nY29sb3I6IGdyZWVuJz5Mb3dlciBwcmljZTwvc3Bhbj4gLyA8c3BhbiBzdHlsZT0nY29sb3I6IHJlZCc+SGlnaGVyIHByaWNlPC9zcGFuPiAvIDxzcGFuIHN0eWxlPSdjb2xvcjogZGFya3Zpb2xldCc+Rm9pbCBbIDxpPm5vdCBzdXBwb3J0ZWQ8L2k+IF08L3NwYW4+IC8gPHNwYW4gY2xhc3M9J2NvbG9yLXByaW1hcnknPlByaWNlIG5vdCBmb3VuZDwvc3BhbjwvcD5cIjtcbiAgICAgICAgICAgICAgICB0YWJsZS5iZWZvcmUobGVnZW5kYV9kaXYpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJvd3MgPSB0YWJsZS5xdWVyeVNlbGVjdG9yQWxsKCdbaWRePWFydGljbGVSb3ddJyk7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCByb3cgb2Ygcm93cykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYXJkX3VybCA9IHJvdy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiY29sLXNlbGxlclwiKVswXS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImFcIilbMF0uaHJlZi5zcGxpdChcIj9cIilbMF0uc3BsaXQoXCIvXCIpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2FyZF9uYW1lID0gKF9hID0gY2FyZF91cmwucG9wKCkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5yZXBsYWNlKC8tVlxcZCsvLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjYXJkX2lkID0gKDAsIHV0aWxpdGllc18xLmdldF9ta21faWQpKHJvdyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmb2lsID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3cucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtb3JpZ2luYWwtdGl0bGU9XCJGb2lsXCJdJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9pbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgUHJvbWlzZS5hbGwoWygwLCBzY3J5ZmFsbF8xLmdldF9jaGVhcGVzdCkoY2FyZF9uYW1lKSwgKDAsIHNjcnlmYWxsXzEuZ2V0X2NhcmRtYXJrZXQpKGNhcmRfaWQpXSkudGhlbihyZXNwb25zZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZSwgX2Y7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2hlYXBlc3QgPSByZXNwb25zZXNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZXhhY3QgPSByZXNwb25zZXNbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwcmljZV9lbGVtID0gcm93LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwcmljZS1jb250YWluZXJcIilbMF0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImZvbnQtd2VpZ2h0LWJvbGRcIilbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW5hbF9wcmljZSA9ICgwLCB1dGlsaXRpZXNfMS5wYXJzZVByaWNlKShwcmljZV9lbGVtLmlubmVySFRNTC5yZXBsYWNlKFwiIOKCrFwiLCBcIlwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwbGF5c2V0X2VsZW0gPSBwcmljZV9lbGVtLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwidGV4dC1tdXRlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwcHUgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBsYXlzZXRfZWxlbS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHB1ID0gKDAsIHV0aWxpdGllc18xLnBhcnNlUFBVKShwbGF5c2V0X2VsZW1bMF0uaW5uZXJIVE1MKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjaGVhcGVzdF9jb2xvciA9IFwiXCIsIGNoZWFwZXN0X3ByaWNlID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBleGFjdF9jb2xvciA9IFwiXCIsIGV4YWN0X3ByaWNlID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaGVhcGVzdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoZWFwZXN0X3ByaWNlID0gcGFyc2VGbG9hdCgoX2IgPSAoX2EgPSBjaGVhcGVzdC5wcmljZXMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5ldXIpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IChfYyA9IGNoZWFwZXN0LnByaWNlcykgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLmV1cl9mb2lsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hlYXBlc3RfcHJpY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hlYXBlc3RfY29sb3IgPSAoZm9pbCA/IFwiZGFya3Zpb2xldFwiIDogY29sb3JfZnJvbV9wcmljZShvcmlnaW5hbF9wcmljZSwgY2hlYXBlc3RfcHJpY2UsIHBwdSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoZWFwZXN0ID0geyBuYW1lOiBcIm5vdF9mb3VuZFwiLCBpZDogLTEgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleGFjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4YWN0X3ByaWNlID0gcGFyc2VGbG9hdCgoX2UgPSAoX2QgPSBleGFjdC5wcmljZXMpID09PSBudWxsIHx8IF9kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZC5ldXIpICE9PSBudWxsICYmIF9lICE9PSB2b2lkIDAgPyBfZSA6IChfZiA9IGV4YWN0LnByaWNlcykgPT09IG51bGwgfHwgX2YgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9mLmV1cl9mb2lsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhhY3RfcHJpY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhhY3RfY29sb3IgPSAoZm9pbCA/IFwiZGFya3Zpb2xldFwiIDogY29sb3JfZnJvbV9wcmljZShvcmlnaW5hbF9wcmljZSwgZXhhY3RfcHJpY2UsIHBwdSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udmVydF9pbWFnZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVwbGFjZUNhbWVyYShyb3csIGV4YWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGFjdCA9IHsgbmFtZTogXCJub3RfZm91bmRcIiwgaWQ6IC0yIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgb3JpZ2luYWxfY29sb3IgPSBjaGVhcGVzdF9jb2xvciAmJiBleGFjdF9jb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlX2VsZW0uaW5uZXJIVE1MID0gXCI8c3BhbiBzdHlsZT0nY29sb3I6IFwiICsgb3JpZ2luYWxfY29sb3IgKyBcIic+XCIgKyBwcmljZV9lbGVtLmlubmVySFRNTCArIFwiPHNwYW4+XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWZvaWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhhY3RfcHJpY2UgPiAwICYmIGNoZWFwZXN0LmlkICE9IGV4YWN0LmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlX2VsZW0uaW5uZXJIVE1MICs9IFwiPGJyPjxzcGFuIHN0eWxlPSdjb2xvcjogXCIgKyBleGFjdF9jb2xvciArIFwiOycgPkUgPC9zcGFuPjxhIHN0eWxlPSdjb2xvcjogYmxhY2snIGhyZWY9J1wiICsgZXhhY3Quc2NyeWZhbGxfdXJpICsgXCInPiBcIiArIGV4YWN0X3ByaWNlLnRvTG9jYWxlU3RyaW5nKFwiaXQtSVRcIiwgeyBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IDIgfSkgKyBcIiDigqw8L2E+XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaGVhcGVzdF9wcmljZSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2VfZWxlbS5pbm5lckhUTUwgKz0gXCI8YnI+PHNwYW4gc3R5bGU9J2NvbG9yOiBcIiArIGNoZWFwZXN0X2NvbG9yICsgXCI7Jz5cIiArIChjaGVhcGVzdC5pZCA9PSBleGFjdC5pZCA/IFwiRT1cIiA6IFwiXCIpICsgXCJMIDwvc3Bhbj48YSBzdHlsZT0nY29sb3I6IGJsYWNrJyBocmVmPSdcIiArIGNoZWFwZXN0LnNjcnlmYWxsX3VyaSArIFwiJz4gXCIgKyBjaGVhcGVzdF9wcmljZS50b0xvY2FsZVN0cmluZyhcIml0LUlUXCIsIHsgbWluaW11bUZyYWN0aW9uRGlnaXRzOiAyIH0pICsgXCIg4oKsPC9hPlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmV4cG9ydHMuc2hvd1RyZW5kID0gc2hvd1RyZW5kO1xuZnVuY3Rpb24gY29sb3JfZnJvbV9wcmljZShvbGRfcHJpY2UsIG5ld19wcmljZSwgcHB1KSB7XG4gICAgaWYgKChwcHUgPiAwICYmIHBwdSA+IG5ld19wcmljZSkgfHwgb2xkX3ByaWNlID4gbmV3X3ByaWNlKSB7XG4gICAgICAgIHJldHVybiBcInJlZFwiO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFwiZ3JlZW5cIjtcbiAgICB9XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5zYXZlQWxsVXJscyA9IGV4cG9ydHMuYWRkUHJpbnRMaXN0QnV0dG9uID0gdm9pZCAwO1xuY29uc3Qgc2NyeWZhbGxfMSA9IHJlcXVpcmUoXCIuLi8uLi9jb21tb24vc2NyeWZhbGxcIik7XG5jb25zdCB1dGlsaXRpZXNfMSA9IHJlcXVpcmUoXCIuLi8uLi9jb21tb24vdXRpbGl0aWVzXCIpO1xuY29uc3QgdXRpbGl0aWVzXzIgPSByZXF1aXJlKFwiLi4vdXRpbGl0aWVzXCIpO1xuZnVuY3Rpb24gYWRkUHJpbnRMaXN0QnV0dG9uKCkge1xuICAgIHZhciBfYTtcbiAgICBjb25zdCB0YWJsZSA9IChfYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiV2FudHNMaXN0VGFibGVcIikpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRib2R5XCIpWzBdO1xuICAgIGlmICh0YWJsZSkge1xuICAgICAgICBjb25zdCBidG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiYVtocmVmJD0nQWRkRGVja0xpc3QnXVwiKVswXTsgLy8gJD0gLS0+IGVuZGluZyB3aXRoXG4gICAgICAgIGJ0bi5jbGFzc0xpc3QuYWRkKFwibXItM1wiKTtcbiAgICAgICAgY29uc3QgcHJpbnRCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBwcmludEJ0bi5jbGFzc0xpc3QuYWRkKFwiYnRuXCIpO1xuICAgICAgICBwcmludEJ0bi5zdHlsZS5jb2xvciA9IFwicmdiKDI0MCwgMTczLCA3OClcIjtcbiAgICAgICAgcHJpbnRCdG4uc3R5bGUuYm9yZGVyQ29sb3IgPSBcInJnYigyNDAsIDE3MywgNzgpXCI7XG4gICAgICAgIHByaW50QnRuLmlubmVySFRNTCA9IFwiPHNwYW4+U2F2ZSBhcy4uLjwvc3Bhbj5cIjtcbiAgICAgICAgcHJpbnRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KCdwcmludFZlcnNpb24nLCAoZGF0YSkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgICAgICBjb25zdCB3YW50c190aXRsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwYWdlLXRpdGxlLWNvbnRhaW5lclwiKVswXS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImgxXCIpWzBdLmlubmVySFRNTDtcbiAgICAgICAgICAgICAgICBsZXQgbGlzdCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJpbnRWZXJzaW9uID0gKF9hID0gZGF0YS5wcmludFZlcnNpb24pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmIChwcmludFZlcnNpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCByb3cgb2YgdGFibGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIm5hbWVcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuYW1lID0gcm93LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYVwiKVswXS5pbm5lckhUTUw7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0ICs9IG5hbWUgKyBcIlxcblwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiB0YWJsZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRyXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjYXJkX2lkID0gKDAsIHV0aWxpdGllc18yLmdldF9ta21faWQpKHJvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FyZF9pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHlpZWxkICgwLCBzY3J5ZmFsbF8xLmdldF9jYXJkbWFya2V0KShjYXJkX2lkKS50aGVuKChjYXJkKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfYjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdCArPSAoKF9iID0gY2FyZC5uYW1lKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBcIlwiKSArIFwiXFxuXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICgwLCB1dGlsaXRpZXNfMS5zYXZlV2l0aEZpbGVQaWNrZXIpKG5ldyBCbG9iKFtsaXN0XSksIHdhbnRzX3RpdGxlID8gd2FudHNfdGl0bGUgKyBcIi50eHRcIiA6IFwid2FudHMudHh0XCIpO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9KTtcbiAgICAgICAgYnRuLmFmdGVyKHByaW50QnRuKTtcbiAgICB9XG59XG5leHBvcnRzLmFkZFByaW50TGlzdEJ1dHRvbiA9IGFkZFByaW50TGlzdEJ1dHRvbjtcbmZ1bmN0aW9uIHNhdmVBbGxVcmxzKCkge1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbXCJ1cmxzXCJdLCAocmVzdWx0KSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIGxldCBzYXZlZF91cmxzID0gKF9hID0gcmVzdWx0LnVybHMpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IFtdO1xuICAgICAgICBjb25zdCByb3dzID0gKF9iID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJXYW50c0xpc3RUYWJsZVwiKSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGJvZHlcIilbMF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0clwiKTtcbiAgICAgICAgaWYgKHJvd3MpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qgcm93IG9mIHJvd3MpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjYXJkX3VybCA9ICgwLCB1dGlsaXRpZXNfMi5nZXRfbWttX3VybCkocm93KTtcbiAgICAgICAgICAgICAgICBpZiAoY2FyZF91cmwgJiYgY2FyZF91cmwuaW5jbHVkZXMoXCIvUHJvZHVjdHMvU2luZ2xlcy9cIikpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2FyZF9pZCA9ICgwLCB1dGlsaXRpZXNfMi5nZXRfbWttX2lkKShyb3cpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2FyZF9pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgeWllbGQgKDAsIHNjcnlmYWxsXzEuZ2V0X2NhcmRtYXJrZXQpKGNhcmRfaWQpLnRoZW4oKGNhcmQpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FyZC5uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzYXZlZF91cmxzLmZpbHRlcigodSkgPT4gdS5ta21faWQgPT0gY2FyZF9pZCkubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVkX3VybHMucHVzaCh7IG5hbWU6IGNhcmQubmFtZSwgbWttX2lkOiBjYXJkX2lkLCB1cmw6IGNhcmRfdXJsIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgXCJ1cmxzXCI6IHNhdmVkX3VybHMgfSk7XG4gICAgICAgIH1cbiAgICB9KSk7XG59XG5leHBvcnRzLnNhdmVBbGxVcmxzID0gc2F2ZUFsbFVybHM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMucmVwbGFjZUNhbWVyYSA9IGV4cG9ydHMucGFyc2VQUFUgPSBleHBvcnRzLnBhcnNlUHJpY2UgPSBleHBvcnRzLmdldF9ta21fdXJsID0gZXhwb3J0cy5nZXRfbWttX3ZlcnNpb24gPSBleHBvcnRzLmdldF9ta21faWQgPSB2b2lkIDA7XG5mdW5jdGlvbiBnZXRfbWttX2lkKHJvdykge1xuICAgIHZhciBfYSwgX2I7XG4gICAgcmV0dXJuICgoX2IgPSAoX2EgPSByb3cuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImZvbnRpY29uLWNhbWVyYVwiKVswXSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmdldEF0dHJpYnV0ZShcImRhdGEtb3JpZ2luYWwtdGl0bGVcIikpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5zcGxpdCgvXFwuanBnL2cpWzBdLnNwbGl0KFwiL1wiKS5zcGxpY2UoLTEpWzBdKSB8fCBcIlwiO1xufVxuZXhwb3J0cy5nZXRfbWttX2lkID0gZ2V0X21rbV9pZDtcbmZ1bmN0aW9uIGdldF9ta21fdmVyc2lvbihyb3cpIHtcbiAgICB2YXIgX2EsIF9iO1xuICAgIGNvbnN0IGFsdCA9ICgoX2IgPSAoX2EgPSByb3cuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImZvbnRpY29uLWNhbWVyYVwiKVswXSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmdldEF0dHJpYnV0ZShcImRhdGEtb3JpZ2luYWwtdGl0bGVcIikpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5tYXRjaCgvYWx0PVxcXCIoLio/KVxcXCIvKVsxXSkgfHwgXCJcIjtcbiAgICBjb25zdCB2ZXJzaW9uID0gYWx0Lm1hdGNoKC9cXChWXFwuKC4qPylcXCkvKTtcbiAgICByZXR1cm4gdmVyc2lvbiAhPSBudWxsID8gdmVyc2lvblsxXSA6IFwiXCI7XG59XG5leHBvcnRzLmdldF9ta21fdmVyc2lvbiA9IGdldF9ta21fdmVyc2lvbjtcbmZ1bmN0aW9uIGdldF9ta21fdXJsKHJvdykge1xuICAgIHZhciBfYSwgX2I7XG4gICAgcmV0dXJuIChfYiA9IChfYSA9IHJvdy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwibmFtZVwiKVswXSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYVwiKVswXSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmhyZWYuc3BsaXQoXCI/XCIpWzBdO1xufVxuZXhwb3J0cy5nZXRfbWttX3VybCA9IGdldF9ta21fdXJsO1xuZnVuY3Rpb24gcGFyc2VQcmljZShwcmljZSkge1xuICAgIHJldHVybiBwYXJzZUZsb2F0KHByaWNlLnJlcGxhY2UoXCIuXCIsIFwiXCIpLm1hdGNoKC9cXGQrXFwsXFxkKy8pWzBdLnJlcGxhY2UoXCIsXCIsIFwiLlwiKSk7XG59XG5leHBvcnRzLnBhcnNlUHJpY2UgPSBwYXJzZVByaWNlO1xuZnVuY3Rpb24gcGFyc2VQUFUocHB1KSB7XG4gICAgcmV0dXJuIHBhcnNlRmxvYXQocHB1Lm1hdGNoKC9cXGQqXFwuP1xcZCsoXFwsXFxkKyk/L2cpWzBdLnJlcGxhY2UoXCIuXCIsIFwiXCIpLnJlcGxhY2UoXCIsXCIsIFwiLlwiKSk7XG59XG5leHBvcnRzLnBhcnNlUFBVID0gcGFyc2VQUFU7XG5mdW5jdGlvbiByZXBsYWNlQ2FtZXJhKHJvdywgY2FyZCwgbXVsLCBtYXhfaGVpZ2h0ID0gMCkge1xuICAgIHZhciBfYTtcbiAgICBsZXQgc3JjO1xuICAgIGlmIChjYXJkKSB7XG4gICAgICAgIGlmIChjYXJkLmltYWdlX3VyaXMpIHtcbiAgICAgICAgICAgIHNyYyA9IGNhcmQuaW1hZ2VfdXJpcy5hcnRfY3JvcDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjYXJkLmNhcmRfZmFjZXMpIHtcbiAgICAgICAgICAgIHNyYyA9IGNhcmQuY2FyZF9mYWNlc1swXS5pbWFnZV91cmlzLmFydF9jcm9wO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc3JjID0gXCJcIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBzcGFuID0gcm93LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJmb250aWNvbi1jYW1lcmFcIilbMF07XG4gICAgY29uc3QgY2FyZF9pbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgIGNhcmRfaW1nLnNyYyA9IHNyYztcbiAgICBjYXJkX2ltZy5zdHlsZS53aWR0aCA9IFwiYXV0b1wiO1xuICAgIGNvbnN0IGhlaWdodCA9IG1heF9oZWlnaHQgIT0gMCA/IG1heF9oZWlnaHQgOiAoKChfYSA9IHNwYW4ucGFyZW50RWxlbWVudCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm9mZnNldEhlaWdodCkgfHwgMCk7XG4gICAgY2FyZF9pbWcuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICE9IDAgPyAoaGVpZ2h0ICogbXVsKS50b1N0cmluZygpICsgXCJweFwiIDogXCIxMTAlXCI7XG4gICAgc3Bhbi5jbGFzc0xpc3QucmVtb3ZlKFwiZm9udGljb24tY2FtZXJhXCIpO1xuICAgIHNwYW4uYXBwZW5kQ2hpbGQoY2FyZF9pbWcpO1xuICAgIHJldHVybiBzcGFuO1xufVxuZXhwb3J0cy5yZXBsYWNlQ2FtZXJhID0gcmVwbGFjZUNhbWVyYTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcImNhcmRtYXJrZXQvY29udGVudF9zY3JpcHRcIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rYm9yaXNcIl0gPSBzZWxmW1wid2VicGFja0NodW5rYm9yaXNcIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvclwiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9jYXJkbWFya2V0L2NvbnRlbnRfc2NyaXB0LnRzXCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
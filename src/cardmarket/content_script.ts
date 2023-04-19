import { showTrend } from "./pages/Users";
import { addCheckboxes, addLinkToSingles } from "./pages/Singles";
import { addDisclaimer, addLinkToCards } from "./pages/ShoppingWizard";
import { addPrintListButton, saveAllUrls } from "./pages/Wants";
import { addImages } from "./pages/Product";

if (window.location.pathname.includes("Magic/Users")) {
    showTrend();
    addImages();
}

if (window.location.pathname.includes("Products/Singles/")) {
    addLinkToSingles();
    addCheckboxes();
}

if (/\S+\/Products\/(Singles\/?[^\/]*\/?$|Search\/?)/.test(window.location.pathname)) {
    addImages();
}

if (window.location.pathname.includes("Cards/")) {
    addLinkToSingles();
}

if (window.location.pathname.includes("ShoppingWizard/Results")) {
    addLinkToSingles();
    if (window.location.pathname.includes("/Magic/Wants")) {
        chrome.storage.sync.get('shoppingWizard', (data) => {
            if (data.shoppingWizard as boolean | undefined) {
                addDisclaimer();
                addLinkToCards();
            }
        })
    }
}

if (/\S+\/Wants\/\d+/.test(window.location.pathname)) {
    addPrintListButton();
    if (window.location.pathname.includes("/Magic/Wants")) {
        saveAllUrls();
        // TODO add images to wants list?
    }
}

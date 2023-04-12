import { showTrend } from "./pages/Users";
import { addCheckboxes, addLinkToSingles } from "./pages/Singles";
import { addDisclaimer, addLinkToCards } from "./pages/ShoppingWizard";
import { addPrintListButton, saveAllUrls } from "./pages/Wants";

if (window.location.pathname.includes("Users")) {
    showTrend();
}

if (window.location.pathname.includes("Products/Singles")) {
    addLinkToSingles();
    addCheckboxes();
}

if (window.location.pathname.includes("Cards/")) {
    addLinkToSingles();
}

if (window.location.pathname.includes("ShoppingWizard/Results")) {
    addLinkToSingles();
    chrome.storage.sync.get('shoppingWizard', (data) => {
        if (data.shoppingWizard as boolean | undefined) {
            addDisclaimer();
            addLinkToCards();
        }
    })
}

if (/\S+\/Wants\/\d+/.test(window.location.pathname)) {
    addPrintListButton();
    saveAllUrls();
}

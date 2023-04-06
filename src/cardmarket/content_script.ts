import { showTrend } from "./pages/Users";
import { addCheckboxes, addLinkToSingles } from "./pages/Singles";
import { addLinkToCards } from "./pages/ShoppingWizard";

if (window.location.pathname.includes("Users")) {
    showTrend();
}

if (window.location.pathname.includes("Products/Singles")) {
    addLinkToSingles();
    addCheckboxes();
}

if (window.location.pathname.includes("ShoppingWizard/Results")) {
    addLinkToCards();
}

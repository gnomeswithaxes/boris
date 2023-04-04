import { showTrend } from "./pages/Users";
import { addLinkToSingles } from "./pages/Singles";
import { addLinkToCards } from "./pages/ShoppingWizard";

if (window.location.pathname.includes("Users")) {
    showTrend();
}

if (window.location.pathname.includes("Products/Singles")) {
    addLinkToSingles();
}

if (window.location.pathname.includes("ShoppingWizard/Results")) {
    addLinkToCards();
}

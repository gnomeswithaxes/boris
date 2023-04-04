import { ISavedList } from "../common/interfaces";

export function navButtonFactory(text: string): Element {
    const li = document.createElement("li");
    li.classList.add("nav-item");
    li.style.padding = "0.5em"

    const a = document.createElement("a")
    a.classList.add("nav-link");
    a.innerHTML = text;
    a.href = "javascript:void(0)";

    li.appendChild(a);

    return li;
}

function totalFactory(total: number, boris_class: string) {
    const div = document.createElement("div");
    div.classList.add("deck-price-v2", boris_class);
    const locale_total = total.toLocaleString("en-us", { minimumFractionDigits: 2 }).split(".")
    div.innerHTML = " €&nbsp;" + locale_total[0] + "<span class='cents'>." + locale_total[1] + "</span>";
    return div;
}

export function setTotal(total: number) {
    document.querySelector(".boris-price")?.remove()

    const price_div = totalFactory(total, "boris-price");
    document.head.insertAdjacentHTML("beforeend", `<style>.boris-price:before {content: "Boris";}</style>`);
    price_div.style.color = "#f0ad4e";

    document.querySelector(".header-prices-boris")?.prepend(price_div);
}

export function setCheapestTotal(total: number) {
    document.querySelector(".boris-cheapest")?.remove()

    const price_div = totalFactory(total, "boris-cheapest");
    document.head.insertAdjacentHTML("beforeend", `<style>.boris-cheapest:before {content: "Cheapest";}</style>`);
    price_div.style.color = "darkviolet";

    document.querySelector(".header-prices-boris")?.prepend(price_div);
}

export function newDropdownItem(list: ISavedList, deleteFunction: Function) {
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

    div.appendChild(deleter)
    div.appendChild(link)

    return div;
}

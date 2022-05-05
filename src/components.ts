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

export function totalFactory(total: number, boris_class: string) {
    const div = document.createElement("div");
    div.classList.add("deck-price-v2", boris_class);
    const locale_total = total.toLocaleString("en-us", { minimumFractionDigits: 2 }).split(".")
    div.innerHTML = " €&nbsp;" + locale_total[0] + "<span class='cents'>." + locale_total[1] + "</span>";
    return div;
}

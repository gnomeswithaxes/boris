import { ISavedList } from "./interfaces";

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

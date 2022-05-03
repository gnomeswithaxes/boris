import { navButtonFactory } from "./components";
import { ISavedList, IScryfallCard } from "./interfaces";
import { fetch_cards, fetch_single, getPrintableListBlob, getTitle, parse_row } from "./utilities";

let page_values = {
  total: 0,
  sizeToggle: true
}

function toggleSaveDeck() {
  borisSaveDeckButton.remove();
  borisNav.appendChild(borisRemoveDeckButton);
  borisRemoveDeckButton.addEventListener("click", () => {
    chrome.storage.sync.get('saved_lists', (result) => {
      const url = window.location.href

      const list = result.saved_lists.filter((l: ISavedList) => l.url !== url);
      if (!list.length)
        document.getElementById("saved-lists-dropdown")?.remove();

      chrome.storage.sync.set({ saved_lists: list });
      borisNav.appendChild(borisSaveDeckButton);
      borisSaveDeckButton.addEventListener("click", addToSavedDecksList);
      borisRemoveDeckButton.remove();
      updateSavedListsDropdown();
    })
  })
}

function updateSavedListsDropdown() {
  chrome.storage.sync.get('saved_lists', (result) => {
    if (result.saved_lists?.length > 0) {

      if (result.saved_lists.filter((l: ISavedList) => l.url === window.location.href).length) {
        toggleSaveDeck();
      }

      document.getElementById("saved-lists-dropdown")?.remove();

      const li = document.createElement("li");
      li.style.padding = "0.5em"
      li.id = "saved-lists-dropdown";
      li.classList.add("dropdown", "nav-item");

      const a = document.createElement("a")
      a.classList.add("nav-link", "dropdown-toggle");
      a.innerHTML = "Saved Lists";
      a.href = "#";
      a.setAttribute("data-toggle", "dropdown");

      const div = document.createElement("div");
      div.classList.add("dropdown-menu");

      result.saved_lists.forEach((l: ISavedList) => {
        const e = document.createElement("a");
        e.classList.add("dropdown-item");
        e.innerHTML = l.title;
        e.href = l.url;
        div.appendChild(e);
      });

      li.appendChild(a);
      li.appendChild(div);

      borisNav.appendChild(li);
    }
  })
}

function convert_price(row: any, card: IScryfallCard) {
  const eur_price = parseFloat(card.prices?.eur ?? 0) * row.amount;
  const card_uri = card.purchase_uris.cardmarket ?? card.scryfall_uri

  row.price.innerHTML =
    "<a style='color: inherit;' href=\"" + card_uri + "\">" +
    "<span class='boris-usd-price'" + (!page_values.sizeToggle ? " style='font-size: 0'" : "") + ">" + row.price.innerHTML + "</span>" +
    "<span class='boris-eur-price'" + (page_values.sizeToggle ? " style='font-size: 0'" : "") + "> €&nbsp;" + eur_price.toLocaleString("en-us", { minimumFractionDigits: 2 }) + "</span>" +
    "</a>";

  page_values.total += eur_price;
}

function convert_prices(card_list: IScryfallCard[]) {
  document.querySelector("table.deck-view-deck-table")?.querySelectorAll("tr:not(.deck-category-header)").forEach((e, i) => {
    const row = parse_row(e.querySelectorAll("td"));
    let card: IScryfallCard | undefined = card_list.find(c => c.name.toLowerCase().includes(row.name.toLowerCase()));

    if (card)
      convert_price(row, card)
    else
      fetch_single(row.name).then((card: IScryfallCard) => {
        if (card.purchase_uris.cardmarket)
          convert_price(row, card)
        else
          row.price.innerHTML = "<span style='color: orange''>" + row.price.innerHTML + "</span>"
      })
  })
}

function set_total(total: number) {
  document.querySelector(".boris-price")?.remove()

  const price_div = document.createElement("div");
  price_div.classList.add("deck-price-v2", "boris-price");
  const locale_total = total.toLocaleString("en-us", { minimumFractionDigits: 2 }).split(".")
  price_div.innerHTML = " €&nbsp;" + locale_total[0] + "<span class='cents'>." + locale_total[1] + "</span>";

  document.head.insertAdjacentHTML("beforeend", `<style>.boris-price:before {content: "Boris";}</style>`);

  document.querySelector(".header-prices-currency")?.prepend(price_div);
}

const togglePrices = () => {
  if (page_values.sizeToggle)
    document.querySelectorAll(".boris").forEach(e => {
      e.querySelector("span.boris-usd-price")?.setAttribute("style", "font-size: 0");
      e.querySelector("span.boris-eur-price")?.setAttribute("style", "font-size: ");

      borisToggleButton.classList.remove("btn-online-muted");
      borisToggleButton.classList.add("btn-online");
    });
  else {
    document.querySelectorAll(".boris").forEach(e => {
      e.querySelector("span.boris-usd-price")?.setAttribute("style", "font-size: ");
      e.querySelector("span.boris-eur-price")?.setAttribute("style", "font-size: 0");
      borisToggleButton.classList.remove("btn-online");
      borisToggleButton.classList.add("btn-online-muted");
    });
  }
  page_values.sizeToggle = !page_values.sizeToggle;
};

const copyToClipboard = async () => {
  borisToClipboardButton.children[0].classList.add("btn-paper");
  navigator.clipboard.writeText(await (await getPrintableListBlob())?.text() ?? "").then(() => {
    borisToClipboardButton.children[0].classList.remove("btn-paper")
  })
}

declare global { interface Window { showSaveFilePicker?: any; } }
const saveToCockatrice = async () => {
  let title = getTitle()?.split("<")[0].trim().replace(/[^a-z A-Z]+/, '') + ".txt";
  const blob = getPrintableListBlob();
  if (blob) {
    blob.then(async blob => {
      let handler: any = await window.showSaveFilePicker({
        suggestedName: title ?? "",
        types: [{
          description: 'Text file',
          accept: { 'text/plain': ['.txt'] },
        }],
      });
      const writable = await handler.createWritable();
      await writable.write(blob);
      writable.close();
    })
  }
}

const addToSavedDecksList = () => {
  chrome.storage.sync.get('saved_lists', (result) => {
    if (result.saved_lists)
      var savedLists: ISavedList[] = result.saved_lists;
    else
      var savedLists: ISavedList[] = []

    const url = window.location.href;
    if (!savedLists.filter(u => u.url === url).length) {
      const format_text = document.querySelector("p.deck-container-information")?.innerHTML!;
      const format = format_text.slice(format_text.search("Format: ") + 8, format_text.search("<br>"))
      savedLists.push({ url: url, title: ("<strong>" + format + "</strong> | " ?? "") + getTitle() ?? url })
    }

    chrome.storage.sync.set({ saved_lists: savedLists.sort((a, b) => a.title.localeCompare(b.title)) }, () => updateSavedListsDropdown());
  });
}

fetch_cards().then((list) => {
  convert_prices(list);
  set_total(page_values.total);
  togglePrices();
})

const borisNav = document.createElement("ul");
borisNav.classList.add("nav", "nav-pills", "deck-type-menu");
borisNav.style.justifyContent = "start"

const borisToggleOuterButton = navButtonFactory("Boris");
const borisToggleButton = borisToggleOuterButton.children[0];
borisToggleButton.classList.add("btn-online-muted");
const borisToClipboardButton = navButtonFactory("Copy");
const borisCockatriceButton = navButtonFactory("Cockatrice");
const borisSaveDeckButton = navButtonFactory("Save");
const borisRemoveDeckButton = navButtonFactory("Saved");
borisRemoveDeckButton.classList.add("show");

borisNav.appendChild(borisToggleOuterButton);
borisNav.appendChild(borisToClipboardButton);
borisNav.appendChild(borisCockatriceButton);
borisNav.appendChild(borisSaveDeckButton);
updateSavedListsDropdown();

document.querySelector("ul.deck-type-menu")?.after(borisNav);

borisToggleButton.addEventListener("click", togglePrices);
borisToClipboardButton.addEventListener("click", copyToClipboard);
borisCockatriceButton.addEventListener("click", saveToCockatrice)
borisSaveDeckButton.addEventListener("click", addToSavedDecksList);

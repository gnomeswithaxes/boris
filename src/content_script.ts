import { navButtonFactory, newDropdownItem, setCheapestTotal, setTotal } from "./components";
import { ISavedList, IScryfallCard } from "./interfaces";
import { fetch_cards, fetch_cheapest, fetch_single, get_cheapest, get_printable_list_blob, get_title, parse_row } from "./utilities";

let page_values = {
  total: 0,
  sizeToggle: true,
  card_list: [] as IScryfallCard[],
}

function removeSavedList(to_delete: string) {
  chrome.storage.sync.get('saved_lists', (result) => {
    if (to_delete === window.location.href) {
      borisNav.appendChild(borisSaveDeckButton);
      borisSaveDeckButton.addEventListener("click", addToSavedDecksList);
      borisRemoveDeckButton.remove();
    }

    const list = result.saved_lists.filter((l: ISavedList) => l.url !== to_delete);

    if (!list.length)
      document.getElementById("saved-lists-dropdown")?.remove();

    chrome.storage.sync.set({ saved_lists: list }, () => updateSavedListsDropdown());
  })
}

function toggleSaveDeck() {
  borisSaveDeckButton.remove();
  borisNav.appendChild(borisRemoveDeckButton);
  borisRemoveDeckButton.addEventListener("click", () => removeSavedList(window.location.href))
}

function updateSavedListsDropdown() {
  chrome.storage.sync.get('saved_lists', (result) => {
    if (result.saved_lists?.length > 0) {

      if (result.saved_lists.filter((l: ISavedList) => l.url === window.location.href).length) {
        toggleSaveDeck();
      }

      document.getElementById("saved-lists-dropdown")?.remove();

      const li = document.createElement("li");
      li.style.padding = "0.5em";
      li.id = "saved-lists-dropdown";
      li.classList.add("dropdown", "nav-item");

      const a = document.createElement("a");
      a.classList.add("nav-link", "dropdown-toggle");
      a.innerHTML = "Saved Lists";
      a.href = "#";
      a.setAttribute("data-toggle", "dropdown");

      const div = document.createElement("div");
      div.classList.add("dropdown-menu");

      document.head.insertAdjacentHTML("beforeend", `<style>.dropdown-item:hover, .dropdown-item:focus { background-color: #d6d6d6; }</style>`);

      for (const list of result.saved_lists) {
        div.appendChild(newDropdownItem(list, removeSavedList));
      }

      li.appendChild(a);
      li.appendChild(div);

      borisNav.appendChild(li);
    }
  })
}

async function convertPrice(row: any, card: IScryfallCard) {
  let eur_price;
  if (!(card.prices?.eur || card.prices?.eur_foil)) {
    const cheap = await get_cheapest(card.name);
    eur_price = parseFloat(cheap.prices?.eur ?? cheap.prices?.eur_foil) * row.amount;
  } else {
    eur_price = parseFloat(card.prices?.eur ?? card.prices?.eur_foil) * row.amount;
  }

  const card_uri = card.purchase_uris.cardmarket ?? card.scryfall_uri

  row.price.innerHTML =
    "<a style='color: inherit;' href=\"" + card_uri + "\">" +
    "<span class='boris-usd-price'" + (!page_values.sizeToggle ? " style='font-size: 0'" : "") + ">" + row.price.innerHTML + "</span>" +
    "<span class='boris-eur-price' " + (page_values.sizeToggle ? " style='font-size: 0'" : "") + "> €&nbsp;" + eur_price.toLocaleString("en-us", { minimumFractionDigits: 2 }) + "</span>" +
    "</a>";

  page_values.total += eur_price;
}

async function convertAllPrices() {
  const card_list = page_values.card_list;
  const table_rows = document.querySelector("table.deck-view-deck-table")?.querySelectorAll("tr:not(.deck-category-header)");
  if (table_rows?.length) {
    for (const tr of table_rows) {
      const row = parse_row(tr.querySelectorAll("td"));
      let card: IScryfallCard | undefined = card_list.find(c => c.name.toLowerCase().includes(row.name.toLowerCase()));
      if (card) {
        if (card.border_color === "gold") {
          card = await get_cheapest(card.name);
        }
        convertPrice(row, card!)
      } else {
        row.price.innerHTML = "<span style='color: orange''>" + row.price.innerHTML + "</span>"
      }
    }
  }
}

async function addCheapestPrices() {
  borisCheapestButton.remove();

  if (page_values.card_list.length) {
    await Promise.all(page_values.card_list.map((card) => get_cheapest(card.name))).then((cheapest_cards) => {
      let card_list: IScryfallCard[] = [];
      for (const c of cheapest_cards) {
        card_list.push(c);
      }

      document.querySelectorAll("tr.deck-category-header>th").forEach((th) => (th as HTMLTableCellElement).colSpan = 5);
      let total = 0;

      for (const e of document.querySelectorAll(".boris")) {
        const row_element = e.parentElement!
        const row = parse_row(row_element.querySelectorAll("td"));
        let card: IScryfallCard | undefined = card_list.find(c => c.name?.toLowerCase().includes(row.name.toLowerCase()));
        const td = document.createElement("td");
        td.classList.add("text-right");
        if (card) {
          const eur_price = parseFloat((card.prices?.eur ?? card.prices?.eur_foil) ?? 0) * row.amount;
          const card_uri = card.scryfall_uri ?? "javascript:void(0)";
          total += eur_price;

          td.innerHTML =
            "<a style='color: darkviolet;' href=\"" + card_uri + "\">" +
            "<span> €&nbsp;" + eur_price.toLocaleString("en-us", { minimumFractionDigits: 2 }) + "</span></a>"
        } else {
          td.innerHTML = "<span style='color: orange;'> €&nbsp;XX.XX </span>"
        }
        row_element.appendChild(td)
      }
      setCheapestTotal(total);
    })
  }
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
  navigator.clipboard.writeText(await (await get_printable_list_blob())?.text() ?? "").then(() => {
    borisToClipboardButton.children[0].classList.remove("btn-paper")
  })
}

declare global { interface Window { showSaveFilePicker?: any; } }
const saveToCockatrice = async () => {
  let title = get_title()?.split("<")[0].trim().replace(/[^a-z A-Z]+/, '') + ".txt";
  const blob = get_printable_list_blob();
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
      savedLists.push({ url: url, title: ("<strong>" + format + "</strong> | " ?? "") + get_title() ?? url })
    }

    chrome.storage.sync.set({ saved_lists: savedLists.sort((a, b) => a.title.localeCompare(b.title)) }, () => updateSavedListsDropdown());
  });
}

const borisPrices = document.createElement("div");
borisPrices.classList.add("header-prices-boris", "header-prices-currency");

const borisNav = document.createElement("ul");
borisNav.classList.add("nav", "nav-pills", "deck-type-menu");
borisNav.style.justifyContent = "start"

const borisToggleOuterButton = navButtonFactory("Boris");
const borisToggleButton = borisToggleOuterButton.children[0];
borisToggleButton.classList.add("btn-online-muted");
const borisToClipboardButton = navButtonFactory("Copy");
const borisCockatriceButton = navButtonFactory("Cockatrice");
const borisCheapestButton = navButtonFactory("Cheapest");
const borisSaveDeckButton = navButtonFactory("Save");
const borisRemoveDeckButton = navButtonFactory("Saved");
borisRemoveDeckButton.classList.add("show");

document.querySelector("div.header-prices-currency")?.after(borisPrices);
document.querySelector("ul.deck-type-menu")?.after(borisNav);

fetch_cards().then(async (list) => {
  page_values.card_list = list;
  await convertAllPrices();
  setTotal(page_values.total);
  togglePrices();
}).then(() => {
  if (chrome.runtime?.id)
    chrome.storage.sync.get(['auto'], (data) => {
      data.auto ? addCheapestPrices() : chrome.storage.sync.set({ auto: false });
    });


  updateSavedListsDropdown();
  borisNav.appendChild(borisToggleOuterButton);
  borisToggleButton.addEventListener("click", togglePrices);
  borisNav.appendChild(borisToClipboardButton);
  borisToClipboardButton.addEventListener("click", copyToClipboard);
  borisNav.appendChild(borisCockatriceButton);
  borisCockatriceButton.addEventListener("click", saveToCockatrice)
  borisNav.appendChild(borisCheapestButton);
  borisCheapestButton.addEventListener("click", addCheapestPrices)
  borisNav.appendChild(borisSaveDeckButton);
  borisSaveDeckButton.addEventListener("click", addToSavedDecksList);
});

// TODO controllo prezzo foil più basso => colore diverso
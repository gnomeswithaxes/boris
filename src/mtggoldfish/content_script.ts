import { get_cheapest, fetch_cards } from "../common/scryfall";
import { navButtonFactory, newDropdownItem, setCheapestTotal, setTotal } from "./components";
import { IPinnedList, IScryfallCard } from "../common/interfaces";
import { get_printable_list_blob, get_title, parse_row, saveToPC } from "./utilities";
import { sleep } from "../common/utilities";

let page_values = {
  total: 0,
  sizeToggle: true,
  card_list: [] as IScryfallCard[],
}

let borisPrices: any;
let borisNav: any;
let borisToggleOuterButton: any;
let borisToggleButton: any;
let borisToClipboardButton: any;
let borisSaveAsButton: any;
let borisCheapestButton: any;
let borisPinDeckButton: any;
let borisUnpinDeckButton: any;

function removePinnedList(to_delete: string) {
  chrome.storage.sync.get('pinned_lists', (result) => {
    if (to_delete === window.location.href) {
      borisNav.appendChild(borisPinDeckButton);
      borisPinDeckButton.addEventListener("click", addToPinnedDecksList);
      borisUnpinDeckButton.remove();
    }

    const list = result.pinned_lists.filter((l: IPinnedList) => l.url !== to_delete);

    if (!list.length)
      document.getElementById("saved-lists-dropdown")?.remove();

    chrome.storage.sync.set({ pinned_lists: list }, () => updatePinnedListsDropdown());
  })
}

function togglePinDeck() {
  borisPinDeckButton.remove();
  borisNav.appendChild(borisUnpinDeckButton);
  borisUnpinDeckButton.addEventListener("click", () => removePinnedList(window.location.href))
}

function updatePinnedListsDropdown() {
  chrome.storage.sync.get('pinned_lists', (result) => {
    if (result.pinned_lists?.length > 0) {

      if (result.pinned_lists.filter((l: IPinnedList) => l.url === window.location.href).length) {
        togglePinDeck();
      }

      document.getElementById("saved-lists-dropdown")?.remove();

      const li = document.createElement("li");
      li.style.padding = "0.5em";
      li.id = "saved-lists-dropdown";
      li.classList.add("dropdown", "nav-item");

      const a = document.createElement("a");
      a.classList.add("nav-link", "dropdown-toggle");
      a.innerHTML = "Pinned Lists";
      a.href = "#";
      a.setAttribute("data-toggle", "dropdown");

      const div = document.createElement("div");
      div.classList.add("dropdown-menu");

      document.head.insertAdjacentHTML("beforeend", `<style>.dropdown-item:hover, .dropdown-item:focus { background-color: #d6d6d6; }</style>`);

      for (const list of result.pinned_lists) {
        div.appendChild(newDropdownItem(list, removePinnedList));
      }

      li.appendChild(a);
      li.appendChild(div);

      borisNav.appendChild(li);
    }
  })
}

async function convertPrice(row: any, card: IScryfallCard) {
  let eur_price;
  if ((card.prices?.eur === null && card.prices?.eur_foil === null) || card.border_color === "gold") {
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
      if (row) {
        let card: IScryfallCard | undefined = card_list.find(c => c.name.toLowerCase().includes(row.name.toLowerCase()));
        if (card) {
          await convertPrice(row, card);
        } else {
          row.price.innerHTML = "<span style='color: orange''>" + row.price.innerHTML + "</span>"
        }
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
        if (row) {
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
  const clipboardItem = new ClipboardItem({
    'text/plain': get_printable_list_blob().then((result) => {
      return new Promise(async (resolve) => {
        resolve(new Blob([(result ? result : "Errore")], {type: 'text/plain'}))
      })
    }),
  });

  navigator.clipboard.write([clipboardItem]).then(() => {
    borisToClipboardButton.children[0].classList.remove("btn-paper")
  })
}

const addToPinnedDecksList = () => {
  chrome.storage.sync.get('pinned_lists', (result) => {
    if (result.pinned_lists)
      var savedLists: IPinnedList[] = result.pinned_lists;
    else
      var savedLists: IPinnedList[] = []

    const url = window.location.href;
    if (!savedLists.filter(u => u.url === url).length) {
      const format_text = document.querySelector("p.deck-container-information")?.innerHTML!;
      const format = format_text.slice(format_text.search("Format: ") + 8, format_text.search("<br>"))
      savedLists.push({ url: url, title: ("<strong>" + format + "</strong> | " ?? "") + get_title() ?? url })
    }

    chrome.storage.sync.set({ pinned_lists: savedLists.sort((a, b) => a.title.localeCompare(b.title)) }, () => updatePinnedListsDropdown());
  });
}

function createBorisComponents() {
  borisPrices = document.createElement("div");
  borisPrices.classList.add("header-prices-boris", "header-prices-currency");
  document.querySelector("div.header-prices-currency")?.after(borisPrices);
  borisNav = document.createElement("ul");
  borisNav.classList.add("nav", "nav-pills", "deck-type-menu");
  borisNav.style.justifyContent = "start"
  document.querySelector("ul.deck-type-menu")?.after(borisNav);

  borisToggleOuterButton = navButtonFactory("Boris");
  borisToggleButton = borisToggleOuterButton.children[0];
  borisToClipboardButton = navButtonFactory("Copy");
  borisSaveAsButton = navButtonFactory("Save as...");
  borisCheapestButton = navButtonFactory("Cheapest");
  borisPinDeckButton = navButtonFactory("Pin");
  borisUnpinDeckButton = navButtonFactory("Pinned");

  borisToggleButton.classList.add("btn-online-muted");
  borisUnpinDeckButton.classList.add("show");
}

function addButtons() {
  borisNav.appendChild(borisToggleOuterButton);
  borisNav.appendChild(borisCheapestButton);
  borisNav.appendChild(borisToClipboardButton);
  borisNav.appendChild(borisSaveAsButton);
  borisNav.appendChild(borisPinDeckButton);
  borisToggleButton.addEventListener("click", togglePrices);
  borisToClipboardButton.addEventListener("click", copyToClipboard);
  borisSaveAsButton.addEventListener("click", saveToPC)
  borisCheapestButton.addEventListener("click", addCheapestPrices)
  borisPinDeckButton.addEventListener("click", addToPinnedDecksList);
}

function removeBorisComponents() {
  borisToggleOuterButton.remove();
  borisToggleButton.remove();
  borisCheapestButton.remove();
  borisToClipboardButton.remove();
  borisSaveAsButton.remove();
  borisPinDeckButton.remove();
  borisUnpinDeckButton.remove();
  borisPrices.remove();
  borisNav.remove();
}

function borisDecklist() {
  fetch_cards().then(async (list) => {
    page_values.card_list = list;
    await convertAllPrices();
    setTotal(page_values.total);
    togglePrices();
  }).then(() => {
    if (chrome.runtime?.id) {
      chrome.storage.sync.get(['auto'], (data) => {
        data.auto ? addCheapestPrices() : chrome.storage.sync.set({ auto: false });
      });
    }
    updatePinnedListsDropdown();
    addButtons();
  });
}

function borisDeckeditor() {
  document.getElementById("preview")?.addEventListener("click", async () => {
    page_values.total = 0;
    page_values.sizeToggle = true;
    page_values.card_list = [] as IScryfallCard[];
    sleep(2000).then(() => {
      removeBorisComponents();
      createBorisComponents();
      borisDecklist();
    });
  });
}

if (window.location.hostname.includes("mtggoldfish.com")) { // controllo inutile?
  const page_url = window.location.pathname;
  if (page_url.includes("decks")) {
    borisDeckeditor();
  }
  if (page_url.includes("deck") || page_url.includes("archetype")) {
    createBorisComponents();
    borisDecklist();
  }
}

// TODO controllo prezzo foil più basso => colore diverso
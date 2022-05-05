import { navButtonFactory, newDropdownItem, setCheapestTotal, setTotal } from "./components";
import { ISavedList, IScryfallCard } from "./interfaces";
import { fetch_cards, fetch_cheapest, fetch_single, get_printable_list_blob, get_title, parse_row } from "./utilities";

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

      result.saved_lists.forEach((list: ISavedList) => {
        div.appendChild(newDropdownItem(list, removeSavedList));
      });

      li.appendChild(a);
      li.appendChild(div);

      borisNav.appendChild(li);
    }
  })
}

function convertPrice(row: any, card: IScryfallCard) {
  const eur_price = parseFloat(card.prices?.eur ?? 0) * row.amount;
  const card_uri = card.purchase_uris.cardmarket ?? card.scryfall_uri

  row.price.innerHTML =
    "<a style='color: inherit;' href=\"" + card_uri + "\">" +
    "<span class='boris-usd-price'" + (!page_values.sizeToggle ? " style='font-size: 0'" : "") + ">" + row.price.innerHTML + "</span>" +
    "<span class='boris-eur-price' " + (page_values.sizeToggle ? " style='font-size: 0'" : "") + "> €&nbsp;" + eur_price.toLocaleString("en-us", { minimumFractionDigits: 2 }) + "</span>" +
    "</a>";

  page_values.total += eur_price;
}

function convertAllPrices(card_list: IScryfallCard[]) {
  document.querySelector("table.deck-view-deck-table")?.querySelectorAll("tr:not(.deck-category-header)").forEach((e, i) => {
    const row = parse_row(e.querySelectorAll("td"));
    let card: IScryfallCard | undefined = card_list.find(c => c.name.toLowerCase().includes(row.name.toLowerCase()));

    if (card)
      convertPrice(row, card)
    else
      fetch_single(row.name).then((card: IScryfallCard) => {
        page_values.card_list.push(card);
        if (card.purchase_uris.cardmarket)
          convertPrice(row, card)
        else
          row.price.innerHTML = "<span style='color: orange''>" + row.price.innerHTML + "</span>"
      })
  })
}

async function addCheapestPrices() {
  borisCheapestButton.remove();

  if (page_values.card_list.length) {
    let requests: Promise<any>[] = []

    for (const card of page_values.card_list) { requests.push(fetch_cheapest(card.name)) };

    await Promise.all(requests).then((responses) => {
      let card_list: IScryfallCard[] = [];
      responses.forEach((r) => {
        card_list.push(r.data?.filter((r: IScryfallCard) => r.prices?.eur !== null)[0])
      })

      document.querySelectorAll("tr.deck-category-header>th").forEach((th) => (th as HTMLTableCellElement).colSpan = 5);
      let total = 0;
      document.querySelectorAll(".boris").forEach((e) => {
        const row_element = e.parentElement!
        const row = parse_row(row_element.querySelectorAll("td"));
        let card: IScryfallCard | undefined = card_list.find(c => c.name?.toLowerCase().includes(row.name.toLowerCase()));
        const td = document.createElement("td");
        td.classList.add("text-right");
        if (card) {
          const eur_price = parseFloat(card.prices?.eur) * row.amount;
          const card_uri = card.scryfall_uri ?? "javascript:void(0)";
          total += eur_price;

          td.innerHTML =
            "<a style='color: darkviolet;' href=\"" + card_uri + "\">" +
            "<span> €&nbsp;" + eur_price.toLocaleString("en-us", { minimumFractionDigits: 2 }) + "</span></a>"
        } else {
          td.innerHTML = "<span style='color: orange;'>--------</span>"
        }
        row_element.appendChild(td)
      })
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

document.querySelector("ul.deck-type-menu")?.after(borisNav);

fetch_cards().then((list) => {
  page_values.card_list = list;
  convertAllPrices(list);
  setTotal(page_values.total);
  togglePrices();
}).finally(() => {
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

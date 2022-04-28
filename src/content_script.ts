import { ISavedList, IInternalCardModel, IScryfallCard } from "./interfaces";

function navButtonFactory(text: string): Element {
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

const borisNav = document.createElement("ul");
borisNav.classList.add("nav", "nav-pills", "deck-type-menu");
borisNav.style.justifyContent = "start"

const borisToggleOuterButton = navButtonFactory("Boris");
const borisToggleButton = borisToggleOuterButton.children[0];
borisToggleButton.classList.add("btn-online-muted");
const borisToClipboardButton = navButtonFactory("Copy");
const borisSaveDeckButton = navButtonFactory("Save");
const borisRemoveDeckButton = navButtonFactory("Saved");
borisRemoveDeckButton.classList.add("show");

borisNav.appendChild(borisToggleOuterButton);
borisNav.appendChild(borisToClipboardButton);
borisNav.appendChild(borisSaveDeckButton);
updateSavedListsDropdown();

document.querySelector("ul.deck-type-menu")?.after(borisNav);

function load_cards(): (IInternalCardModel)[] {
  let text_list: (IInternalCardModel)[] = [];

  document.querySelector("table.deck-view-deck-table")?.querySelectorAll("tr:not(.deck-category-header)").forEach((e, i) => {
    const row_parts = e.querySelectorAll("td");
    const card_amount = parseInt(row_parts[0].innerHTML);
    const card = row_parts[1].querySelector("a");
    const card_price = row_parts[3];

    const name = card?.innerHTML!;
    const set = card?.getAttribute("data-card-id");
    let first_bracket = set!.search("\\[");
    let second_bracket = set!.search("\\]");
    let set_name = set!.slice(first_bracket + 1, second_bracket);

    text_list.push({ name: name, set: set_name, amount: card_amount });

    card_price.classList.add("boris");
  });

  return text_list;
}

async function fetch_collection(ids: any[]): Promise<any> {
  return fetch("https://api.scryfall.com/cards/collection", {
    method: "POST", headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifiers: ids })
  }).then(async r => {
    return await r.json();
  })
}

async function fetch_cards() {
  let text_list = load_cards();
  let card_list: IScryfallCard[] = [];
  let requests: Promise<Response>[] = []
  while (text_list.length) {
    requests.push(fetch_collection(text_list.splice(0, 75).map(c => c.set.length < 3 || c.set.length > 5 ? { name: c.name } : { name: c.name, set: c.set })))
  }
  return await Promise.all(requests).then((responses) => {
    responses.forEach(async (response: any) => {
      card_list = [...card_list, ...response.data];
      if (response.not_found.length)
        await fetch_collection(response.not_found.map((c: IScryfallCard) => ({ name: c.name })))
          .then((response) => card_list = [...card_list, ...response.data]);
    });
    return card_list;
  })
}

function add_eur_prices(card_list: IScryfallCard[]) {
  document.querySelector("table.deck-view-deck-table")?.querySelectorAll("tr:not(.deck-category-header)").forEach((e, i) => {
    const name = e.querySelectorAll("td")[1].querySelector("a")?.innerHTML!;
    const price_elem = e.querySelector(".boris")!;
    let card: IScryfallCard | undefined = card_list.find(c => c.name === name);
    const usd_price = price_elem.innerHTML
    if (card) {
      const eur_price = card.prices?.eur;
      const card_uri: string = card.purchase_uris.cardmarket ?? card.scryfall_uri

      price_elem.innerHTML = "<a style='color: black;' href=\"" + card_uri + "\"><span class='boris-usd-price'>" + usd_price + "</span><span class='boris-eur-price' style='font-size: 0'> €&nbsp;" + eur_price + "</span></a>";
    } else {
      price_elem.innerHTML = "<span style='color: orange''>" + usd_price + "</span>"
    }
  })
  togglePrices();
}

function calculate_total(list: IScryfallCard[]) {
  let total = 0;
  list.forEach((c) => {
    total += parseFloat(c.prices?.eur ?? 0)
  })
  const price_div = document.createElement("div");
  price_div.classList.add("deck-price-v2", "boris-price");
  price_div.innerHTML = " €&nbsp;" + total.toFixed(0) + "<span class='cents'>." + total.toFixed(2).split(".")[1] + "</span>";

  document.head.insertAdjacentHTML("beforeend", `<style>.boris-price:before {content: "Boris";}</style>`);

  document.querySelector(".header-prices-currency")?.prepend(price_div);
}

fetch_cards().then((list) => {
  add_eur_prices(list);
  calculate_total(list)
})

let sizeToggle: boolean = true;
const togglePrices = () => {
  if (sizeToggle)
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
  sizeToggle = !sizeToggle;
};

function download(filename: string, text: string) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

const copyToClipboard = () => {
  let printable_list = "";
  load_cards().forEach(c => printable_list += c.amount + " " + c.name + "\n")
  navigator.clipboard.writeText(printable_list).then(() => {
    borisToClipboardButton.children[0].classList.add("btn-paper");
    setTimeout(() => borisToClipboardButton.children[0].classList.remove("btn-paper"), 500)
  })
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
      savedLists.push({ url: url, title: ("<strong>" + format + "</strong> | " ?? "") + document.querySelector("h1.title")?.innerHTML ?? url })
    }

    chrome.storage.sync.set({ saved_lists: savedLists.sort((a, b) => a.title.localeCompare(b.title)) }, () => updateSavedListsDropdown());
  });
}

borisToggleButton.addEventListener("click", togglePrices);
borisToClipboardButton.addEventListener("click", copyToClipboard);
borisSaveDeckButton.addEventListener("click", addToSavedDecksList);

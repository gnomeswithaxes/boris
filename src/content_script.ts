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

function parse_row(row_parts: NodeListOf<HTMLTableCellElement>) {
  const card = row_parts[1].querySelector("a");
  const set = card?.getAttribute("data-card-id");
  let first_bracket = set!.search("\\[");
  let second_bracket = set!.search("\\]");
  let set_name = set!.slice(first_bracket + 1, second_bracket);

  const row = {
    amount: parseInt(row_parts[0].innerHTML),
    card_line: card,
    name: card?.innerHTML!,
    set: set_name,
    mana_cost: row_parts[2].querySelector("span.manacost"),
    price: row_parts[3]
  }

  return row
}


function load_cards(): (IInternalCardModel)[] {
  let text_list: (IInternalCardModel)[] = [];

  document.querySelector("table.deck-view-deck-table")?.querySelectorAll("tr:not(.deck-category-header)").forEach((e, i) => {
    const row = parse_row(e.querySelectorAll("td"));

    text_list.push({ name: row.name, set: row.set, amount: row.amount });

    row.price.classList.add("boris");
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
      if (response.not_found.length) {
        
        const format = (name: string) => name.slice(0, name.search("//") - 1) + "//" + name.slice(name.search("//") + 3)

        await fetch_collection(response.not_found.map((c: IScryfallCard) => ({ name: format(c.name) })))
          .then((response) => card_list = [...card_list, ...response.data]);
      }
    });
    return card_list;
  })
}

function convert_prices(card_list: IScryfallCard[]) {
  let total = 0;

  document.querySelector("table.deck-view-deck-table")?.querySelectorAll("tr:not(.deck-category-header)").forEach((e, i) => {
    const row = parse_row(e.querySelectorAll("td"));
    // const price_elem = e.querySelector(".boris")!;
    let card: IScryfallCard | undefined = card_list.find(c => c.name.toLowerCase().includes(row.name.toLowerCase()));
    const usd_price = row.price.innerHTML
    if (card) {
      const eur_price = parseFloat(card.prices?.eur ?? 0) * row.amount;

      total += eur_price;

      const card_uri: string = card.purchase_uris.cardmarket ?? card.scryfall_uri

      row.price.innerHTML = "<a style='color: black;' href=\"" + card_uri + "\"><span class='boris-usd-price'>" + usd_price + "</span><span class='boris-eur-price' style='font-size: 0'> €&nbsp;" + eur_price.toFixed(2) + "</span></a>";
    } else {
      row.price.innerHTML = "<span style='color: orange''>" + usd_price + "</span>"
    }
  })
  set_total(total);
  togglePrices();
  console.log(getSourceAsDOM("https://www.mtggoldfish.com/deck/4778591#paper"))
}

function set_total(total: number) {
  const price_div = document.createElement("div");
  price_div.classList.add("deck-price-v2", "boris-price");
  const locale_total = total.toLocaleString("en-us", { minimumFractionDigits: 2 }).split(".")
  price_div.innerHTML = " €&nbsp;" + locale_total[0] + "<span class='cents'>." + locale_total[1] + "</span>";

  document.head.insertAdjacentHTML("beforeend", `<style>.boris-price:before {content: "Boris";}</style>`);

  document.querySelector(".header-prices-currency")?.prepend(price_div);
}

fetch_cards().then((list) => {
  convert_prices(list);
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

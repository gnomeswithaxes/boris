const borisNav = document.createElement("ul");
borisNav.classList.add("nav", "nav-pills");

function navButtonFactory(text: string): Element {
  const li = document.createElement("li");
  li.classList.add("nav-item");

  const a = document.createElement("a")
  a.classList.add("nav-link");
  a.innerHTML = text;
  a.href = "javascript:void(0)";

  li.appendChild(a);

  return li;
}

const borisToggleButton = navButtonFactory("Boris");
borisToggleButton.classList.add("btn-online-muted");
const borisToClipboardButton = navButtonFactory("Copy");
// const borisSaveDeckButton = navButtonFactory("Save");

borisNav.appendChild(borisToggleButton);
borisNav.appendChild(borisToClipboardButton);
// borisNav.appendChild(borisSaveDeckButton);

document.querySelector("ul.deck-type-menu")?.after(borisNav);

interface IInternalCardModel {
  name: string, set: string, amount: number
}

interface IScryfallCard {
  name: string,
  [key: string]: any
}

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

fetch_cards()
  .then((list) => { add_eur_prices(list); calculate_total(list) })


function calculate_total(list: IScryfallCard[]) {
  let total = 0;
  list.forEach((c) => {
    total += parseFloat(c.prices?.eur)
  })
  const price_div = document.createElement("div");
  price_div.classList.add("deck-price-v2", "boris-price");
  price_div.innerHTML = " €&nbsp;" + total.toFixed(0) + "<span class='cents'>." + total.toFixed(2).split(".")[1] + "</span>";

  document.head.insertAdjacentHTML("beforeend", `<style>.boris-price:before {content: "Boris";}</style>`);

  document.querySelector(".header-prices-currency")?.prepend(price_div);
}

function download(filename: string, text: string) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

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

const copyToClipboard = () => {
  let printable_list = "";
  load_cards().forEach(c => printable_list += c.amount + " " + c.name + "\n")
  navigator.clipboard.writeText(printable_list).then(() => {
    borisToClipboardButton.classList.add("btn-paper");
    setTimeout(() => borisToClipboardButton.classList.remove("btn-paper"), 800)
  })
}


borisToggleButton.addEventListener("click", togglePrices);
borisToClipboardButton.addEventListener("click", copyToClipboard);







function old_fetch(card_list: any) {
  while (card_list.length > 0) {
    let batch = "";
    while (true) {
      const card = card_list.pop();
      const segment = encodeURIComponent('!"' + card?.name + '" set:' + card?.set + ' OR ');
      if (batch.length + segment.length <= 1000) { // scryfall supporta query di max 1000 caratteri
        batch += segment;
        if (card_list.length === 0) {
          console.log(batch);
          fetch(
            "https://api.scryfall.com/cards/search?q=" + batch
          ).then(async (value) => {
            console.log(await value.json());
          });
          break;
        }
      } else {
        console.log(batch);
        card_list.push(card!);
        fetch(
          "https://api.scryfall.com/cards/search?q=" + batch
        ).then(async (value) => {
          console.log(await value.json());
        });
        break;
      }
    }
  }
}

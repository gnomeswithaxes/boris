import { IInternalCardModel, IScryfallCard } from "./interfaces";

export function parse_row(row_parts: NodeListOf<HTMLTableCellElement>) {
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

export function get_printable_list_blob(): Promise<Blob> {
    for (const a of document.querySelectorAll("a")) {
        if (a.innerText?.includes("Text File")) {
            return fetch(a.href)
                .then(res => { return res.blob() })
        }
    }
    return Promise.resolve(new Blob([""]));
}

declare global { interface Window { showSaveFilePicker?: any; } }
export const saveToCockatrice = async () => {
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

export const get_title = () => {
    return document.querySelector("h1.title")?.innerHTML;
}

export function load_cards(): (IInternalCardModel)[] {
    let text_list: IInternalCardModel[] = [];

    document.querySelector("table.deck-view-deck-table")?.querySelectorAll("tr:not(.deck-category-header)").forEach((e, i) => {
        const row = parse_row(e.querySelectorAll("td"));

        text_list.push({ name: row.name, set: row.set, amount: row.amount });

        row.price.classList.add("boris");
    });

    return text_list;
}

export async function fetch_collection(ids: any[]): Promise<any> {
    return fetch("https://api.scryfall.com/cards/collection", {
        method: "POST", headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifiers: ids })
    }).then(async r => {
        return await r.json();
    })
}

export async function fetch_single(name: string): Promise<any> {
    return fetch(
        "https://api.scryfall.com/cards/named?fuzzy=" + name
    ).then(async r => {
        return await r.json();
    });
}

export async function fetch_cheapest(name: string): Promise<any> {
    return fetch(
        "https://api.scryfall.com/cards/search?order=eur&unique=prints&dir=asc&q=!\"" + name + "\""
    ).then(async r => {
        let response = await r.json();
        if (response.has_more) {
            const more = await fetch(response.next_page).then(async r => { return await r.json() })
            response.data.push(...more.data)
        }
        return response;
    });
}

export async function get_cheapest(name: string): Promise<IScryfallCard> {
    const prints_list = await fetch_cheapest(name);
    return prints_list.data?.filter((r: IScryfallCard) => (r.prices?.eur || r.prices?.eur_foil) && r.border_color !== "gold")[0];
}

export async function fetch_cards() {
    let text_list = load_cards();
    let card_list: IScryfallCard[] = [];
    let requests: Promise<Response>[] = []
    while (text_list.length) {
        requests.push(fetch_collection(text_list.splice(0, 75).map(c => c.set.length < 3 || c.set.length > 5 ? { name: c.name } : { name: c.name, set: c.set })))
    }

    return await Promise.all(requests).then(async (responses: any[]) => {
        for (const response of responses) {
            card_list = [...card_list, ...response.data];
            for (const card of response.not_found) {
                const cheapest = await get_cheapest(card.name);
                card_list.push(cheapest);
            }
        };
        return card_list;
    })
}

export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

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

export function getPrintableListBlob(): Promise<Blob> | undefined {
    for (const a of document.querySelectorAll("a")) {
        if (a.innerText?.includes("Text File")) {
            return fetch(a.href)
                .then(res => { return res.blob() })
        }
    }
}

export const getTitle = () => {
    return document.querySelector("h1.title")?.innerHTML;
}

export function load_cards(): (IInternalCardModel)[] {
    let text_list: (IInternalCardModel)[] = [];

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

export async function fetch_cards() {
    let text_list = load_cards();
    let card_list: IScryfallCard[] = [];
    let requests: Promise<Response>[] = []
    while (text_list.length) {
        requests.push(fetch_collection(text_list.splice(0, 75).map(c => c.set.length < 3 || c.set.length > 5 ? { name: c.name } : { name: c.name, set: c.set })))
    }

    return await Promise.all(requests).then((responses) => {
        responses.forEach(async (response: any) => {
            card_list = [...card_list, ...response.data];

        });
        return card_list;
    })
}
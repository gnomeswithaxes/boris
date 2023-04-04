import { IScryfallCard } from "./interfaces";
import { load_cards } from "../mtggoldfish/utilities";

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
        "https://api.scryfall.com/cards/named?include_multilingual=true&fuzzy=" + name
    ).then(async r => {
        return await r.json();
    });
}

export async function get_exact(name: string, set: string) {
    return fetch(
        "https://api.scryfall.com/cards/search?include_multilingual=true&q=" + name + " set:" + set
    ).then(async r => {
        return await r.json();
    });
}

export async function get_cardmarket(id: string) {
    return fetch(
        "https://api.scryfall.com/cards/cardmarket/" + id
    ).then(async r => {
        return await r.json();
    });
}

export async function fetch_cheapest(name: string): Promise<any> {
    return fetch(
        "https://api.scryfall.com/cards/search?order=eur&unique=prints&dir=asc&q=" + name
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
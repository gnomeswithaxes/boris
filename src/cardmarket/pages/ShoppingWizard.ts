import { IScryfallCard, ISavedUrl } from "../../common/interfaces";
import { get_cardmarket, fetch_single } from "../../common/scryfall";
import { get_mkm_id, get_mkm_version } from "../utilities";

export function addDisclaimer() {
    const section = document.getElementsByClassName("card-columns")[0]
    const disclaimer = document.createElement("h4");
    disclaimer.innerHTML = "<i style='color: red;'>Due to some limitations, some links may not work or be wrong</i><hr>"
    section.before(disclaimer)
}

export function addLinkToCards() {
    chrome.storage.local.get(["urls"], async (result) => {
        let saved_urls = result.urls ?? []

        for (const table of document.getElementsByTagName("tbody")) {
            for (const row of table.getElementsByTagName("tr")) {
                const card_id = get_mkm_id(row);
                const card_version = get_mkm_version(row);
                const card_elem = row.getElementsByClassName("card-name")[0];
                const set_title = row.getElementsByClassName("expansion-symbol")[0]?.getAttribute("data-original-title")

                if (card_id) {
                    await get_cardmarket(card_id).then(async (card) => {
                        const saved = saved_urls.filter((u: ISavedUrl) => u.mkm_id == card_id)
                        const url: string = saved.length > 0 ? saved[0].url : (await format_url(card, card_version, set_title || ""))
                        if (url) {
                            card_elem.innerHTML = "<a href='" + url + "' target='_blank'>" + card.name + "</a><br>/ <a href='" + card.purchase_uris.cardmarket + "' target='_blank'>All printings</a>"
                            if (saved_urls.filter((u: ISavedUrl) => u.mkm_id == card_id).length == 0) {
                                saved_urls.push({ name: card.name, mkm_id: card_id, url: url })
                            }
                        } else {
                            fetch_single(card_elem.innerHTML.replace(/\(V\.\d+\)/g, '')).then((card) => {
                                card_elem.innerHTML = "<a href='" + card.purchase_uris.cardmarket + "' target='_blank'>" + card.name + "<br>(All)</a>"
                            });
                        }
                    });
                }
            }
        }

        chrome.storage.local.set({ "urls": saved_urls })
    });
}

async function format_url(card: IScryfallCard, version: string, set_title: string): Promise<string> {
    if (card.name) {
        let name = card.name
        let set = ""
        if (version) {
            set = set_title
            name += " V" + version
        } else {
            const set_type = set_title?.split(":").pop()
            if (!card.set_name.includes("Extras") && !card.set_name.includes("Promos")) {
                set = card.set_name + ((set_type && (set_type.includes("Extras") || set_type.includes("Promos"))) ? set_type : "")
            } else {
                set = card.set_name
            }
        }
        set = set.replace(" Set ", " ")
        let path = (set + "/" + name).replace(/ \/\/ /g, "-").replace(/:/g, "").replace(/,/g, "").replace(/\s+/g, "-")
        let url = "https://www.cardmarket.com/Magic/Products/Singles/" + path

        if (url.includes("\'")) {
            const new_url = url.replace(/\'/g, "")
            return await fetch(new_url).then(async r => {
                if (r.ok && urls_are_equal(r.url, new_url)) {
                    return new_url
                } else {
                    const new_url = url.replace(/\'/g, "-")
                    return await fetch(new_url).then(r => {
                        if (r.ok && urls_are_equal(r.url, new_url)) {
                            return new_url
                        } else {
                            return ""
                        }
                    })
                }
            })
        } else {
            return url;
        }
    }

    return ""
}

function urls_are_equal(url1: string, url2: string): boolean {
    return url1.split("/")!.slice(-1)[0] == url2.split("/")!.slice(-1)[0]
}

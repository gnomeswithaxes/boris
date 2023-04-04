import { get_cardmarket, fetch_single } from "../../common/scryfall";
import { get_mkm_id } from "../utilities";

export function addLinkToCards() {
    for (const table of document.getElementsByTagName("tbody")) {
        for (const row of table.getElementsByTagName("tr")) {
            const card_id = get_mkm_id(row);
            const card_elem = row.getElementsByClassName("card-name")[0];
            const set_type = row.getElementsByClassName("expansion-symbol")[0]?.getAttribute("data-original-title")?.split(":").pop()

            if (card_id) {
                get_cardmarket(card_id).then((card) => {
                    if (card.name) {
                        const name = card.name
                        let set = card.set_name + (set_type === "Extras" || set_type === "Promos" ? set_type : "")
                        set = set.replace("Set", "")
                        let path = (set + "/" + name).replace(/ \/\/ /g, "-").replace(/:/g, "").replace(/\s+/g, "-").replace(/\'/g, "")
                        let url = "https://www.cardmarket.com/Magic/Products/Singles/" + path
                        card_elem.innerHTML = "<a href='" + url + "'>" + name + "</a><br>/ <a href='" + card.purchase_uris.cardmarket + "'>All printings</a>"
                    } else {
                        fetch_single(card_elem.innerHTML.replace(/\(V\.\d+\)/g, '')).then((card) => {
                            card_elem.innerHTML += "<br>/ <a href='" + card.purchase_uris.cardmarket + "'>All printings</a>"
                        });
                    }
                });
            }
        }
    }
}
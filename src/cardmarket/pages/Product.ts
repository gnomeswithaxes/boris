import { IScryfallCard } from "../../common/interfaces";
import { get_cardmarket } from "../../common/scryfall";
import { get_mkm_id, get_mkm_src, get_card_src, replaceCamera } from "../utilities";

export function addImages() {
    chrome.storage.sync.get("images", async (result) => {
        if (result.images as boolean) {
            const header = document.querySelector(".table-header>.row>.col-thumbnail")
            if (header) {
                header.classList.add("col-boris-image")
            } else {
                document.querySelector(".table-header>.row>.col-icon")?.classList.add("col-boris-image")
            }
            for (const row of document.querySelectorAll(".table-body>div")) {
                if (row.getElementsByClassName("fonticon-camera").length > 0) {
                    get_cardmarket(get_mkm_id(row)).then((card: IScryfallCard) => {
                        let src = card.id ? get_card_src(card) : ""
                        if (src == "") {
                            src = get_mkm_src(row)
                        }
                        const span = row.getElementsByClassName("fonticon-camera")[0];
                        if (src != "") {
                            replaceCamera(span, src)
                        }
                        const div = span?.parentElement
                        div?.classList.remove("col-thumbnail", "col-icon")
                        div?.classList.add("col-boris-image")
                        div?.appendChild(span!)
                    });
                }
            }
        }
    })
}

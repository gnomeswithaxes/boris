import { IScryfallCard } from "../../common/interfaces";
import { get_cardmarket } from "../../common/scryfall";
import { get_mkm_id, replaceCamera } from "../utilities";

export function addImages(mul: number) {
    chrome.storage.sync.get("images", (result) => {
        if (result.images as boolean) {
            let height = 0;
            let max_height = 0;
            for (const elem of document.querySelectorAll(".col-offer")) {
                height = elem.clientHeight
                if (height > max_height) {
                    max_height = height;
                }
            }
            for (const row of document.querySelectorAll(".table-body>div")) {
                if (row.getElementsByClassName("fonticon-camera").length > 0) {
                    get_cardmarket(get_mkm_id(row)).then((card: IScryfallCard) => {
                        const span  = row.getElementsByClassName("fonticon-camera")[0];
                        if (card.name)
                            replaceCamera(row, card, mul, max_height)
                        
                        const div = span?.parentElement
                        const cell = document.createElement("div")

                        div?.classList.add("col-1")
                        cell.appendChild(span!)
                        div?.appendChild(cell)
                    })
                }
            }
        }
    })
}
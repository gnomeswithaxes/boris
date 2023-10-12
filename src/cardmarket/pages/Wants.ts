import { ISavedUrl } from "../../common/interfaces"
import { get_cardmarket, fetch_single } from "../../common/scryfall"
import { saveWithFilePicker } from "../../common/utilities"
import { get_mkm_id, get_mkm_url, get_mkm_version } from "../utilities"

export function addPrintListButton() {
    const table = document.getElementById("WantsListTable")?.getElementsByTagName("tbody")[0];
    if (table) {
        const btn = document.querySelectorAll("a[href$='AddDeckList']")[0] // $= --> ending with
        btn.classList.add("mr-3")
        const printBtn = document.createElement("div")
        printBtn.classList.add("btn")
        printBtn.style.color = "rgb(240, 173, 78)"
        printBtn.style.borderColor = "rgb(240, 173, 78)"
        printBtn.innerHTML = "<span>Save as...</span>"

        printBtn.addEventListener("click", () => {
            chrome.storage.sync.get('printVersion', async (data) => {
                const wants_title = document.getElementsByClassName("page-title-container")[0].getElementsByTagName("h1")[0].innerHTML
                let list = ""
                const printVersion = data.printVersion as boolean | undefined ?? false
                for (const row of table.getElementsByTagName("tr")!) {
                    let amount = row.querySelector("td.amount")!.getAttribute("data-amount") ?? "1"
                    let name = row.querySelector("td.name a")!.innerHTML
                    if (printVersion) {
                        list += amount + " " + name + "\n"
                    } else {
                        const card_id = get_mkm_id(row);
                        if (card_id) {
                            await get_cardmarket(card_id).then(async (card) => {
                                if (card.name) {
                                    list +=  amount + " " + card.name + "\n"
                                } else {
                                    list += amount + " " + name + "\n"
                                }
                            })
                        }
                    }
                }
                saveWithFilePicker(new Blob([list]), wants_title ? wants_title + ".txt" : "wants.txt");
            })
        })

        btn.after(printBtn)
    }
}

export function saveAllUrls() {
    chrome.storage.local.get(["urls"], async (result) => {
        let saved_urls = result.urls ?? []
        const rows = document.getElementById("WantsListTable")?.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
        if (rows) {
            for (const row of rows) {
                const card_url = get_mkm_url(row);
                if (card_url && card_url.includes("/Products/Singles/")) {
                    const card_id = get_mkm_id(row);
                    if (card_id) {
                        await get_cardmarket(card_id).then(async (card) => {
                            if (card.name) {
                                const already_in = saved_urls.filter((u: ISavedUrl) => u.mkm_id == card_id)
                                if (already_in.length == 0) {
                                    saved_urls.push({ name: card.name, mkm_id: card_id, url: card_url })
                                } else {
                                    already_in[0].url = card_url
                                }
                            }
                        });
                    }
                }
            }
            chrome.storage.local.set({ "urls": saved_urls })
        }
    });
}
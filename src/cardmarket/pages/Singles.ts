import { sleep } from "../../common/utilities";

export function addLinkToSingles() {
    for (const user of document.getElementsByClassName("seller-name")) {
        const user_link = user.getElementsByTagName("a")![0]
        user_link.parentElement!.innerHTML += "&nbsp;-&nbsp;<a href='" + user_link.href + "/Offers/Singles/'>Singles</a>"
    }
}

async function getReference(default_ref: number): Promise<number> {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get('reference', (data) => {
            if (data.reference as number | undefined) {
                return resolve(data.reference);
            } else {
                chrome.storage.sync.set({ reference: default_ref })
                return resolve(default_ref);
            };
        });
    })
}

export async function addCheckboxes() {
    let reference = await getReference(1);

    const info = document.getElementsByClassName("info-list-container")[0];
    if (info) {
        const rows = info.getElementsByTagName("dd")
        const nrows = 4
        let prices: number[] = []
        for (let i = 0; i < nrows; i++) {
            const elem = rows[rows.length - nrows + i]
            prices.push(parseFloat(elem.innerHTML.match(/\d+\,\d+/)![0].replace(",", ".")))
            elem.innerHTML += "&nbsp;<input type='radio' name='reference' value=" + i + (i == reference ? " checked" : "") + ">"
        }
        colorPrices(prices[reference])

        for (const radio of document.querySelectorAll('input[name="reference"]')) {
            radio.addEventListener("change", function (this: any) {
                chrome.storage.sync.set({ reference: this.value }).then(() => {
                    reference = this.value
                });
                colorPrices(prices[this.value])
            });
        }

        document.getElementById("loadMoreButton")?.addEventListener("click", () =>
            sleep(3000).then(() => colorPrices(prices[reference]))
        )
    }
}

function colorPrices(reference_price: number) {
    for (const elem of document.getElementsByClassName("price-container")) {
        const price_elem = elem.getElementsByClassName("font-weight-bold")[0] as HTMLElement

        const playset_elem = price_elem.parentElement!.parentElement!.getElementsByClassName("text-muted")
        let ppu = 0
        if (playset_elem.length > 0) {
            ppu = parseFloat(playset_elem[0].innerHTML?.match(/\d+(?:\,\d+)?/g)![0].replace(",", "."))
        }

        price_elem.classList.remove("color-primary")
        if (price_elem) {
            if ((ppu > 0 && ppu <= reference_price) || parseFloat(price_elem.innerHTML.replace(" €", "").replace(",", ".")) <= reference_price) {
                price_elem.style.color = "green"
            } else {
                price_elem.style.color = "red"
            }
        }
    }
}
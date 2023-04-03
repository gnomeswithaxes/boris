import { fetch_single, get_cardmarket, get_cheapest, get_exact } from "../common/scryfall"
import { IScryfallCard } from "../mtggoldfish/interfaces";

if (window.location.pathname.includes("Users")) {
    const table = document.getElementById("UserOffersTable");
    if (table) {
        const legenda_div = document.createElement("div");
        legenda_div.innerHTML = "<hr><p class='font-weight-bold'>Legenda: <span style='color: green'>Prezzo minore</span> / <span style='color: red'>Prezzo maggiore</span> / <span style='color: darkviolet'>Foil [ <i>non supportato</i> ]</span> / <span class='color-primary'>Prezzo non trovato</span</p>"
        table.before(legenda_div)

        const rows = table.querySelectorAll('[id^=articleRow]')
        for (const row of rows) {
            const card_url = row.getElementsByClassName("col-seller")[0].getElementsByTagName("a")[0].href.split("?")[0].split("/")

            let card_name = card_url.pop()?.replace(/-V\d+/, '')
            // card_name = row.getElementsByClassName("col-seller")[0].getElementsByTagName("a")[0].innerHTML.replace(/\(V.\d\)/, '')
            // const card_set = card_url.pop()

            let foil = false
            if (row.querySelectorAll('[data-original-title="Foil"]').length > 0) {
                foil = true
            }

            get_cheapest(card_name!).then((cheapest) => {
                if (cheapest) {
                    add_boris_prices(row, cheapest, foil)
                }
            });
        }
    }
}

if (window.location.pathname.includes("Products/Singles")) {
    for (const user of document.getElementsByClassName("seller-name")) {
        const user_link = user.getElementsByTagName("a")![0]
        user_link.parentElement!.innerHTML += "&nbsp;-&nbsp;<a href='" + user_link.href + "/Offers/Singles/'>Singles</a>"
    }
}

if (window.location.pathname.includes("ShoppingWizard/Results")) {
    for (const table of document.getElementsByTagName("tbody")) {
        for (const row of table.getElementsByTagName("tr")) {
            const card_id = row.getElementsByClassName("fonticon-camera")[0]?.getAttribute("data-original-title")?.split(/\.jpg/g)[0].split("/").splice(-1)[0]
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
                        fetch_single(card_elem.innerHTML.replace(/\(V\.\d+\)/g, '')).then((card)=> {
                            card_elem.innerHTML += "<br>/ <a href='" + card.purchase_uris.cardmarket + "'>All printings</a>"
                        });
                    }
                });
            } 
        }
    }
}

function add_boris_prices(row: Element, cheapest: IScryfallCard, foil: boolean) {
    const price_elem = row.getElementsByClassName("price-container")[0].getElementsByClassName("font-weight-bold")[0]
    const eur_price = parseFloat(cheapest.prices?.eur ?? cheapest.prices?.eur_foil);

    let color = "green"

    const playset_elem = price_elem.parentElement!.parentElement!.getElementsByClassName("extra-small")
    if (foil) {
        color = "darkviolet"
    } else if (playset_elem.length > 0) {
        const ppu = playset_elem[0].innerHTML?.match(/\d+(?:\,\d+)?/g)
        if (ppu && ppu.length > 0 && parseFloat(ppu[0].replace(",", ".")) > eur_price) {
            color = "red"
        }
    } else if (parseFloat(price_elem.innerHTML.replace(" €", "").replace(",", ".")) > eur_price) {
        color = "red"
    }

    const new_price_elem = price_elem.innerHTML + "<br><a style='color: " + color + ";' href='" + cheapest.scryfall_uri + "'> " + eur_price.toLocaleString("it-IT", { minimumFractionDigits: 2 }) + " €</a>"
    price_elem.innerHTML = "<span style='color: " + color + ";'>" + new_price_elem + "</span>"
}
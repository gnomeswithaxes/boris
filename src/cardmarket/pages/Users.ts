import { get_cheapest, get_cardmarket } from "../../common/scryfall";
import { get_mkm_id, parsePPU, parsePrice } from "../utilities";

export function showTrend() {
    const table = document.getElementById("UserOffersTable");
    if (table) {
        const legenda_div = document.createElement("div");
        legenda_div.innerHTML = "<hr><p class='font-weight-bold'>E = Exact set / L = Lowest Availble <br><span style='color: green'>Lower price</span> / <span style='color: red'>Higher price</span> / <span style='color: darkviolet'>Foil [ <i>not supported</i> ]</span> / <span class='color-primary'>Price not found</span</p>"
        table.before(legenda_div)

        const rows = table.querySelectorAll('[id^=articleRow]')
        for (const row of rows) {
            const card_url = row.getElementsByClassName("col-seller")[0].getElementsByTagName("a")[0].href.split("?")[0].split("/")

            let card_name = card_url.pop()?.replace(/-V\d+/, '')
            let card_id = get_mkm_id(row);

            let foil = false
            if (row.querySelectorAll('[data-original-title="Foil"]').length > 0) {
                foil = true
            }

            Promise.all([get_cheapest(card_name!), get_cardmarket(card_id)]).then(responses => {
                const cheapest = responses[0]
                const exact = responses[1]

                const price_elem = row.getElementsByClassName("price-container")[0].getElementsByClassName("font-weight-bold")[0]
                const original_price = parsePrice(price_elem.innerHTML.replace(" €", ""))

                const playset_elem = price_elem.parentElement!.parentElement!.getElementsByClassName("text-muted")
                let ppu = 0
                if (playset_elem.length > 0) {
                    ppu = parsePPU(playset_elem[0].innerHTML)
                }

                let cheapest_color = "", cheapest_price = 0
                let exact_color = "", exact_price = 0

                if (cheapest) {
                    cheapest_price = parseFloat(cheapest.prices?.eur ?? cheapest.prices?.eur_foil);
                    if (cheapest_price) {
                        cheapest_color = (foil ? "darkviolet" : color_from_price(original_price, cheapest_price, ppu));
                    }
                }
                if (exact) {
                    exact_price = parseFloat(exact.prices?.eur ?? exact.prices?.eur_foil);
                    if (exact_price) {
                        exact_color = (foil ? "darkviolet" : color_from_price(original_price, exact_price, ppu));
                    }
                }

                let original_color = cheapest_color && exact_color
                price_elem.innerHTML = "<span style='color: " + original_color + "'>" + price_elem.innerHTML + "<span>"

                if (!foil) {
                    if (exact_price > 0 && cheapest.id != exact.id)
                        price_elem.innerHTML += "<br><span style='color: " + exact_color + ";' >E </span><a style='color: black' href='" + exact.scryfall_uri + "'> " + exact_price.toLocaleString("it-IT", { minimumFractionDigits: 2 }) + " €</a>"

                    if (cheapest_price > 0)
                        price_elem.innerHTML += "<br><span style='color: " + cheapest_color + ";'>" + (cheapest.id == exact.id ? "E=" : "") + "L </span><a style='color: black' href='" + cheapest.scryfall_uri + "'> " + cheapest_price.toLocaleString("it-IT", { minimumFractionDigits: 2 }) + " €</a>"
                }
            })
        }
    }
}


function color_from_price(old_price: number, new_price: number, ppu: number) {
    if ((ppu > 0 && ppu > new_price) || old_price > new_price) {
        return "red"
    } else {
        return "green"
    }
}
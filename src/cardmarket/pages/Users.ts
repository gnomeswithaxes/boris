import { get_cheapest, get_cardmarket } from "../../common/scryfall";
import { get_mkm_id } from "../utilities";

export function showTrend() {
    const table = document.getElementById("UserOffersTable");
    if (table) {
        const legenda_div = document.createElement("div");
        legenda_div.innerHTML = "<hr><p class='font-weight-bold'>Legenda: E = Stesso set / L = Prezzo più basso\ <br>Colori: <span style='color: green'>Prezzo minore</span> / <span style='color: red'>Prezzo maggiore</span> / <span style='color: darkviolet'>Foil [ <i>non supportato</i> ]</span> / <span class='color-primary'>Prezzo non trovato</span</p>"
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
                const original_price = parseFloat(price_elem.innerHTML.replace(" €", "").replace(",", "."))

                const playset_elem = price_elem.parentElement!.parentElement!.getElementsByClassName("extra-small")
                let ppu = 0
                if (playset_elem.length > 0) {
                    ppu = parseFloat(playset_elem[0].innerHTML?.match(/\d+(?:\,\d+)?/g)![0].replace(",", "."))
                }

                let cheapest_color = "", exact_color = ""
                let cheapest_price = 0, exact_price = 0

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

                let original_color = exact_color || cheapest_color
                price_elem.innerHTML = "<span style='color: " + original_color + "'>" + price_elem.innerHTML + "<span>"

                if (!foil) {
                    if (exact_price > 0 && cheapest.set != exact.set )
                        price_elem.innerHTML += "<br><span style='color: " + exact_color + ";' >E </span><a style='color: black' href='" + exact.scryfall_uri + "'> " + exact_price.toLocaleString("it-IT", { minimumFractionDigits: 2 }) + " €</a>"

                    if (cheapest_price > 0)
                        price_elem.innerHTML += "<br><span style='color: " + cheapest_color + ";'>" + (cheapest.set == exact.set ? "E=" : "") + "L </span><a style='color: black' href='" + cheapest.scryfall_uri + "'> " + cheapest_price.toLocaleString("it-IT", { minimumFractionDigits: 2 }) + " €</a>"
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
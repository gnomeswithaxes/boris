import { IScryfallCard } from "../common/interfaces"
import { boris_img_class, camera_class, camera_icon, camera_icon_classlist, title_attribute } from "./page_elements"

export function get_mkm_id(row: Element): string {
    const camera_span = row.getElementsByClassName(camera_class)[0] || row.getElementsByClassName(boris_img_class)[0]
    return camera_span?.getAttribute(title_attribute)?.split(/\.jpg/g)[0].split("/").splice(-1)[0] || ""
}

export function get_mkm_src(row: Element): string {
    return row.getAttribute(title_attribute)?.match(/src=\"(.*?)\"/)![1] || ""
}

export function get_mkm_version(row: Element): string {
    const alt = row.getElementsByClassName(camera_class)[0]?.getAttribute(title_attribute)?.match(/alt=\"(.*?)\"/)![1] || ""
    const version = alt.match(/\(V\.(.*?)\)/)
    return version != null ? version[1] : ""
}

export function get_mkm_url(row: Element): string {
    return row.getElementsByClassName("name")[0]?.getElementsByTagName("a")[0]?.href.split("?")[0]
}

export function parsePrice(price: string): number {
    return parseFloat(price.replace(".", "").match(/\d+\,\d+/)![0].replace(",", "."))
}

export function parsePPU(ppu: string): number {
    return parseFloat(ppu.match(/\d*\.?\d+(\,\d+)?/g)![0].replace(".", "").replace(",", "."))
}

export function get_card_src(card: IScryfallCard) {
    let src = "";
    if (card) {
        if (card.image_uris) {
            src = card.image_uris.small
        } else if (card.card_faces) {
            src = card.card_faces[0].image_uris.small
        }
    }
    return src
}

export function parseUrl(data: string) {
    const url = data.match(/"*"/)
    return url
}

export function replaceCamera(span: Element, src: string) {
    const card_img = document.createElement("img");
    card_img.src = src
    card_img.style.width = "100%"
    card_img.style.height = "100%"
    
    span.classList.remove(...camera_icon_classlist)
    span.classList.add(boris_img_class)
    span.appendChild(card_img);

    span.getElementsByClassName(camera_icon)[0].remove()
}

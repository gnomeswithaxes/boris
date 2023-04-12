
export function get_mkm_id(row: Element): string {
    return row.getElementsByClassName("fonticon-camera")[0]?.getAttribute("data-original-title")?.split(/\.jpg/g)[0].split("/").splice(-1)[0] || ""
}

export function get_mkm_version(row: Element): string {
    const alt = row.getElementsByClassName("fonticon-camera")[0]?.getAttribute("data-original-title")?.match(/alt=\"(.*?)\"/)![1] || ""
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
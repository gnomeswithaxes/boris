
export function get_mkm_id(row: Element): string {
    return row.getElementsByClassName("fonticon-camera")[0]?.getAttribute("data-original-title")?.split(/\.jpg/g)[0].split("/").splice(-1)[0] || ""
}
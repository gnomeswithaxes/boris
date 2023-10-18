import { IInternalCardModel } from "../common/interfaces";
import { saveWithFilePicker } from "../common/utilities";

export function parse_row(row_parts: NodeListOf<HTMLTableCellElement>) {
  const card = row_parts[1].querySelector("a");
  const set = card?.getAttribute("data-card-id");

  if (set) {

    let first_bracket = set!.search("\\[");
    let second_bracket = set!.search("\\]");
    let set_name = set!.slice(first_bracket + 1, second_bracket);

    const row = {
      amount: parseInt(row_parts[0].innerHTML),
      card_line: card,
      name: card?.innerHTML!,
      set: set_name,
      mana_cost: row_parts[2].querySelector("span.manacost"),
      price: row_parts[3]
    }

    return row
  }
  else return null
}

export function get_printable_list_blob(): Promise<Blob> {
  for (const a of document.querySelectorAll("a")) {
    if (a.innerText?.includes("Text File")) {
      return fetch(a.href)
        .then(res => { return res.blob() })
    }
  }
  return Promise.resolve(new Blob([""]));
}

export const saveToPC = async () => {
  let title = get_title()?.split("<")[0].trim().replace(/[^a-z A-Z]+/, '') + ".txt";
  get_printable_list_blob().then((blob) => {
    if (blob) {
      saveWithFilePicker(blob, title);
    }
  });
}

export const get_title = () => {
  return document.querySelector("h1.title")?.innerHTML;
}

export function load_cards(): (IInternalCardModel)[] {
  let text_list: IInternalCardModel[] = [];

  document.querySelector("table.deck-view-deck-table")?.querySelectorAll("tr:not(.deck-category-header)").forEach((e, i) => {
    const row = parse_row(e.querySelectorAll("td"));
    if (row) {
      text_list.push({ name: row.name, set: row.set, amount: row.amount });
  
      row.price.classList.add("boris");
    }
  });

  return text_list;
}

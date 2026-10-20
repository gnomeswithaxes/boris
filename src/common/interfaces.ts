export interface IPinnedList {
  url: string
  title: string
  format?: string
}

export interface IScryfallCard {
  name: string
  id: string
  border_color: string
  set: string
  set_name: string
  scryfall_uri: string
  prices: {
    eur: string | null
    eur_foil: string | null
  }
  purchase_uris?: {
    cardmarket: string
    [key: string]: string
  }
}

export interface ISavedUrl {
  name: string
  mkm_id: string
  url: string
}

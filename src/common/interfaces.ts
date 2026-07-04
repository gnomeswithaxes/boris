export interface IPinnedList {
  url: string
  title: string
}

export interface IInternalCardModel {
  name: string
  set: string
  amount: number
}

export interface IScryfallCard {
  name: string
  id: string
  border_color: string
  set_name: string
  scryfall_uri: string
  prices: {
    eur: string | null
    eur_foil: string | null
  }
  image_uris?: {
    small: string
    [key: string]: string
  }
  card_faces?: Array<{
    image_uris: {
      small: string
      [key: string]: string
    }
  }>
  purchase_uris?: {
    cardmarket: string
    [key: string]: string
  }
  set_uri: string
}

export interface ISavedUrl {
  name: string
  mkm_id: string
  url: string
}

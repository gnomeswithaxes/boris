export interface IPinnedList {
    url: string,
    title: string
}

export interface IInternalCardModel {
    name: string, set: string, amount: number
}

export interface IScryfallCard {
    name: string,
    [key: string]: any
}

export interface ISavedUrl {
    name: string,
    mkm_id: string,
    url: string
}

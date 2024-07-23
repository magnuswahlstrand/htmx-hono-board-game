export type HtmxProps = {
    hx_swap_oob?: string | boolean
}

export type Health = {
    current: number
    max: number
}

export function TypedObjectKeys<T extends object>(obj: T) {
    return Object.keys(obj) as (keyof typeof obj)[];
}
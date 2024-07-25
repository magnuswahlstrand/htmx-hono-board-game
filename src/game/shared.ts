export type HtmxProps = {
    hx_swap_oob?: string | boolean
}

export function TypedObjectKeys<T extends object>(obj: T) {
    return Object.keys(obj) as (keyof typeof obj)[];
}
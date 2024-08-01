export type HtmxProps = {
    hx_swap_oob?: string | boolean
}

export function TypedObjectKeys<T extends object>(obj: T) {
    return Object.keys(obj) as (keyof typeof obj)[];
}

export const poisonIcon = 'https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/card_poison.png';
export const defenseIcon = 'https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/card_defend.png';
export const stunIcon = 'https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/card_stun.png';
export const Monsters = {
    lizard: {
        name: 'Lizard Man',
        url: 'https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/FlameDemon%20Evolved.png'
    }
} as const
export type MonsterType = keyof typeof Monsters
export type MonsterState = {
    type: MonsterType
    health: {
        current: number
        max: number
    }
}
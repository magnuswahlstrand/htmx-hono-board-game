import {Health, Status} from "./types";

export const UIMonsters = {
    goblin: {
        name: 'Goblin',
        targetName: 'the goblin',
        url: 'https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/monster_goblin.png'
    },
    // lizard: {
    //     name: 'Lizard Man',
    //     targetName: 'the lizard man',
    //     url: 'https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/FlameDemon%20Evolved.png'
    // },
    // lizard_small: {
    //     name: 'Lizard Man',
    //     targetName: 'the lizard man',
    //     url: 'https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/FlameDemon.png'
    // }
} as const
export type MonsterType = keyof typeof UIMonsters

export type MonsterAction = {
    attack?: number
    defense?: number
}

export type InitialMonsterState = {
    type: MonsterType
    maxHealth: number
}
export type MonsterState = {
    type: MonsterType
    health: Health
    nextAction?: MonsterAction
    status: Status
    defense: number;
}

export const Monsters: Record<MonsterType, InitialMonsterState> = {
    goblin: {
        type: 'goblin',
        maxHealth: 30
    },
    // lizard: {
    //     type: 'lizard',
    //     maxHealth: {
    //         current: 35,
    //         max: 35
    //     }
    // },
    // lizard_small: {
    //     type: 'lizard_small',
    //     maxHealth: {
    //         current: 20,
    //         max: 20
    //     }
    // }
} as const

export const MonsterActions: Record<MonsterType, (round: number) => MonsterAction> = {
    goblin: (round) => {
        return (round % 2) ? {attack: 4} : {attack: 2}
    },
    // lizard: (round) => {
    //     return (round % 2) ? {attack: 5} : {attack: 3}
    // },
    // lizard_small: (round) => {
    //     return (round % 2) ? {attack: 5} : {attack: 7}
    // }
} as const
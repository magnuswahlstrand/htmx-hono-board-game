import {Health} from "./types";

export const UIMonsters = {
    lizard: {
        name: 'Lizard Man',
        url: 'https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/FlameDemon%20Evolved.png'
    },
    lizard_small: {
        name: 'Lizard Man',
        url: 'https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/FlameDemon.png'
    }
} as const
export type MonsterType = keyof typeof UIMonsters

export type MonsterAction = {
    attack: number | null
    defense: number | null
}

export type MonsterState = {
    type: MonsterType
    health: Health
    nextAction?: MonsterAction
}

export const Monsters: Record<MonsterType, MonsterState> = {
    lizard: {
        type: 'lizard',
        health: {
            current: 35,
            max: 35
        }
    },
    lizard_small: {
        type: 'lizard_small',
        health: {
            current: 20,
            max: 20
        }
    }
} as const
import {MonsterType, UIMonsters} from "./monsters";
import {Target} from "./stages/fightStage";


function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export type FightEvent = attackEvent | eotEvent | poisonEvent | stunEvent | turnSkipped | poisonDamageEvent
type attackEvent = {
    type: 'attack'
    source: Target
    target: Target
    damage: number
    defenseRemoved: number
}
type eotEvent = {
    type: 'end_of_turn'
    source: 'player'
}
type poisonEvent = {
    type: 'poison_applied'
    source: Target
    target: Target
    value: number
}
type poisonDamageEvent = {
    type: 'poison_damage'
    source: Target
    value: number
}

type stunEvent = {
    type: 'stun'
    source: Target
    target: Target
    value: number
}
type turnSkipped = {
    type: 'turn_skipped'
    source: Target
    reason: 'stunned'
}

export function formatEvent(event: FightEvent, monsterType: MonsterType) {
    switch (event.type) {
        case "attack":
            const logMonsterName = UIMonsters[monsterType].targetName
            if (event.source === "player") {
                return `You attack ${logMonsterName} for ${event.damage} damage.`
            } else {
                return `${capitalize(logMonsterName)} attacks you for ${event.damage} damage.`
            }
        case "stun":
            if (event.source === "player") {
                return `You stun ${UIMonsters[monsterType].targetName}.`
            } else {
                return `${capitalize(UIMonsters[monsterType].targetName)} stuns you.`
            }
        case "turn_skipped":
            if (event.source === "player") {
                return `You are stunned and cannot act.`
            } else {
                return `${capitalize(UIMonsters[monsterType].targetName)} is stunned and cannot act.`
            }
        case "poison_applied":
            if (event.source === "player") {
                return `${capitalize(UIMonsters[monsterType].targetName)} is poisoned for ${event.value}.`
            } else {
                return `You are poisoned for ${event.value}.`
            }
        case "poison_damage":
            if (event.source === "player") {
                return `You took ${event.value} poison damage.`
            } else {
                return `${capitalize(UIMonsters[monsterType].targetName)} took ${event.value} poison damage.`
            }

        case "end_of_turn":
            return `Your turn ended.`

        default:
            return event satisfies never
    }
}
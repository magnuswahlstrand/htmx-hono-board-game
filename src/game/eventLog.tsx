import {MonsterType, UIMonsters} from "./monsters";
import {Target} from "./stages/fightStage";


function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export type FightAction = {
    source: Target
    target?: Target
    effects: FightEffect[]
}

export type FightEffect = attackEvent | eotEvent | poisonEvent | stunEvent | turnSkipped | poisonDamageEvent
type attackEvent = {
    type: 'attack'
    value: number
}
type eotEvent = {
    type: 'end_of_turn'
}
type poisonEvent = {
    type: 'poison_applied'
    value: number
}
type poisonDamageEvent = {
    type: 'poison_damage'
    value: number
}

type stunEvent = {
    type: 'stun'
    value: number
}
type turnSkipped = {
    type: 'turn_skipped'
    reason: 'stunned'
}


function foobar(effect: FightEffect, isFirst: boolean, monsterType: MonsterType, source: Target, target?: Target) {
    const prefix = isFirst ? '' : ', and '
    const postfix = (isFirst && target) ? target === "player" ? "you" : UIMonsters[monsterType].targetName : ''
    let out

    switch (effect.type) {
        case "attack": {
            const verb = source === "player" ? "deal" : "deals"
            out = `${verb} ${effect.value} damage` + (isFirst ? " to " : "")
            break
        }
        case "stun":
            const verb = source === "player" ? "stun" : "stuns"
            out = `${verb} ` + (isFirst ? "" : (target === "player" ? "you" : "it"))
            break
        case "turn_skipped": {
            const verb = source === "player" ? "are stunned" : "is stunned"
            out = `${verb} and cannot act`
            break
        }
        case "poison_applied": {
            const verb = "apply"
            out = `${verb} ${effect.value} poison` + (isFirst ? " to " : "")
            break
        }
        case "poison_damage":
            return ''
        case "end_of_turn":
            return ''
        default:
            return effect satisfies never
    }

    return prefix + out + postfix
}

export function formatEvents(action: FightAction, monsterType: MonsterType) {
    const actor = action.source === "player" ? "You" : capitalize(UIMonsters[monsterType].targetName)

    const log = [
        actor + " ",
    ]


    action.effects.forEach((effect, i) => {
        log.push(foobar(effect, i === 0, monsterType, action.source, action.target))
    })

    log.push(".")
    return log.join("")

    //
    //
    //
    // switch (action.type) {
    //     case "attack":
    //         const logMonsterName = UIMonsters[monsterType].targetName
    //         if (action.source === "player") {
    //             return `You attack ${logMonsterName} for ${action.damage} damage.`
    //         } else {
    //             return `${capitalize(logMonsterName)} attacks you for ${action.damage} damage.`
    //         }
    //     case "stun":
    //         if (action.source === "player") {
    //             return `You stun ${UIMonsters[monsterType].targetName}.`
    //         } else {
    //             return `${capitalize(UIMonsters[monsterType].targetName)} stuns you.`
    //         }
    //     case "turn_skipped":
    //         if (action.source === "player") {
    //             return `You are stunned and cannot act.`
    //         } else {
    //             return `${capitalize(UIMonsters[monsterType].targetName)} is stunned and cannot act.`
    //         }
    //     case "poison_applied":
    //         if (action.source === "player") {
    //             return `${capitalize(UIMonsters[monsterType].targetName)} is poisoned for ${action.value}.`
    //         } else {
    //             return `You are poisoned for ${action.value}.`
    //         }
    //     case "poison_damage":
    //         if (action.source === "player") {
    //             return `You took ${action.value} poison damage.`
    //         } else {
    //             return `${capitalize(UIMonsters[monsterType].targetName)} took ${action.value} poison damage.`
    //         }
    //
    //     case "end_of_turn":
    //         return `Your turn ended.`
    //
    //     default:
    //         return action satisfies never
    // }
}
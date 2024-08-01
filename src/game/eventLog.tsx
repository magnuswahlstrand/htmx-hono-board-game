import {Target} from "./stages/fightStage";


export type FightAction =
    attackEvent
    | eotEvent
    | poisonEvent
    | stunEvent
    | turnSkipped
    | poisonDamageEvent
    | healEvent
    | defendEvent
    | curePoisonEvent
type attackEvent = {
    type: 'attack'
    actor: Target
    value: number
}
type eotEvent = {
    type: 'end_of_turn'
    actor: Target
}
type poisonEvent = {
    type: 'poison_applied'
    actor: Target
    value: number
}
type poisonDamageEvent = {
    type: 'poison_damage'
    actor: Target
    value: number
}

type stunEvent = {
    type: 'stun'
    actor: Target
    value: number
}
type turnSkipped = {
    type: 'turn_skipped'
    actor: Target
    reason: 'stunned'
}

type healEvent = {
    type: 'heal'
    actor: Target
    value: number
}

type defendEvent = {
    type: 'defend'
    actor: Target
    value: number
}


type curePoisonEvent = {
    type: 'cure_poison'
    actor: Target
}


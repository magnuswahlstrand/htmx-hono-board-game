import {FightState} from "./fightStage";


export const applyDamage = (currentHealth: number, damage: number) => {
    return Math.max(0, currentHealth - damage)
}

export const dealDamage = (state: FightState, damage: number) => {
    state.monster.health.current = applyDamage(state.monster.health.current, damage)
}
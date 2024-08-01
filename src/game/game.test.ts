import {expect, test} from "vitest";
import {formatEvents} from "./eventLog";

test('event log', () => {

    const attackEvent = {type: 'attack', value: 5} as const
    const stunEvent = {type: 'stun', value: 1} as const
    const poisonedEvent = {type: 'poison_applied', value: 2} as const

    let res = formatEvents({
        source: 'player', target: 'monster',
        effects: [attackEvent]
    }, 'goblin')
    expect(res).to.equal('You deal 5 damage to the goblin.')

    res = formatEvents({
        source: 'player', target: 'monster',
        effects: [attackEvent, poisonedEvent]
    }, 'goblin')
    expect(res).to.equal('You deal 5 damage to the goblin, and apply 2 poison.')

    res = formatEvents({
        source: 'player', target: 'monster',
        effects: [attackEvent, poisonedEvent, stunEvent]
    }, 'goblin')
    expect(res).to.equal('You deal 5 damage to the goblin, and apply 2 poison, and stun it.')

    res = formatEvents({
        source: 'player', target: 'monster',
        effects: [stunEvent, poisonedEvent, attackEvent]
    }, 'goblin')
    expect(res).to.equal('You stun the goblin, and apply 2 poison, and deal 5 damage.')

    res = formatEvents({
        source: 'player', target: undefined,
        effects: [{type: 'turn_skipped', reason: 'stunned'}]
    }, 'goblin')
    expect(res).to.equal('You are stunned and cannot act.')

})
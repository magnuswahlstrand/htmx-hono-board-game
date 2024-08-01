import {expect, test} from "vitest";
import {FightAction, formatEvents} from "./eventLog";
import {groupAndFormatLog} from "../components/screens/FightStage";

test('event log', () => {

    const attackEvent: FightAction = {actor: 'player', type: 'attack', value: 5} as const
    const poisonedEvent: FightAction = {actor: 'player', type: 'poison_applied', value: 2} as const
    const stunEvent: FightAction = {actor: 'player', type: 'stun', value: 1} as const
    const healEvent: FightAction = {actor: 'player', type: 'heal', value: 6} as const

    let res = groupAndFormatLog([
        [attackEvent, poisonedEvent],
        [poisonedEvent],
        [stunEvent],
        [healEvent]
    ])

    expect(res[0]?.actor).to.equal('player')
    expect(res[0]?.log).to.deep.equal([
            'Dealt 5 damage & applied 2 poison',
            'Applied 2 poison',
            'Stunned',
            'Healed for 6 hit points'
        ]
    )

    res = groupAndFormatLog([
        [attackEvent, poisonedEvent],
        [{actor: 'monster', type: 'poison_applied', value: 2}],
        [attackEvent, poisonedEvent],
    ])

    expect(res).to.deep.equal([
        {
            actor: 'player',
            log: [
                'Dealt 5 damage & applied 2 poison',
            ]
        },
        {
            actor: 'monster',
            log: [
                'Applied 2 poison',
            ]
        },
        {
            actor: 'player',
            log: [
                'Dealt 5 damage & applied 2 poison',
            ]
        },
    ])
})
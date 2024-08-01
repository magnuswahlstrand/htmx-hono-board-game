import {cardsWithId, initialState, setupFight} from "./setup";
import {expect, test} from "vitest";
import {FightState, resumeFightLoopWithAction, runFightLoop, setMonsterAction} from "./fightStage";
import {Monsters} from "./monsters";


const assertHelper = (stage: FightState) => ({
    round: stage.round,
    currentActor: stage.currentActor,
    player: {
        drawPile: stage.player.drawPile.map(c => c.type),
        discardPile: stage.player.discardPile.map(c => c.type),
        hand: stage.player.hand.map(c => c.type),
    },
    monsterHp: stage.monster.health.current
})

const playHands = (stage: FightState, cards: string[]) => {
    for (let card of cards) {
        const c = stage.player.hand.find((c) => c.type == card)
        if (!c) throw new Error(`Card ${c} not found in hand`)
        resumeFightLoopWithAction(stage, {type: 'play_card', cardId: c.id})
    }
}

test('fight loop', () => {
    const stage = setupFight(initialState.player, Monsters['lizard'])
    stage.player.drawPile = cardsWithId(['big_punch', 'big_punch', 'big_punch', 'big_punch', 'big_punch'])
    runFightLoop(stage)

    // Assert
    expect(assertHelper(stage)).to.deep.contain({
        round: 1,
        currentActor: 'player',
        player: {
            drawPile: ['big_punch', 'big_punch'],
            hand: ['big_punch', 'big_punch', 'big_punch'],
            discardPile: [],
        },
        monsterHp: 35,
    })

    playHands(stage, ['big_punch', 'big_punch'])

    // Assert
    expect(assertHelper(stage)).to.deep.contain({
        round: 1,
        currentActor: 'player',
        player: {
            drawPile: ['big_punch', 'big_punch'],
            hand: ['big_punch'],
            discardPile: ['big_punch', 'big_punch'],
        }
    })

    playHands(stage, ['big_punch'])
    resumeFightLoopWithAction(stage, {type: 'end_turn'})

    // Assert
    // New round, player draws 3 cards
    expect(assertHelper(stage)).to.deep.contain({
        round: 2,
        currentActor: 'player',
        player: {
            drawPile: ['big_punch', 'big_punch'],
            hand: ['big_punch', 'big_punch', 'big_punch'],
            discardPile: [],
        },
        monsterHp: 5,
    })


    playHands(stage, ['big_punch'])
    // Assert
    // Final move, should kill monster
    expect(assertHelper(stage)).to.deep.contain({
        round: 2,
        currentActor: 'player',
        monsterHp: 0,
    })
})

test('monster actions', () => {
    const res = setMonsterAction(Monsters['lizard'], 1)
    expect(res).to.deep.equal({
        attack: 3,
        defense: 3
    })
})
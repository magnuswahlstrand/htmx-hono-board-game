import {cardsWithId, initialState, setupFight} from "./setup";
import {expect, test} from "vitest";
import {FightState, resumeFightLoopWithAction, runFightLoop} from "./fightStage";
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
    stage.player.drawPile = cardsWithId(['punch_through', 'punch_through', 'punch_through', 'punch_through', 'punch_through'])
    runFightLoop(stage)

    // Assert
    expect(assertHelper(stage)).to.deep.contain({
        round: 1,
        currentActor: 'player',
        player: {
            drawPile: ['punch_through', 'punch_through'],
            hand: ['punch_through', 'punch_through', 'punch_through'],
            discardPile: [],
        },
        monsterHp: 35,
    })

    playHands(stage, ['punch_through', 'punch_through'])

    // Assert
    expect(assertHelper(stage)).to.deep.contain({
        round: 1,
        currentActor: 'player',
        player: {
            drawPile: ['punch_through', 'punch_through'],
            hand: ['punch_through'],
            discardPile: ['punch_through', 'punch_through'],
        }
    })

    playHands(stage, ['punch_through'])
    resumeFightLoopWithAction(stage, {type: 'end_turn'})

    // Assert
    // New round, player draws 3 cards
    expect(assertHelper(stage)).to.deep.contain({
        round: 2,
        currentActor: 'player',
        player: {
            drawPile: ['punch_through', 'punch_through'],
            hand: ['punch_through', 'punch_through', 'punch_through'],
            discardPile: [],
        },
        monsterHp: 5,
    })


    playHands(stage, ['punch_through'])
    // Assert
    // Final move, should kill monster
    expect(assertHelper(stage)).to.deep.contain({
        round: 2,
        currentActor: 'player',
        monsterHp: 0,
    })
})
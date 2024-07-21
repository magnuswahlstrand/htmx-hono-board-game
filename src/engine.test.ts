import {expect, test} from 'vitest'
import {Game, MoveFunc} from "./engine";


type Card = {}


type MyGameState = {
    deck: Card[]
    hand: Card[]
}


const initialState: MyGameState = {
    deck: [],
    hand: [],
}

const playCard: MoveFunc<MyGameState> = (G, ctx, handPosition: number) => {
    // Get card
    const card = G.hand[handPosition]
    if (!card) {
        return 'INVALID'
    }

    // Remove card from hand
    G.hand.splice(handPosition, 1)
    return 'SUCCESS'
}

const cardGame = new Game({
    state: initialState,
    moves: {
        playCard,
    }
});

cardGame.moves.playCard(1)

test('Game', () => {
    expect(cardGame.moves.playCard(-1)).toBe('INVALID')
})
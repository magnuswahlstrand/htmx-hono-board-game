// import {expect, test} from 'vitest'


type GameContext = {
    currentPlayer: string
}


type Card = {}

type MyGameState = {
    deck: Card[]
    hand: Card[]
    cells: Array<string | null>
}

type MoveFunction<G> = (G: G, ctx: GameContext, ...args: any[]) => void;

const moves2 = {
    foo: () => {
    },
    bar: () => {
    },
}

type Game<GameState> = {
    // setup: () => ({cells: Array(9).fill(null)}),
    name: string
    moves: {
        [K: string]: MoveFunction<GameState>
    }
}

const g: Game<MyGameState> = {
    name: 'my-game',
    moves: {
        drawCard: (G, ctx) => {
            const card = G.deck.pop();
            if (card) {
                G.hand.push(card);
            }
        },
        playCard: (G, ctx) => {
            G.cells
            G.cells[id] = ctx.currentPlayer;

        }
    }
} as const


//
// test('adds 1 + 2 to equal 3', () => {
//     const game: Game = {
//         name: 'my-game',
//         moves: {
//             playCard: (G, ctx, id) => {
//                 G.cells[id] = ctx.currentPlayer;
//             }
//         }
//     }
//
//
//     expect(sum(1, 2)).toBe(3)
// })
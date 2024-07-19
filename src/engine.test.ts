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

const aState

type MoveFunction<G> = (G: G, ctx: GameContext, ...args: any[]) => void;
const myFunc = (G: MyGameState, ctx: GameContext, id: number) => {
}

type Remove<T extends any[]> = T extends [any, any, ...infer U] ? U : never
type RemoveFirstParam<T extends (...args: any[]) => any> = (...args: Remove<Parameters<T>>) => ReturnType<T>
const myFunc2: RemoveFirstParam<MoveFunction<MyGameState>> = (foo: number) => {
}
type Remove2<T extends any[]> = T extends [any, any, ...infer U] ? U : never
type RemoveTwoParams<T extends (...args: any[]) => any> = (...args: Remove2<Parameters<T>>) => ReturnType<T>

// Removing args ✅


// https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
type PublicMoves<T extends Record<string, (...args: any[]) => any>> = {
    [Property in keyof T]: RemoveTwoParams<T[Property]>
}

// const g: Game<MyGameState> = {
const g = {
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

// Strip arguments from function type

class Game<GameState, R extends Record<string, MoveFunction<GameState> {
    readonly state: GameState
    private readonly context: GameContext
    moves: PublicMoves<R>

    constructor(args: {
        state: GameState,
        moves: R
    }) {
        this.state = args.state;
        this.context = {
            currentPlayer: '1',
        }
        this.moves = this.transformedMoves(args.moves)
    }

    private transformedMoves(moves: R): PublicMoves<R> {
        return (Object.entries(moves) as [keyof R, MoveFunction<G>][]).reduce((acc, [key, value]) => {
            // TODO: Can this be handled with generics?
            // @ts-ignore
            acc[key] = (...args: any[]) => {
                value(this.state, this.context, ...args)
            }
            return acc
        }, {} as PublicMoves<R>)
    }
}

const initialState = {
    deck: [] as Card[],
    hand: [] as Card[],
    cells: Array(9).fill(null)
} as const

const foo = new Game({
    state: initialState,
    moves: {
        playCard: (G, ctx, handPosition: number) => {
            const card = G.hand[handPosition]
            if (!card) {
                return 'INVALID_MOVE'
            }
        },
        drawCard: (G, ctx, id: string) => {
        }
    }
});

foo.moves.playCard(1)
foo.moves.drawCard('1')


test('adds 1 + 2 to equal 3', () => {


    expect(sum(1, 2)).toBe(3)
})
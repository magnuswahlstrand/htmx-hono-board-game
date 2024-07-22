type gameOverDraw = {
    draw: true
}
type gameOverWinner = {
    winner: string
}

type GameOver = gameOverDraw | gameOverWinner
type GameOverFunc<GameState> = (main: Main<GameState>) => GameOver | undefined

export type GameContext = {
    gameOver?: GameOver;
    currentPlayer: string
    playOrder: string[]
}

// TODO: Rename
export type Main<GameState> = {
    G: GameState,
    ctx: GameContext
}

type Turns<GameState> = {
    endIf: (m: Main<GameState>) => boolean
}

export type MoveFunc<GameState> = (main: Main<GameState>, ...args: any[]) => unknown;
// TODO: We could narrow this to include GameState and GameContext
type RemoveFirstItems<T extends any[]> = T extends [any, ...infer U] ? U : never
type RemoveFirstParams<T extends (...args: any[]) => any> = (...args: RemoveFirstItems<Parameters<T>>) => void
// https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
type PublicMoves<T extends Record<string, (...args: any[]) => any>> = {
    [Property in keyof T]: RemoveFirstParams<T[Property]>
}

export class Game<GameState, InitialMoves extends Record<string, MoveFunc<GameState>>> {
    readonly state: GameState
    readonly ctx: GameContext
    moves: PublicMoves<InitialMoves>
    private readonly turns: Turns<GameState>
    private readonly endIf: GameOverFunc<GameState>

    constructor(args: {
        state: GameState,
        moves: InitialMoves,
        turns?: Turns<GameState>
        endIf?: GameOverFunc<GameState>,
    }) {
        this.state = structuredClone(args.state);
        this.ctx = {
            currentPlayer: '0',
            playOrder: [
                "0",
                "1"
            ]
        }
        // TODO: Move to defaultTurns
        this.turns = args.turns ? args.turns : {
            endIf: ({G, ctx}) => true
        }
        this.endIf = args.endIf ? args.endIf : (({G, ctx}) => {
        }) as GameOverFunc<GameState>

        this.moves = this.transformedMoves(args.moves)
    }

    private transformedMoves(moves: InitialMoves): PublicMoves<InitialMoves> {
        return Object.entries(moves).reduce((acc, [key, value]) => {
            // TODO: Can this be handled with generics?
            // @ts-ignore
            acc[key] = (...args: any[]) => {
                // TODO: Stop if game is over
                if (this.ctx.gameOver) {
                    return 'INVALID'
                }

                const res = value({G: this.state, ctx: this.ctx}, ...args)
                if (res === 'INVALID') {
                    return res
                }


                const gameOver = this.endIf({G: this.state, ctx: this.ctx})
                if (gameOver) {
                    this.ctx.gameOver = gameOver
                    console.log("End game", gameOver)
                    return 'SUCCESS'
                }

                if (this.turns.endIf({G: this.state, ctx: this.ctx})) {
                    const nextPlayerIndex = (this.ctx.playOrder.indexOf(this.ctx.currentPlayer) + 1) % this.ctx.playOrder.length
                    this.ctx.currentPlayer = this.ctx.playOrder[nextPlayerIndex]!
                    console.log("End turn, next player", this.ctx.currentPlayer)
                    return 'SUCCESS'
                }

                return 'SUCCESS'
            }
            return acc
        }, {} as PublicMoves<InitialMoves>)
    }
}


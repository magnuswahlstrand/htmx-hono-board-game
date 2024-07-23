type gameOverDraw = {
    draw: true
}
type gameOverWinner = {
    winner: string
}

type GameOver = gameOverDraw | gameOverWinner
export type GameOverFunc<GameState> = (main: Main<GameState>) => GameOver | undefined

export type GameContext = {
    gameOver?: GameOver;
    currentPlayer: string
    playOrder: string[]
}

type EventTypes = 'end_turn'

export type GameEvents = {
    queue: Set<EventTypes>
    endTurn: () => void
}


// TODO: Rename
export type Main<GameState> = {
    G: GameState,
    ctx: GameContext
    events: GameEvents
}

type Turns<GameState> = {
    before?: (m: Main<GameState>) => void
    endIf?: (m: Main<GameState>) => boolean
    after?: (m: Main<GameState>) => void
}

export type MoveFunc<GameState> = (main: Main<GameState>, ...args: any[]) => unknown;
// TODO: We could narrow this to include GameState and GameContext
type RemoveFirstItems<T extends any[]> = T extends [any, ...infer U] ? U : never
type RemoveFirstParams<T extends (...args: any[]) => any> = (...args: RemoveFirstItems<Parameters<T>>) => void
// https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
export type PublicMoves<T extends Record<string, (...args: any[]) => any>> = {
    [Property in keyof T]: RemoveFirstParams<T[Property]>
}

export class Game<GameState, InitialMoves extends Record<string, MoveFunc<GameState>>> {
    readonly state: GameState
    readonly ctx: GameContext
    readonly events: GameEvents
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
            // TODO: Don't hardcode
            currentPlayer: '0',
            playOrder: [
                "0",
            ]
        }
        this.events = {
            queue: new Set<EventTypes>(),
            endTurn: () => {
                console.log("End turn")
            }
        }

        // TODO: Move to defaultTurns
        this.turns = args.turns ? args.turns : {
            endIf: () => true,
        }
        this.endIf = args.endIf ? args.endIf : (({G, ctx}) => {
        }) as GameOverFunc<GameState>

        this.moves = this.transformedMoves(args.moves)
    }

    private onEndTurn() {
        this.turns.after?.({
            G: this.state,
            ctx: this.ctx,
            events: this.events
        })
        const nextPlayerIndex = (this.ctx.playOrder.indexOf(this.ctx.currentPlayer) + 1) % this.ctx.playOrder.length
        this.ctx.currentPlayer = this.ctx.playOrder[nextPlayerIndex]!
        console.log("End turn, next player", this.ctx.currentPlayer)
    }

    // TODO: Make private
    evaluateGameLoop() {
        // TODO: Merge events with functions below
        if (this.events.queue.has('end_turn' || this.turns.endIf?.({
            G: this.state,
            ctx: this.ctx,
            events: this.events
        }))) {
            this.onEndTurn()
        }
        this.events.queue.delete('end_turn')

        const gameOver = this.endIf({G: this.state, ctx: this.ctx, events: this.events})
        if (gameOver) {
            this.ctx.gameOver = gameOver
        }

        return 'SUCCESS'
    }

    private transformedMoves(moves: InitialMoves): PublicMoves<InitialMoves> {
        const game = this
        return Object.entries(moves).reduce((acc, [key, value]) => {
            // TODO: Can this be handled with generics?
            // @ts-ignore
            acc[key] = (...args: any[]) => {
                // TODO: Stop if game is over
                if (this.ctx.gameOver) {
                    return 'INVALID'
                }

                const res = value({G: this.state, ctx: this.ctx, events: this.events}, ...args)
                if (res === 'INVALID') {
                    return res
                }

                return game.evaluateGameLoop()
            }
            return acc
        }, {} as PublicMoves<InitialMoves>)
    }

}


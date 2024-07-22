import {Game, Main} from "../engine";

export type TicTacToeState = {
    cells: string[]
}
const defaultState: TicTacToeState = {
    cells: Array(9).fill(null),
}
export const pickCell = ({G}: Main<TicTacToeState>, playerId: string, cellNumber: number) => {
    // Get card
    G.cells[cellNumber] = playerId
    return 'SUCCESS'
}
export const endIf = ({G}: Main<TicTacToeState>) => {
    const combinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ] as const
    // Check for winner
    for (const combination of combinations) {
        const [a, b, c] = combination

        const player = G.cells[a]
        if (player && player === G.cells[b] && player === G.cells[c]) {
            console.log("Winner", player, a, b, c)
            return {winner: player} as const
        }
    }

    // Draw
    if (G.cells.every(cell => cell !== null)) {
        return {draw: true} as const
    }

    return;
}


const moves = {
    pickCell,
}

export class TicTacToe extends Game<TicTacToeState, typeof moves> {
    constructor(initialState?: TicTacToeState) {
        super({
            state: initialState || defaultState,
            moves,
            endIf
        })
    }
}

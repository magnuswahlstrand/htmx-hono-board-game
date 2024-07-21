import {describe, expect, it} from 'vitest'
import {Game} from "../engine";
import {endIf, defaultState, pickCell} from "./tictactoe";


const TicTacToeDefinition = {
    state: defaultState,
    moves: {
        pickCell,
    },
    endIf
};
new Game(TicTacToeDefinition)

describe('TicTacToe', () => {
    it('should be draw', () => {
        const ticTacToe = new Game(TicTacToeDefinition);

        ticTacToe.moves.pickCell("0", 0)
        ticTacToe.moves.pickCell("1", 1)
        ticTacToe.moves.pickCell("0", 2)

        ticTacToe.moves.pickCell("1", 6)
        ticTacToe.moves.pickCell("0", 7)
        ticTacToe.moves.pickCell("1", 8)

        ticTacToe.moves.pickCell("0", 3)
        ticTacToe.moves.pickCell("1", 4)
        ticTacToe.moves.pickCell("0", 5)
        expect(ticTacToe.ctx.gameOver).to.deep.equal({draw: true})
    })

    it('can be won', () => {
        console.log(defaultState)
        const ticTacToe = new Game(TicTacToeDefinition);

        expect(ticTacToe.ctx.currentPlayer).toBe("0")

        ticTacToe.moves.pickCell("0", 0)
        expect(ticTacToe.ctx.currentPlayer).toBe("1")

        ticTacToe.moves.pickCell("1", 3)
        expect(ticTacToe.ctx.currentPlayer).toBe("0")

        ticTacToe.moves.pickCell("0", 1)
        ticTacToe.moves.pickCell("0", 2)

        expect(ticTacToe.ctx.gameOver).to.deep.equal({winner: "0"})
    })

})
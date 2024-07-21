import {TicTacToeState} from "../games/tictactoe";

const Cell = ({value}: { value: string | null }) => {
    return <div class="cell">{value ? value : '-'}</div>
}

const Board = ({state}: { state: TicTacToeState }) => {
    return <div id="board">
        {state.cells.map((player) => <Cell value={player}/>)}
    </div>
}

export default Board
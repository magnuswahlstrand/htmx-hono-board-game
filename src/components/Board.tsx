import {TicTacToeState} from "../game/tictactoe";

const cellStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100px",
    height: "100px",
    border: "1px solid black",
    cursor: "pointer",
}

const Cell = ({value, index, gameId}: { value: string | null, index: number, gameId: string }) => {
    return <div style={cellStyle}
                hx-post={`/game/${gameId}/cell/${index}`}
                hx-target="#board"
                hx-swap="outerHTML"
    >{value ? value : '-'}</div>
}

const Board = ({state, gameId}: { state: TicTacToeState, gameId: string }) => {
    console.log('foo', state)
    return <div id="board">
        {state.cells.map((player, index) => <Cell value={player} index={index} gameId={gameId}/>)}
    </div>
}

export default Board
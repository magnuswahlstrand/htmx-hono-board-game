import {Game2State} from "../games/game2/game2";
import FightStage from "./FightStage";

const Game = ({state, gameId, swap = false}: { state: Game2State, gameId: string, swap?: boolean }) => {
    return (
        <div id="game" class="game" hx-swap-oob={swap}>
            <FightStage state={state.stage} gameId={gameId}/>
        </div>
    )
}

export default Game

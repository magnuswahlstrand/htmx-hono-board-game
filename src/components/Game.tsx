import FightStage from "./FightStage";
import {Game2State} from "../game/types";

const Game = ({state, gameId, swap = false}: { state: Game2State, gameId: string, swap?: boolean }) => {
    return (
        <div id="game" class="game" hx-swap-oob={swap}>
            <FightStage state={state.stage} gameId={gameId}/>
        </div>
    )
}

export default Game

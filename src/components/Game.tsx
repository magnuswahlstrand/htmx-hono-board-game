import FightStage from "./screens/FightStage";
import {Game2State} from "../game/types";
import RewardScreen from "./screens/RewardScreen";

const Game = ({state, gameId, swap = false}: { state: Game2State, gameId: string, swap?: boolean }) => {
    if (state.stage?.label === 'fight') {
        return <div id="game" class="game" hx-swap-oob={swap}><FightStage state={state.stage} gameId={gameId}/></div>
    } else if (state.stage?.label === 'reward') {
        return <div id="game" class="game" hx-swap-oob={swap}><RewardScreen state={state.stage} gameId={gameId}/></div>
    } else {
        return <div id="game" class="game" hx-swap-oob={swap}>Unknown stage</div>
    }
}

export default Game

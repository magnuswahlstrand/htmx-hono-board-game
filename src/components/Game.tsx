import FightStage from "./screens/FightStage";
import {Game2State} from "../game/types";
import RewardScreen from "./screens/RewardScreen";
import {Header} from "./Header";
import MapStage from "./screens/MapStage";

type Props = { state: Game2State, gameId: string, swap?: boolean }

const Game = ({state, gameId, swap = false}: Props) => {
    switch (state.stage?.label) {
        case 'fight':
            return <FightStage state={state.stage} gameId={gameId} swap={swap}/>
        case 'reward':
            return <RewardScreen state={state.stage} gameId={gameId} swap={swap}/>
        case 'map':
            return <MapStage state={state.stage} gameId={gameId} swap={swap}/>
        case undefined:
            return <div>Oh no, something went wrong</div>
        default:
            return state.stage satisfies never
    }
}

export default (props: Props) => {

    return <div id="game" class="game" hx-swap-oob={props.swap}>
        <Header state={props.state}/>
        <div id="game-inner">
            <Game {...props}/>
        </div>
    </div>
}

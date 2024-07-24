import {Pile} from "./Pile";
import {Hand} from "./Hand";
import {HtmxProps} from "../games/game2/shared";
import {PlayerFightState} from "../games/game2/fightStage";

type Props = {
    state: PlayerFightState
    gameId: string
} & HtmxProps

export function Player({state, gameId, hx_swap_oob}: Props) {
    return <div class="player" id="player" hx-swap-oob={hx_swap_oob}>
        <Pile state={state.drawPile} text={'Draw pile'}/>
        <Hand state={state.hand} gameId={gameId}/>
        <Pile state={state.discardPile} text={'Discard pile'}/>
    </div>;
}
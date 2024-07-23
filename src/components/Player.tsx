import {PlayerState} from "../games/game2/game2";
import {Pile} from "./Pile";
import {Hand} from "./Hand";
import {HtmxProps} from "../games/game2/shared";

type Props = {
    state: PlayerState
    gameId: string
} & HtmxProps

export function Player({state, gameId, hx_swap_oob}: Props) {
    return <div class="player" id="player" hx-swap-oob={hx_swap_oob}>
        <Pile state={state.drawPile}/>
        <Hand state={state.hand} gameId={gameId}/>
        <Pile state={state.discardPile}/>
    </div>;
}
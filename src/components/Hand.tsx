import HandCard from "./HandCard";
import {HtmxProps} from "../game/shared";
import {Card as CardType} from "../game/types";

type Props = {
    state: CardType[],
    gameId: string
} & HtmxProps

export function Hand({gameId, state, hx_swap_oob}: Props) {
    return <div class="hand" id="hand" hx-swap-oob={hx_swap_oob}>
        {state.map((card) => (
            <HandCard type={card.type} id={card.id} gameId={gameId}/>
        ))}
    </div>
}
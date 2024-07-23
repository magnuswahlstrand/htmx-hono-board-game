import type {Card as CardType} from "../games/game2/game2";
import Card from "./Card";
import {HtmxProps} from "../games/game2/shared";

type Props = {
    state: CardType[],
    gameId: string
} & HtmxProps

export function Hand({gameId, state, hx_swap_oob}: Props) {
    return <div class="hand" id="hand" hx-swap-oob={hx_swap_oob}>
        {state.map((card) => (
            <Card type={card.type} id={card.id} gameId={gameId}/>
        ))}
    </div>
}
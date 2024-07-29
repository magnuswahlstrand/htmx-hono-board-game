import HandCard from "./HandCard";
import {HtmxProps} from "../game/shared";
import {Card as CardType} from "../game/types";
import {css, Style} from "hono/css";

type Props = {
    state: CardType[],
    gameId: string
} & HtmxProps

const style = css`
    .hand {
        display: flex;
        gap: 0.5em;
    }
`

export function Hand({gameId, state, hx_swap_oob}: Props) {
    return <div class="hand" id="hand" hx-swap-oob={hx_swap_oob}>
        <Style>{style}</Style>

        {state.map((card, i) => {

            const offsetX = 4*Math.pow(i - state.length / 2 + 0.5, 2)-10
            const rotation = 5.0 * (i - state.length / 2 + 0.5)
            return <HandCard type={card.type} id={card.id} gameId={gameId}
                             rotation={rotation}
                             offsetY={offsetX}
            />
        })}
    </div>
}
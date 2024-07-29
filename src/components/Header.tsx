import {css} from "hono/css";
import {PropsWithChildren} from "hono/jsx";
import {Game2State} from "../game/types";
import {CenteredRow} from "./CenteredRow";

const Row = ({style, children}: PropsWithChildren<{ style?: Promise<string> }>) => {
    const s = css`
        display: flex;
        ${style};
    `

    return <div class={s}>
        {children}
    </div>

}

const IconItem = ({src, children}: PropsWithChildren<{ src: string }>) => {
    const style = css`
        display: flex;
        gap: 0.4em;
        align-items: center;
        justify-content: start;
    `

    return <div class={style}>
        <image src={src}/>
        {children}
    </div>
}

export function Header({state}: { state: Game2State }) {
    const style = css`
        padding: 0.3em 1em;
        color: white;
        justify-content: space-between
    `

    return <CenteredRow style={style} maxWidth={"50em"}>
        <Row style={css`gap:2em`}>
            <IconItem src="https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/heart.png">
                {state.player.health.current} / {state.player.health.max}
            </IconItem>

            <IconItem src="https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/gold_coins.png">
                {state.player.gold}
            </IconItem>

            <IconItem src="https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/start.png">
                10
            </IconItem>
        </Row>
        <IconItem src="https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/spell_book_open.png">
            {state.player.deck.length}
        </IconItem>
    </CenteredRow>
}

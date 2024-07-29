import {Cards} from "../game/cards";
import Card from "./Card";
import {css, Style} from "hono/css";

type Props = {
    type: keyof typeof Cards
    id: number
    gameId: string
    rotation: number
    offsetY: number
}

const style = css`
    .hand-card {
        margin: 0 -10px;
        position: relative;
    }
`

const HandCard = ({type, id, gameId, rotation, offsetY}: Props) => {

    return (
        <form hx-post={`/game/${gameId}/action`} hx-target="this" hx-swap="outerHTML">
            <Style>{style}</Style>
            <input type="hidden" name="type" value="play_card"/>
            <input type="hidden" name="cardId" value={id}/>
            <div class="hand-card" style={{transform: `rotate(${rotation}deg)`, marginTop: offsetY, position: "relative"}}>
                <Card type={type}/>
            </div>
        </form>
    )
}


export default HandCard

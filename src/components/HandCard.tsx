import {Cards} from "../game/cards";
import Card from "./Card";
import {css, Style} from "hono/css";

type Props = {
    type: keyof typeof Cards
    id: number
    gameId: string
    rotation: number
    offsetY: number
    disabled?: boolean
}

const style = css`
    .hand-card {
        margin: 0 -10px;
        position: relative;
    }
`

const HandCard = ({type, id, gameId, rotation, offsetY, disabled = false}: Props) => {

    const inner = <div className="hand-card"
                       style={{transform: `rotate(${rotation}deg)`, marginTop: offsetY, position: "relative"}}>
        <Style>{style}</Style>
         <Card type={type} disabled={disabled}/>
    </div>

    return (
        disabled ? inner : <form hx-post={`/game/${gameId}/action`} hx-target="this" hx-swap="outerHTML">
            <input type="hidden" name="type" value="play_card"/>
            <input type="hidden" name="cardId" value={id}/>
            {inner}
        </form>
    )
}


export default HandCard

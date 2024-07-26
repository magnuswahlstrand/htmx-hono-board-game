import {Cards} from "../game/cards";
import Card from "./Card";


type Props = {
    type: keyof typeof Cards
    id: number
    gameId: string
}

const HandCard = ({type, id, gameId}: Props) => {

    return (
        <form hx-post={`/v2/game/${gameId}/action`} hx-target="this" hx-swap="outerHTML">
            <input type="hidden" name="type" value="play_card"/>
            <input type="hidden" name="cardId" value={id}/>
            <Card type={type}/>
        </form>
    )
}


export default HandCard

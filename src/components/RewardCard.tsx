import {Cards} from "../game/cards";
import Card from "./Card";


type Props = {
    type: keyof typeof Cards
    gameId: string
}

const RewardCard = ({type, gameId}: Props) => {

    return (
        <form hx-post={`/game/${gameId}/reward`} hx-target="this" hx-swap="outerHTML">
            <input type="hidden" name="type" value="select_card"/>
            <input type="hidden" name="card" value={type}/>
            <Card type={type}/>
        </form>
    )
}


export default RewardCard

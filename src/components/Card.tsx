import {z} from "zod";
import {Cards} from "../games/game2/cards";




type Props = {
    type: keyof typeof Cards
    index: number
    gameId: string
}

const Card = ({type, index, gameId}: Props) => {
    const {title, description, url} = Cards[type]
    return (
        <form hx-post={`/v2/game/${gameId}/action`} hx-target="this" hx-swap="outerHTML">
            <input type="hidden" name="actionType" value="play_card"/>
            <input type="hidden" name="cardType" value={type}/>
            <input type="hidden" name="cardIndex" value={index}/>
            <button type="submit" class="card">
                <div class="header">{title}</div>
                <div>
                    <img src={url} alt={title}/>
                </div>
                <div class="description">{description}</div>
            </button>
        </form>
    )
}


export default Card

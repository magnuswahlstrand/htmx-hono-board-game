import {Cards} from "../game/cards";


type Props = {
    type: keyof typeof Cards
}

const Card = ({type}: Props) => {
    const {title, description, url} = Cards[type]
    return (
        <button type="submit" class="card">
            <div class="header">{title}</div>
            <div>
                <img src={url} alt={title}/>
            </div>
            <div class="description">{description}</div>
        </button>
    )
}

export default Card

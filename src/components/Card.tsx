import {Cards} from "../game/cards";


type Props = {
    type: keyof typeof Cards
    disabled?: boolean
}

const Card = ({type, disabled}: Props) => {
    const {title, description, url} = Cards[type]
    return (
        <button type="submit" class="card" disabled={disabled}>
            <div class="header">{title}</div>
            <div>
                <img src={url} alt={title} height={"48"}/>
            </div>
            <div class="description">{description}</div>
        </button>
    )
}

export default Card

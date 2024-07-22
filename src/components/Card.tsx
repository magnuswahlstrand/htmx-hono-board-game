const Cards = {
    stun: {
        title: "Stun",
        description: "Stun the enemy",
        url: 'https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/skill_icons5.png'
    },
    punch_through: {
        title: "Punch through!",
        description: "Deal 10 damage",
        url: 'https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/skill_icons41.png'
    }
} as const


type Props = {
    type: keyof typeof Cards
}

const Card = ({type}: Props) => {
    const {title, description, url} = Cards[type]
    return (
        <div class="card">
            <div class="header">{title}</div>
            <div>
                <img src={url} alt={title}/>
            </div>
            <div class="description">{description}            </div>
        </div>
    )
}

export default Card

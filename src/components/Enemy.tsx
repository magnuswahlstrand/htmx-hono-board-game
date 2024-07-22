import {css} from "hono/css";

const Enemies = {
    lizard: {
        name: 'Lizard Man',
        url: 'https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/BestialLizardfolk.gif'
    }
} as const

type Props = {
    type: keyof typeof Enemies
}

const imgClass = css`
    width: 20em;
    height: 20em;
`

const containerClass = css`
    display: flex;
    flex-direction: column;
    gap: 0.3em;
    align-items: center;
`

const meterClass = css`
    width: 100%;
    height: 3em;
`

const meterContainerClass = css`
    display: flex;
    width: 100%;
    align-items: center;
`

const meterText = css`
    white-space: nowrap;
    width: 70px;
    text-align: left;
`

const Enemy = ({type}: Props) => {
    const {url, name} = Enemies[type]


    return (<div class={containerClass}>
            <h1>{name}</h1>
            <img class={imgClass} src={url} alt={"enemy"}/>
            <div class={meterContainerClass}>
                <div class={meterText}>2 / 10</div>
                <meter value="2" min="0" max="10" class={meterClass}>2 out of 10</meter>
            </div>
        </div>
    )
}

export default Enemy

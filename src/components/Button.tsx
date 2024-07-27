import {PropsWithChildren} from "hono/jsx";
import {css, Style} from "hono/css";

type Props = {
    url?: string
}

const style = css`
    .button {
        font-family: Arial, Helvetica, sans-serif;
        background-color: grey;
        padding: 10px 24px;
        font-size: 1em;
        border: 3px solid black;
        cursor: pointer;
    }

    .button:hover {
        background-color: darkgrey;
    }
`

const Button = (props: PropsWithChildren<Props>) => {
    return (
        <>
            <Style>{style}</Style>
            <button type="submit" class="button">
                {props.children}
            </button>
        </>
    )
}
// hx_post={`/v2/game/${gameId}/reward`}
// hx_target="this"
// hx_swap="outerHTML"
// class="button" type="submit"
// name="type" value="skip_reward"


export default Button

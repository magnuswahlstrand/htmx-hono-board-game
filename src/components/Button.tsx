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
        white-space: nowrap;
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
export default Button

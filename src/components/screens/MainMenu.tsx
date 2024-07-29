import {CenteredRow} from "../CenteredRow";
import Button from "../Button";
import {css} from "hono/css";

const MainMenu = () => {

    const style = css`
        display: flex;
        flex-direction: column;
        gap: 1em;
    `
    return <CenteredRow maxWidth={"40em"}>
        <div className={style}>
            <h1>Game!</h1>
            <form hx-post={`/game`}>
                <Button>
                    New Game
                </Button>
            </form>

            <Button>
                Continue
            </Button>
        </div>
    </CenteredRow>
}

export default MainMenu

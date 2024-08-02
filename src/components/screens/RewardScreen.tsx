import {RewardState} from "../../game/stages/rewardStage";
import RewardCard from "../RewardCard";
import Button from "../Button";
import {css, Style} from "hono/css";
import {CenteredRow} from "../CenteredRow";

const style = css`
    .reward {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1em;
    }

    .reward-choices {
        display: flex;
        justify-content: space-between;
        width: 100%;
        gap: 1em;
    }
`

const RewardStage = ({state, gameId}: { state: RewardState, gameId: string, swap?: boolean }) => {
    return (
        <div id="reward" class="reward">
                <CenteredRow maxWidth={"40em"}>
            <div class={css`
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1em;
                background-color: white;
                border: 4px solid black;
                padding: 1em 4em;
            `}>
                    <Style>{style}</Style>
                    <h1>Victory</h1>
                    You defeated the evil monster. Please select your reward!
                    <div class={"reward-choices"}>
                        {state.cards.map((card) => (
                            <RewardCard type={card} gameId={gameId}/>
                        ))}
                    </div>
                    <form hx-post={`/game/${gameId}/reward`}>
                        <input type="hidden" name="type" value="skip"/>
                        <Button>
                            Skip reward
                        </Button>
                    </form>
            </div>
                </CenteredRow>
        </div>
    )
}

export default RewardStage
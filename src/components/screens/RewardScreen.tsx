import {RewardState} from "../../game/stages/rewardStage";
import RewardCard from "../RewardCard";
import Button from "../Button";
import {css, Style} from "hono/css";

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

const RewardStage = ({state, gameId, swap = false}: { state: RewardState, gameId: string, swap?: boolean }) => {
    return (
        <div id="reward" class="reward" hx-swap-oob={swap}>
            <Style>{style}</Style>
            <h1>Victory</h1>
            You defeated the evil monster. Please select your reward!
            <div class={"reward-choices"}>
                {state.cards.map((card) => (
                    <RewardCard type={card} gameId={gameId}/>
                ))}
            </div>
            <form hx-post={`/v2/game/${gameId}/reward`}>
                <Button>
                    Skip reward
                </Button>
            </form>
        </div>
    )
}

export default RewardStage
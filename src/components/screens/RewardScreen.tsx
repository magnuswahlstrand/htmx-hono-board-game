import {RewardState} from "../../game/stages/rewardStage";
import RewardCard from "../RewardCard";
import {css} from "hono/css";

const RewardStage = ({state, gameId, swap = false}: { state: RewardState, gameId: string, swap?: boolean }) => {

    const style = css`
        display: flex;
        justify-content: space-between;
        width: 100%;
    `

    return (
        <div id="fight" class="fight" hx-swap-oob={swap}>
            <h1>Victory</h1>
            You defeated the evil monster. Please select your reward!
            <div class={style}>

                {state.cards.map((card) => (
                    <RewardCard type={card} gameId={gameId}/>
                ))}
            </div>

        </div>
    )
}

export default RewardStage
import {CardType, WorldMap} from "../types";
import {validMapActions, validRewardActions} from "../../do2";
import {z} from "zod";

export type MapState = {
    label: 'map'
    state: 'selection' | 'stage_complete'
    map: WorldMap
    action?: z.infer<typeof validMapActions>
    choice?: number
}

export function runMapLoop(stage: MapState) {
    if (stage.state === 'stage_complete') {
        return
    }

    // Reward selection
    if (stage.action === undefined)
        return

    if (stage.action.type === 'select_node') {
        const nodeId = stage.action.nodeId
        const validAction = stage.map.nodes[stage.map.currentNode]!.links.includes(nodeId)
        if (!validAction) {
            throw new Error('Invalid node selection')
        }

        console.log('nodeId', nodeId)
        //
        // stage.map.nodes = stage.map.nodes.filter(n => n !== cardType)
        // logger_info('select_card', stage.choice.card)
        // const card = stage.cards.find(c => c === cardType)
        // if (card === undefined) {
        //     throw new Error('Invalid card selection')
        // }
        // stage.reward = card
        // stage.state = 'stage_complete'
    }
    // else if (stage.choice.type === 'skip') {
    //     stage.reward = undefined
    //     stage.state = 'stage_complete'
    // }
}
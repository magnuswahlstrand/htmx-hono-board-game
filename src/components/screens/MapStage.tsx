import {MapState} from "../../game/stages/mapStage";
import {css, Style} from "hono/css";

const MapStage = ({state, gameId, swap = false}: { state: MapState, gameId: string, swap?: boolean }) => {

    const allowedNodes = state.map.nodes[state.map.currentNode]!.links

    const script = `
    nodes = ${JSON.stringify(state.map.nodes)}
    allowedNodes = ${JSON.stringify(allowedNodes)}
    
    images = {
        start: 'https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/start.png',
        monster: 'https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/monster.png',
        boss: 'https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/boss.png',
        camp: 'https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/camp.png',
        punch: 'https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/punch.png'
    }

    nested = nodes.map(n => n.links.map(l => ({source: n.id, target: l})))
    links = nested.reduce((a, b) => a.concat(b), [])


    // Initialize SVG
    svg = d3.select("svg");

    x = d3.scaleLinear([0, 10], [0, 400]);
    y = d3.scaleLinear([0, 10], [400, 0]);


    // Add links
    link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("class", "link")
        .attr("x1", d => x(nodes[d.source].coordinates.x))
        .attr("y1", d => y(nodes[d.source].coordinates.y))
        .attr("x2", d => x(nodes[d.target].coordinates.x))
        .attr("y2", d => y(nodes[d.target].coordinates.y));


    // Add nodes
    nodeGroup = svg.append("g")
        .attr("class", "nodes")
        .selectAll("image")
        .data(nodes)
        .enter().append("g")

    // Add background circles
    nodeGroup.append("circle")
        .attr("r", 15) // Radius of the circle
        .attr("cx", d => x(d.coordinates.x))
        .attr("cy", d => y(d.coordinates.y))
        .attr("fill", "#a29164")

    diameter = 30
    maxDiameter = 50

    function loopAnimation(d, d2, foo) {
        d3.select(this)
            .transition()
            .duration(600)
            .attr("width", maxDiameter)
            .attr("height", maxDiameter)
            .attr("x", x(d.coordinates.x) - maxDiameter / 2)
            .attr("y", y(d.coordinates.y) - maxDiameter / 2)
            .transition()
            .duration(600)
            .attr("width", diameter)
            .attr("height", diameter)
            .attr("x", x(d.coordinates.x) - diameter / 2)
            .attr("y", y(d.coordinates.y) - diameter / 2)
            .on('end', loopAnimation)
    }

    nodeGroup.append("image")
        .attr("xlink:href", d => images[d.type])
        .attr("width", 30)
        .attr("height", 30)
        .attr("x", d => x(d.coordinates.x) - 15)
        .attr("y", d => y(d.coordinates.y) - 15)
        .attr("opacity", d => d.visited || allowedNodes.includes(d.id) ? 1 : 0.3)
        .filter(d => allowedNodes.includes(d.id))
        .on('click', handleClick)
        .attr("class", "node")
        .each(loopAnimation)

    // Handle click
    function handleClick(event, d) {
        const selector = \`#node-\${d.id}\`
        htmx.trigger(selector, "trigger-submit");
    }
    `

    return (
        <>
            <Style>
                {css`
                    .node {
                        cursor: pointer;
                    }

                    .link {
                        stroke-opacity: 0.6;
                        stroke: black
                    }

                    .map-outer {
                        border-width: 37px 36px;
                        border-style: solid;
                        border-image: url('https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/map_outer.png');
                        border-image-slice: 37 36;
                        border-image-repeat: round;
                        display: inline-block;
                    }

                    .map-inner {
                        border-width: 24px 23px;
                        border-style: solid;
                        border-image: url('https://pub-e405f37647b2451f9d27fc3e700b2f4f.r2.dev/map_inner.png');
                        border-image-slice: 24 23 fill;
                        border-image-repeat: round;
                        display: inline-block;
                    }

                `}
            </Style>

            <div className="map-outer">
                <div className="map-inner">
                    <svg width="400" height="450"></svg>
                </div>
            </div>
            <script dangerouslySetInnerHTML={{__html: script}}>
            </script>
            {allowedNodes.map(nodeId =>
                <form>
                    <input type="hidden" name="type" value={`select_node`}/>
                    <input type="hidden" name="nodeId" value={nodeId}/>
                    <button type="submit" style={{display: "none"}} id={`node-${nodeId}`}
                            hx-post={`/game/${gameId}/map`} hx-trigger="trigger-submit">Submit
                    </button>
                </form>
            )}
        </>
    )
}

export default MapStage
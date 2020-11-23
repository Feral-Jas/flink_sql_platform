<template>
    <div style="width: 100%; display: flex; justify-content: space-between">
        <div id="myPaletteDiv" style="width: 150px; margin-right: 2px; background-color: rgb(97.6%, 97.6%, 75.8%);"></div>
        <div id="flowchartnew" style="flex-grow: 1; height: 85vh; background-color: rgb(97.6%, 97.6%, 75.8%);"></div>
    </div>
</template>
<style></style>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import go from 'gojs';
@Component({})
export default class FlowchartNew extends Vue {
    diagram!: go.Diagram;
    nodeDataArray = [];
    linkDataArray = [];
    showLinkLabel(e: any) {
        const label = e.subject.findObject('LABEL');
        if (label !== null) label.visible = e.subject.fromNode.data.category === 'Conditional';
    }
    mounted() {
        const $ = go.GraphObject.make;
        this.diagram = $(
            go.Diagram,
            'flowchartnew', // must name or refer to the DIV HTML element
            {
                LinkDrawn: this.showLinkLabel, // this DiagramEvent listener is defined below
                LinkRelinked: this.showLinkLabel,
                'undoManager.isEnabled': true, // enable undo & redo
            }
        );
        function nodeStyle() {
            return [
                // The Node.location comes from the "loc" property of the node data,
                // converted by the Point.parse static method.
                // If the Node.location is changed, it updates the "loc" property of the node data,
                // converting back using the Point.stringify static method.
                new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
                {
                    // the Node.location is at the center of each node
                    locationSpot: go.Spot.Center,
                },
            ];
        }
        // Define a function for creating a "port" that is normally transparent.
        // The "name" is used as the GraphObject.portId,
        // the "align" is used to determine where to position the port relative to the body of the node,
        // the "spot" is used to control how links connect with the port and whether the port
        // stretches along the side of the node,
        // and the boolean "output" and "input" arguments control whether the user can draw links from or to the port.
        function makePort(name: string, align: any, spot: any, output: boolean, input: boolean) {
            const horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
            // the port is basically just a transparent rectangle that stretches along the side of the node,
            // and becomes colored when the mouse passes over it
            return $(go.Shape, {
                fill: 'transparent', // changed to a color in the mouseEnter event handler
                strokeWidth: 0, // no stroke
                width: horizontal ? NaN : 8, // if not stretching horizontally, just 8 wide
                height: !horizontal ? NaN : 8, // if not stretching vertically, just 8 tall
                alignment: align, // align the port on the main Shape
                stretch: horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical,
                portId: name, // declare this object to be a "port"
                fromSpot: spot, // declare where links may connect at this port
                fromLinkable: output, // declare whether the user may draw links from here
                toSpot: spot, // declare where links may connect at this port
                toLinkable: input, // declare whether the user may draw links to here
                cursor: 'pointer', // show a different cursor to indicate potential link point
            });
        }
        function textStyle() {
            return {
                font: 'bold 11pt Lato, Helvetica, Arial, sans-serif',
                stroke: 'black',
            };
        }
        this.diagram.nodeTemplateMap.add(
            'Operator', // the default category
            $(
                go.Node,
                'Table',
                nodeStyle(),
                // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
                $(
                    go.Panel,
                    'Auto',
                    $(go.Shape, 'Rectangle', { fill: '#FCB79B', stroke: '#00A9C9', strokeWidth: 3.5 }, new go.Binding('figure', 'figure')),
                    $(
                        go.TextBlock,
                        textStyle(),
                        {
                            margin: 8,
                            maxSize: new go.Size(160, NaN),
                            wrap: go.TextBlock.WrapFit,
                            editable: true,
                        },
                        new go.Binding('text').makeTwoWay()
                    )
                ),
                // four named ports, one on each side:
                makePort('T', go.Spot.Top, go.Spot.TopSide, false, true),
                makePort('L', go.Spot.Left, go.Spot.LeftSide, true, true),
                makePort('R', go.Spot.Right, go.Spot.RightSide, true, true),
                makePort('B', go.Spot.Bottom, go.Spot.BottomSide, true, false)
            )
        );
        this.diagram.nodeTemplateMap.add(
            'Conditional',
            $(
                go.Node,
                'Table',
                nodeStyle(),
                // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
                $(
                    go.Panel,
                    'Auto',
                    $(go.Shape, 'Diamond', { fill: '#FCB79B', stroke: '#00A9C9', strokeWidth: 3.5 }, new go.Binding('figure', 'figure')),
                    $(
                        go.TextBlock,
                        textStyle(),
                        {
                            margin: 8,
                            maxSize: new go.Size(160, NaN),
                            wrap: go.TextBlock.WrapFit,
                            editable: true,
                        },
                        new go.Binding('text').makeTwoWay()
                    )
                ),
                // four named ports, one on each side:
                makePort('T', go.Spot.Top, go.Spot.Top, false, true),
                makePort('L', go.Spot.Left, go.Spot.Left, true, true),
                makePort('R', go.Spot.Right, go.Spot.Right, true, true),
                makePort('B', go.Spot.Bottom, go.Spot.Bottom, true, false)
            )
        );

        this.diagram.nodeTemplateMap.add(
            'Start',
            $(
                go.Node,
                'Table',
                nodeStyle(),
                $(
                    go.Panel,
                    'Spot',
                    $(go.Shape, 'Circle', {
                        desiredSize: new go.Size(70, 70),
                        fill: '#FCB79B',
                        stroke: '#09d3ac',
                        strokeWidth: 3.5,
                    }),
                    $(
                        go.TextBlock,
                        'Auto',
                        textStyle(),
                        {
                            margin: 8,
                            maxSize: new go.Size(160, NaN),
                            wrap: go.TextBlock.WrapFit,
                            editable: true,
                        },
                        new go.Binding('text').makeTwoWay()
                    )
                ),
                // three named ports, one on each side except the top, all output only:
                makePort('L', go.Spot.Left, go.Spot.Left, true, false),
                makePort('R', go.Spot.Right, go.Spot.Right, true, false),
                makePort('B', go.Spot.Bottom, go.Spot.Bottom, true, false)
            )
        );

        this.diagram.nodeTemplateMap.add(
            'End',
            $(
                go.Node,
                'Table',
                nodeStyle(),
                $(
                    go.Panel,
                    'Spot',
                    $(go.Shape, 'Circle', {
                        desiredSize: new go.Size(60, 60),
                        fill: '#FCB79B',
                        stroke: '#DC3C00',
                        strokeWidth: 3.5,
                    }),
                    $(
                        go.TextBlock,
                        'Auto',
                        textStyle(),
                        {
                            margin: 8,
                            maxSize: new go.Size(160, NaN),
                            wrap: go.TextBlock.WrapFit,
                            editable: true,
                        },
                        new go.Binding('text').makeTwoWay()
                    )
                ),
                // three named ports, one on each side except the bottom, all input only:
                makePort('T', go.Spot.Top, go.Spot.Top, false, true),
                makePort('L', go.Spot.Left, go.Spot.Left, false, true),
                makePort('R', go.Spot.Right, go.Spot.Right, false, true)
            )
        );

        this.diagram.linkTemplate = $(
            go.Link, // the whole link panel
            {
                routing: go.Link.AvoidsNodes,
                curve: go.Link.JumpOver,
                corner: 5,
                toShortLength: 4,
                relinkableFrom: true,
                relinkableTo: true,
                reshapable: true,
                resegmentable: true,
                // mouse-overs subtly highlight links:
                selectionAdorned: false,
            },
            new go.Binding('points').makeTwoWay(),
            $(
                go.Shape, // the highlight shape, normally transparent
                {
                    isPanelMain: true,
                    strokeWidth: 8,
                    stroke: 'transparent',
                    name: 'HIGHLIGHT',
                }
            ),
            $(
                go.Shape, // the link path shape
                { isPanelMain: true, stroke: 'gray', strokeWidth: 2 },
                new go.Binding('stroke', 'isSelected', function(sel) {
                    return sel ? 'dodgerblue' : 'gray';
                }).ofObject()
            ),
            $(
                go.Shape, // the arrowhead
                { toArrow: 'standard', strokeWidth: 0, fill: 'gray' }
            ),
            $(
                go.Panel,
                'Auto', // the link label, normally not visible
                {
                    visible: false,
                    name: 'LABEL',
                    segmentIndex: 2,
                    segmentFraction: 0.5,
                },
                new go.Binding('visible', 'visible').makeTwoWay(),
                $(
                    go.Shape,
                    'RoundedRectangle', // the label shape
                    { fill: '#F8F8F8', strokeWidth: 0 }
                ),
                $(
                    go.TextBlock,
                    'Yes', // the label
                    {
                        textAlign: 'center',
                        font: '10pt helvetica, arial, sans-serif',
                        stroke: '#333333',
                        editable: true,
                    },
                    new go.Binding('text').makeTwoWay()
                )
            )
        );
        const myPalette = $(
            go.Palette,
            'myPaletteDiv', // must name or refer to the DIV HTML element
            {
                // Instead of the default animation, use a custom fade-down
                'animationManager.initialAnimationStyle': go.AnimationManager.None,
                //"InitialAnimationStarting": animateFadeDown, // Instead, animate with this function

                nodeTemplateMap: this.diagram.nodeTemplateMap, // share the templates used by myDiagram
                model: new go.GraphLinksModel([
                    // specify the contents of the Palette
                    { category: 'Start', text: 'Source' },
                    { category: 'Operator', text: 'Operator' },
                    { category: 'Conditional', text: 'Sideout' },
                    { category: 'End', text: 'Sink' },
                ]),
            }
        );
        (this.diagram.model as go.GraphLinksModel).nodeDataArray = this.nodeDataArray;
        (this.diagram.model as go.GraphLinksModel).linkDataArray = this.linkDataArray;
    }
    clear() {
        this.nodeDataArray = [];
        this.linkDataArray = [];
        (this.diagram.model as go.GraphLinksModel).nodeDataArray = this.nodeDataArray;
        (this.diagram.model as go.GraphLinksModel).linkDataArray = this.nodeDataArray;
    }
}
</script>

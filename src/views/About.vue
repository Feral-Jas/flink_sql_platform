<template>
  <div style="border: solid 1px black; width:100%; height:85vh"></div>
</template>

<script>
import go from "gojs";
const $ = go.GraphObject.make;
// This works because we have overridden the /extensionsTS/tsconfig.json file
// in the options to the loader: 'ts-loader', in the webpack.config.js
import { GuidedDraggingTool } from "gojs/extensionsTS/GuidedDraggingTool.ts";
export default {
  name: "Diagram",
  mounted() {
    const diagram = $(go.Diagram, this.$el, {
      "undoManager.isEnabled": true,
      "grid.visible": true,
      "grid.gridCellSize": new go.Size(30, 30),
      draggingTool: new GuidedDraggingTool()
    });
    diagram.nodeTemplate = $(
      go.Node,
      "Vertical",
      {
        locationSpot: go.Spot.Left,
        locationObjectName: "SHAPE",
        selectionAdorned: false,
        resizable: true,
        resizeObjectName: "SHAPE",
        rotatable: true,
        rotateObjectName: "SHAPE",
        layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized
      },
      new go.Binding("layerName", "isHighlighted", function(h) {
        return h ? "Foreground" : "";
      }).ofObject(),
      $(go.Shape, {
        name: "SHAPE",
        width: 70,
        height: 70,
        stroke: "#C2185B",
        fill: "#F48FB1",
        strokeWidth: 3
      })
    );

    diagram.startTransaction("new object");
    diagram.model.addNodeData({ layerName: "james" });
    diagram.model.addNodeData({});
    diagram.model.addNodeData({});
    diagram.model.addNodeData({});
    diagram.model.addNodeData({});

    diagram.commitTransaction("new object");
  }
};
</script>

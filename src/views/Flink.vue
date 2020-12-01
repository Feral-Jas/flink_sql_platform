<template>
  <v-app id="inspire">
    <v-app-bar app color="white" flat>
      <v-container class="py-0 fill-height">
        <v-badge class="mr-3" bordered color="error" icon="mdi-hammer" overlap>
          <v-btn class="white--text" color="error" depressed @click="flinkDash()">Flink自动构建工具</v-btn>
        </v-badge>
        <v-btn
          class="mr-2"
          elevation="1"
          v-for="link in links"
          :key="link"
          :color="links_color[link]"
          @click="action(link)"
        >
          {{
          link
          }}
        </v-btn>
        <v-snackbar top color="blue-grey" timeout="3000" v-model="snackbar">{{ snackbarText }}</v-snackbar>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" width="800px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mr-3"
              elevation="1"
              color="success"
              v-bind="attrs"
              v-on="on"
              @click="exportData()"
            >导入导出</v-btn>
          </template>
          <v-card>
            <v-card-title class="headline grey lighten-2">
              <span>Flink任务JSON</span>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="copy2clipboard()">COPY</v-btn>
              <v-btn color="green darken-1" @click="importData()">OK</v-btn>
            </v-card-title>
            <v-card-text height="400px">
              <v-textarea rows="10" clearable :value="graphDataString" @input="assign"></v-textarea>
            </v-card-text>
            <v-card-actions></v-card-actions>
          </v-card>
        </v-dialog>

        <v-responsive max-width="260">
          <v-text-field
            dense
            flat
            hide-details
            rounded
            solo-inverted
            v-model="describe"
            @change="assign(val)"
          ></v-text-field>
        </v-responsive>
      </v-container>
    </v-app-bar>

    <v-main class="grey lighten-3">
      <v-container>
        <v-row>
          <v-spacer></v-spacer>
          <v-col cols="12">
            <v-sheet min-height="60vh" rounded="lg">
              <Flowchart ref="flowchart"></Flowchart>
            </v-sheet>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { GraphLinksModel, Diagram } from "gojs";
import execa from "execa";
import copy from "copy-to-clipboard";
import Flowchart from "./FlowchartNew.vue";
@Component({
  components: {
    Flowchart
  }
})
export default class Flink extends Vue {
  dialog = false;
  snackbar = false;
  snackbarText = "已将任务图提交到flink集群执行";
  links = ["清空", "对齐", "测试", "部署"];
  links_color = {
    清空: "white",
    对齐: "white",
    测试: "white",
    部署: "white"
  };
  describe = "v0.0.1 Alpha - 单链实现";
  graphData: any = {};
  graphDataString = "";
  flinkDash() {
    window.open("http://localhost:8081/#/overview", "_blank");
  }
  assign(val: string) {
    //console.log(val);
    this.graphDataString = val;
  }
  action(link: string) {
    switch (link) {
      case "清空":
        console.log("clear");
        (this.$refs.flowchart as Flowchart).clear();
        break;
      case "对齐":
        console.log("align");
        //TODO re-align graph
        //(this.$refs.flowchart as Flowchart).clear();
        break;
      case "测试":
        console.log("test");
        break;
      case "部署":
        console.log("deploy");
        this.snackbar = true;
        Vue.axios
          .post("http://localhost:3301/job", this.graphDataString)
          .then(res => {
            console.log(res.config.data);
          });
        break;
      default:
        console.log(link);
        break;
    }
  }
  exportData() {
    const nodeDataArray = ((this.$refs.flowchart as Flowchart).diagram
      .model as GraphLinksModel).nodeDataArray;
    const linkDataArray = ((this.$refs.flowchart as Flowchart).diagram
      .model as GraphLinksModel).linkDataArray;
    this.graphData = { nodeDataArray, linkDataArray };

    this.graphDataString = JSON.stringify({ nodeDataArray, linkDataArray });
    this.dialog = false;
  }
  importData() {
    this.graphData = JSON.parse(this.graphDataString);
    ((this.$refs.flowchart as Flowchart).diagram
      .model as GraphLinksModel).nodeDataArray = this.graphData.nodeDataArray;
    ((this.$refs.flowchart as Flowchart).diagram
      .model as GraphLinksModel).linkDataArray = this.graphData.linkDataArray;
    console.log(this.graphDataString);
    this.dialog = false;
  }
  copy2clipboard() {
    copy(this.graphDataString);
    console.log("copy");
  }
}
</script>

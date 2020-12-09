<template>
    <v-app id="inspire">
        <v-app-bar app color="white" flat>
            <v-container class="py-0 fill-height">
                <v-badge class="mr-3" bordered color="error" icon="mdi-hammer" overlap>
                    <v-btn class="white--text" color="error" depressed @click="deployWithFlinkRest">Flink SQL部署工具</v-btn>
                </v-badge>
                release tag:v0.0.1 单上游单下游（kafka到kafka）支持
                <v-snackbar outlined top color="success" timeout="5000" v-model="snackbar">
                    <v-icon>mdi-success</v-icon>
                    <a href="http://localhost:8081/#/job/running" target="_blank"> {{ snackbarText }}</a></v-snackbar
                >
                <v-spacer></v-spacer>
                <v-btn class="mr-2" color="error" @click="sample">例子</v-btn>
                <v-btn color="success" @click="deploy()">构建任务</v-btn>
            </v-container>
        </v-app-bar>
        <v-main class="grey lighten-3">
            <v-container>
                <v-row>
                    <v-col>
                        <v-card elevation="2" outlined shaped tile height="30vh">
                            <v-card-text>
                                <v-textarea
                                    outlined
                                    name="input-7-4"
                                    label="SQL语句编辑器"
                                    :value="sql"
                                    height="25vh"
                                    @change="assignSql"
                                    no-resize
                                ></v-textarea>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-card elevation="2" outlined shaped tile>
                            <v-card-title primary-title>
                                <v-text-field
                                    outlined
                                    name="sourceTableName"
                                    label="源表表名(kafka topic)"
                                    :value="sourceTableName"
                                    @change="assignSourceName"
                                    id="source"
                                ></v-text-field>
                            </v-card-title>
                            <v-card-text>
                                <v-select :items="sourceTypes" v-model="sourceType" label="类型"></v-select>
                                <v-simple-table>
                                    <template v-slot:default>
                                        <thead>
                                            <tr>
                                                <th class="text-left">字段名</th>
                                                <th class="text-left">类型</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="row in sourceRows" :key="row.id">
                                                <td>
                                                    <v-text-field v-model="row.name"></v-text-field>
                                                </td>
                                                <td>
                                                    <v-text-field v-model="row.type"></v-text-field>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>
                                <v-col class="d-flex justify-space-between">
                                    <v-btn icon @click="deleteSourceRow()">
                                        <v-icon color="error">mdi-minus</v-icon>
                                    </v-btn>
                                    <v-btn icon @click="addSourceRow()">
                                        <v-icon color="primary">mdi-plus</v-icon>
                                    </v-btn>
                                </v-col>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col>
                        <v-card elevation="2" outlined shaped tile>
                            <v-card-title primary-title>
                                <v-text-field
                                    outlined
                                    name="sinkTableName"
                                    label="目标表表名(kafka topic)"
                                    :value="sinkTableName"
                                    @change="assignSinkName"
                                    id="sink"
                                ></v-text-field>
                            </v-card-title>
                            <v-card-text>
                                <v-select :items="sinkTypes" v-model="sinkType" label="类型"></v-select>
                                <v-simple-table>
                                    <template v-slot:default>
                                        <thead>
                                            <tr>
                                                <th class="text-left">属性</th>
                                                <th class="text-left">值</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="row1 in sinkRows" :key="row1.id">
                                                <td>
                                                    <v-text-field v-model="row1.name"></v-text-field>
                                                </td>
                                                <td>
                                                    <v-text-field v-model="row1.type"></v-text-field>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>
                                <v-col class="d-flex justify-space-between">
                                    <v-btn icon @click="deleteSinkRow()">
                                        <v-icon color="error">mdi-minus</v-icon>
                                    </v-btn>
                                    <v-btn icon @click="addSinkRow()">
                                        <v-icon color="primary">mdi-plus</v-icon>
                                    </v-btn>
                                </v-col>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>
<style></style>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class FlinkSql extends Vue {
    sourceTableName = '';
    sinkTableName = '';
    sourceTypes = ['kafka'];
    sinkTypes = ['kafka', 'dm', 'elasticsearch'];
    sourceType = 'kafka';
    sinkType = 'kafka';
    sourceRows = [{ id: 0, name: 'message', type: 'STRING' }];
    sinkRows = [{ id: 0, name: 'message', type: 'STRING' }];
    sql = '';
    snackbar = false;
    snackbarText = '';
    addSourceRow() {
        const index = this.sourceRows.length;
        this.sourceRows.push({ id: index, name: '', type: '' });
    }
    deleteSourceRow() {
        this.sourceRows.pop();
    }
    addSinkRow() {
        const index = this.sinkRows.length;
        this.sinkRows.push({ id: index, name: '', type: '' });
    }
    deleteSinkRow() {
        this.sinkRows.pop();
    }
    deploy() {
        const kafkaSourceConfig =
            "with('connector' = 'kafka', 'topic' = '" +
            this.sourceTableName +
            "','properties.bootstrap.servers' = 'localhost:9092','properties.group.id' = 'testGroup','format' = 'json', 'scan.startup.mode' = 'group-offsets')";
        const kafkaSinkConfig =
            "with('connector' = 'kafka', 'topic' = '" +
            this.sinkTableName +
            "','properties.bootstrap.servers' = 'localhost:9092','properties.group.id' = 'testGroup','format' = 'json', 'scan.startup.mode' = 'group-offsets')";
        let sourceSchema = 'CREATE TABLE ' + this.sourceTableName + '(';
        this.sourceRows.forEach((row) => {
            sourceSchema += row.name + ' ' + row.type;
            if (row.id != this.sourceRows.length - 1) {
                sourceSchema += ',';
            }
        });
        sourceSchema += ')' + kafkaSourceConfig;
        let sinkSchema = 'CREATE TABLE ' + this.sinkTableName + '(';
        this.sinkRows.forEach((row) => {
            sinkSchema += row.name + ' ' + row.type;
            if (row.id != this.sinkRows.length - 1) {
                sinkSchema += ',';
            }
        });
        sinkSchema += ')' + kafkaSinkConfig;
        console.log([sourceSchema, sinkSchema, this.sql]);
        // Vue.axios
        //   .post(
        //     "http://localhost:8081/jars/26240e06-e500-44ba-b420-8013e7b256dc_FlinkSqlWithArgs.jar/run",
        //     { programArgsList: [sourceSchema, sinkSchema, this.sql] }
        //   )
        //   .then(res => console.log(res.data));
        Vue.axios.post('http://localhost:3301/sqljob', [sourceSchema, sinkSchema, this.sql]).then((res) => {
            console.log(res.data);
            Vue.axios
                .post('http://localhost:8081/jars/841766ee-f928-4e55-843c-300872421834_FlinkSqlWithArgs.jar/run?programArg=' + res.data)
                .then((res) => {
                    this.snackbarText = res.data.jobid;
                    this.snackbar = true;
                    console.log(res.data);
                });
        });
        //window.open('http://localhost:8081/#/job/running', '_blank');
    }
    deployWithFlinkRest() {
        Vue.axios.post('http://localhost:8081/jars/54e68e07-ba52-48c0-887f-0a0333cf82a5_WordCountSQL.jar/run');
        //window.open('http://localhost:8081/#/job/running', '_blank');
    }
    assignSourceName(val: any) {
        this.sourceTableName = val;
    }
    assignSinkName(val: any) {
        this.sinkTableName = val;
    }
    assignSql(val: any) {
        this.sql = val;
    }
    sample() {
        this.sourceTableName = 'sql_prod1';
        this.sinkTableName = 'sql_consumer';
        this.sourceRows = [
            { id: 0, name: 'name', type: 'STRING' },
            { id: 1, name: 'age', type: 'BIGINT' },
            { id: 2, name: 'cost', type: 'BIGINT' },
            { id: 3, name: 'buy_time', type: 'TIMESTAMP' },
            { id: 4, name: 'WATERMARK FOR buy_time', type: "as buy_time - INTERVAL '10' SECOND" },
        ];
        this.sinkRows = [{ id: 0, name: 'count_all', type: 'BIGINT' }];
        this.sql = "INSERT INTO sql_consumer\nselect count(*)\nfrom sql_prod1\ngroup by TUMBLE(buy_time,INTERVAL '5' SECOND)";
    }
}
</script>

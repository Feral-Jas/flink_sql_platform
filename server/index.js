const express = require('express');
const app = express();
const port = 3301;
const cors = require('cors');
app.use(cors());
//app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get('/job/:id', (req, res) => {
    res.send('Hello World!' + req.params.id);
});
app.post('/job', (req, res) => {
    const { exec } = require('child_process');
    exec('flink run -d ../flink_jobs/ArgsJob.jar dmjob1', (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
    res.send(req.body);
});
app.post("/sqljob",(req,res)=>{
    //const { exec } = require('child_process');
    console.log(req.body)
    // exec('flink run -d ../flink_jobs/ArgsJob.jar dmjob1', (error, stdout, stderr) => {
    //     if (error) {
    //         console.log(`error: ${error.message}`);
    //         return;
    //     }
    //     if (stderr) {
    //         console.log(`stderr: ${stderr}`);
    //         return;
    //     }
    //     console.log(`stdout: ${stdout}`);
    // });
    res.send(req.body);
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

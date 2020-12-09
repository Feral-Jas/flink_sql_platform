const express = require('express');
const app = express();
const port = 3301;
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/flink', { useNewUrlParser: true, useUnifiedTopology: true });
const SqlJob = mongoose.model('SqlJob', { jobName: String, source: String, sink: String, sql: String });
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
app.post('/sqljob', (req, res) => {
    console.log(req.body);
    const newJob = new SqlJob({ jobName: 'sqljob', source: req.body[0], sink: req.body[1], sql: req.body[2] });
    newJob.save().then((doc) => {
        res.send(doc.id);
    });
    // SqlJob.find(function(err, doc) {
    //     res.send(doc);
    // });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

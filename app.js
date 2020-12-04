const express = require("express");

let port = 5000;
const serverList = [];

function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

for (let i=0; i<5; i++) {
    const instance = {};
    instance.port = port;
    instance.isBusy = false;
    instance.app = express();
    instance.app.use(express.json());
    instance.app.use(express.urlencoded({ extended: false }));
    instance.app.post('/upload', async (req, res) => {
        const timeStart = new Date().getTime();
        if (instance.isBusy) {
            return res.status(503).json({message: 'Server is busy!'});
        }
        instance.isBusy = true;
        await sleep(1000*0.5*req.body.size);
        console.log(`Server ${instance.port} received file of ${req.body.size}`);
        instance.isBusy = false
        return res.status(201).json({message: 'Message sent!', time: new Date().getTime() - timeStart});
    });

    instance.app.get('/server-state', async (req, res) => {
        return res.status(200).json({isBusy: instance.isBusy});
    });
    instance.app.listen(instance.port, () => console.log(`Server listening on port ${instance.port}!`));
    serverList.push(instance);
    port++;
}

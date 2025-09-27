import express from "express";

const app = express();
const port = process.env.PORT || '3000';

app.use('/', (req, res) => {
    res.send('Benvenuto in Track My Money!');
});

app.listen(port, () => {
    console.log('Server in esecuzione!')
})
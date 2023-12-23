const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

mongoose.connect('mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const dataSchema = new mongoose.Schema({
  name: String,
  from: String,
  to: String,
  paymentOption: String,
  paymentDone: Boolean,
});

const Data = mongoose.model('Data', dataSchema);

app.use(express.json());

app.post('/saveData', async (req, res) => {
  try {
    const { name, from, to, paymentOption, paymentDone } = req.body;
    const newData = new Data({ name, from, to, paymentOption, paymentDone });
    await newData.save();

    console.log('Data saved successfully');
    res.status(200).json({ message: 'Data saved successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/getData', async (req, res) => {
  try {
    const { name, from, to, payment, paymentDone } = req.query;

    const query = {};
    if (name) query.name = name;
    if (from) query.from = from;
    if (to) query.to = to;
    if (payment) query.payment = payment;
    if (paymentDone !== undefined) query.paymentDone = paymentDone;

    const result = await Data.find(query);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

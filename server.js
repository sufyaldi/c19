const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;
const _dirname = path.resolve();
const datapath = path.join(_dirname, 'data', 'data.json');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

async function readData() {
  try {
    const data = await fs.readFile(datapath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Gagal membaca data:', err);
    return [];
  }
}

async function writeData(data) {
  try {
    await fs.writeFile(datapath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Gagal menulis data:', err);
  }
}

app.get('/', async (req, res) => {
  const data = await readData();
  res.render('home', { data });
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/add', async (req, res) => {
  const data = await readData();
  const dataGet = {
    name: req.body.name,
    height: req.body.height,
    weight: req.body.weight,
    birthdate: req.body.birthdate,
    married: req.body.married === 'true',
  };
  data.push(dataGet);
  await writeData(data);
  res.redirect('/');
});

app.get('/delete/:index', async (req, res) => {
  const index = req.params.index;
  const data = await readData();
  data.splice(index, 1);
  await writeData(data);
  res.redirect('/');
});

app.get('/edit/:index', async (req, res) => {
  const index = req.params.index;
  const data = await readData();
  const item = data[index];
  res.render('edit', { item });
});

app.post('/edit/:index', async (req, res) => {
  const index = req.params.index;
  const data = await readData();
  data[index] = {
    name: req.body.name,
    height: req.body.height,
    weight: req.body.weight,
    birthdate: req.body.birthdate,
    married: req.body.married === 'true',
  };
  await writeData(data);
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Aplikasi contoh berjalan pada port ${port}`);
});

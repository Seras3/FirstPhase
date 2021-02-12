if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.static('views'));
app.use(express.static('scripts'));
app.use(express.static('assets'));
app.use(express.static('styles'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
})

app.get('/tutorial', (req, res) => {
  res.sendFile(__dirname + '/views/tutorial.html');
});


app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
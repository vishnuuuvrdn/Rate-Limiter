const path = require('path');
const express = require('express');
const aiRoutes = require('./routes/ai.routes');
const dataRoutes = require('./routes/data.routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());

app.get('/', (req, res) => {
  res.render('index');
});

app.use('/api/ai', aiRoutes);
app.use('/api/data', dataRoutes);

app.use((req, res) => {
    res.redirect('/');
});

module.exports = app;
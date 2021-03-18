const express = require('express');
const app = express();
const port = 3000;
const router = require('./modules/router');
const morgan = require('morgan');

app.locals.games = require('./data/games.json');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(morgan('[:date[iso] :remote-addr] :status :method :url'));

app.use(express.static('./public'));

app.use(router);

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
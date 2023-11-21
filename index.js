const express = require('express')
const app = express();
const PORT = 3000

app.get('/', (req, res) => {
    res.send('Welcome to the autocedi backend');
});

app.listen(PORT, () => {
    console.log('listening on port ' + PORT);
})
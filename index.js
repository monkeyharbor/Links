let express = require("express");
let bodyParser = require("body-parser");
let DataStore = require('nedb');
let db = new DataStore('liberatelinks.db');
db.loadDatabase();
let app = express();

//Initialize HTTP server
let http = require('http');
let server = http.createServer(app);

let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log("BIG EAR AT: " + port);
});

app.use(bodyParser.json());
app.use('/', express.static('public'));

//get route to return all data/ ideas in DB
app.get('/allideas', (req, res) => {
    db.find({}, function (err, docs) {
        console.log(docs);
        res.json(docs);
    });

})

// app.get('/ideas/:location', (req, res) => {
//     //???
//     db.find({"address" : req.params.location}, function (err, docs) {
//         console.log(docs);
//         res.json(docs);
//     });

// })

// app.get('/userideas/:user', (req, res) => {
//     db.find({ name: req.params.user }, function (err, docs) {
//         console.log(docs);
//         let obj = {
//             "ideas": docs
//         }
//         res.json(obj);
//     });
// })

app.post('/postidea', (req, res) => {
    console.log(req.body);
    db.insert(req.body);
    res.json({ "status": "success" });
})

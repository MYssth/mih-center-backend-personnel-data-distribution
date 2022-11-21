const dboperations = require('./dboperations');

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));
app.use('/api', router);

router.use((request, response, next) => {
    //write authen here
    console.log('middleware');
    next();
});

router.route('/getpersonnel').get((request, response) => {

    dboperations.getPersonnel().then(result => {
        response.json(result[0]);
    }).catch(err => {
        console.error(err);
        response.sendStatus(500);
    });

});

router.route('/getpersonnel/:id').get((request, response) => {

    dboperations.getPersonnelById(request.params.id).then(result => {
        response.json(result[0]);
    }).catch(err => {
        console.error(err);
        response.sendStatus(500);
    });

});

router.route('/getroles').get((request, response) => {

    dboperations.getRoles().then(result => {
        response.json(result[0]);
    }).catch(err => {
        console.error(err);
        response.sendStatus(500);
    })

});

router.route('/getrolelist/:id').get((request, response) => {

    dboperations.getRoleList(request.params.id).then(result => {
        response.json(result[0]);
    }).catch(err => {
        console.error(err);
        response.sendStatus(500);
    });

});

router.route('/getpositions').get((request, response) => {

    dboperations.getPositions().then(result => {
        response.json(result[0]);
    }).catch(err => {
        console.error(err);
        response.sendStatus(500);
    });

});

router.route('/getmihapps').get((request, response) => {

    dboperations.getMihapps().then(result => {
        response.json(result[0]);
    }).catch(err => {
        console.error(err);
        response.sendStatus(500);
    });

});

var port = process.env.PORT;
app.listen(port);
console.log('personnel-data-distribution API is running at ' + port);
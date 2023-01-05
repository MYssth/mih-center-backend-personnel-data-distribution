const dboperations = require('./dboperations');

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const { request, response } = require('express');
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

    response.setHeader('Access-Control-Allow-Origin', '*'); //หรือใส่แค่เฉพาะ domain ที่ต้องการได้
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.setHeader('Access-Control-Allow-Credentials', true);

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

router.route('/getlevels').get((request, response) => {

    dboperations.getLevels().then(result => {
        response.json(result[0]);
    }).catch(err => {
        console.error(err);
        response.sendStatus(500);
    })

});

router.route('/getlevelviews').get((request, response) => {

    dboperations.getLevelViews().then(result => {
        response.json(result[0]);
    }).catch(err => {
        console.error(err);
        response.sendStatus(500);
    })

});

router.route('/getlevellist/:id').get((request, response) => {

    dboperations.getLevelList(request.params.id).then(result => {
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

router.route('/getdepartments').get((request, response) => {

    dboperations.getDepartments().then(result => {
        response.json(result[0]);
    }).catch(err => {
        console.error(err);
        response.sendStatus(500);
    });
});

router.route('/getfactions').get((request, response) => {

    dboperations.getFactions().then(result => {
        response.json(result[0]);
    }).catch(err => {
        console.error(err);
        response.sendStatus(500);
    });
});

router.route('/getfields').get((request, response) => {

    dboperations.getFields().then(result => {
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
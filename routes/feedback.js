var express = require('express');
var router = express.Router();

function adminonly(req,res,next){
    if (!req.session.isadmin)
    {return res.render('users/login', { message: "Restricted Area - Need Admin Privileges" }); }
    next();
    }


// ==================================================
// Route to list all records. Display view to list all records
// ==================================================
router.get('/', adminonly, function (req, res, next) {
    let query = "SELECT feedback_id, user_id, listing_id, review_date, comments, rating, status FROM feedback";

    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        }
        res.render('feedback/allrecords', { allrecs: result });
    });
});

router.post('/submit', function(req, res, next){

    var list_id = req.body.listing_id;
    if (req.session.user_id)
        {
            res.render('feedback/submit', {list_id : list_id, users_id : req.session.user_id});
        } else {
            res.render('users/login', { message: "Please Login First" });
        }

});


// ==================================================
// Route to view one specific record. Notice the view is one record
// URL: http://localhost:3008/feedback/1/show
// ==================================================
router.get('/:recordid/show', adminonly, function (req, res, next) {
    let query = "SELECT feedback_id, user_id, listing_id, review_date, comments, rating, status FROM feedback WHERE feedback_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.render('feedback/onerec', { onerec: result[0] });
        }
    });
});

// ==================================================
// Route to show empty form to obtain input form end-user.
// ==================================================
router.get('/addrecord', function (req, res, next) {
    res.render('feedback/addrec');
});

// ==================================================
// Route to obtain user input and save in database.
// ==================================================
router.post('/', function (req, res, next) {
    let insertquery = "INSERT INTO feedback (user_id, listing_id, review_date, comments, rating, status) VALUES (?, ?, now(), ?, ?, 'Review')";
    db.query(insertquery, [req.body.user_id, req.body.listing_id, req.body.comments, req.body.rating], (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.redirect('/');
        }
    });
});

// ==================================================
// Route to delete one specific record.
// ==================================================
router.get('/:recordid/delete', adminonly, function (req, res, next) {
    let query = "DELETE FROM feedback WHERE feedback_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.redirect('/feedback');
        }
    });
});
// ==================================================
// Route to edit one specific record.
// ==================================================
router.get('/:recordid/edit', adminonly, function (req, res, next) {
    let query = "SELECT feedback_id, user_id, listing_id, review_date, comments, rating, status FROM feedback WHERE feedback_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.render('feedback/editrec', { onerec: result[0] });
        }
    });
});

// ==================================================
// Route to save edited data in database.
// ==================================================
router.post('/save', adminonly, function (req, res, next) {
    let updatequery = "UPDATE feedback SET user_id = ?, listing_id = ?, review_date = ?, comments = ?, rating = ?, status = ? WHERE feedback_id = " + req.body.feedback_id;
    db.query(updatequery, [req.body.user_id, req.body.listing_id, req.body.review_date, req.body.comments, req.body.rating, req.body.status], (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.redirect('/feedback');
        }
    });
});
module.exports = router;
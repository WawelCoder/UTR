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
    let query = "SELECT subscription_id, user_id, category_id, subscribe_date, unsubscribe_date FROM subscription";

    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        }
        res.render('subscription/allrecords', { allrecs: result });
    });
});

// ==================================================
// Route to view one specific record. Notice the view is one record
// URL: http://localhost:3008/subscription/1/show
// ==================================================
router.get('/:recordid/show', adminonly, function (req, res, next) {
    let query = "SELECT subscription_id, user_id, category_id, subscribe_date, unsubscribe_date FROM subscription WHERE subscription_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.render('subscription/onerec', { onerec: result[0] });
        }
    });
});

// ==================================================
// Route to show empty form to obtain input form end-user.
// ==================================================
router.get('/addrecord', function (req, res, next) {
    res.render('subscription/addrec');
});

// ==================================================
// Route to obtain user input and save in database.
// ==================================================
router.post('/', function (req, res, next) {
    let insertquery = "INSERT INTO subscription (user_id, category_id, subscribe_date, unsubscribe_date) VALUES (?, ?, ?, ?)";
    db.query(insertquery, [req.body.user_id, req.body.category_id, req.body.subscribe_date, req.body.unsubscribe_date || null], (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.redirect('/subscription');
        }
    });
});

// ==================================================
// Route to delete one specific record.
// ==================================================
router.get('/:recordid/delete', adminonly, function (req, res, next) {
    let query = "DELETE FROM subscription WHERE subscription_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.redirect('/subscription');
        }
    });
});
// ==================================================
// Route to edit one specific record.
// ==================================================
router.get('/:recordid/edit', adminonly, function (req, res, next) {
    let query = "SELECT subscription_id, user_id, category_id, subscribe_date, unsubscribe_date FROM subscription WHERE subscription_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.render('subscription/editrec', { onerec: result[0] });
        }
    });
});

// ==================================================
// Route to save edited data in database.
// ==================================================
router.post('/save', adminonly, function (req, res, next) {
    let updatequery = "UPDATE subscription SET user_id = ?, category_id = ?, subscribe_date = ?, unsubscribe_date = ? WHERE subscription_id = " + req.body.subscription_id;
    db.query(updatequery, [req.body.user_id, req.body.category_id, req.body.subscribe_date, req.body.unsubscribe_date || null], (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.redirect('/subscription');
        }
    });
});

module.exports = router;
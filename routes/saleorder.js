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
    let query = "SELECT order_id, buyer_user_id, sale_date, customernotes, payment_status, authorization_num FROM saleorder";

    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        }
        res.render('saleorder/allrecords', { allrecs: result });
    });
});

// ==================================================
// Route to view one specific record. Notice the view is one record
// URL: http://localhost:3008/saleorder/1/show
// ==================================================
router.get('/:recordid/show', adminonly, function (req, res, next) {
    let query = "SELECT order_id, buyer_user_id, sale_date, customernotes, payment_status, authorization_num FROM saleorder WHERE order_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.render('saleorder/onerec', { onerec: result[0] });
        }
    });
});

// ==================================================
// Route to show empty form to obtain input form end-user.
// ==================================================
router.get('/addrecord', function (req, res, next) {
    res.render('saleorder/addrec');
});

// ==================================================
// Route to obtain user input and save in database.
// ==================================================
router.post('/', function (req, res, next) {
    let insertquery = "INSERT INTO saleorder (buyer_user_id, sale_date, customernotes, payment_status, authorization_num) VALUES (?, ?, ?, ?, ?)";
    db.query(insertquery, [req.body.buyer_user_id, req.body.sale_date, req.body.customernotes, req.body.payment_status, req.body.authorization_num], (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.redirect('/saleorder');
        }
    });
});

// ==================================================
// Route to delete one specific record.
// ==================================================
router.get('/:recordid/delete', adminonly, function (req, res, next) {
    let query = "DELETE FROM saleorder WHERE order_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.redirect('/saleorder');
        }
    });
});

// ==================================================
// Route to edit one specific record.
// ==================================================
router.get('/:recordid/edit', adminonly, function (req, res, next) {
    let query = "SELECT order_id, buyer_user_id, sale_date, customernotes, payment_status, authorization_num FROM saleorder WHERE order_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.render('saleorder/editrec', { onerec: result[0] });
        }
    });
});

// ==================================================
// Route to save edited data in database.
// ==================================================
router.post('/save', adminonly, function (req, res, next) {
    let updatequery = "UPDATE saleorder SET buyer_user_id = ?, sale_date = ?, customernotes = ?, payment_status = ?, authorization_num = ? WHERE order_id = " + req.body.order_id;
    db.query(updatequery, [req.body.buyer_user_id, req.body.sale_date, req.body.customernotes, req.body.payment_status, req.body.authorization_num], (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.redirect('/saleorder');
        }
    });
});

module.exports = router;
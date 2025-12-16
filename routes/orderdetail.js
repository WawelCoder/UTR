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
    let query = "SELECT orderdetail_id, order_id, listing_id, sale_price, quantity FROM orderdetail";

    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        }
        res.render('orderdetail/allrecords', { allrecs: result });
    });
});

// ==================================================
// Route to view one specific record. Notice the view is one record
// URL: http://localhost:3008/orderdetail/1/show
// ==================================================
router.get('/:recordid/show', adminonly, function (req, res, next) {
    let query = "SELECT orderdetail_id, order_id, listing_id, sale_price, quantity FROM orderdetail WHERE orderdetail_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.render('orderdetail/onerec', { onerec: result[0] });
        }
    });
});

// ==================================================
// Route to show empty form to obtain input form end-user.
// ==================================================
router.get('/addrecord', function (req, res, next) {
    res.render('orderdetail/addrec');
});

// ==================================================
// Route to obtain user input and save in database.
// ==================================================
router.post('/', function (req, res, next) {
    let insertquery = "INSERT INTO orderdetail (order_id, listing_id, sale_price, quantity) VALUES (?, ?, ?, ?)";
    db.query(insertquery, [req.body.order_id, req.body.listing_id, req.body.sale_price, req.body.quantity], (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.redirect('/orderdetail');
        }
    });
});

// ==================================================
// Route to delete one specific record.
// ==================================================
router.get('/:recordid/delete', adminonly, function (req, res, next) {
    let query = "DELETE FROM orderdetail WHERE orderdetail_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.redirect('/orderdetail');
        }
    });
});
// ==================================================
// Route to edit one specific record.
// ==================================================
router.get('/:recordid/edit', adminonly, function (req, res, next) {
    let query = "SELECT orderdetail_id, order_id, listing_id, sale_price, quantity FROM orderdetail WHERE orderdetail_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.render('orderdetail/editrec', { onerec: result[0] });
        }
    });
});

// ==================================================
// Route to save edited data in database.
// ==================================================
router.post('/save', adminonly, function (req, res, next) {
    let updatequery = "UPDATE orderdetail SET order_id = ?, listing_id = ?, sale_price = ?, quantity = ? WHERE orderdetail_id = " + req.body.orderdetail_id;
    db.query(updatequery, [req.body.order_id, req.body.listing_id, req.body.sale_price, req.body.quantity], (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.redirect('/orderdetail');
        }
    });
});

module.exports = router;
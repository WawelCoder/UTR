var express = require('express');
var router = express.Router();

function adminonly(req,res,next){
    if (!req.session.isadmin)
    {return res.render('users/login', { message: "Restricted Area - Need Admin Privileges" }); }
    next();
    }

//Display reports menu
//http://localhost:3008/report
router.get('/', adminonly, function(req, res, next) {
    res.render('report/reportmenu');


});

module.exports = router;

//Customer Listing
//http://localhost:3008/report/custlist

router.get('/custlist', adminonly, function (req, res, next) {
    let query = "SELECT user_id, username, email, password, first_name, last_name, phone, address1, address2, city, state, zip FROM users";

    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        }
        res.render('report/custlist', { allrecs: result });
    });
});


//Product Listing
//http://localhost:3008/report/prodlist

router.get('/prodlist', adminonly, function (req, res, next) {
    let query = "SELECT listing_id, user_id, title, author, isbn, description, price, item_condition, date_posted, category_id, homepage FROM listings";

    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        }
        res.render('report/prodlist', { allrecs: result });
    });
});


//Sale Listing
//http://localhost:3008/report/salelist

router.get('/salelist', adminonly, function (req, res, next) {
   // let query = "SELECT order_id, buyer_user_id, sale_date, customernotes, payment_status, authorization_num FROM saleorder ";
   let query = "SELECT so.order_id, so.buyer_user_id, so.sale_date, so.customernotes, so.payment_status, so.authorization_num, od.sale_price " + "FROM saleorder so JOIN orderdetail od ON so.order_id = od.order_id"
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        }
        res.render('report/salelist', { allrecs: result });
    });
});

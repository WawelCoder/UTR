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
    let query = "SELECT listing_id, user_id, title, author, isbn, description, price, item_condition, date_posted, category_id, homepage FROM listings";

    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        }
        res.render('listings/allrecords', { allrecs: result });
    });
});

// ==================================================
// Route to view one specific record. Notice the view is one record
// URL: http://localhost:3008/listings/1/show
// ==================================================
router.get('/:recordid/show', function (req, res, next) {
    let query = "SELECT listing_id, user_id, title, author, isbn, description, price, item_condition, date_posted, category_id, homepage FROM listings WHERE listing_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {

                let query = "SELECT feedback_id, comments, rating FROM feedback WHERE listing_id = " + req.params.recordid;

                db.query(query, (err, reviews) => {
                    if (err) 
                    {
                        console.log(err);
                        res.render('error');
                    } else {
                        res.render('listings/onerec', { onerec: result[0], reviews: reviews });
                    }
                });
        }
    });
});


// ==================================================
// Route to show empty form to obtain input form end-user.
// ==================================================
router.get('/addrecord', adminonly, function (req, res, next) {

    //GET acceptable values from category_id from Category table
    let query = "SELECT category_id, category_name FROM category";
    // execute query
    db.query(query, (err, categories) => {
         if (err) {
         console.log(err);
         res.render('error');
        }
        //Pass category_id values to addrec view
    res.render('listings/addrec', {category: categories});
});
});
// ==================================================
// Route to obtain user input and save in database.
// ==================================================
router.post('/', adminonly, function (req, res, next) {

    var homepage_value = 0;
    if (req.body.homepage) {
        homepage_value = 1;
    }

    let insertquery = "INSERT INTO listings (user_id, title, author, isbn, description, price, item_condition, date_posted, category_id, homepage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(insertquery, [req.body.user_id, req.body.title, req.body.author, req.body.isbn, req.body.description, req.body.price, req.body.item_condition, req.body.date_posted, req.body.category_id, homepage_value], (err, result) => {
        if (err) { 
            console.log(err);
            res.render('error');
        } else {
            res.redirect('/listings');
        }
    });
});

// ==================================================
// Route to delete one specific record.
// ==================================================
router.get('/:recordid/delete', adminonly, function (req, res, next) {
    let query = "DELETE FROM listings WHERE listing_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.redirect('/listings');
        }
    });
});

// ==================================================
// Route to edit one specific record.
// ==================================================
router.get('/:recordid/edit', adminonly, function (req, res, next) {
    let query = "SELECT listing_id, user_id, title, author, isbn, description, price, item_condition, date_posted, category_id, homepage FROM listings WHERE listing_id = " + req.params.recordid;
     // execute query
     db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {

            let query = "SELECT category_id, category_name FROM category";
            // execute query
            db.query(query, (err, categories) => {
            if (err) {
                    console.log(err);
                    res.render('error');
                    }
               res.render('listings/editrec', {onerec: result[0], category: categories});
            });
       } 
     });
});


// ==================================================
// Route to save edited data in database.
// ==================================================
router.post('/save', adminonly, function (req, res, next) {

    var homepage_value = 0;
    if (req.body.homepage) {
        homepage_value = 1;
    }

    let updatequery = "UPDATE listings SET user_id = ?, title = ?, author = ?, isbn = ?, description = ?, price = ?, item_condition = ?, date_posted = ?, category_id = ?, homepage = ? WHERE listing_id = " + req.body.listing_id;
    db.query(updatequery, [req.body.user_id, req.body.title, req.body.author, req.body.isbn, req.body.description, req.body.price, req.body.item_condition, req.body.date_posted, req.body.category_id, homepage_value], (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.redirect('/listings');
        }
    });
});


module.exports = router;
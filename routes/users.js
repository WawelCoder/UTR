var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

function adminonly(req,res,next){
    if (!req.session.isadmin)
    {return res.render('users/login', { message: "Restricted Area - Need Admin Privileges" }); }
    next();
    }

// ==================================================
// Route to list all records. Display view to list all records
// ==================================================
router.get('/', adminonly, function (req, res, next) {
    let query = "SELECT user_id, username, email, password, first_name, last_name, phone, address1, address2, city, state, zip, isadmin FROM users";

    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        }
        res.render('users/allrecords', { allrecs: result });
    });
});

// ==================================================
// Route to view one specific record. Notice the view is one record
// URL: http://localhost:3008/users/1/show
// ==================================================
router.get('/:recordid/show', adminonly, function (req, res, next) {
    let query = "SELECT user_id, username, email, password, first_name, last_name, phone, address1, address2, city, state, zip, isadmin FROM users WHERE user_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.render('users/onerec', { onerec: result[0] });
        }
    });
});

// ==================================================
// Route to show empty form to obtain input form end-user.
// ==================================================
router.get('/addrecord', function (req, res, next) {
    res.render('users/addrec');
});
// ==================================================
// Route Enable Registration
// ==================================================
router.get('/register', function (req, res, next) {
    res.render('users/addrec');
});
// ==================================================
// Route Provide Login Window
// ==================================================
router.get('/login', function (req, res, next) {
    res.render('users/login', { message: "Please Login:" });
});
// ==================================================
// Route Check Login Credentials
// ==================================================
router.get('/logout', function (req, res, next) {
    req.session.user_id = 0;
    req.session.custname = "";
    req.session.cart = [];
    req.session.qty = [];
    req.session.isadmin = 0;
    res.redirect('/');
});


// ==================================================
// Route Check Login Credentials
// ==================================================
router.post('/login', function (req, res, next) {
    let query = "select user_id, first_name, last_name, password, isadmin from users WHERE username = '" + req.body.username + "'";
    // execute query
    db.query(query, (err, result) => {
        if (err) { res.render('error'); }
        else {
            if (result[0]) {
                // Username was correct. Check if password is correct
                bcrypt.compare(req.body.password, result[0].password, function (err, result1) {
                    if (result1) {
                        // Password is correct. Set session variables for user.
                        var userid = result[0].user_id;
                        req.session.user_id = userid;
                        var custname = result[0].first_name + " " + result[0].last_name;
                        req.session.custname = custname;
                        var isadmin = result[0].isadmin;
                        req.session.isadmin = isadmin;
                        res.redirect('/');
                    } else {
                        // password do not match
                        res.render('users/login', { message: "Wrong Password" });
                    }
                });
            }
            else { res.render('users/login', { message: "Wrong Username" }); }
        }
    });
});


// ==================================================
// Route to obtain user input and save in database.
// ==================================================
router.post('/', function (req, res, next) {
    let insertquery = "INSERT INTO users (username, email, password, first_name, last_name, phone, address1, address2, city, state, zip) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) { res.render('error'); }

            db.query(insertquery, [req.body.username, req.body.email, hash, req.body.first_name, req.body.last_name, req.body.phone, req.body.address1, req.body.address2, req.body.city, req.body.state, req.body.zip], (err, result) => {
                if (err) {
                    console.log(err);
                    res.render('error');
                } else {
                    res.redirect('/users');
                }
            });
        });
    });
});

// ==================================================
// Route to delete one specific record.
// ==================================================
router.get('/:recordid/delete', adminonly, function (req, res, next) {
    let query = "DELETE FROM users WHERE user_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.redirect('/users');
        }
    });
});

// ==================================================
// Route to provide form for new password.
// ==================================================
router.get('/pwdchg', function(req, res, next) {
    res.render('users/newpwd');

});
// ==================================================
// Route to change user password in database
// ==================================================
router.post('/pwdchg', function (req, res, next) {
    let updatequery = "UPDATE users SET password = ? WHERE user_id = " + req.session.user_id;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) { res.render('error'); }

            db.query(updatequery, [hash], (err, result) => {
                if (err) {
                    console.log(err);
                    res.render('error');
                } else {
                    res.redirect('/users/logout');
                }
            });
        });
    });
});

// ==================================================
// Route to edit one specific record.
// ==================================================
router.get('/profile', function (req, res, next) {
    let query = "SELECT user_id, username, email, password, first_name, last_name, phone, address1, address2, city, state, zip, isadmin FROM users WHERE user_id = " + req.session.user_id;
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.render('users/profile', { onerec: result[0] });
        }
    });
});

// ==================================================
// Route to save edited data in database.
// ==================================================
router.post('/profile',  function (req, res, next) {
    let updatequery = "UPDATE users SET email = ?, first_name = ?, last_name = ?, phone = ?, address1 = ?, address2 = ?, city = ?, state = ?, zip = ? WHERE user_id = " + req.body.user_id;

            db.query(updatequery, [req.body.email, req.body.first_name, req.body.last_name, req.body.phone, req.body.address1, req.body.address2, req.body.city, req.body.state, req.body.zip], (err, result) => {
                if (err) {
                    console.log(err);
                    res.render('error');
                } else {
                    res.redirect('/');
                }
            });
        });

// ==================================================
// Route to edit one specific record.
// ==================================================
router.get('/:recordid/edit', adminonly, function (req, res, next) {
    let query = "SELECT user_id, username, email, password, first_name, last_name, phone, address1, address2, city, state, zip, isadmin FROM users WHERE user_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.render('users/editrec', { onerec: result[0] });
        }
    });
});

// ==================================================
// Route to save edited data in database.
// ==================================================
router.post('/save', adminonly, function (req, res, next) {
    let updatequery = "UPDATE users SET username = ?, email = ?, password = ?, first_name = ?, last_name = ?, phone = ?, address1 = ?, address2 = ?, city = ?, state = ?, zip = ?, isadmin = ? WHERE user_id = " + req.body.user_id;

    var isadmin_value = 0;
    if (req.body.isadmin) {
        isadmin_value = 1;
    }

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) { res.render('error'); }

            db.query(updatequery, [req.body.username, req.body.email, hash, req.body.first_name, req.body.last_name, req.body.phone, req.body.address1, req.body.address2, req.body.city, req.body.state, req.body.zip, isadmin_value], (err, result) => {
                if (err) {
                    console.log(err);
                    res.render('error');
                } else {
                    res.redirect('/users');
                }
            });
        });
    });
});


module.exports = router;
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
    let query = "SELECT shipment_id, order_id, shipper_name, shipper_contact, shipment_date, tracking_number, status FROM shipments";

    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        }
        res.render('shipments/allrecords', { allrecs: result });
    });
});

// ==================================================
// Route to view one specific record. Notice the view is one record
// URL: http://localhost:3008/shipments/1/show
// ==================================================
router.get('/:recordid/show', adminonly, function (req, res, next) {
    let query = "SELECT shipment_id, order_id, shipper_name, shipper_contact, shipment_date, tracking_number, status FROM shipments WHERE shipment_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.render('shipments/onerec', { onerec: result[0] });
        }
    });
});

// ==================================================
// Route to show empty form to obtain input form end-user.
// ==================================================
router.get('/addrecord', adminonly, function (req, res, next) {
    res.render('shipments/addrec');
});

// ==================================================
// Route to obtain user input and save in database.
// ==================================================
router.post('/', adminonly, function (req, res, next) {
    let insertquery = "INSERT INTO shipments (order_id, shipper_name, shipper_contact, shipment_date, tracking_number, status) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(insertquery, [req.body.order_id, req.body.shipper_name, req.body.shipper_contact, req.body.shipment_date, req.body.tracking_number, req.body.status], (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.redirect('/shipments');
        }
    });
});

// ==================================================
// Route to delete one specific record.
// ==================================================
router.get('/:recordid/delete', adminonly, function (req, res, next) {
    let query = "DELETE FROM shipments WHERE shipment_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.redirect('/shipments');
        }
    });
});
// ==================================================
// Route to edit one specific record.
// ==================================================
router.get('/:recordid/edit', adminonly, function (req, res, next) {
    let query = "SELECT shipment_id, order_id, shipper_name, shipper_contact, shipment_date, tracking_number, status FROM shipments WHERE shipment_id = " + req.params.recordid;
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.render('shipments/editrec', { onerec: result[0] });
        }
    });
});

// ==================================================
// Route to save edited data in database.
// ==================================================
router.post('/save', adminonly, function (req, res, next) {
    let updatequery = "UPDATE shipments SET order_id = ?, shipper_name = ?, shipper_contact = ?, shipment_date = ?, tracking_number = ?, status = ? WHERE shipment_id = " + req.body.shipment_id;
    db.query(updatequery, [req.body.order_id, req.body.shipper_name, req.body.shipper_contact, req.body.shipment_date, req.body.tracking_number, req.body.status], (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.redirect('/shipments');
        }
    });
});

module.exports = router;
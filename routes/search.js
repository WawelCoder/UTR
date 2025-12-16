var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    let query = "SELECT listing_id, user_id, title, author, isbn, description, price, item_condition, date_posted, category_id FROM listings WHERE description LIKE '%" + req.query.searchcriteria + "%' OR title LIKE '%" + req.query.searchcriteria + "%' OR author LIKE '%" + req.query.searchcriteria + "%' OR isbn LIKE '%" + req.query.searchcriteria + "%' OR item_condition LIKE '%" + req.query.searchcriteria + "%'";
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.render('search', { allrecs: result });
        }
    });
});
module.exports = router;

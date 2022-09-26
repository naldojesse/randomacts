const express = require("express"); // import express from "express";
const router = express.Router(); //express.Router() for creating a router object from express module which is used to handle the routes
const Acts = require("../controllers/acts"); //import commentsController from "../controllers/comments"
const { ensureAuth, ensureGuest } = require("../middleware/auth"); //purpose of this is to ensure that the user is authenticated before they can access the routes in this file

// router.post('/users/addact', Users.addAct);

router.post('/createAct', function (req, res) {
    console.log("in acts route");
    Acts.create(req, res);
});

router.patch('/:id', Acts.update);

router.get('/:id', Acts.show);

//! get this error when using this route
//! reason: Error: Argument passed in must be a single String of 12 bytes or a string of 24 hex characters
// router.get('/generateRAK', ensureAuth, function(req, res) {
//     console.log("in acts route");
//     Acts.generateRAK(req, res);
// });

module.exports = router;
const express = require("express"); // import express from "express";
const router = express.Router(); //express.Router() for creating a router object from express module which is used to handle the routes
const Acts = require("../controllers/acts"); //import commentsController from "../controllers/comments"
const Users = require("../controllers/users");
const { ensureAuth, ensureGuest } = require("../middleware/auth"); //purpose of this is to ensure that the user is authenticated before they can access the routes in this file

router.post('/users/addact', Users.addAct);

router.post('/acts', Acts.create);

router.patch('/acts/:id', Acts.update);

router.get('/acts/:id', Acts.show);

module.exports = router;
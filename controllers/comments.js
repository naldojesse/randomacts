const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");

module.exports = {
  createComment: async (req, res) => {
    let comment;
    try {
      comment = await Comment.create({ comment: req.body.comment, likes: 0, post: req.params.id, user: req.user.id });
      // # TODO: refactor models to embed user in comment
      //    to avoid transactions and multiple queries to db for each comment creation and update to user model
      Post.findOneAndUpdate({_id: req.params.id, $push: {comments: comment._id}});
      User.findOneAndUpdate({_id: req.user.id, $push: {comments: comment._id}});
      console.log("Comment has been added!");
      res.redirect("/post/" + req.params.id);
    } catch (err) {
      console.log(err);
    }
  },
};
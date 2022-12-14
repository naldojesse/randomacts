// brigngsin cloudinary and the post model / schema
const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post"); //brings in the post model / schema
const Comment = require("../models/Comment"); //brings in the comment model / schema
const Act = require("../models/Act"); //brings in the act model / schema
const User = require("../models/User");

module.exports = {
  //getProfile is a function that takes in req and res and returns the profile page with the posts and user data from the database and renders it to the page using ejs templating engine
  getProfile: async (req, res) => { //async and await is set up to handle the promise that is returned from the database, the promise is returned from the database when the data is retrieved from the database and the promise is resolved
    console.log("getting profile");
    try { //try block is used to handle any errors that may occur when the data is retrieved from the database
      // stores all posts made by profile user in variable posts
      const posts = await Post.find({ user: req.user.id }); //finds all posts made by the user that is logged in and stores them in the posts variable
      // const acts = await User.findOne({_id: req.user.id}); //finds all acts assigned for the user that is logged in and stores them in the acts variable

      const user = await User.find({ _id: req.user.id}).deepPopulate('acts acts.act_info');

      // const user = await User.findOne({ _id: req.user.id }); //finds the user that is logged in and stores them in the user variable
      // console.log(user);
      // // console.log(user.populate("acts", "title"));
      // // console.log(user.populate("Acts", "title"));
      // // console.log(user.acts);
      // console.log(user.populate("Act", "acts.act_info"))



      // // having trouble getting acts to populate on user
      // //instead manually populate acts array and looping through it to get the act title
      // const acts = await Act.find();
      // console.log(acts);
      // let useracts = []
      // console.log("not looping?");
      // console.log(acts.length);
      // for (let i = 0; i < acts.length; i++) {
      //   console.log('looping through acts')
      //   for (let j = 0; j < acts[i].users.length; j++) {
      //     console.log(req.user.id);
      //     console.log(acts[i].users[j]);
      //     if (acts[i].users[j] == req.user.id) {
      //       useracts.push(acts[i])
      //     }
      //   }
      // }
      console.log("acts found")
      // console.log(acts)
      // console.log(acts[0].email);
      // console.log(acts[0].acts)
      // console.log(user[0].acts[0].act_info.title)
      console.log(user[0].acts.length);
      let showacts = user[0].acts;

      // renders page with posts data
      res.render("profile.ejs", { posts: posts, user: req.user, acts: showacts}   ); //renders the profile page with the posts and user data from the database and renders it to the page using ejs templating engine
    } catch (err) { //catch block is used to handle any errors that may occur when the data is retrieved from the database
      console.log(err);
    }
  },
  //getFeed is a function that takes in req and res and returns the feed page with the posts data from the database and renders it to the page
  //Once again async and await are used here because we need asynchronous code to handle thr promise that is returned from the database
  //If we did not use async and await here then the code would not wait for the promise to be resolved before it continued to run and it would not have the data from the database to render to the page
  getFeed: async (req, res) => {
    try {
      // Stores all posts recently created and cuts out unecessary returned object data
      //The sort method is used to sort the posts by the date they were created in descending order
      //lean specifically tells mongoose to return the plain javascript objects instead of mongoose documents
      // const posts = await Post.find().sort({ createdAt: "desc" }).lean(); //waits for the promise to be resolved and then stores the posts in the posts variable
      // const posts = await Post.find().populate('comments').sort({createdAt:"desc"}).lean().populate('users');
      const posts = await Post.find().populate({
    path: 'comments',
    model: 'Comment',
    populate: {
      path: 'user',
      model: 'User'
    }
  })
      console.log(posts);
      //gets all comments from the database and stores them in the comments variables
      // const comments = await Comment.find().lean(); //waits for the promise to be resolved and then stores the comments in the comments variable
      res.render("feed.ejs", { posts: posts }); //after the promise is resolved the posts data is rendered to the feed page
    } catch (err) {
      console.log(err);
    }
  },
  getNewPost: async (req, res) => {
    console.log('getting new post');
    console.log(req.params.id);
    try {
        const acts = await Act.find({ _id: req.params.id }).lean();
        res.render("newpost.ejs", { user: req.user, act: acts[0] });
    } catch (err) {
      console.log(err);
    }
  },
  //getPost is a function that takes in req and res and returns the post page with the post data from the database and renders it to the page
  getPost: async (req, res) => {
    try {
      //Just retrieving that specific post by ID
      //and storing it in a variable called post
      //and then rendering the post.ejs page
      //and passing in the post data and the user data plus the comment data for that post
      //so that we can use it in the post.ejs page
      //to display the post data and the comment data for that post
      const post = await Post.findById(req.params.id);
      //gets all comments of the post based on id then sorts it by date created in descending order
      const comments = await Comment.find({post: req.params.id}).sort({ createdAt: "desc" }).lean();
      res.render("post.ejs", { post: post, user: req.user, comments: comments });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path); //uploads the image to cloudinary and stores the result in the result variable
      // Uses data from inputs to create new post
      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      // redirects to profile page with new post
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      // finds the post in database by its id and increments likes by one
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};

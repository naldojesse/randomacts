const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Act = require("../models/Act");
const User = require("../models/User");

// const Acts = mongoose.model('Act');
// const User = mongoose.model('User');
// * hello world Doc comment
// ! hello world Error comment
// ? hello world Warn comment

module.exports = {

    show: async(req, res) => {
        try {
            await Act.findOne({_id: req.params.id}).populate('users')
            // res.redirect('')
        } catch(err) {
            console.log(err);
        }
    },


    create: async(req, res) => {
        console.log(req.body)
        try {
            await Act.create({
                title: req.body.title,
                approval: true,
                avg_approval: 0,
                avg_rating: 0,
                created_by: req.user.id,
            });
            console.log("Act has been added!");
            res.redirect("/profile")

        } catch (err) {
            console.log(err);
        }
    },
    index: async(req, res) => {
        try {
            await Act.find({});
            console.log("Found all the acts!");
            // res.redirect("/acts")
        } catch (err) {
            console.log(err);
        }
    },
    generateRAK: async(req, res) => {
        try {
            console.log("in generate RAK controller");
            let randomAct = await Act.aggregate([{$sample: {size: 1}}])
            console.log("got random act");


            // res.redirect("/acts")

        } catch (err) {
            console.log(err);
        }
    },
    guestGenerateRAK: async(req, res) => {
        // try {
        //     console.log("in guest generate RAK controller");
        //     // await Act.find({}).populate('users')
        //     // res.redirect("/acts")
        //
        // } catch (err) {
        //     console.log(err);
        // }
    },
    update: async(req, res) => {
        try {
            await Act.find({});
            console.log("Found all the acts!");

            await Act.findOneAndUpdate(req.params.id,{
                _id: req.params.id,
                $push: {
                    users: req.user.id,
                    user_ratings: req.body.actrating,
                    approval_rating: req.body.recommend,
                }
            }, async function (err, currentAct) {
                let user_rating = 0;
                let approval = 0;

                // updates average rating of the act
                for (let i = 0; i < currentAct.user_ratings.length; i++) {
                    user_rating += currentAct.user_ratings[i];
                }
                currentAct.avg_rating = user_rating / currentAct.user_ratings.length;

                // updates average approval of the act
                for (let i = 0; i < currentAct.approval_rating.length; i++) {
                    approval += currentAct.approval_rating[i];
                }
                currentAct.avg_approval = approval / currentAct.approval_rating.length;

                if (currentAct.avg_approval < 0.3 && currentAct.approval_rating.length > 50) {
                    currentAct.approval = false;
                }


                currentAct.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                });

                await User.findOne({_id: req.user.id}, function (err, user) {

                    for (let i = 0; i < user.acts.length; i++) {
                        if (user.acts[i].act_info === req.body.actID) {
                            user.acts[i].completed = true;
                            user.save(function (err) {
                                if (err) {
                                    console.log(err);
                                }
                            });
                        }
                    }
                });

            });

        } catch (err) {
            console.log(err);
        }
    }
}
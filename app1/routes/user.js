const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const {User , Course} = require("../db");
// User Routes
router.post('/signup', (req, res) => {
    // Implement user signup logic
    const username= req.body.username;
    const password=req.body.password;
    User.create({
        username,
        password
    })
    res.json({
        message :"user created"
    })
});

router.get('/courses',async (req, res) => {
    // Implement listing all courses logic
    const response = await Course.find({});

    res.json({
        courses: response
    })
});

router.post('/courses/:courseId', userMiddleware, (req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId;
    const username = req.headers.username;

    User.updateOne(
        { username: username },
        { $push: { purchasedCourses: courseId } }
    ).then(() => {
        res.json({
            message: "purchase complete"
        });
    });
});  
 


router.get('/purchasedCourses', userMiddleware, async(req, res) => {
    // Implement fetching purchased courses logic
    const user = await User.findOne({
        username: req.headers.username
    });
    console.log(user.purchasedCourses);
    const courses = await Course.find({
        _id: {
            "$in": user.purchasedCourses
        }
    });

    res.json({
        courses: courses
    })
});

module.exports = router
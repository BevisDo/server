const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Course = require("../models/Course");

//@route GET api/courses
//@desc Get course
//@access Private
router.get("/", verifyToken, async (req, res) => {
  try {
    const courses = await Course.find({ user: req.userId }).populate("user", [
      "username",
    ]);
    res.json({ success: true, courses });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//@route POST api/courses
//@desc Create course
//@access Private

router.post("/", verifyToken, async (req, res) => {
  const { title, description, url, status } = req.body;

  //simple Validate
  if (!title)
    return res
      .status(400)
      .json({ success: false, message: "Tile is required" });

  try {
    const newCourse = new Course({
      title,
      description,
      url: url.startsWith("https://") ? url : `https://${url}`,
      status: status || "LOADING",
      user: req.userId,
    });

    await newCourse.save();

    res.json({ success: true, message: "Happy Teaching", course: newCourse });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//@route PUT api/courses
//@desc Update course
//@access Private
router.put("/:id", verifyToken, async (req, res) => {
  const { title, description, url, status } = req.body;

  //simple Validate
  if (!title)
    return res
      .status(400)
      .json({ success: false, message: "Tile is required" });

  try {
    let updateCourse = {
      title,
      description: description || "",
      url: (url.startsWith("https://") ? url : `https://${url}`) || "",
      status: status || "UPDATING",
    };

    const courseUpdateCondition = { _id: req.params.id, user: req.userId };
    updateCourse = await Course.findOneAndUpdate(
      courseUpdateCondition,
      updateCourse,
      { new: true }
    );

    //user not authorised to update course

    if (!updateCourse)
      return res.status(401).json({
        success: false,
        message: "Post not found or User not Authorised",
      });

    res.json({
      success: true,
      message: "Greate time to relax",
      coure: updateCourse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//@route DELETE api/courses
//@desc Delete course
//@access Private
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const courseDeleteCondition = { _id: req.params.id, user: req.userId };
    const deleteCourse = await Course.findOneAndDelete(courseDeleteCondition);

    //user not authorised or course not found
    if (!deleteCourse)
      return res.status(401).json({
        success: false,
        message: "Post not found or User not Authorised",
      });
    res.json({ success: true, course: deleteCourse });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;

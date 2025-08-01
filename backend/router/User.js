const {
  AddUser,
  getUserDetails,
  loginUser,
  updateUserDetails,
  getResume,
  generateCustomAnswer,
} = require("../controller/User");

const authMiddleware = require("../middleware/auth");
const uploadMiddleware = require("../middleware/multerUpload");

const router = require("express").Router();

router.post("/signup", AddUser);
router.get("/user", authMiddleware, getUserDetails);
router.post("/login", loginUser);

// ✅ THIS IS THE ONE WE'RE TALKING ABOUT
router.patch(
  "/user",
  authMiddleware,
  uploadMiddleware.single("resume"),
  updateUserDetails
);

router.post("/custom-answer", authMiddleware, generateCustomAnswer);
router.get("/resume", authMiddleware, getResume);

module.exports = router;

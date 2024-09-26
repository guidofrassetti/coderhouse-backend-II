import CustomRouter from "./custom.router.js";
import { login, register, profile } from "../controllers/user.controller.js";

export default class SessionsRouter extends CustomRouter {
  init() {
    this.post("/login", ["PUBLIC"], login);
    this.post("/register", ["PUBLIC"], register);
    this.get("/profile", ["USER"], profile);
    this.get("/failLogin", (req, res) => {
      res.status(401).json({ message: "Login failed" });
    });
    this.get("/failRegister", (req, res) => {
      res.json({
        message: "Register failed",
      });
      res.send("Register failed").json;
    });
  }
}

/* app.get("/getSession", (req, res) => {
  res.render({ session: req.session });
}); */

/* app.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/failLogin" }),
  async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });
    try {
      const user = await UserSchemma.findOne({ email }).lean();
      if (!user || !isValidPassword(user, password)) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const token = generateToken(user);
      res.status(200).cookie("currentUser", token, { httpOnly: true }).json({
        message: "Login successful",
        user: user.first_name,
        token,
      });
    } catch (error) {
      res.status(500).json({ message: "Error during login" });
    }
  }
);
 */

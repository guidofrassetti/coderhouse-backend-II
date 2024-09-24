import { Router } from "express";
const app = Router();
import { UserSchemma } from "../models/user.model.js";
import { isValidPassword, generateToken } from "../utils.js";
import passport from "passport";
import handleAuth from "../middlewares/handle_auth.js";

/* app.get("/getSession", (req, res) => {
  res.render({ session: req.session });
}); */

app.get("/failLogin", (req, res) => {
  res.status(401).json({ message: "Login failed" });
});

app.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  handleAuth("admin"),
  (req, res) => {
    res.status(200).json({
      message: "Authenticated user",
      user: {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role,
      },
    });
  }
);

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
//login sin passport
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserSchemma.findOne({ email }).lean();
    if (isValidPassword(user, password)) {
      const token = generateToken({
        email: user.email,
        name: user.first_name,
        role: user.role,
      });
      return res
        .status(200)
        .cookie("currentUser", token, {
          httpOnly: true,
          maxAge: 60000,
          signed: true,
        })
        .json({
          message: "Login successful",
          user: user.first_name,
          token,
        });
    }
    return res.status(400).json({ message: "Invalid credentials" });
  } catch (error) {
    return res.status(500).json({ message: "Error during login" });
  }
});

app.get("/failRegister", (req, res) => {
  res.json({
    message: "Register failed",
  });
  res.send("Register failed").json;
});

/* Registo */
app.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/failRegister",
    session: false,
    successRedirect: "/login",
  }),
  async (req, res) => {
    res.status(201).json({
      message: "User created",
    });

    /* Metodo sin passport - tradicional */

    /* const { first_name, last_name, email, age, password } = req.body;
    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    try {
      await UserSchemma.create({
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),
      });
      res.status(201).json({
        message: "User created",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error creating user",
      });
    } */
  }
);

export default app;

import { Router } from "express";
const app = Router();
import { UserSchemma } from "../models/user.model.js";
import { isValidPassword, generateToken } from "../utils.js";
import passport from "passport";

app.get("/getSession", (req, res) => {
  res.render({ session: req.session });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("failLogin", (req, res) => {
  res.render("failLogin");
});

app.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
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
  (req, res) => {
    if (!req.user)
      return res.status(400).json({ message: "Invalid credentials" });
    res
      .status(200)
      .json({ message: "Login successful", user: req.user.first_name });

      const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({
      message: "All fields are required",
    });

  try {
    const user = await UserSchemma.findOne({ email }).lean();
    if (!isValidPassword(user, password))
      return res.status(404).json({ message: "Invalid credentials" });
    if (!user) return res.status(404).json({ message: "Invalid credentials" });
  } catch (error) {
    res.status(500).json({
      message: "Error creating user",
    });
  } 
  }
); */

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await UserSchemma.findOne({ email });
    if (!user || !isValidPassword(user, password)) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user);
    res
      .status(200)
      .cookie("currentUser", token, { httpOnly: true, signed: true })
      .json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error during login" });
  }
});

app.get("/failLogin", (req, res) => {
  res.json({
    message: "Register failed",
  });
  res.send("Register failed").json;
});

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
    res.redirect("/login");

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

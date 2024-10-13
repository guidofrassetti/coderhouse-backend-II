import { createHash, isValidPassword, generateToken } from "../utils.js";
import UserService from "../services/user.services.js";
import { sendEmail } from "../services/nodemailer.js";


const userService = new UserService();

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //const user = await UserSchemma.findOne({ email }).lean();
    const user = await userService.login(req.body);
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
};

export const register = (req, res) => userService.register(req, res);
export const profile = (req, res) => userService.profile(req, res);

export const sendEmailController = async (req, res) => {
  const { email, subject, message } = req.body;

  if (!email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    await sendEmail(email, subject, message);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending email', error });
  }
};

/* export const profile = (req, res) => {
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
    };
}; */

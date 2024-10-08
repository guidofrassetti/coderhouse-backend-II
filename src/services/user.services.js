    import { createHash, isValidPassword, generateToken } from "../utils.js";
    import passport from "passport";
    import { UserSchemma } from "../models/user.model.js";
    import DatabaseDao from "../models/dao.js";
    import { userDTO } from "../dto/user.dto.js";

    const userDAO = new DatabaseDao(UserSchemma);

    export default class UserService {

        async login(user)
        {
            try {
                const { email, password } = req.body;
                /* const user = await UserSchemma.findOne({ email }).lean(); */
                const user = await userDAO.getByEmail(email);
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
        }
        //usamos passport 
        async register(req, res) {
            passport.authenticate("register", {
            failureRedirect: "/failRegister",
            session: false,
            successRedirect: "/login",
            })(req, res);
        }
        //usamos passport
        async profile(req, res) {
            passport.authenticate("jwt", { session: false }, (err, user) => {
              handleAuth("admin")(req, res, () => {
                const userDto = userDTO(user);
                return res.status(200).json({
                  message: "Authenticated user",
                  user: userDto,
                });
              });
            })(req, res);
          }
    }


import passport from "passport";
import local from "passport-local";
import { UserSchemma } from "../models/user.model.js";
import { createHash, getJWTCookie } from "../utils.js";
import jwt, { ExtractJwt, Strategy as jwtStrategy } from "passport-jwt";
import DatabaseDao from "../models/dao.js";

const userDAO = new DatabaseDao(UserSchemma);

const localStrategy = local.Strategy;

export const jwtPassport = () => {
  passport.use(
    "jwt",
    new jwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([getJWTCookie]),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (jwtPayload, done) => {
        try {
          return done(null, jwtPayload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

//Registrar un usuario
export const initPassport = () => {
  passport.use(
    "register",
    new localStrategy(
      {
        usernameField: "email", // usamos el email como username
        passReqToCallback: true, // permite que passport lea el body de la petición
      },
      async (req, username, password, done) => {
        try {
          console.log('passport init')

          const userFound = await userDAO.getByEmail( username );
          if (userFound) {
            return done(null, false, { message: "User already exists" });
          }

          const { first_name, last_name, age } = req.body;
          const newUser = await userDAO.create({
            first_name,
            last_name,
            email: username,
            age,
            password: createHash(password),
          });
          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //En JWT, la información del usuario se envía en el token mismo, que se firma digitalmente y se envía en cada solicitud.
  //Passort: alamcenar en la session del servidor el id del usuario, se envia una cookie (La sesión se identifica mediante un ID de sesión único que se envía al cliente en una cookie.)
/*   passport.serializeUser((user, done) => {
    done(null, user._id); 
  });
  passport.deserializeUser(async (id, done) => {
    const user = await UserSchemma.findById(id); 
    done(null, user);
  }); */
};

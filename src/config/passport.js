import passport from "passport";
import local from "passport-local";
import { UserSchemma } from "../models/user.model.js";
import { createHash, getJWTCookie } from "../utils.js";
import jwt, { ExtractJwt, Strategy as jwtStrategy } from "passport-jwt";

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
          const userFound = await UserSchemma.findOne({ email: username });
          if (userFound) {
            return done(null, false, { message: "User already exists" });
          }

          const { first_name, last_name, age } = req.body;

          const newUser = new UserSchemma({
            first_name,
            last_name,
            email: username,
            age,
            password: createHash(password),
          });

          await newUser.save();
          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  /* 
  passport.use(
    "login",
    new localStrategy(
      { usernameField: "email", passReqToCallback: true },
      async (req, username, password, done) => {
        try {
          const user = await UserSchemma.findOne({ email: username });
          if (!user) return done(null, false);
          if (!isValidPassword(user, password)) return done(null, false);
          return done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  ); */
  //En JWT, la información del usuario se envía en el token mismo, que se firma digitalmente y se envía en cada solicitud.
  //Passort: alamcenar en la session del servidor el id del usuario, se envia una cookie (La sesión se identifica mediante un ID de sesión único que se envía al cliente en una cookie.)
  passport.serializeUser((user, done) => {
    done(null, user._id); //No va a haber error / el id del usuario (cookie va a enviar solo id)
  });
  passport.deserializeUser(async (id, done) => {
    //deserializar para recuperar parametros
    const user = await UserSchemma.findById(id); //recuperamos el usuario por id
    done(null, user);
  });
};

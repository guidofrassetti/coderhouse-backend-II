import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import jwtPassport, { ExtractJwt } from "passport-jwt";

const jwtStrategy = jwtPassport.Strategy;
const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

const decodeToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send({ message: "No token provided" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(400).send({ message: "Invalid token" });
    }
    req.userId = decoded.id;
    next();
  });
};

const getJWTCookie = (req) => {
  let token = null;
  if (req.signedCookie) {
    token = req.signedCookie["currentUser"];
  }
  return token;
};

export {
  createHash,
  isValidPassword,
  generateToken,
  decodeToken,
  getJWTCookie,
};

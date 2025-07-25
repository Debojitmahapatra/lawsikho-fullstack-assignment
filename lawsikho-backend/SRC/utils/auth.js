import jwt from 'jsonwebtoken';
import { JwtSECRET } from '../../config.js';


export const checkAuth = function (req, res, next) {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).send({ status: false, message: "Authorization header missing" });
    }

    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).send({ status: false, message: "Invalid token format. Expected 'Bearer <token>'" });
    }

    const token = tokenParts[1];

    jwt.verify(token, JwtSECRET, (err, user) => {
      if (err) {
        return res.status(401).send({ status: false, message: "Unauthorized access. Invalid token." });
      }

      req.user = user; // Set the user info to req
      next(); // Move to next middleware or controller
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};




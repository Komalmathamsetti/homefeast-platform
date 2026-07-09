const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No Token Provided"
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      "homefeast_secret"
    );

    console.log("DECODED:", decoded);

    req.user = decoded;

    next();

  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: error.message
    });
  }
};

module.exports = verifyToken;
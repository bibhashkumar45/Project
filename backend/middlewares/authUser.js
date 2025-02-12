import jwt from "jsonwebtoken";
//admin authentication middleware
const authUser = (req, res, next) => {
  try {
    const {token } = req.headers;
    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized Login please authUser",
      });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SCRETE);
    req.body.userId=token_decode.id;                                        // Imp
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;

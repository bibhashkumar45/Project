import jwt from "jsonwebtoken";
//Doctor authentication middleware
const authDoctor = (req, res, next) => {
  try {
    const {dtoken } = req.headers; 
    // {console.log(dToken)};
    if (!dtoken) {
      return res.json({
        success: false,
        message: "Not Authorized Login please docUser",
      });
    }

    const token_decode = jwt.verify(dtoken, process.env.JWT_SCRETE);
    req.body.docId=token_decode.id;                                        // Imp
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
 
export default authDoctor;

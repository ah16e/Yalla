import AppError from "../utils/appError.js";

const allowedTo = (...roles) => {

    return (req, res, next) => {
     
        if (!roles.includes(req.currentUser.role)) {
            const error = new AppError("You are not allowed to perform this action", 401);
            return next(error);
        }
        next();
    };
}

export default allowedTo;
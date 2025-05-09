import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import httpsStatusText from '../utils/httpsStatusText.js';


const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'] ||  req.headers['Authorization'];
    if (!authHeader) {
        const error = new AppError("You are not logged in", 401, httpsStatusText.ERROR);
        return next(error);
    }
    
    const token = authHeader.split(' ')[1];

    try {
        const currntUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.currentUser = currntUser;
        next();
    } catch (err) {
        const error = new AppError("Invalid token", 401, httpsStatusText.ERROR);
        return next(error);
        
    }
}

export default verifyToken;
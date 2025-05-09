import jwt from 'jsonwebtoken';


const generateJWT = async (palload) => {
    const token = await jwt.sign(palload, process.env.JWT_SECRET_KEY, {expiresIn: '1h'});
    return token;
}

export default generateJWT;
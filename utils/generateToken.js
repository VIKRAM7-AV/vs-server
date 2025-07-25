import jwt from 'jsonwebtoken';

const generateToken = (userId, res) => {
    const token=jwt.sign({id:userId}, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });

    res.cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "none"
    });
}

export default generateToken;
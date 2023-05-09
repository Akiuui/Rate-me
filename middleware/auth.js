import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    try {
        let token = req.header("Authorization");

        if (!token) {
            return res.status(403).send("Access Denied, Token doesnt exist");
        }

        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }

        const verified = jwt.verify(token, process.env.JTW_SECRET)

        req.user = verified;
        next();

    } catch (err) {
        err.status(500).json({ erorr: err.message });
    }

}
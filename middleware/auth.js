import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    try {
        let token = req.header("Authorization");

        if (!token) { }


    } catch (err) {
        err.status(500).json({ erorr: err.message });
    }

}
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js"

/*REGISTER*/
export const register = async (req, res) => { //API that registers the user
    try {
        const { firstName, lastName, email, password, pisturePath, friends, location, occupation } = req.body //Get all items from the form

        const salt = await bcrypt.genSalt(); //Generates the salt form encrypting
        const passwordHash = await bcrypt.hash(password, salt) //Bcrypt hashes password and returns it 

        const newUser = new User({ //Using the User schema we create a "class" vith all the required elements  
            firstName, lastName, email, password: passwordHash, pisturePath, friends, location, occupation,
            viewedProfile: Math.floor(Math.random() * 10000), impressions: Math.floor(Math.random() * 10000)
        })

        const savedUser = await newUser.save() //Save method saves the "class" to MongoDB 
        res.status(201).json(savedUser) //Returns good status to the frontend and all the elements too
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

/*LOGIN USER*/

export const login = async (req, res) => {
    try {
        const { email, password } = req.body; //From the form we get the email and password
        const user = await User.findOne({ email: email }) //We use "findOne" to search inside of the DB and return a users information that matches the email
        if (!user) return res.status(400).json({ msg: "User does not exist." }) //If user is null then send error signal
        const isMatch = await bcrypt.compare(password, user.password) //Then using compare we see if the users Hashed password matches the form password
        if (!isMatch) return res.status(400).json({ msg: "Wrong credetials" }) //If it doesnt match, we send error signal 

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); //JWT creates a token and its signed to the user
        delete user.password
        res.status(200).json({ token, user })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }

}
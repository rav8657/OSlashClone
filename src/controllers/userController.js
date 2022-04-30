const userModel = require('../models/userModel')
const validator = require('../validators/validator')
const bcrypt = require('bcrypt')
const saltRounds = 10;
const jwt = require('jsonwebtoken')


//creating user by validating every details.

const register = async function (req, res) {
    try {

        let requestBody = req.body

        //Extract body
        let { name,email,password } = requestBody

        //*---Validation for empty req body-----------
        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Invalid request parameter, please provide user Detaills" });
        }
        //Validation for the user's first name.
        if (!validator.isValid(name)) {
            return res.status(400).send({ status: false, message: "Invalid request parameter, please provide name" });
        }
      
        //Validation for the user's Email Id.
        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, message: "Invalid request parameter, please provide email" });
        }
        //validating email using RegEx.
        if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) {
            return res.status(400).send({ status: false, message: `Email should be a valid email address` });
        }

        //searching email in DB to maintain its uniqueness
        let isEmailAlredyPresent = await userModel.findOne({ email: email })
        if (isEmailAlredyPresent) {
            return res.status(400).send({ status: false, message: `Email Already Present` });
        }

        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: "Invalid request parameter, please provide password" });
        }

        //setting length criteria for password.
        if (!(password.length >= 8 && password.length <= 15)) {
            return res.status(400).send({ status: false, message: "Password should be Valid min 8 and max 15 " });
        }

        password = await bcrypt.hash(password, saltRounds); //encrypting password by using bcrypt.

        //object destructuring for response body.
        const userDetails = { name, email, password }

        let savedUserData = await userModel.create(userDetails)

        res.status(201).send({ status: true, message: 'User Registration successfully', data: savedUserData })

    } catch (error) {

        res.status(500).send({ status: false, msg: error.message })
    }
}

//!..................................................................
//user login by validating the email and password.

const login = async (req, res) => {

    try {
        const requestBody = req.body;

        // Extract params

        const { email, password } = requestBody;

        // Validation for Empty request body
        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, msg: "Please enter login credentials" });
        }

        if (!validator.isValid(email)) {
            res.status(400).send({ status: false, msg: "Enter an email" });
            return;
        }

        if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) {
            return res.status(400).send({ status: false, message: `Email should be a valid email address` });
        }

        if (!validator.isValid(password)) {
            res.status(400).send({ status: false, msg: "enter a password" });
            return;
        }

        if (!(password.length >= 8 && password.length <= 15)) {
            return res.status(400).send({ status: false, message: "Password should be Valid min 8 and max 15 " })
        }
        // Validation ends

        //finding user's details in DB to verify the credentials.
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).send({ status: false, message: `Invalid login credentials` });
        }

        let hashedPassword = user.password

        //converting normal password to hashed value to match it with DB's entry by using compare function.
        const encryptedPassword = await bcrypt.compare(password, hashedPassword)

        if (!encryptedPassword) return res.status(401).send({ status: false, message: `Invalid login credentials` });

        //Creating JWT token through userId. 
        const token = jwt.sign({
            userId: user._id,
            iat: Math.floor(Date.now() / 1000),   //time of issuing the token.
            exp: Math.floor(Date.now() / 1000) + 3600 * 24  //+ 60 * 30 setting token expiry time limit.
        }, 'OSlash')


        res.header("BearerToken", token);

        res.status(200).send({ status: true, msg: "user login successfully", data: { userId: user._id, token: token } });
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, msg: error.message });
    }
}


//!..............................................................


module.exports = {
    register,
    login,
   
}



import User from "../schemas/userSchema";
import { hashPassword, comparePassword } from "../helpers/auth";
import jwt from "jsonwebtoken";
import nanoid from "nanoid";

// sendgrid
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);

export const signUp = async (req, res) => {
    try {
        // validation
        const { name, email, username, phone="", password } = req.body;
        
        // check if fields are valid
        if (!name) {
            return res.json({
                error: "Name is required",
            });
        }
        if (!email) {
            return res.json({
                error: "Email is required",
            });
        }
        if (!username) {
            return res.json({
                error: "Username is required",
            });
        }
        if (!password) {
            return res.json({
                error: "Password is required",
            });
        }

        // check if a user with email or username already exists
        const emailExist = await User.findOne({ 'email': email });
        if (emailExist) {
            return res.json({
                error: "Email is already associated with an account",
            });
        }
        const usernameExist = await User.findOne({'username': {'$regex': username,$options:'i'}});
        if (usernameExist) {
            return res.json({
                error: "Username is already associated with an account",
            });
        }

        // hash password
        const hashedPassword = await hashPassword(password);
        try {
            const user = await new User({
                name,
                email,
                username,
                password: hashedPassword,
            }).save();
            if (phone != "") {
                const resp = await User.updateOne(
                    {'_id': user._id},
                    {'phone': phone}
                );
            }

            // create signed token
            const token = jwt.sign({
                _id: user._id
            }, process.env.JWT_SECRET, {
                expiresIn: "21d",
            });
            const {
                password,
                ...rest
            } = user._doc;
            return res.json({
                token,
                user: rest,
            });
        } catch (err) {
            console.log(err);
        }
    } catch (err) {
        console.log(err);
    }
};

export const signIn = async (req, res) => {
    try {
        const { emailUsername, password } = req.body;

        // check if our db has user with that email
        const user = await User.findOne({
            $or: [{ 'email': emailUsername }, { 'username': emailUsername }]
        });
        if (!user) {
            return res.json({
                error: "No user found with email/username provided",
            });
        }

        // check password
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.json({
                error: "Incorrect password",
            });
        }
        
        // create signed token
        const token = jwt.sign({
            _id: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: "21d",
        });
        user.password = undefined;
        user.secret = undefined;
        res.json({
            token,
            user,
        });
    } catch (err) {
        console.log(err);
        return res.status(400).send("Error. Try again.");
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    // find user by email
    const user = await User.findOne({
        email
    });
    console.log("USER ===> ", user);
    if (!user) {
        return res.json({
            error: "User not found"
        });
    }
    // generate code
    const resetCode = nanoid(5).toUpperCase();
    // save to db
    user.resetCode = resetCode;
    user.save();
    // prepare email
    const emailData = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Password reset code",
        html: "<h1>Your password  reset code is: {resetCode}</h1>"
    };
    // send email
    try {
        const data = await sgMail.send(emailData);
        console.log(data);
        res.json({
            ok: true
        });
    } catch (err) {
        console.log(err);
        res.json({
            ok: false
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, password, resetCode } = req.body;

        // find user based on email and resetCode
        const user = await User.findOne({
            email,
            resetCode
        });
        // if user not found
        if (!user) {
            return res.json({
                error: "Email or reset code is invalid"
            });
        }
        // if password is short
        if (!password || password.length < 6) {
            return res.json({
                error: "Password is required and should be 6 characters long",
            });
        }
        // hash password
        const hashedPassword = await hashPassword(password);
        user.password = hashedPassword;
        user.resetCode = "";
        user.save();
        return res.json({
            ok: true
        });
    } catch (err) {
        console.log(err);
    }
};

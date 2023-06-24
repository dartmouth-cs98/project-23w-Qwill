import User from "../schemas/userSchema";
import Letter from "../schemas/letterSchema";
import Friend from "../schemas/friendSchema";
import Font from "../schemas/fontSchema";
import { deleteFontBackend } from "../helpers/font";

import { hashPassword, comparePassword } from "../helpers/auth";
import jwt from "jsonwebtoken";
import nanoid from "nanoid";

// sendgrid
// First four controllers from: https://nabendu82.medium.com/react-native-project-with-nodejs-and-mongodb-part-2-9f3217b37e8c
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);


/**
 * POST /api/signUp
 * Handles user sign up and input validation
 * 
 * Request body: { name: String, email: String, username: String, phone: String (optional), password: String }
 * Response: { token: String, user: Object } || { error: String }
 */
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
        const usernameExist = await User.findOne({'username': {'$regex': `^${username}$`,$options:'i'}});
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
                numCustomFonts: 0,
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


/**
 * POST /api/signIn
 * Handles user sign in by checking user email/username and password
 * 
 * Request body: { emailUsername: String, password: String }
 * Response: { token: String, user: Object } || { error: String }
 */
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


/**
 * POST /api/forgotPassword
 * Generates a reset code for a user who forgot their password
 * 
 * Request body: { email: String }
 * Response: { ok: Boolean } || { error: String }
 */
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


/**
 * POST /api/resetPassword
 * Resets the password of a user given a reset code
 * 
 * Request body: { email: String, password: String, resetCode: String }
 * Response: { ok: Boolean } || { error: String }
 */
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


/**
 * POST /api/changeName
 * Changes the name of a user
 * 
 * Request body: { userID: String, newName: String }
 * Response: { ok: Boolean } || { error: String }
 */
export const changeName = async (req, res) => {
    try {
        const { userID, newName } = req.body;

        // check if our db has a user with the ID of the user
        const user = await User.findOne({
            '_id': userID
        });
        if (!user) {
            return res.json({
                error: "No user found with userID",
            });
        }

        // set new name
        user.name = newName;
        user.resetCode = "";
        user.save();
        return res.json({
            ok: true
        });
    } catch (err) {
        console.log(err);
    }
};


/**
 * POST /api/changeUsername
 * Changes the username of a user
 * 
 * Request body: { userID: String, newUsername: String }
 * Response: { ok: Boolean } || { error: String }
 */
export const changeUsername = async (req, res) => {
    try {
        const { userID, newUsername } = req.body;

        // check if our db has a user with the ID of the user
        const user = await User.findOne({
            '_id': userID
        });
        if (!user) {
            return res.json({
                error: "No user found with userID",
            });
        }

        // check if username already exists
        const usernameExist = await User.findOne({'username': {'$regex': `^${newUsername}$`,$options:'i'}});
        if (usernameExist) {
            console.log(req.body);
            console.log(usernameExist);
            return res.json({
                error: "Username is already associated with another account",
            });
        }

        // set new username to current
        user.username = newUsername;
        user.resetCode = "";
        user.save();
        return res.json({
            ok: true
        });
    } catch (err) {
        console.log(err);
    }
};


/**
 * POST /api/changePassword
 * Changes the password of a user
 * 
 * Request body: { userID: String, oldPassword: String, newPassword: String }
 * Response: { ok: Boolean } || { error: String }
 */
export const changePassword = async (req, res) => {
    try {
        const { userID, oldPassword, newPassword } = req.body;

        // check if our db has a user with the ID of the user
        const user = await User.findOne({
            '_id': userID
        });
        if (!user) {
            return res.json({
                error: "No user found with userID",
            });
        }

        // check if password is short
        if (!newPassword || newPassword.length < 6) {
            return res.json({
                error: "Password is required and should be 6 characters long",
            });
        }

        // check if old password provided was correct
        const match = await comparePassword(oldPassword, user.password);
        if (!match) {
            return res.json({
                error: "Current Password is incorrect",
            });
        }

        // hash password and save to use profile
        const hashedPassword = await hashPassword(newPassword);
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


/**
 * POST /api/deleteUserAccount
 * Deletes the user and all associated data from the database
 * 
 * Request body: { userID: String }
 * Response: { ok: Boolean } || { error: String }
 */
 export const deleteUserAccount = async (req, res) => {
    var mongoose = require('mongoose');

    try {
        const { userID } = req.body;

        // check if our db has a user with the ID of the user
        const user = await User.findOne({
            '_id': userID
        });
        if (!user) {
            return res.json({
                error: "No user found with userID",
            });
        }

        // delete all data associated with user
        console.log("deleting all data for user: " + user.id);

        // delete all letters user was involved in
        await Letter.deleteMany({'sender': userID});
        await Letter.deleteMany({'recipient': userID});

        // delete all friend requests user was involved in
        await Friend.deleteMany({'friendReqSender': userID});
        await Friend.deleteMany({'friendReqRecipient': userID});
        
        // delete all custom fonts created by the user
        const query = [
            {
            $match: {
                    creator: new mongoose.Types.ObjectId(user._id), 
                }
            },
        ];
        const cursor = Font.aggregate(query);
        for await (const doc of cursor) {
            deleteFontBackend(doc._id);
        }

        // delete the user
        await User.deleteOne({'_id': userID});
       
        return res.json({
            ok: true
        });
    } catch (err) {
        console.log(err);
    }
};


/**
 * POST /api/bug
 * Reports a detected bug in the frontend application
 * 
 * Request body: { bug: String }
 * Response: { ok: Boolean } || Error
 */
export const reportBug = async (req, res) => {
    try {
        const { bug } = req.body;
        console.log("BUG FOUND: " + bug);
        return res.json({
            ok: true
        });
    } catch (err) {
        console.log(err);
    }
};
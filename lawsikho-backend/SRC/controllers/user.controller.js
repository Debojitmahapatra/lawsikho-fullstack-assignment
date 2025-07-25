import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import userModel from "../models/user.model.js";
import { isValid, isValidObjectId, isValidRequestBody } from "../utils/valid.js";
import { JwtSECRET } from '../../config.js';
import RecordModel from '../models/record.model.js';

export const createUser = async (req, res) => {
    try {
        let data = req.body;

        if (!isValidRequestBody(data)) { return res.status(400).send({ status: false, message: "Please enter details " }) }

        let { name, email, password, phone, role } = data

        //*name validation

        if (!isValid(name)) {
            return res.status(400).send({ status: false, message: "Please enter a valid name" })
        }
        name = name.trim()

        if (!name.match(/^[a-zA-Z]+$/)) {
            return res.status(400).send({ status: false, message: "name should alpha characters" })
        };

        //*email validation 
        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "Please enter a valid email" })
        }
        //trim the email
        email = email.trim()
        //email unique check ---
        const isUniqueEmail = await userModel.findOne({ email: email });
        if (isUniqueEmail) { return res.status(400).send({ status: false, message: "Please enter a unique email" }) }
        //email regex check ---

        if (!(email).match(/^[a-zA-Z_\.\-0-9]+[@][a-z]{3,6}[.][a-z]{2,4}$/)) { return res.status(400).send({ status: false, message: 'invalid E-mail' }) };

        //*password validation
        if (!isValid(password)) { return res.status(400).send({ status: false, message: "Please enter a valid password" }) }
        password = password.trim()
        if (password.length > 15 || password.length < 8) { return res.status(400).send({ status: false, message: "password should be between 15 and 8 characters" }) }


        // *phone validation

        if (!isValid(phone)) { return res.status(400).send({ status: false, message: "Please enter a valid phone" }) }
        phone = phone.trim()
        const phoneAlreadyExists = await userModel.findOne({ phone: phone })
        if (phoneAlreadyExists) { return res.status(400).send({ status: false, message: "phone number already exists" }) }

        if (!phone.match(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/)) { return res.status(400).send({ status: false, message: "phone number not valid" }); }

        //role validation
        if (role) {
            if (!['user', 'admin'].includes(role)) { return res.status(400).send({ status: false, message: "role has to be user or  admin" }) }
        }
        //todo encrypting password by using bcrypt.
        const saltRounds = 10;
        const encryptedPassword = await bcrypt.hash(password, saltRounds)

        let userData = {
            name,
            email,
            password: encryptedPassword,
            phone,
            role
        }


        let createData = await userModel.create(userData)
        res.status(201).send({ success: true, message: "User created successfully", data: createData })

    } catch (error) {
        console.log("This is the error :", err.message)
        res.status(500).send(error.message)
    }
}


export const loginUser = async (req, res) => {
    try {
        if (!isValidRequestBody(req.body)) { return res.status(400).send({ status: false, message: "Please enter details " }) }

        let { email, password } = req.body

        if (!isValid(email)) { return res.status(400).send({ status: false, message: "Please enter your email Address" }) }
        if (!(email.trim()).match(/^[a-zA-Z_\.\-0-9]+[@][a-z]{3,6}[.][a-z]{2,4}$/)) { return res.status(400).send({ status: false, message: 'invalid E-mail' }) };

        if (!isValid(password)) { return res.status(400).send({ status: false, message: "Please enter your password" }) }
        password = password.trim()
        if (password.length > 15 || password.length < 8) { return res.status(400).send({ status: false, message: "password should be between 15 and 8 characters" }) }

        let user = await userModel.findOne({ email: email });

        if (!user)
            return res.status(400).send({
                status: false, message: "email Address is not present please signup first",
            });


        const encryptedPassword = await bcrypt.compare(password, user.password);

        // Login successful – handle Record model logic
        let record = await RecordModel.findOne(); // Assuming there's one shared record document

        if (!record) {
            // If no record exists, create one
            record = await RecordModel.create({
                loginUser: [{ user: user._id, userCount: 1 }]
            });
        } else {
            // Check if user already exists in loginUser array
            const userEntry = record.loginUser.find(entry => entry.user.toString() === user._id.toString());

            if (userEntry) {
                // Increment userCount
                userEntry.userCount += 1;
            } else {
                // Add new user entry
                record.loginUser.push({ user: user._id, userCount: 1 });
            }

            await record.save();
        }


        if (!encryptedPassword) { return res.status(400).send({ status: false, message: "Please enter your password correctly" }); }

        let token = jwt.sign({ userID: user._id.toString(), role: user.role }, JwtSECRET, { expiresIn: '1d' });
        res.setHeader("BearerToken", token);
        res.status(200).send({ status: true, message: 'user login successful', data: { userID: user._id, user, token: token } });


    } catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ message: "Error", error: err.message })
    }
}

export const getUserById = async (req, res) => {
    try {
        let id = req.params.userId
        console.log(id);

        if (!isValidObjectId(id)) { return res.status(400).send({ status: false, message: "Please enter valid userId" }) }

        const findUser = await userModel.findById(id)

        if (!findUser) { return res.status(404).send({ status: false, message: "No user found" }) }
        res.status(200).send({ status: true, message: 'user found', data: findUser });
    } catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ message: "Error", error: err.message })
    }
}

export const allUsers=async(req,res)=>{
     try {
        let allUser=await userModel.find();      //find({}, { name: 1, _id: 0 });
       if(allUser.length==0){ return res.status(404).send({ status: false, message: "no user found" }) }
    
       res.status(201).send({ success: true, message: "User list", data: allUser })
    
    
    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ message: "Error", error: err.message })
     }
}
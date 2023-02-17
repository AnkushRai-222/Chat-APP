const userModel = require("../models/userModel")
const {validEmail,validName,validPassword,validPhone} = require('../validator/validation')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { isValidObjectId } = require("mongoose")

//-------------------------------------[ CREATE USER ]---------------------------------------//
const createUser = async function(req,res){
    try{
     let data = req.body;

     if(Object.keys(data).length == 0){
        return res.status(400).send({ status: false, message: "Please give some data" })
     }
     let {name, email, phone, password } = data;

     if (!name) { return res.status(400).send({ status: false, message: "Name is mandatory" }); }
     if (!email) { return res.status(400).send({ status: false, message: "Email is mandatory" }); }
     if (!phone) { return res.status(400).send({ status: false, message: "Phone is mandatory" }); }
     if (!password) { return res.status(400).send({ status: false, message: "Password is mandatory" }); }

     if (!validName(name.trim())) { return res.status(400).send({ status: false, message: "Name should be in alphabets only" }); }
    
    if (!validEmail(email)) { return res.status(400).send({ status: false, message: "Please provide correct email" }); }
    let findEmail = await userModel.findOne({ email });
    if (findEmail) { return res.status(400).send({ status: false, message: "User with this email already exists" }); }
    
    if (!validPhone(phone)) { return res.status(400).send({ status: false, message: "Please provide correct phone number" }); }
    let findPhone = await userModel.findOne({ phone });
    if (findPhone) { return res.status(400).send({ status: false, message: "User with this phone number already exists" }); }
    
    if (!validPassword(password)) { return res.status(400).send({ status: false, message: "Password Should be (8-15) in length with one upperCase, special character and number" }); }
    
    
    //..hashing a password
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds)
    
    
    const userData = {
      name: name,  email: email,
      phone, password: hash
    }    
    const user = await userModel.create(userData);
    return res.status(201).send({ status: true, message: "User created successfully", data: user });
    }
    catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}

//----------------------------------------[ LOGIN USER ]-------------------------------------//
const loginUser = async function (req, res) {
    try {
      let data = req.body
      if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, message: "Please enter login details" }); }
  
      const { email, password } = data
  
      if (!email) { return res.status(400).send({ status: false, messsage: "Email is required" }); }
      if (!password) { return res.status(400).send({ status: false, messsage: "Password is required" }); }
      
      if (!validEmail(email)) { return res.status(400).send({ status: false, message: "Please provide correct email" }); }
      if (!validPassword(password)) { return res.status(400).send({ status: false, message: "Password Should be (8-15) in length with one upperCase, special character and number" }); }
 
      const userData = await userModel.findOne({ email: email })
      if (!userData) { return res.status(404).send({ status: false, message: "Email is incorrect" }); }
  
      const comparePassword = await bcrypt.compare(password, userData.password)
      if (!comparePassword) { return res.status(401).send({ status: false, msg: "Password is incorrect" }); }
  
      
      const token = jwt.sign({ userId: userData._id }, "Chat-App", { expiresIn: "24h" } )
  
      return res.status(200).send({ status: true, message: "User login successfull", data: { userId: userData._id, token: token } })
    }
    catch (error) {
      return res.status(500).send({ status: false, message: error.message })
    }
  }
//----------------------------------------[ DELETE USER ]-------------------------------------//
const deleteUser = async function (req, res) {
    try {
      let userId = req.params.userId
      if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, message: 'userId is a not a valid userId' }) }
      
      let userdata = await userModel.findOne({_id:userId,isDeleted:false})
      if (!userdata) { return res.status(404).send({ status: false, message: "user not Found" }) }
      
      await userModel.findOneAndUpdate({ _id: userId }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })
      return res.status(200).send({ status: true, message: "user is sucessfully deleted" })
    }
    catch (err) {
      return res.status(500).send({ status: false, msg: err.message });
    }
  }
  

  module.exports = {createUser,loginUser,deleteUser}
  
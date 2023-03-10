const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('email-validator')
const exp = require('constants')
const validate = require('mongoose-validator')

var passwordvalidator = [
  validate({
    validator: 'isLength',
    arguments: [6, 500],
    message: 'Password must be greater than 6 characters'
  }),
];


const UserSchema = new mongoose.Schema({
  Fname: {
    type: String,
    required: [true, "Please Enter your First name"],
  },

  Lname: {
    type: String,
    required: [true, "Please Enter your Last name"],
  },

  Email: {
    type: String,
    required: [true, "Email is required"],
    validate: [validator.validate, "Please Enter a Valid Email"],

  },

  password: {
    type: String,
    required: [true, "Password is required"],
    validate: passwordvalidator
  },

}, { timestamp: true })

UserSchema.pre("save", async function (next) {
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10)
    console.log('hashed Password:', hashedPassword)
    this.password = hashedPassword
    next()
  }
  catch {
    console.log('error in save', error)
  }
})

UserSchema.virtual('confirmpassword')
.get(()=>this._confirmpassword)
.set(value=>this._confirmpassword = value)

UserSchema.pre('validate',function(next){
  if(this.password !== this.confirmpassword){
    this.invalidate('confirmpassword','confirmpassword must match password')
  }
  next()
})

module.exports = mongoose.model("User", UserSchema)
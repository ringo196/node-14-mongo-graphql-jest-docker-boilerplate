import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import isEmail from 'validator/lib/isEmail';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: [isEmail, 'No valid email address provided.']
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    maxlength: 42,
  },
  role: {
    type: String,
  },
})

userSchema.statics.findByLogin = async function (login) {
  let user = await this.findOne({
    username: login,
  });

  if (!user) {
    user = await this.findOne({ email: login });
  }

  return user;
}

userSchema.methods.generatePasswordHash = async function () {
  const saltRounds = 10
  return bcrypt.hash(this.password, saltRounds)
}

userSchema.methods.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password)
}

userSchema.pre('save', async function ()  {
  this.password = await this.generatePasswordHash()
})


const User = mongoose.model('User', userSchema);

export default User;

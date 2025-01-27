import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Profile = new Schema({
  image: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  gender: { type: String },

  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  password: {
    type: String,
  },
  userId: {
    type: String,
  },
});

export default mongoose.model('Profile', Profile);

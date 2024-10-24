const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique:true
  },
  status:{
type:Boolean
  },
  gender:{type:String,required:true,enum:["Men","Women"]},
  image: {
    type: String, // Assuming the image is stored as a URL. If you store it differently, adjust the type accordingly.
    default: 'default-image-url.jpg', // Provide a default image URL if needed.
  },
},{versionKey:false});

const Category = mongoose.model('StyleCategory', categorySchema);

module.exports = Category;

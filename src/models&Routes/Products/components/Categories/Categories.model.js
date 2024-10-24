// const mongoose = require("mongoose");
// const load = {
//  Title:String
// };
// const categorySchema = new mongoose.Schema(load,{versionKey:false});
// const categoryModel = mongoose.model("Category", categorySchema);
// module.exports = categoryModel;
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  status:{
type:Boolean
  },
  gender:{type:String,required:true},
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', 
  },
  wear:{
    type: String,
    required: true,
  },
  image: {
    type: String, // Assuming the image is stored as a URL. If you store it differently, adjust the type accordingly.
    default: 'default-image-url.jpg', // Provide a default image URL if needed.
  },
  subcategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  }],
},{versionKey:false});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;

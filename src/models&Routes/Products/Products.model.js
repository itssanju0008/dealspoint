const mongoose = require("mongoose");
const slugify = require("slugify"); // Use slugify to create URL-friendly slugs

const productSchema = new mongoose.Schema(
  {
    product_name: { type: String, required: true },
    slug: { type: String, unique: true }, // Slug field
    keywords: String,
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brands",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    review: Number,
    review_count: Number,
    product_description: { type: String },
    specifications: { type: String },
    variations: [],
    seller: String,
    gallery:[],
    pack_of:Number,
    past_sold: Number,
    thumbnail: String,
    mrp: Number,
    price: Number,
    pack:[],
    type: {
      type: String,
      enum: ["product", "pack"], // Ensures only "product" or "pack" is allowed
      required: true, // Optional: Ensures the type field is mandatory
    },
  },
  { versionKey: false }
);

// Pre-save hook to generate the slug
productSchema.pre("save", async function (next) {
  if (this.isModified("product_name")) {
    // Generate the base slug
    let baseSlug = slugify(this.product_name, { lower: true, strict: true });
    
    // Check if the slug already exists in the database
    let slug = baseSlug;
    let count = 1;
    
    // Loop to ensure the slug is unique
    while (await Product.exists({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }
    
    // Assign the unique slug
    this.slug = slug;
  }
  
  next();
});

const Product = mongoose.model("Products", productSchema);

module.exports = Product;

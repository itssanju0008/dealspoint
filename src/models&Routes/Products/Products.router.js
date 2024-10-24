const express = require("express");
const router = express.Router();
const Product = require("./Products.model"); // Adjust the file path as needed

// CREATE a new product
router.post("/", async (req, res) => {
  try {
    const {
      product_name,
      keywords,
      brand,
      pack,
      gallery,
      type,
      category,
      review,
      review_count,
      product_description,
      specifications,
      variations,
      seller,
      past_sold,
      thumbnail,
      pack_of,
      mrp,
      price,
    } = req.body;

    // Validate required fields
    if (!product_name || !brand || !category || !mrp || !price) {
      return res
        .status(400)
        .json({
          error:
            "Required fields: product_name, brand, category, mrp, and price.",
        });
    }

    const newProduct = new Product({
      product_name,
      keywords,
      brand,
      category,
      pack_of,      pack,
      type,
      review,
      gallery,
      review_count,
      product_description,
      specifications,
      variations,
      seller,
      past_sold,
      thumbnail,
      mrp,
      price,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// READ all products with pagination, sorting, filtering, and searching
router.get("/", async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1; // Default page is 1
    const perPage = parseInt(req.query.per_page) || 10; // Default per page is 10

    // Sorting (sort by price, review, etc.)
    let sortField = req.query.sort || "price"; // Default sort by 'price'
    let sortOrder = req.query.order === "desc" ? -1 : 1; // Default sort order is ascending

    // Filters: brand, category, price range
    const { brand, category, minPrice, maxPrice, search } = req.query;

    const filter = {};

    // Filter by brand
    if (brand) {
      filter.brand = brand; // Match the brand by ObjectId
    }

    // Filter by category
    if (category) {
      filter.category = category; // Match the category by ObjectId
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice); // Minimum price filter
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice); // Maximum price filter
    }

    // Search functionality: product_name or keywords
    if (search) {
      filter.$or = [
        { product_name: { $regex: search, $options: "i" } }, // Case-insensitive search on product name
        { keywords: { $regex: search, $options: "i" } }, // Case-insensitive search on keywords
      ];
    }

    // Fetch products with pagination, sorting, filtering, and searching
    const products = await Product.find(filter)
      .populate("brand", "name") // Populate brand and show only the name
      .populate("category", "name") // Populate category and show only the name
      .sort({ [sortField]: sortOrder }) // Sorting based on specified field and order
      .skip((page - 1) * perPage) // Skip the products for pagination
      .limit(perPage) // Limit the products per page
      .lean();

    // Count total products for pagination calculation
    const totalProducts = await Product.countDocuments(filter);

    // Return paginated, sorted, filtered, and searched products along with meta info
    res.json({
      totalProducts,
      totalPages: Math.ceil(totalProducts / perPage),
      currentPage: page,
      perPage,
      products,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    // Find product by slug
    const product = await Product.findOne({ slug })
      .populate("brand", "name")
      .populate("category", "name")
      .lean();

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product by slug:", error.message); // Log the error
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// UPDATE a product by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      product_name,
      keywords,
      pack,
      gallery,
      type,
      brand,
      pack_of,
      category,
      review,
      review_count,
      product_description,
      specifications,
      variations,
      seller,
      past_sold,
      thumbnail,
      mrp,
      price,
    } = req.body;

    // Validate required fields
    if (!product_name || !brand || !category || !mrp || !price) {
      return res
        .status(400)
        .json({
          error:
            "Required fields: product_name, brand, category, mrp, and price.",
        });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        product_name,
        gallery,
        keywords,
        pack,
        type,
        brand,
        category,
        review,
        review_count,
        product_description,pack_of,
        specifications,
        variations,
        seller,
        past_sold,
        thumbnail,
        mrp,
        price,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE a product by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.json({ message: "Product deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

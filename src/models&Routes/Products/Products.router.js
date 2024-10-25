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
    if (!product_name || !category || !mrp || !price) {
      return res.status(400).json({
        error: "Required fields: product_name, category, mrp, and price.",
      });
    }

    // Validate the brand field if it’s provided
    const validBrand = brand && mongoose.Types.ObjectId.isValid(brand) ? brand : undefined;

    const newProduct = new Product({
      product_name,
      keywords,
      brand: validBrand,
      category,
      pack_of,
      pack,
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
    console.error("Error saving product:", error.message);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
})

// READ all products with pagination, sorting, filtering, and searching
router.get("/", async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1; // Default page is 1
    const perPage = parseInt(req.query.limit) || 20; // Default limit is 20

    // Sorting options: az, za, phl, plh, latest, best_seller, top_rated, new_arrival
    let sortField = "product_name";
    let sortOrder = 1; // Default sort order is ascending

    if (req.query.sort_by) {
      switch (req.query.sort_by) {
        case "az":
          sortField = "product_name";
          sortOrder = 1; // Ascending A-Z
          break;
        case "za":
          sortField = "product_name";
          sortOrder = -1; // Descending Z-A
          break;
        case "phl":
          sortField = "price";
          sortOrder = -1; // Price high to low
          break;
        case "plh":
          sortField = "price";
          sortOrder = 1; // Price low to high
          break;
        case "latest":
          sortField = "_id";
          sortOrder = -1; // Latest products first
          break;
        case "best_seller":
          sortField = "past_sold";
          sortOrder = -1; // Best seller (highest past_sold first)
          break;
        case "top_rated":
          sortField = "review";
          sortOrder = -1; // Top rated (highest review first)
          break;
        case "new_arrival":
          sortField = "_id";
          sortOrder = -1; // Newest arrivals (assuming newest have higher _id)
          break;
        default:
          sortField = "product_name";
          sortOrder = 1;
      }
    }

    // Filters: brand, category, ratings, price range, and search
    const { brand, category, minPrice, maxPrice, search, filter_by = {} } = req.query;

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

    // Filter by ratings
    if (filter_by.ratings) {
      const ratings = filter_by.ratings.split(",").map(Number); // Convert ratings to an array of numbers
      const minRating = Math.min(...ratings); // Find the minimum rating
      filter.review = { $gte: minRating }; // Filter products with review >= minRating
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

// GET products by category ID with pagination, filtering, and sorting
router.get("/category/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 20, filter_by = {}, sort_by } = req.query;

    // Parse `filter_by` (e.g., ratings)
    let filters = {};
    if (filter_by.ratings) {
      const ratings = filter_by.ratings.split(",").map(Number); // Convert ratings to an array of numbers
      const minRating = Math.min(...ratings); // Find the minimum rating

      filters.review = { $gte: minRating }; // Filter products with review >= minRating
    }

    // Handle sorting
    let sort = {};
    if (sort_by) {
      switch (sort_by) {
        case "az":
          sort = { product_name: 1 }; // Sort by name (A-Z)
          break;
        case "za":
          sort = { product_name: -1 }; // Sort by name (Z-A)
          break;
        case "phl":
          sort = { price: -1 }; // Sort by price high to low
          break;
        case "plh":
          sort = { price: 1 }; // Sort by price low to high
          break;
        case "latest":
          sort = { _id: -1 }; // Sort by latest (assuming _id is the object id or timestamp)
          break;
        default:
          sort = {}; // No sorting
      }
    }

    // Handle pagination
    const skip = (page - 1) * limit;

    // Fetch products by category ID, applying filters, sorting, and pagination
    const products = await Product.find({ category: categoryId, ...filters })
      .populate("brand category") // Populate brand and category if needed
      .sort(sort) // Apply sorting
      .skip(skip) // Skip for pagination
      .limit(parseInt(limit)); // Limit the results

    // Send the response as a JSON array of products
    res.json(products);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "Internal server error" });
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
      return res.status(400).json({
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
        product_description,
        pack_of,
        specifications,
        keywords,
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

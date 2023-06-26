import mongoose from "mongoose";

const ProductModel = new mongoose.Schema(
  {
    name: { type: String },
    price: { type: Number },
    description: { type: String },
    category: { type: String },
    rating: { type: Number },
    supply: { type: Number },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductModel);
export default Product;
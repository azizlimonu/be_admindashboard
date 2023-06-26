import User from "../models/User.js";
import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import Transaction from "../models/Transaction.js";

import getCountryIso3 from "country-iso-2-to-3";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    const productsWithStats = await Promise.all(
      products.map(async (product) => {
        const stat = await ProductStat.find({
          productId: product._id,
        });
        return {
          ...product._doc,
          stat,
        };
      })
    );
    res.status(200).json(productsWithStats);
  } catch (error) {
    console.log(`Error in getProducts = ${error}`);
    res.status(500).json({ message: error.message });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const customers = await User
      .find({ role: "user" })
      .select("-password");
    res.status(200).json(customers);
  } catch (error) {
    console.log(`Error in getCustomers = ${error}`);
    res.status(500).json({ message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    // expected Query
    // {
    //   page: '1',
    //   pageSize: '10',
    //   sort: '{"field":"cost","sort":"asc"}',
    //   search: 'apple'
    // }

    const {
      page = 1,
      pageSize = 20,
      sort = null,
      search = ""
    } = req.query;

    const generateSort = () => {
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        [sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1)
      };
      return sortFormatted;
    };

    const sortFormatted = Boolean(sort) ? generateSort() : {};

    const transactions = await Transaction.find({
      $or: [
        { cost: { $regex: new RegExp(search, "i") } },
        { userId: { $regex: new RegExp(search, "i") } },
      ],
    })
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize);

    const total = await Transaction.countDocuments({
      name: { $regex: search, $options: "i" }
    });

    res.status(200).json({ transactions, total });
  } catch (error) {
    console.log(`Error in getTransactions = ${error}`);
    res.status(500).json({ message: error.message });
  }
};

export const getGeography = async (req, res) => {
  // ========= Example of usage =======
  // assume this user
  // const users = [
  //   { country: "USA" },
  //   { country: "USA" },
  //   { country: "USA" },
  //   { country: "CAN" },
  //   { country: "CAN" },
  //   { country: "AUS" },
  // ];
  // the Mapped Location will be
  // {
  //    "USA": 3,
  //    "CAN": 2,
  //    "AUS": 1
  // }
  // the formatted location will be
  // [
  //   { id: "USA", value: 3 },
  //   { id: "CAN", value: 2 },
  //   { id: "AUS", value: 1 }
  // ]


  try {
    const users = await User.find();

    const mappedLocations = users.reduce((acc, { country }) => {
      const countryISO3 = getCountryIso3(country);
      if (!acc[countryISO3]) {
        acc[countryISO3] = 0;
      }
      acc[countryISO3]++;
      return acc;
    }, {});

    // map each mappedlocation and turn to array and destructuring the array and assign value to it
    const formattedLocations = Object.entries(mappedLocations).map(
      ([country, count]) => {
        return { id: country, value: count };
      }
    );

    res.status(200).json(formattedLocations);
  } catch (error) {
    console.log(`Error in getGeography = ${error}`);
    res.status(500).json({ message: error.message });
  }
};
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

import client from './routes/client.js';
import general from './routes/general.js';
import management from './routes/management.js';
import sales from './routes/sales.js';

// Models or Schema
import User from './models/User.js';
import Product from "./models/Product.js";
import ProductStat from "./models/ProductStat.js";
import Transaction from "./models/Transaction.js";
import OverallStat from "./models/OverallStat.js";
import AffiliateStat from "./models/AffiliateStat.js";

// Seeder
import {
  dataUser,
  dataProduct,
  dataProductStat,
  dataTransaction,
  dataOverallStat,
  dataAffiliateStat,
} from './data/seed.js';

/* CONFIGURATION */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
app.use("/api/client", client);
app.use("/api/general", general);
app.use("/api/management", management);
app.use("/api/sales", sales);

app.get("/", (req, res) => {
  res.send("API okay bos");
});

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 5001;

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ONLY ADD DATA ONE TIME */
    User.insertMany(dataUser);
    Transaction.insertMany(dataTransaction);
    Product.insertMany(dataProduct);
    ProductStat.insertMany(dataProductStat);
    OverallStat.insertMany(dataOverallStat);
    AffiliateStat.insertMany(dataAffiliateStat);
  })
  .catch((error) => console.log(`${error} did not connect`));

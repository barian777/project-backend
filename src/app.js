import express from "express"
import config from "./config.js";
import productRoutes from "./routes/product.routes.js"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(productRoutes);

app.listen(config.PORT, () => {console.log(`Server running on port: ${config.PORT}`);})



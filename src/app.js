import express from "express"
import config from "./config.js";
import productRoutes from "./routes/product.routes.js"
import cartRoutes from "./routes/cart.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(`${config.DIRNAME}/public`))
app.use(productRoutes);
app.use(cartRoutes);

app.listen(config.PORT, () => {console.log(`Server running on port: ${config.PORT}`);})




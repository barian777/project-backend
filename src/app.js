import ProductManager from "./managers/productManager.js";
import express from "express"

const PORT = 5000;
const app = express();
const manager = new ProductManager("./data/products.json")

app.get("/products", async (req, res) => {
    const limit = +req.query.limit || 0;
    const products = await manager.getProducts(limit);
    res.send({status : 1, payload : products})
})

app.get("/products/:pid", async (req, res) => {
    const product = await manager.getProductById(+req.params.pid);
    res.send({status : 1, payload : product}) 
})

app.listen(PORT, () => {console.log(`Server running on port: ${PORT}`);})

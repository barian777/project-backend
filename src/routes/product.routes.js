import express from "express";
import ProductManager from "../managers/productManager.js";

const manager = new ProductManager("./ddbb/products.json")
const routerProducts = express.Router()

routerProducts.post("/api/products", async (req, res) => {
    try {
      const body = req.body;
      if (
        req.body.title &&
        req.body.description &&
        req.body.code &&
        req.body.price &&
        req.body.status &&
        req.body.stock &&
        req.body.category &&
        req.body.thumbnail
      ) {
        await manager.addProduct(body);
        res.status(200).send({ origin: "server1", payload: body });
      } else {
        res.status(400).send({origin: "server1", payload: "Por favor complete todos los campos",});
      }
    } catch (error) {
      res.status(500).send({ origin: "server1", payload: "Se produjo un error al subir el producto nuevo." });
    }
  });

routerProducts.get("/api/products", async (req, res) => {
    try {
        const limit = +req.query.limit || 0;
        const products = await manager.getProducts(limit);
        res.status(200).send({origin : "server1", payload : products})
    } catch (error) {
        console.error("Error al intentar obtener los productos:", error);
        res.status(500).send({origin : "server1", payload : "No se pudo obtener los productos."})
    }
})

routerProducts.get("/api/products/:pid", async (req, res) => {
    try {
        const product = await manager.getProductById(+req.params.pid);
        res.status(200).send({origin : "server1", payload : product}) 
    } catch (error) {
        res.status(404).send({origin : "server1", payload : "Por favor ingrese un ID válido."})
    }
})

routerProducts.put("/api/products/:pid", async (req, res) => {
    const productId = parseInt(req.params.pid);
    const { prop, value } = req.body; 

    try {
        const updated = await manager.updateProduct(productId, prop, value);

        if (updated) {
            res.status(200).send({ origin: "server1", payload: "El producto se actualizó con éxito." });
        } else {
            res.status(404).send({ origin: "server1", payload: "No se encontró el producto para actualizar." });
        }
    } catch (error) {
        console.error("Error al intentar actualizar el producto:", error);
        res.status(500).send({ origin: "server1", payload: "Se produjo un error al intentar actualizar el producto." });
    }
});

routerProducts.delete("/api/products/:pid", async (req, res) => {
    try {
        const productId = +req.params.pid;
        const productDeleted = await manager.deleteProduct(productId);

        if (productDeleted) {
            res.status(200).send({ origin: "server1", payload: "El producto se eliminó con éxito." });
        } else {
            res.status(404).send({ origin: "server1", payload: "No se encontró el producto para eliminar." });
        }
    } catch (error) {
        res.status(500).send({ origin: "server1", payload: "Se produjo un error al intentar eliminar el producto." });
    }
});


export default routerProducts;
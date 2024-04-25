import { Router } from "express";
import CartManager from "../managers/cartManager.js";

const manager = new CartManager("./ddbb/cartProducts.json");
const routerCart = Router();

routerCart.post("/api/carts", async (req, res) => {
    try {
        await manager.createCart();
        res.status(200).send({ origin:"server1", payload : "Se creo un carrito con exito"})
    } catch (error) {
        console.error("Se produjo un error al crear el carrito", error);
        res.status(500).send({ origin:"server1", payload : "No se puedo crear el carrito"})
    }
})

routerCart.post("/api/carts/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = +req.params.cid;
        const productId= +req.params.pid;
        await manager.addProductOnCart(cartId,productId)
        res.status(200).send({origin:"server1", payload:"El producto se agrego con exito"})
    } catch (error) {
        console.error("Se produjo un error al agregar el producto al carrito.", error);
        res.status(500).send({ origin:"server1", payload : "No se puedo agregar el producto al carrito."})
    }
})

routerCart.get("/api/carts/:cid", async (req, res) => {
    try {
        const productsCart = await manager.getCartsById(+req.params.cid)
        console.log("Se obtuvo exitosamente los productos.");
        res.status(200).send({osrigin:"server1", payload:productsCart})
    } catch (error) {
        console.error("Se produjo un error al obtener los productos", error)
        res.status(500).send({ origin:"server1", payload : "No se puedo obtener los productos."})
    }
})

export default routerCart;
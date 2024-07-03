import { Router } from "express";
import CartManager from "../dao/managerCart.mdb.js";
import mongoose from "mongoose";
import cartsModel from "../dao/models/carts.model.js";

const manager = new CartManager();
const routerCart = Router();

routerCart.post("/", async (req, res) => {
    const { userId } = req.body;
    try {
        await manager.createCart(userId);
        res.status(200).send({ origin: "server1", payload: "Se creó un carrito con éxito." });
    } catch (error) {
        console.error("Se produjo un error al crear el carrito.", error);
        res.status(500).send({ origin: "server1", payload: "No se pudo crear el carrito." });
    }
});

routerCart.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const qty = 1;

    try {
        const updatedCart = await manager.addProduct(cid, { _id: pid, qty });
        res.status(200).send({ origin: "server1", payload: updatedCart });
    } catch (error) {
        console.error("Se produjo un error al añadir el producto al carrito.", error);
        res.status(500).send({ origin: "server1", payload: "No se pudo añadir el producto al carrito." });
    }
});

routerCart.get("/", async (req, res) => {
    try {
        const productsCart = await manager.getAll();
        console.log("Se obtuvieron exitosamente los carritos.");
        res.status(200).send({ origin: "server1", payload: productsCart });
    } catch (error) {
        console.error("Se produjo un error al obtener los carritos", error);
        res.status(500).send({ origin: "server1", payload: "No se pudo obtener los carritos." });
    }
});

routerCart.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const productsCart = await manager.getCartsById(cid);
        console.log("Se obtuvieron exitosamente los productos.");
        res.status(200).send({ origin: "server1", payload: productsCart });
    } catch (error) {
        console.error("Se produjo un error al obtener los productos", error);
        res.status(500).send({ origin: "server1", payload: "No se pudo obtener los productos." });
    }
});

routerCart.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cid)) {
        return res.status(400).send({ error: 'El ID no es válido.' });
    }
    try {
        const emptyCart = await cartsModel.findOneAndUpdate(
            { _id: cid },
            { $set: { products: [] } },
            { new: true }
        );
        res.status(200).send({ origin: "serverAtlas", payload: emptyCart });
    } catch (error) {
        console.error("Se produjo un error al vaciar el carrito", error);
        res.status(500).send({ error: 'Ocurrió un error al intentar vaciar el carrito.' });
    }
});

routerCart.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
        return res.status(400).send({ error: 'Alguno de los ID son inválidos.' });
    }

    try {
        const updatedCart = await cartsModel.findOneAndUpdate(
            { _id: cid },
            { $pull: { products: { _id: pid } } },
            { new: true }
        );

        if (!updatedCart) {
            return res.status(404).send({ error: 'Carrito o producto no encontrado.' });
        }

        res.status(200).send({ origin: "serverAtlas", payload: updatedCart });
    } catch (error) {
        console.error("Se produjo un error al eliminar el producto.", error);
        res.status(500).send({ error: 'Ocurrió un error al intentar eliminar el producto.' });
    }
});

routerCart.put('/:cid/products/:pid/:qty', async (req, res) => {
    const { cid, pid, qty } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
        return res.status(400).send({ error: 'Alguno de los ID son inválidos.' });
    }

    try {
        const updatedCart = await cartsModel.findOneAndUpdate(
            { _id: cid, 'products._id': pid },
            { $inc: { 'products.$.quantity': parseInt(qty) } },
            { new: true }
        );

        if (!updatedCart) {
            return res.status(404).send({ error: 'Carrito o producto no encontrado.' });
        }

        res.status(200).send({ origin: "serverAtlas", payload: updatedCart });
    } catch (error) {
        console.error("Se produjo un error al actualizar el producto.", error);
        res.status(500).send({ error: 'Ocurrió un error al intentar actualizar el producto.' });
    }
});

export default routerCart;

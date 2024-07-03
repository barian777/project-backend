import cartsModel from "./models/carts.model.js";
import usersModel from "./models/users.model.js";
import productModel from "./models/products.model.js";
import mongoose from "mongoose";

class CartManager {
    constructor() {}

    getAll = async () => {
        try {
            return await cartsModel
                .find()
                .populate({ path: '_user_id', model: usersModel })
                .populate({ path: 'products._id', model: productModel })
                .lean();
        } catch (err) {
            throw new Error(`Error al obtener los carritos: ${err.message}`);
        }
    };

    createCart = async (userId) => {
        try {
            if (!userId) {
                throw new Error('Se necesita el ID del usuario.');
            }

            const newCart = new cartsModel({
                _user_id: userId,
                products: []
            });

            const savedCart = await newCart.save();
            return savedCart;
        } catch (err) {
            throw new Error(`Error al crear el carrito: ${err.message}`);
        }
    };

    getCartsById = async (id) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('ID de carrito no válido.');
            }
            const cart = await cartsModel.findById(id).populate('products._id');
            if (!cart) {
                throw new Error('Carrito no encontrado.');
            }
            return cart;
        } catch (error) {
            throw new Error(`Error al obtener el carrito por ID: ${error.message}`);
        }
    };

    addProduct = async (cid, product) => {
        try {
            const cart = await cartsModel.findById(cid);
            if (!cart) {
                throw new Error("Carrito no encontrado.");
            }

            const existingProduct = cart.products.find(p => p._id.toString() === product._id.toString());
            if (existingProduct) {
                existingProduct.quantity += product.qty;
            } else {
                cart.products.push({
                    _id: product._id,
                    quantity: product.qty
                });
            }
            const updatedCart = await cart.save();
            return updatedCart;
        } catch (error) {
            throw new Error(`Error al añadir el producto al carrito: ${error.message}`);
        }
    };
}

export default CartManager;


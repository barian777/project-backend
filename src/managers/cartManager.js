import fs from "fs";
import ProductManager from "./productManager.js";

class CartManager{
    
    static cId = 0;

    constructor(filePath) {
        this.path = filePath
    }

    async getCarts(){
        try {
            const carts = await fs.promises.readFile(this.path)
            const parsedCart = await JSON.parse(carts)
            return parsedCart
        } catch (error) {
            console.error("Se produjo un error al traer los carritos.", error);
            return "No se pudo obtener los carritos"
        }
    }

    async createCart(){
        try {
            const carts = await this.getCarts();
            const lastCart = carts.length > 0 ? carts[carts.length -1].id : CartManager.cId;
            const id = lastCart +1;
            const products = [];
            const newCart = {
                id,
                products
            }
            carts.push(newCart),
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))
            return true
        } catch (error) {
            console.error("Se produjo un erro al crear el carrito.", error);
            return false
        }
    }

    async getCartsById(id){
        try {
            const idParsed = +id;
            if (idParsed || idParsed === 0){
                const carts = await this.getCarts();
                const cartSelect = carts.find(element => element.id === idParsed)
                return cartSelect || "El ID ingresado no existe"
            }else{
                return "Porfavor ingrese un número de ID."
            }
        } catch (error) {
            console.error(`No se encontro un carrito con el ID ${id}`, error);
            return false
        }
    }

    async addProductOnCart(id, idProducto) {
        try {
            const content = await fs.promises.readFile(this.path);
            const cart= JSON.parse(content);
    
            // Busca el objeto con el ID dado
            const cartSelect = cart.find(item => item.id === +id);
    
            if (cartSelect) {
                // Verifica si el producto ya existe en el array de productos
                const productExistent = cartSelect.products.find(product => product.idProduct === +idProducto);
    
                if (productExistent) {
                    // Si el producto ya existe, aumenta la cantidad
                    productExistent.quantity++;
                } else {

                    cartSelect.products.push({ idProduct: idProducto, quantity: 1 });
                }
    

                await fs.promises.writeFile(this.path, JSON.stringify(cart, null, 2));
    
                console.log("Producto agregado con éxito.");
            } else {
                console.log("No se encontró el carrito con el ID especificado.");
            }
        } catch (error) {
            console.error("Error al agregar el producto:", error);
        }
    }

    async getProduct(id){
        const managerProduct = new ProductManager("../ddbb/products.json")
        const productSelect = await managerProduct.getProductById(+id)
        const finalProduct =  { id : productSelect.id, quantity : 1}
        if(typeof productSelect.id === "undefined"){
            return "Ingrese un ID valido."
        } else{
            return finalProduct
        }
    }
}

export default CartManager;

const managerCart = new CartManager("../ddbb/cartProducts.json")

//await managerCart.agregarProducto(2,1000)
//await managerCart.addProductOnCart(3,1003)
//console.log(await managerCart.getProduct(1000));
//console.log(await managerCart.addProductOnCart(1,1000));
//await managerCart.createCart()
//await managerCart.createCart()
//await managerCart.addProductOnCart(1,1000)
//console.log(await managerCart.addProductOnCart(1,1001));
//console.log(await managerCart.getCartsById(1));
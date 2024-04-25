import fs from "fs";

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
            const carts = await this.getCarts();
            const cartSelect = carts.find((element) => {element.id === +id})
            return cartSelect 
        } catch (error) {
            console.error(`No se encontro un carrito con el ID ${id}`, error);
            return false
        }


    }
}

const managerCart = new CartManager("../ddbb/cartProducts.json")

console.log(await managerCart.getCartsById(2));
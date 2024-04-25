import fs from 'fs';

class ProductManager{

    static idGenerator = 1000;

    constructor(filePath){
        this.path = filePath;
    }

    async getProducts(limit) {
        try {
            const products = await fs.promises.readFile(this.path)
            const productsParsed = await JSON.parse(products)
            return limit === 0 ? productsParsed: productsParsed.slice(0, +limit)
        } catch (error) {
            console.error("Error en la función getProducts:", error);
            return "Se produjo un error para obtener los productos."
        }
    }

    async addProduct({title, description, code, price, status, stock, category,thumbnail}){
        try {
            const products = await this.getProducts(0);

            const lastProductId = products.length > 0 ? products[products.length - 1].id : ProductManager.idGenerator;
            const id = lastProductId + 1;
            
            let codeValidation = products.some(product => product.code === code)
            if(codeValidation === true){
                return "El código de producto ingresado esta repetido. Porfavor ingrése un producto con otro código."
            }else{
                const newProduct= {
                    id,
                    title,
                    description,
                    code,
                    price,
                    status,
                    stock,
                    category,
                    thumbnail,
                }
                products.push(newProduct);
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2))
                return "El producto se añadio exitosamente"
            }

        } catch (error) {
            return "Se produjo un error para agregar un producto."
        }
    }

    async getProductById(id){
        try {
            const products = await this.getProducts(0);
            const productById = products.find(element => element.id === parseInt(id))
            return productById || `Producto con ID ${id} innexistente.`
        } catch (error) {
            return `Se produjo un error para encontrar el prodcuto con el id ${id}.`
        }
    }
    
    async deleteProduct(id){
        try {
            const products = await this.getProducts(0)
            const validationID = products.some(product => product.id === id)
            if(validationID){
                const filteredProducts = products.filter((product) => {return product.id !== id})
                await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts, null, 2))
                return true;
            }else{
                return false;
            }
        } catch (error) {
            return "Se produjo un error para eliminar el producto."
        }
    }

    async updateProduct(id, prop, value){
        try {
                const products = await this.getProducts(0)
                const parseId = +id;
                const index = products.findIndex(product => product.id === parseId);
                if(prop === "price" || prop === "stock"){
                    if (index !== -1){
                        const updatedProduct = {...products[index]}
                        updatedProduct[prop] = +value
                        products[index] = updatedProduct
                        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2))
                        return true;
                    }else{
                        return false;
                    }
                } else{
                    if (index !== -1){
                        const updatedProduct = {...products[index]}
                        updatedProduct[prop] = value
                        products[index] = updatedProduct
                        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2))
                        return true;
                    }else{
                        return false;
                    }
                }
            } catch (error) {
                return "Se produjo un error."
            }
        }
}

export default ProductManager;

// export const manager = new ProductManager("../data/products.json")
// const data = await manager.getProducts(0)
// console.log(data);

import { Router } from "express";
import { uploader } from "../uploader.js";
import ManagerProducts from "../dao/managerProduct.mdb.js"
import productsModel from "../dao/models/products.model.js"

const router = Router();

const manager = new ManagerProducts();

router.get('/', async (req, res) => {
    const limit = isNaN(+req.query.limit) ? 8 : +req.query.limit;
    const page = isNaN(+req.query.page) ? 1 : +req.query.page;
    const key = req.query.key || null ;
    const value = req.query.value || null;
    const order = req.query.order || 'asc';
    let sort;
    if (order === 'desc') {
        sort = { [key]: -1 };
    } else {
        sort = { [key]: 1 };
    }

    try {
        const listProducts = await productsModel.paginate({[key]:value},{page:page, limit:limit, sort })
        res.status(200).send({origin : "serverAtlas", payload : listProducts})
    } catch (error) {
        console.error("Error al intentar obtener los productos:", error);
        res.status(500).send({origin : "serverAtlas", payload : "No se pudo obtener los productos."})
    }
})

router.get('/:id', async (res,req) => {
    const id = req.params.id
    try {
        const productSelect = await manager.getById(id)
        res.status(200).send({origin : "serverAtlas", payload : productSelect})
    } catch (error) {
        console.error("Error al intentar obtener el producto:", error);
        res.status(500).send({origin : "serverAtlas", payload : "No se pudo obtener el producto."})
    }
})

router.post('/', uploader.single('thumbnail'), async (req, res) => {
    try {
        const socketServer = req.app.get('socketServer');
        const newProduct = await manager.add(req.body)
        res.status(200).send({origin : "serverAtlas", payload : `${newProduct} se cargo con exito.`})
        socketServer.emit('newProduct', req.body);
    } catch (error) {
        console.error("Error al intentar cargar el producto:", error);
        res.status(500).send({origin : "serverAtlas", payload : "No se pudo cargar el producto."})
    }
})

router.put('/:id', async (req, res) => {
    try {
        const filter = { _id: req.params.id };
        const update = req.body;
        const options = { new: true };
        const productUpdated = await manager.update(filter, update, options);

        res.status(200).send({origin : "serverAtlas", payload : `${productUpdated} <br/>Se actualizo exitosamente.`})

    } catch (error) {
        console.error("Error al intentar actualizar el producto:", error);
        res.status(500).send({origin : "serverAtlas", payload : "No se pudo actualizar el producto."})
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const filter = {_id: req.params.id};
        const productDelete = await manager.delete(filter)

        res.status(200).send({origin : "serverAtlas", payload : `El producto ${productDelete} se elimino con exito.`})
    } catch (error) {
        console.error("Error al intentar eliminar el producto:", error);
        res.status(500).send({origin : "serverAtlas", payload : "No se pudo eliminar el producto."})
    }
})

export default router;
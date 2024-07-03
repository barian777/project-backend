import { Router } from "express";

import UsersManager from '../dao/managerUser.mdb.js';

const router = Router();
const manager = new UsersManager();

router.get('/', async (req, res)=> {
    try {
        const listUsers =  await manager.getAll()
        res.status(200).send({origin : "serverAtlas", payload : listUsers})
    } catch (error) {
        console.error("Error al intentar obtener los usuarios:", error);
        res.status(500).send({origin : "serverAtlas", payload : "No se pudo obtener los usuarios."})
    }

})

router.get('/role/:irol', async (req, res)=> {
    try {
        const role = req.params.irol 
        const listUsers =  await manager.getByIndex(role)
        res.status(200).send({origin : "serverAtlas", payload : listUsers})
    } catch (error) {
        console.error("Error al intentar obtener los usuarios:", error);
        res.status(500).send({origin : "serverAtlas", payload : "No se pudo obtener los usuarios."})
    }

})

//     try {
//         if (req.params.role === 'admin' || req.params.role === 'premium' || req.params.role === 'user') {
//             const match = { role: req.params.role };
//             const group = { _id: '$region', totalGrade: {$sum: '$grade'} };
//             const sort = { totalGrade: -1 };
//             const process = await manager.getAggregated(match, group, sort);

//             res.status(200).send({ origin: config.SERVER, payload: process });
//         } else {
//             res.status(200).send({ origin: config.SERVER, payload: null, error: 'role: solo se acepta admin, premium o user' });
//         }
//     } catch (err) {
//         res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
//     }
// });

router.get('/paginate/:page/:limit', async (req, res) => {
    try {
        const filter = { role: 'admin' };
        const options = { page: req.params.page, limit: req.params.limit, sort: { lastName: 1 } };
        const process = await manager.getPaginated(filter, options);

        res.status(200).send({ origin: config.SERVER, payload: process });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const process = await manager.add(req.body);
        
        res.status(200).send({ origin: config.SERVER, payload: process });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const filter = { _id: req.params.id };
        const update = req.body;
        const options = { new: true };
        const process = await manager.update(filter, update, options);
        
        res.status(200).send({ origin: config.SERVER, payload: process });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const filter = { _id: req.params.id };
        const process = await manager.delete(filter);

        res.status(200).send({ origin: config.SERVER, payload: process });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

export default router;
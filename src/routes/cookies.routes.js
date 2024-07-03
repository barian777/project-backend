import { Router } from 'express';

const router = Router();

router.get('/getcookies', async (req, res) => {
    try {
        res.status(200).send({ origin: "serverAtlas", payload: req.cookies });
    } catch (err) {
        res.status(500).send({ origin: "serverAtlas", payload: null, error: err.message });
    }
});

router.get('/setcookie', async (req, res) => {
    try {
        
        res.cookie('codercookie', 'qki', {maxAge:50000, signed:true});
        
        res.status(200).send({ origin: "serverAtlas", payload: "Cookie generada" });
    } catch (err) {
        res.status(500).send({ origin: "serverAtlas", payload: null, error: err.message });
    }
});

router.get('/deletecookie', async (req, res) => {
    try {
        res.clearCookie('codercookie');
        res.status(200).send({ origin:"serverAtlas", payload: "Cookie eliminada" });
    } catch (err) {
        res.status(500).send({ origin: "serverAtlas", payload: null, error: err.message });
    }
});

export default router;

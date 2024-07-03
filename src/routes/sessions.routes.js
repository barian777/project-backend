import { Router } from 'express';
import passport from 'passport';

import config from '../config.js';
import { createHash, isValidPassword, verifyRequiredBody } from '../utils.js';
import UsersManager from '../dao/managerUser.mdb.js';
import initAuthStrategies from '../auth/passport.strategies.js';

const router = Router();
const manager = new UsersManager();
initAuthStrategies();

const verifyAdmin = (req, res, next) => {
    if (req.session.user?.role !== 'admin')
        return res.status(403).send({ origin: config.SERVER, payload: 'Acceso denegado: permitido unicamente ADMIN' });

    next();
}

router.get('/hash/:password', async (req, res) => {
    res.status(200).send({ origin: config.SERVER, payload: createHash(req.params.password) });
});

router.post('/register', verifyRequiredBody(['firstName', 'lastName', 'email', 'password']), async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const foundUser = await manager.getOne({ email: email });

        if (!foundUser) {
            const process = await manager.add({ firstName, lastName, email, password: createHash(password)});
            res.status(200).send({ origin: config.SERVER, payload: process });
        } else {
            res.status(400).send({ origin: config.SERVER, payload: 'El email ya se encuentra registrado' });
        }
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});


router.post('/login', verifyRequiredBody(['email', 'password']), async (req, res) => {
    try {
        const { email, password } = req.body;
        const foundUser = await manager.getOne({ email: email });

        if (foundUser && isValidPassword(password, foundUser.password)) {
        
            const { password, ...filteredFoundUser } = foundUser;
            req.session.user = filteredFoundUser;
            req.session.save(err => {
                if (err) return res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });

                res.redirect('/realtime_products');
            });
        } else {
            res.status(401).send({ origin: config.SERVER, payload: 'Datos de acceso no válidos' });
        }
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});


router.post('/pplogin', verifyRequiredBody(['email', 'password']), passport.authenticate('login', { failureRedirect: `/login?error=${encodeURI('Usuario o clave no válidos')}`}), async (req, res) => {
    try {
        req.session.user = req.user;
        req.session.save(err => {
            if (err) return res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
            res.redirect('/profile');
        });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});


router.get('/ghlogin', passport.authenticate('ghlogin', {scope: ['user']}), async (req, res) => {
});

router.get('/ghlogincallback', passport.authenticate('ghlogin', {failureRedirect: `/login?error=${encodeURI('Error al identificar con Github')}`}), async (req, res) => {
    try {
        req.session.user = req.user // req.user es inyectado AUTOMATICAMENTE por Passport al parsear el done()
        req.session.save(err => {
            if (err) return res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
        
            res.redirect('/profile');
        });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

router.get('/admin', verifyAdmin, async (req, res) => {
    try {
        res.status(200).send({ origin: config.SERVER, payload: 'Bienvenido ADMIN!' });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

router.get('/logout', async (req, res) => {
    try {
        req.session.destroy(err => {
            if (err) return res.status(500).send({ origin: config.SERVER, payload: 'Error al ejecutar logout', error: err });
            res.redirect('/login');
        });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

export default router;


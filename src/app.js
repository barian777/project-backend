import express from "express"
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser"
import session from "express-session";
import fileStore from "session-file-store";
import passport from 'passport';

import config from "./config.js";
import initSocket from "./sockets.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import viewsRoutes from "./routes/views.routes.js";
import usersRoutes from "./routes/users.routes.js";
import cookieRoutes from "./routes/cookies.routes.js"
import sessionRoutes from "./routes/sessions.routes.js"

const app = express();
const fileStorage = fileStore(session);

const expressInstance = app.listen(config.PORT, async () => {
    await mongoose.connect(config.MONGODB_URI);

    const socket = initSocket(expressInstance);
    app.set('socketServer', socket);
    
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser(config.SECRET));
    app.use(session({
        store:new fileStorage({path:'./sessions', ttl:100, retries:0}),
        secret:config.SECRET,
        resave: true,
        saveUninitialized:true
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    
    app.engine('handlebars', handlebars.engine({
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        }
    }));
    app.set('views', `${config.DIRNAME}/views`);
    app.set('view engine', 'handlebars');

    app.use('/', viewsRoutes);
    app.use('/api/products',productRoutes);
    app.use('/api/carts', cartRoutes);
    app.use('/api/user', usersRoutes);
    app.use('/api/cookies', cookieRoutes);
    app.use('/api/sessions', sessionRoutes);
    app.use('/static', express.static(`${config.DIRNAME}/public`));
    
    console.log(`Server running on port: ${config.PORT}`);
});







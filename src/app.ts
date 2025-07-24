import express, {Request, Response, json} from "express";
import route from './routes';


function createApp() {
    const app = express();

    app.use(express.json());

    app.use("/api", route);

    return app;
};

export default createApp;




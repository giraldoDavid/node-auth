import { Server } from './presentation/server';
import { envs } from './config';
import { AppRoutes } from './presentation/routes';
import { MongoDatabase } from './data/mongodb';

(() => {
    main();
})();

async function main () {
    
    await MongoDatabase.connect({
        dbName: envs.MONGO_DB_NAME,
        mongoUrl: envs.MONGO_URL,
    })

    // todo: inicio de nuestro server
    new Server({
        port: envs.PORT,
        routes: AppRoutes.routes
    })
        .Start()
};
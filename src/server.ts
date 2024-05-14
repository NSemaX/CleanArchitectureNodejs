import express, {Express, Request, Response,Application} from 'express';
import SequelizeConnection from './infrastructure/db/SequelizeConnection'
import { db } from "./domain/models/index";
import "reflect-metadata";
import { applicationRoutes } from './application/routes';
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger.json";
import { exceptionHandler } from './application/middlewares/errorHandling/errorHandlerMiddleware';

const app: Express = express();
const port = 3000;

(async () => {
    await SequelizeConnection.connect();
  
    // once connection is authenticated, sequelize will sync the database models
    // force flag is used to drop the database and create the database again
    db.sequelize.sync({
        force: false 
      })
  
  })();

  
app.get('/', (req: Request, res: Response)=>{
    res.send('Hello, this is Express + TypeScript');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', applicationRoutes);


app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

app.use(exceptionHandler);

app.listen(port, ()=> {
console.log(`[Server]: I am running at http://localhost:${port}`);
});

process.on('SIGINT', () => {
    SequelizeConnection.close(); 
  });


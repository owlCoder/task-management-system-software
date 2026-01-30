import express from 'express';
import { corsPolicy } from './Middlewares/cors/corsPolicy';
import { Microservice_controller } from './WebAPI/controllers/microserviceController';
import { Measurement_controller } from './WebAPI/controllers/measurementController';
import { Measurement_Service } from './Services/measurementService';
import { Microservice_Service } from './Services/microserviceService';
import { Db } from './Database/DbConnectionPool';
import { Health_Service } from './Services/healthService';
import { GarbageCollector_Service } from './Services/GCService';
import { LoggerService } from './Services/LoggerService';
import { logger } from './infrastructure/Logger';
import { SIEMService } from './SIEM/Services/SIEMService';
import { LogerService } from './SIEM/Services/LogerService';

async function bootstrap() {
    const app = express();

    await Db.initialize();

    app.use(corsPolicy);
    app.use(express.json());

    const measurementService = new Measurement_Service();
    const microserviceService = new Microservice_Service();
    const loggerService = new LoggerService(logger);

    //SIEM
    const siemLoger = new LogerService();
    const SIEMservice = new SIEMService(siemLoger);

    const healthService = new Health_Service(measurementService,microserviceService,loggerService);

    const measurementController = new Measurement_controller(measurementService,loggerService,microserviceService,SIEMservice);
    const microserviceController = new Microservice_controller(microserviceService,loggerService,SIEMservice);

    const gc = new GarbageCollector_Service(measurementService,loggerService);
    
    await gc.start();
    await healthService.start();

    app.use("/api/v1/measurements", measurementController.getRouter());
    app.use("/api/v1/microservice", microserviceController.getRouter());

    return app;
}

export default bootstrap();
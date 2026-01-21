import express from 'express';
import { corsPolicy } from './Middlewares/cors/corsPolicy';
import { Microservice_controller } from './WebAPI/controllers/Microservice_controller';
import { Measurement_controller } from './WebAPI/controllers/Measurement_controller';
import { Measurement_Service } from './Services/Measurement_Service';
import { Microservice_Service } from './Services/Microservice_Service';
import { Db } from './Database/DbConnectionPool';
import { Health_Service } from './Services/Health_Service';
import { GarbageCollector_Service } from './Services/GC_Service';


async function bootstrap() {
    const app = express();

    await Db.initialize();

    app.use(corsPolicy);
    app.use(express.json());

    const measurementService = new Measurement_Service();
    const microserviceService = new Microservice_Service();

    const healthService = new Health_Service(
        measurementService,
        microserviceService
    );

    const measurementController = new Measurement_controller(measurementService);
    const microserviceController = new Microservice_controller(microserviceService);

    const gc = new GarbageCollector_Service(measurementService);
    
    gc.start();
    healthService.start();

    app.use("/api/v1/SSM/measurement", measurementController.getRouter());
    app.use("/api/v1/SSM/microservice", microserviceController.getRouter());

    return app;
}

export default bootstrap();
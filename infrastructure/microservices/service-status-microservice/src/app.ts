import express from 'express';
import { corsPolicy } from './Middlewares/cors/corsPolicy';
import { Microservice_controller } from './WebAPI/controllers/Microservice_controller';
import { Measurement_controller } from './WebAPI/controllers/Measurement_controller';
import { Measurement_Service } from './Services/Measurement_Service';
import { Microservice_Service } from './Services/Microservice_Service';

const app = express();

app.use(corsPolicy);

app.use(express.json());

const measurementService = new Measurement_Service();
const microserviceService = new Microservice_Service();
const measurementConstroller = new Measurement_controller(measurementService);
const microserviceController = new Microservice_controller(microserviceService);

app.use("/api/v1/SSM/measurement", measurementConstroller.getRouter());
app.use("/api/v1/SSM/microservice", microserviceController.getRouter());

export default app;
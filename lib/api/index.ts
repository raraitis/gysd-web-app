import { addAuthFailedInterceptor, createClient } from "./service";

const API_URL = process.env.API_URL;

const mainClient = createClient(API_URL!);

addAuthFailedInterceptor(mainClient);

export { mainClient };

import express from 'express';
import { GetCompanyController } from './src/controllers/GetCompanyController';

const Routes = (app: express.Application): void => {
    app.get('/companies/:id', GetCompanyController);

    app.all('/*', (req, res) => {
        // TODO
    });
};

export default Routes;

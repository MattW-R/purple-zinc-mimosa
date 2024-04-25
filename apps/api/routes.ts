import express from 'express';
import { GetCompanyController } from './src/controllers/GetCompanyController';
import { GetCompaniesController } from './src/controllers/GetCompaniesController';

const Routes = (app: express.Application): void => {
    app.get('/companies', GetCompaniesController);
    app.get('/companies/:id', GetCompanyController);

    app.all('/*', (req, res) => {
        res.status(405).json({
            success: false,
            message: 'Method not allowed.',
        });
    });
};

export default Routes;

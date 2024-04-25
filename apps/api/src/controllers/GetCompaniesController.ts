import express from 'express';
import { CompaniesService } from '../services/CompaniesService';

export const GetCompaniesController = async (req: express.Request, res: express.Response) => {
    const companies = await CompaniesService.getCompanies();

    if (companies.length > 0) {
        res.status(200).json({
            success: true,
            message: 'Companies retrieved successfully.',
            data: companies,
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'Companies could not be found.',
        });
    }
};

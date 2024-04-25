import express from 'express';
import { CompaniesService } from '../services/CompaniesService';
import { z } from 'zod';
import { CompanyWithEmployees } from '../types/CompanyWithEmployees';

const PathParams = z.object({
    ids: z.union([
        z.coerce.number(),
        z.string().transform((val) => val.split(',').map(Number).slice(0, 1000)),
    ]),
});

export const GetCompanyController = async (req: express.Request, res: express.Response) => {
    try {
        const pathParamsParseResult = PathParams.safeParse(req.params);

        if (!pathParamsParseResult.success) {
            res.status(400).json({
                success: false,
                message: 'Invalid path parameters.',
            });
        } else {
            const { ids } = pathParamsParseResult.data;

            let companies: CompanyWithEmployees[] = [];
            if (Array.isArray(ids)) {
                companies = await CompaniesService.getCompaniesByIds(ids);
            } else {
                companies = await CompaniesService.getCompanyById(ids);
            }

            if (companies.length > 0) {
                res.status(200).json({
                    success: true,
                    message: 'Companies retrieved successfully.',
                    data: companies,
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Company could not be found.',
                });
            }
        }
    } catch (Error) {
        console.log(Error);
        res.status(500).json({
            success: false,
            message: 'Internal server error.',
        });
    }
};

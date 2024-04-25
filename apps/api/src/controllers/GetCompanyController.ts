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

/**
 * @name GetCompanyController
 * @route {GET} /company/:ids
 * @description Retrieves company information by IDs provided in the path parameters.
 * @authentication Does not require authentication.
 * @path-param {string} ids - Comma-separated list of company IDs to retrieve information for.
 * @returns {Promise<void>} - Promise representing the completion of the request handling.
 */
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

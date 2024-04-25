import express from 'express';
import { CompaniesService } from '../services/CompaniesService';
import { z } from 'zod';

const QueryParams = z.object({
    limit: z.coerce.number().max(1000).min(0).default(100),
    offset: z.coerce.number().min(0).default(0),
    companyName: z.string().optional(),
    activeStatus: z
        .enum(['true', 'false'])
        .transform((value) => value === 'true')
        .optional(),
    employeeName: z.string().optional(),
});

/**
 * @name GetCompaniesController
 * @route {GET} /companies
 * @description Retrieves companies based on specified query parameters.
 * @authentication Does not require authentication.
 * @query-param {number} limit - The maximum number of companies to retrieve (default: 100, max: 1000, min: 0).
 * @query-param {number} offset - The number of companies to skip (default: 0, min: 0).
 * @query-param {string} [companyName] - The name of the company to filter by.
 * @query-param {boolean} [activeStatus] - The active status of the company (true or false).
 * @query-param {string} [employeeName] - The name of an employee of the company to filter by.
 * @returns {Promise<void>} - Promise representing the completion of the request handling.
 */
export const GetCompaniesController = async (req: express.Request, res: express.Response) => {
    try {
        const queryParamsParseResult = QueryParams.safeParse(req.query);

        if (!queryParamsParseResult.success) {
            res.status(400).json({
                success: false,
                message: 'Invalid query parameters.',
            });
        } else {
            const { limit, offset, companyName, activeStatus, employeeName } =
                queryParamsParseResult.data;

            const companies = await CompaniesService.getCompanies(limit, offset, {
                companyName,
                activeStatus,
                employeeName,
            });

            if (companies.length > 0) {
                res.status(200).json({
                    success: true,
                    message: 'Companies retrieved successfully.',
                    data: companies,
                    pagination: {
                        limit,
                        offset,
                        totalRecords: companies.length,
                    },
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Companies could not be found.',
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

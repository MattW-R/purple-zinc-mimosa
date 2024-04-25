import express from 'express';
import { CompaniesService } from '../services/CompaniesService';
import { z } from 'zod';

const QueryParams = z.object({
    limit: z.coerce.number().max(1000).min(0).default(100),
    offset: z.coerce.number().min(0).default(0),
});

export const GetCompaniesController = async (req: express.Request, res: express.Response) => {
    const queryParamsParseResult = QueryParams.safeParse(req.query);

    if (!queryParamsParseResult.success) {
        res.status(400).json({
            success: false,
            message: 'Invalid query parameters.',
        });
    } else {
        const { limit, offset } = queryParamsParseResult.data;

        const companies = await CompaniesService.getCompanies(limit, offset);

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
};

import express from 'express';
import { CompaniesService } from '../services/CompaniesService';
import { z } from 'zod';

const PathParams = z.object({
    id: z.coerce.number(),
});

export const GetCompanyController = async (req: express.Request, res: express.Response) => {
    const pathParamsParseResult = PathParams.safeParse(req.params);

    if (!pathParamsParseResult.success) {
        res.status(400).json({
            success: false,
            message: 'Invalid path parameters.',
        });
    } else {
        const company = await CompaniesService.getCompanyById(pathParamsParseResult.data.id);

        if (company) {
            res.status(200).json({
                success: true,
                message: 'Company retrieved successfully.',
                data: company,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Company could not be found.',
            });
        }
    }
};

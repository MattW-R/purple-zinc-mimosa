import { FromSchema } from 'json-schema-to-ts';

export const CompanySchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties: {
        id: {
            type: 'integer',
        },
        name: {
            type: 'string',
        },
        industry: {
            type: 'string',
        },
        active: {
            type: 'boolean',
        },
        website: {
            type: 'string',
            format: 'uri',
        },
        telephone: {
            type: 'string',
            pattern: '^[0-9-]+$',
        },
        slogan: {
            type: 'string',
        },
        address: {
            type: 'string',
        },
        city: {
            type: 'string',
        },
        country: {
            type: 'string',
        },
    },
    required: [
        'id',
        'name',
        'industry',
        'active',
        'website',
        'telephone',
        'slogan',
        'address',
        'city',
        'country',
    ],
    additionalProperties: false,
} as const;

export type Company = FromSchema<typeof CompanySchema>;

export const CompaniesSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'array',
    items: CompanySchema,
} as const;

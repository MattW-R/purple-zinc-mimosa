import { FromSchema } from 'json-schema-to-ts';

export const EmployeeSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties: {
        id: {
            type: 'integer',
        },
        first_name: {
            type: 'string',
        },
        last_name: {
            type: 'string',
        },
        email: {
            type: ['string', 'null'],
            format: 'email',
        },
        role: {
            type: 'string',
        },
        company_id: {
            type: ['integer', 'null'],
        },
    },
    required: ['id', 'first_name', 'last_name', 'role'],
    additionalProperties: false,
} as const;

export type Employee = FromSchema<typeof EmployeeSchema>;

export const EmployeesSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'array',
    items: EmployeeSchema,
} as const;

export const EmployeesSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'array',
    items: {
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
    },
} as const;

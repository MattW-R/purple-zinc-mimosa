export const CompaniesSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'array',
    items: {
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
    },
} as const;

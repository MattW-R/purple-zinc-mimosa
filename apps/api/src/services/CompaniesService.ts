import { MongoClient, Filter } from 'mongodb';
import { CompanyWithEmployees } from '../types/CompanyWithEmployees';
import { Company } from '@packages/schemas';

const dbClientConnection = new MongoClient(
    process.env.MONGO_CONNECTION || 'mongodb://localhost:27017'
).connect();

/**
 * Sets up indexes in the database.
 * @returns {Promise<void>}
 */
const setupIndexes = async () => {
    const dbClient = await dbClientConnection;
    const db = dbClient.db('purple-zinc-mimosa');
    const companiesCollection = db.collection('companies');
    const employeesCollection = db.collection('employees');

    await companiesCollection.createIndex({ id: 1 }, { unique: true });
    await companiesCollection.createIndex({ name: 1 });

    await employeesCollection.createIndex({ id: 1 }, { unique: true });
    await employeesCollection.createIndex({ company_id: 1 });
    await employeesCollection.createIndex({ first_name: 1 });
    await employeesCollection.createIndex({ last_name: 1 });
};

setupIndexes().catch(console.log);

/**
 * Retrieves a company with employees by its ID.
 * @param {number} companyId - The company ID.
 * @returns {Promise<CompanyWithEmployees[]>}
 */
const getCompanyById = async (companyId: number): Promise<CompanyWithEmployees[]> => {
    const dbClient = await dbClientConnection;
    const db = dbClient.db('purple-zinc-mimosa');
    const companiesCollection = db.collection('companies');

    return companiesCollection
        .aggregate<CompanyWithEmployees>([
            {
                $match: {
                    id: companyId,
                },
            },
            {
                $limit: 1,
            },
            {
                $lookup: {
                    from: 'employees',
                    localField: 'id',
                    foreignField: 'company_id',
                    as: 'employees',
                },
            },
            {
                $project: {
                    _id: 0,
                    'employees._id': 0,
                },
            },
        ])
        .toArray();
};

/**
 * Retrieves companies with employees by their IDs.
 * @param {number[]} companyIds - An array of company IDs.
 * @returns {Promise<CompanyWithEmployees[]>}
 */
const getCompaniesByIds = async (companyIds: number[]): Promise<CompanyWithEmployees[]> => {
    const dbClient = await dbClientConnection;
    const db = dbClient.db('purple-zinc-mimosa');
    const companiesCollection = db.collection('companies');

    return companiesCollection
        .aggregate<CompanyWithEmployees>([
            {
                $match: {
                    id: { $in: companyIds },
                },
            },
            {
                $limit: companyIds.length,
            },
            {
                $lookup: {
                    from: 'employees',
                    localField: 'id',
                    foreignField: 'company_id',
                    as: 'employees',
                },
            },
            {
                $project: {
                    _id: 0,
                    'employees._id': 0,
                },
            },
        ])
        .toArray();
};

/**
 * Retrieves companies with employees, optionally filtered.
 * @param {number} limit - The maximum number of companies to retrieve.
 * @param {number} offset - The number of companies to skip.
 * @param {object} [filters] - Optional filters for company retrieval.
 * @param {string} [filters.companyName] - Filter by company name.
 * @param {boolean} [filters.activeStatus] - Filter by active status.
 * @param {string} [filters.employeeName] - Filter by employee name.
 * @returns {Promise<CompanyWithEmployees[]>}
 */
const getCompanies = async (
    limit: number,
    offset: number,
    filters?: { companyName?: string; activeStatus?: boolean; employeeName?: string }
): Promise<CompanyWithEmployees[]> => {
    const dbClient = await dbClientConnection;
    const db = dbClient.db('purple-zinc-mimosa');
    const companiesCollection = db.collection('companies');

    const initialQuery: Filter<Company> = {};
    if (filters && filters.companyName) {
        initialQuery['name'] = filters.companyName;
    }
    if (filters && filters.activeStatus !== undefined) {
        initialQuery['active'] = filters.activeStatus;
    }

    const postLookupQuery: Filter<CompanyWithEmployees> = {};
    if (filters && filters.employeeName) {
        const employeeNames = filters.employeeName.split(' ');

        postLookupQuery['employees'] = {
            $elemMatch: {
                $or: [
                    {
                        first_name: {
                            $in: employeeNames,
                        },
                    },
                    {
                        last_name: {
                            $in: employeeNames,
                        },
                    },
                ],
            },
        };
    }

    return companiesCollection
        .aggregate<CompanyWithEmployees>([
            {
                $match: initialQuery,
            },
            {
                $lookup: {
                    from: 'employees',
                    localField: 'id',
                    foreignField: 'company_id',
                    as: 'employees',
                },
            },
            {
                $match: postLookupQuery,
            },
            {
                $sort: {
                    id: 1,
                },
            },
            {
                $skip: offset,
            },
            {
                $limit: limit,
            },
            {
                $project: {
                    _id: 0,
                    'employees._id': 0,
                },
            },
        ])
        .toArray();
};

export const CompaniesService = {
    getCompanyById,
    getCompaniesByIds,
    getCompanies,
};

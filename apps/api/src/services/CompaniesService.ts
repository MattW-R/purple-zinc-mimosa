import { MongoClient } from 'mongodb';
import { CompanyWithEmployees } from '../types/CompanyWithEmployees';

const dbClientConnection = new MongoClient(
    process.env.MONGO_CONNECTION || 'mongodb://localhost:27017'
).connect();

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

const getCompanies = async (
    limit: number,
    offset: number,
    filters?: { companyName?: string; activeStatus?: boolean; employeeName?: string }
): Promise<CompanyWithEmployees[]> => {
    const dbClient = await dbClientConnection;
    const db = dbClient.db('purple-zinc-mimosa');
    const companiesCollection = db.collection('companies');

    const initialQuery: Record<string, any> = {};
    if (filters && filters.companyName) {
        initialQuery['name'] = filters.companyName;
    }
    if (filters && filters.activeStatus !== undefined) {
        initialQuery['active'] = filters.activeStatus;
    }

    const postLookupQuery: Record<string, any> = {};
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

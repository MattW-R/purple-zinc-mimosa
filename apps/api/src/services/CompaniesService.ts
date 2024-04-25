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
};

setupIndexes().catch(console.log);

const getCompanyById = async (companyId: number): Promise<CompanyWithEmployees | null> => {
    const dbClient = await dbClientConnection;
    const db = dbClient.db('purple-zinc-mimosa');
    const companiesCollection = db.collection('companies');

    const [company] = await companiesCollection
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

    return company;
};

const getCompanies = async (
    limit: number,
    offset: number,
    filters?: { companyName?: string; activeStatus?: boolean }
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
    getCompanies,
};

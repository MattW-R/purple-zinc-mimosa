import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { CompanySchema, EmployeeSchema } from '@packages/schemas';
import { MongoClient } from 'mongodb';

const dbClientConnection = new MongoClient(
    process.env.MONGO_CONNECTION || 'mongodb://localhost:27017'
).connect();

const parseJsonFilesInDir = async (
    dir: string,
    callback: (fileName: string, jsonData: any) => Promise<void>
) => {
    const fileNamesInDir = fs.readdirSync(dir).filter((file) => path.extname(file) === '.json');

    for await (const fileName of fileNamesInDir) {
        const fileData = fs.readFileSync(path.join(dir, fileName));
        const jsonData = JSON.parse(fileData.toString());
        await callback(fileName, jsonData);
    }
};

const dropDatabase = async () => {
    const dbClient = await dbClientConnection;
    const db = dbClient.db('purple-zinc-mimosa');

    await db.dropDatabase();
};

const seedDatabase = async () => {
    const dbClient = await dbClientConnection;
    const db = dbClient.db('purple-zinc-mimosa');
    const companiesCollection = db.collection('companies');
    const employeesCollection = db.collection('employees');

    const ajv = new Ajv();
    addFormats(ajv);

    const companyValidator = ajv.compile(CompanySchema);

    await parseJsonFilesInDir('./data/companies', async (fileName, companiesJsonData) => {
        if (Array.isArray(companiesJsonData)) {
            const validCompaniesData = companiesJsonData.filter((companyJsonData) =>
                companyValidator(companyJsonData)
            );

            if (validCompaniesData.length > 0) {
                const insertManyResult = await companiesCollection.insertMany(validCompaniesData);

                console.log(
                    `${insertManyResult.insertedCount} valid / ${companiesJsonData.length} JSON documents inserted into companies collection.`
                );
            } else {
                console.log(`No valid JSON data in ${fileName}.`);
            }
        } else {
            console.log(`${fileName} does not contain a JSON array.`);
        }
    });

    const employeeValidator = ajv.compile(EmployeeSchema);

    await parseJsonFilesInDir('./data/employees', async (fileName, employeesJsonData) => {
        if (Array.isArray(employeesJsonData)) {
            const validEmployeesData = employeesJsonData.filter((employeeJsonData) =>
                employeeValidator(employeeJsonData)
            );

            if (validEmployeesData.length > 0) {
                const insertManyResult = await employeesCollection.insertMany(validEmployeesData);

                console.log(
                    `${insertManyResult.insertedCount} valid / ${employeesJsonData.length} JSON documents inserted into employees collection.`
                );
            } else {
                console.log(`No valid JSON data in ${fileName}.`);
            }
        } else {
            console.log(`${fileName} does not contain a JSON array.`);
        }
    });
};

dropDatabase()
    .then(async () => {
        await seedDatabase();
    })
    .catch(console.log);

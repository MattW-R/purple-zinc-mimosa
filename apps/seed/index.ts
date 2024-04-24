import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { CompanySchema, EmployeeSchema } from '@packages/schemas';

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

const seedDatabase = async () => {
    const ajv = new Ajv();
    addFormats(ajv);

    const companyValidator = ajv.compile(CompanySchema);

    await parseJsonFilesInDir('./data/companies', async (fileName, companiesJsonData) => {
        if (Array.isArray(companiesJsonData)) {
            const validCompanyData = companiesJsonData.filter((companyJsonData) =>
                companyValidator(companyJsonData)
            );

            console.log(validCompanyData.length);
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

            console.log(validEmployeesData.length);
        } else {
            console.log(`${fileName} does not contain a JSON array.`);
        }
    });
};

seedDatabase().catch(console.log);

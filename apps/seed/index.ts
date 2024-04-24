import fs from 'fs';
import path from 'path';

const companiesDir = './data/companies';

const companyFileNamesInDir = fs
    .readdirSync(companiesDir)
    .filter((file) => path.extname(file) === '.json');

companyFileNamesInDir.forEach((companyFileName) => {
    const fileData = fs.readFileSync(path.join(companiesDir, companyFileName));
    const json = JSON.parse(fileData.toString());
});

const employeesDir = './data/employees';

const employeeFileNamesInDir = fs
    .readdirSync(employeesDir)
    .filter((file) => path.extname(file) === '.json');

employeeFileNamesInDir.forEach((employeeFileName) => {
    const fileData = fs.readFileSync(path.join(employeesDir, employeeFileName));
    const json = JSON.parse(fileData.toString());
});

import fs from 'fs';
import path from 'path';

const parseJsonFilesInDir = async (dir: string, callback: (jsonData: any) => Promise<void>) => {
    const fileNamesInDir = fs.readdirSync(dir).filter((file) => path.extname(file) === '.json');

    for await (const fileName of fileNamesInDir) {
        const fileData = fs.readFileSync(path.join(dir, fileName));
        const jsonData = JSON.parse(fileData.toString());
        await callback(jsonData);
    }
};

const seedDatabase = async () => {
    await parseJsonFilesInDir('./data/companies', async (companyJsonData) => {
        console.log(companyJsonData);
    });

    await parseJsonFilesInDir('./data/employees', async (employeeJsonData) => {
        console.log(employeeJsonData);
    });
};

seedDatabase().catch(console.log);

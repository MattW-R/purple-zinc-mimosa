import { Company, Employee } from '@packages/schemas';

export interface CompanyWithEmployees extends Company {
    employees: Employee[];
}

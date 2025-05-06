import { requiredAdmin } from '@/lib/auth-helper';
import CompaniesClient from './companies-client';

export default async function CompaniesPage() {
    await requiredAdmin();
    return <CompaniesClient />;
}

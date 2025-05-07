import { requiredAdmin } from '@/lib/auth-helper';
import CompaniesClient from './companies-client';
import Container from '@/components/layout/container';
import Card from '@/components/layout/card';

export default async function CompaniesPage() {
    await requiredAdmin();
    return <Container>
        <Card>
            <CompaniesClient />
        </Card>
    </Container>;
}

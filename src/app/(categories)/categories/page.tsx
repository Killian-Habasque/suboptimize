import { requiredAdmin } from '@/lib/auth-helper';
import CategoriesClient from '@/features/categories/components/categories-client';
import Container from '@/components/layout/container';
import Card from '@/components/layout/card';

export default async function CategoriesPage() {
    await requiredAdmin();
    return (
        <Container>
            <Card>
                <CategoriesClient />
            </Card>
        </Container>
    );
}


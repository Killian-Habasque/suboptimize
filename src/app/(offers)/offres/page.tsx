"use client";

import { Suspense } from "react";
import Container from "@/components/layout/container";
import Grid from "@/components/layout/grid";
import GridItem from "@/components/layout/grid-item";
import Card from "@/components/layout/card";
import OfferList from "@/features/offers/components/list-offers";
import CategoryList from "@/features/offers/components/list-categories";
import PopularCompanies from "@/features/offers/components/list-popular-companies";
import { useSearchParams } from "next/navigation";

const OffersContent = () => {
    const searchParams = useSearchParams();
    const categorySlug = searchParams.get('category');
    const companySlug = searchParams.get('company');

    const getPageTitle = () => {
        if (categorySlug && companySlug) {
            return `Offres - ${categorySlug} - ${companySlug}`;
        }
        if (categorySlug) {
            return `Offres - ${categorySlug}`;
        }
        if (companySlug) {
            return `Offres - ${companySlug}`;
        }
        return 'Top offres';
    };

    return (
        <Grid columns={3}>
            <GridItem colSpan={2}>
                <Card>
                    <div className="p-4">
                        <h1 className="text-2xl font-bold mb-6 text-primary">
                            {getPageTitle()}
                        </h1>
                        <OfferList categorySlug={categorySlug} companySlug={companySlug} />
                    </div>
                </Card>
            </GridItem>
            <GridItem colSpan={1}>
                <Card>
                    <div className="p-4">
                        <CategoryList />
                    </div>
                </Card>
                <Card>
                    <div className="p-4">
                        <PopularCompanies />
                    </div>
                </Card>
            </GridItem>
        </Grid>
    );
};

const OffersPage = () => {
    return (
        <Container>
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-[200px]">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            }>
                <OffersContent />
            </Suspense>
        </Container>
    );
};

export default OffersPage;

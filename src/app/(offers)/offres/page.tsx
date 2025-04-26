"use client";

import React from 'react';
import Container from "@/components/layout/container";
import Grid from "@/components/layout/grid";
import GridItem from "@/components/layout/grid-item";
import Card from "@/components/layout/card";
import OfferList from "@/features/offers/components/OfferList";
import CategoryList from "@/features/offers/components/CategoryList";
import PopularBrands from "@/features/offers/components/PopularBrands";

const Offers = () => {
    return (
        <Container>
            <Grid columns={3}>
                <GridItem colSpan={2}>
                    <Card>
                        <div className="p-4">
                            <h1 className="text-2xl font-bold mb-6">Top offres</h1>
                            <OfferList />
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
                            <PopularBrands />
                        </div>
                    </Card>
                </GridItem>
            </Grid>
        </Container>
    );
};

export default Offers;

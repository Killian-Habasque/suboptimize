import SubscriptionDetails from "@/features/subscriptions/components/subscription-details";
import Container from "@/components/layout/container";
import Grid from "@/components/layout/grid";
import GridItem from "@/components/layout/grid-item";
import Card from "@/components/layout/card";

interface SubscriptionPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function SubscriptionPage({ params }: SubscriptionPageProps) {
    const { id } = await params;
    
    return (
        <Container>
            <Grid columns={3}>
                <GridItem colSpan={3}>
                    <Card>
                        <div className="p-6">
                            <SubscriptionDetails id={id} />
                        </div>
                    </Card>
                </GridItem>
            </Grid>
        </Container>
    );
} 
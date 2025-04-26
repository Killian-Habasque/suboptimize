
import Card from "@/components/layout/card";
import Container from "@/components/layout/container";
import Grid from "@/components/layout/grid";
import GridItem from "@/components/layout/grid-item";
import Login from "@/features/auth/components/login";
import { requiredGuest } from "@/lib/auth-helper";

export default async function Home() {
    await requiredGuest();
    return (
        <Container>
            <Grid columns={3}>
                <GridItem colSpan={3}>
                    <Card>
                        <div className="flex flex-col justify-center items-center m-4">
                            <h1 className="text-3xl my-3">Hey, time to Sign In</h1>
                            <Login />
                        </div>
                    </Card>
                </GridItem>
            </Grid>
        </Container>
    );
}

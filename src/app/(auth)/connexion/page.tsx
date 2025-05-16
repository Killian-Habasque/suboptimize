
import Container from "@/components/layout/container";
import Grid from "@/components/layout/grid";
import LoginCard from "@/features/auth/components/login-card";
import { requiredGuest } from "@/lib/auth-helper";

export default async function Home() {
    await requiredGuest();
    return (
        <Container>
            <Grid columns={3}>
                <LoginCard />
            </Grid>
        </Container>
    );
}

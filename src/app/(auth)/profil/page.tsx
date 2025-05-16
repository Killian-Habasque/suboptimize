import { requiredAuth } from "@/lib/auth-helper";
import Card from "@/components/layout/card";
import Container from "@/components/layout/container";
import Grid from "@/components/layout/grid";
import GridItem from "@/components/layout/grid-item";
import ProfileInfo from "@/features/auth/components/profile-info";
import ProfileSubscriptions from "@/features/auth/components/profile-subscriptions";

export default async function ProfilePage() {
  const user = await requiredAuth();

  return (
    <Container>
      <Grid columns={3}>
        <GridItem colSpan={3}>
          <Card>
            <ProfileInfo user={user} />
          </Card>
          <Card className="mt-6">
            <ProfileSubscriptions />
          </Card>
        </GridItem>
      </Grid>
    </Container>
  );
}

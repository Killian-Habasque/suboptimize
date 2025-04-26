import { requiredAuth } from "@/lib/auth-helper";
import Header from "@/components/navigation/header";
import Card from "@/components/layout/card";
import Container from "@/components/layout/container";
import Grid from "@/components/layout/grid";
import GridItem from "@/components/layout/grid-item";
import Footer from "@/components/navigation/footer";
import ProfileInfo from "@/features/auth/components/profile-info";
import ProfileStats from "@/features/auth/components/profile-stats";
import ProfileSubscriptions from "@/features/auth/components/profile-subscriptions";

export default async function ProfilePage() {
  const user = await requiredAuth();
  
  return (
    <>
      <Header />
      <Container>
        <Grid columns={3}>
          <GridItem colSpan={2}>
            <Card>
              <ProfileInfo user={user} />
            </Card>
            <Card className="mt-6">
              <ProfileSubscriptions />
            </Card>
          </GridItem>
          <GridItem colSpan={1}>
            <Card>
              <ProfileStats />
            </Card>
          </GridItem>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

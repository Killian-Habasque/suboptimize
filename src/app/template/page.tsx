"use client"

import Header from "@/components/navigation/header";
import Card from "@/components/layout/card";
import Container from "@/components/layout/container";
import Grid from "@/components/layout/grid";
import GridItem from "@/components/layout/grid-item";
import Footer from "@/components/navigation/footer";
import Calendar from "@/features/subscriptions/components/calendar";
import { useSubscription } from "@/features/subscriptions/subscriptionContext";

const Template = () => {
  const { subscriptions, loading } = useSubscription();
  return (
    <>
      <Header />
      <Container>
        <Grid columns={3}>
          <GridItem colSpan={2}>
            <Card>
              <Calendar subscriptions={subscriptions} />
            </Card>
          </GridItem>
          <GridItem colSpan={1}>
            <Card>
              Test
            </Card>
            <Card>
              Test 2
            </Card>
          </GridItem>
        </Grid>
      </Container>
      <Footer />
    </>
  )
}
export default Template;
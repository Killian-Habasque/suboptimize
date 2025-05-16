"use client"

import Card from "@/components/layout/card";
import Container from "@/components/layout/container";
import Grid from "@/components/layout/grid";
import GridItem from "@/components/layout/grid-item";
import Calendar from "@/features/subscriptions/components/calendar";
import { useSubscription } from "@/features/subscriptions/subscription-context";
import UpcomingSubscriptions from "@/features/subscriptions/components/list-upcoming-subscriptions";
import LoginCard from "@/features/auth/components/login-card";
import SummaryCard from "../../../features/subscriptions/components/summary-card";

const SubscriptionsPage = () => {
  const { subscriptions } = useSubscription();

  return (
    <Container>
      <Grid columns={3}>
        <LoginCard label="Pour personnaliser votre calendrier, connectez-vous !" />
        <GridItem colSpan={2}>
          <Card>
            <Calendar subscriptions={subscriptions} />
          </Card>
        </GridItem>
        <GridItem colSpan={1}>
          <Card>
            <UpcomingSubscriptions subscriptions={subscriptions} />
          </Card>
        </GridItem>
        <GridItem colSpan={3}>
          <Card>
            <SummaryCard subscriptions={subscriptions} />
          </Card>
        </GridItem>
      </Grid>
    </Container>
  )
}
export default SubscriptionsPage;
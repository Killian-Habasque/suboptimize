

import Calendar from '../components/calendar'
import Container from './blocks/container'
import Grid from './blocks/grid'
import GridItem from './blocks/grid-item'
import Header from './menu/banner-global'
import Footer from './menu/footer'

export default function Template() {
  return (
    <>
      <Header />
      <Container>
        <Grid columns={3}>
          <GridItem colSpan={2}>
            <Calendar />
          </GridItem>
          <GridItem colSpan={1}>
            test
          </GridItem>
        </Grid>
      </Container>
      <Footer />
    </>
  )
}

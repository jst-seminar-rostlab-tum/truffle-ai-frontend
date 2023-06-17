import Page from '@/components/side-effects/Page'
import Compare from '@/components/side-effects/Compare'
import withAuth from '@/components/side-effects/withAuth'
import Head from 'next/head'

/**
 * Compare projects page
 */
// @TODO get ID from URL and pass as prop
const ComparePage = () => (
  <Page>
    <Head>
      <title>Compare</title>
    </Head>
    <Compare />
  </Page>
)

export default withAuth(ComparePage)

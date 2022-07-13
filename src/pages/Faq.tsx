import { PageWrapper } from './PageWrapper';
import { Box, Text } from 'grommet';

export const Faq = () => {
  return (
    <PageWrapper
      breadcrumbs={[
        {
          label: 'Home',
          path: '/'
        }
      ]}
    >
      <Box align='center' overflow='hidden'>
        <Text weight={500} size='2rem' margin='small'>
          FAQ
        </Text>
      </Box>
    </PageWrapper>
  );
};

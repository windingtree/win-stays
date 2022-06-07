import { useAppState } from '../store';
import { PageWrapper } from './PageWrapper';
import { Search } from '../components/Search';

export const Home = () => {
  const { isConnecting } = useAppState();

  return (
    <PageWrapper>
      {!isConnecting &&
        <div>
          Hi!!!
        </div>
      }
      <Search />
    </PageWrapper>
  );
};

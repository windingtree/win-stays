import { useAppState } from '../store';
import { PageWrapper } from './PageWrapper';

export const Home = () => {
  const { isConnecting } = useAppState();

  return (
    <PageWrapper>
      {!isConnecting &&
        <div>
          Hi!!!
        </div>
      }
    </PageWrapper>
  );
};

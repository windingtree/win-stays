import { LoginForm } from '../components/LoginForm';
import { useAppState } from '../store';
import { PageWrapper } from './PageWrapper';

export const Login = () => {
  const { isConnecting } = useAppState();

  return (
    <PageWrapper>
      {!isConnecting &&
        <LoginForm />
      }
    </PageWrapper>
  );
};

import { AppStateProvider } from './store';
import { AppRoutes } from './Routes';
import { Theme } from './Theme';
import { AppHeader } from './components/AppHeader';
import { AppFooter } from './components/AppFooter';

const App = () => (
  <AppStateProvider>
    <Theme>
      <AppHeader />
      <AppRoutes />
      <AppFooter />
    </Theme>
  </AppStateProvider>
);

export default App;

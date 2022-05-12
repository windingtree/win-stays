import { AppStateProvider } from './store';
import { Theme } from './Theme';
import { AppRoutes } from './Routes';
import { AppHeader } from './components/AppHeader';

const App = () => (
  <AppStateProvider>
    <Theme>
      <AppHeader />
      <AppRoutes />
    </Theme>
  </AppStateProvider>
);

export default App;

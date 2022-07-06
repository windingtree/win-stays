import { AppStateProvider } from './store';
import { AppRoutes } from './Routes';
import { Theme } from './Theme';
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

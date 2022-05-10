import { AppStateProvider } from './store';
import { AppRoutes } from './Routes';

const App = () => (
  <AppStateProvider>
    <AppRoutes />
  </AppStateProvider>
);

export default App;

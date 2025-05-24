import { Provider } from 'react-redux';
import { store } from '@store/store';
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <Provider store={store}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-..." />
      <AppRouter />
    </Provider>
  );
}

export default App;
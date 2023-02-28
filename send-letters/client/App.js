import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/auth';
import Navigation from './components/Navigation';

export default function App() {  
  return (
    <NavigationContainer contentStyle={{ backgroundColor: '#F0F4FF' }}>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </NavigationContainer>
  );
}



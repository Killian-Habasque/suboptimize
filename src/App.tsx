import Header from "./components/header.js";
import { AuthProvider } from "./contexts/authContext";
import RouterService from "./services/routerService.js";

function App() {
  return (
    <AuthProvider>
      <Header />
      <div className="w-full h-screen flex flex-col">
        <RouterService />
      </div>
    </AuthProvider>
  );
}

export default App;
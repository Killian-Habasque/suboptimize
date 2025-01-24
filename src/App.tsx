import { AuthProvider } from "./contexts/authContext";
import RouterService from "./services/routerService.js";

function App() {
  return (
    <AuthProvider>
      <div className="w-full h-screen flex flex-col min-h-full">
        <RouterService />
      </div>
    </AuthProvider>
  );
}

export default App;
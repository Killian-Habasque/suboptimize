import { AuthProvider } from "./contexts/authContext";
import { SubscriptionProvider } from "./contexts/subscriptionContext";
import RouterService from "./services/routerService.js";

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <div className="w-full h-screen flex flex-col min-h-full">
          <RouterService />
        </div>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;
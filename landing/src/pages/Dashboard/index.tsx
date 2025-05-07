import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

interface TariffPlan {
  name: string;
  price: string;
  features: string[];
  limits: {
    requestsPerDay: number;
    maxConcurrent: number;
  };
}

const tariffPlans: TariffPlan[] = [
  {
    name: "Basic",
    price: "Free",
    features: ["Basic RPC access", "Limited requests", "Community support"],
    limits: {
      requestsPerDay: 1000,
      maxConcurrent: 5,
    },
  },
  {
    name: "Pro",
    price: "$49/month",
    features: ["Priority RPC access", "Higher request limits", "Email support", "Advanced analytics"],
    limits: {
      requestsPerDay: 10000,
      maxConcurrent: 20,
    },
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: ["Dedicated RPC nodes", "Unlimited requests", "24/7 support", "Custom solutions"],
    limits: {
      requestsPerDay: 100000,
      maxConcurrent: 100,
    },
  },
];

export const Dashboard = () => {
  const { publicKey } = useWallet();
  const [apiKey, setApiKey] = useState<string>("");
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
  const [currentPlan] = useState<TariffPlan>(tariffPlans[0]);
  const [usageStats] = useState({
    requestsToday: 0,
    requestsThisMonth: 0,
    averageResponseTime: 0,
  });

  useEffect(() => {
    if (publicKey) {
      const generatedKey = `san_${publicKey.toString().slice(0, 8)}_${Math.random().toString(36).substring(2, 15)}`;
      setApiKey(generatedKey);
    }
  }, [publicKey]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-space-grotesk text-4xl font-bold text-text-primary">Dashboard</h1>
        <div className="flex items-center gap-4">
          <WalletMultiButton style={{ backgroundColor: '#e64a29', color: '#fff', borderRadius: '2rem', padding: '0.5rem 1rem' }} />
        </div>
      </div>
      
      {/* API Key Section */}
      <div className="bg-white rounded-[1.25rem] shadow-md p-8 mb-8 border border-[rgba(40,29,27,0.1)]">
        <h2 className="font-space-grotesk text-2xl font-bold mb-6 text-text-primary">Your API Key</h2>
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <code className={`bg-background-secondary p-4 rounded-[1.25rem] font-nunito text-lg w-full ${!isApiKeyVisible ? 'blur-md' : ''}`}>
              {apiKey}
            </code>
            <button 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-color hover:text-[#e64a29]"
              onClick={() => setIsApiKeyVisible(!isApiKeyVisible)}
            >
              {isApiKeyVisible ? 'Hide' : 'Show'}
            </button>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => navigator.clipboard.writeText(apiKey)}
          >
            Copy
          </button>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="bg-white rounded-[1.25rem] shadow-md p-8 mb-8 border border-[rgba(40,29,27,0.1)]">
        <h2 className="font-space-grotesk text-2xl font-bold mb-6 text-text-primary">Usage Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-background-secondary rounded-[1.25rem] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-nunito text-lg text-text-secondary">Requests Today</h3>
              <div className="w-12 h-12 rounded-full bg-primary-color/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="font-space-grotesk text-4xl font-bold text-text-primary">{usageStats.requestsToday}</p>
              <span className="text-primary-color font-nunito">requests</span>
            </div>
            <div className="mt-4 h-2 bg-background-alt rounded-full overflow-hidden">
              <div className="h-full bg-primary-color rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>

          <div className="bg-background-secondary rounded-[1.25rem] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-nunito text-lg text-text-secondary">Monthly Usage</h3>
              <div className="w-12 h-12 rounded-full bg-primary-color/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="font-space-grotesk text-4xl font-bold text-text-primary">{usageStats.requestsThisMonth}</p>
              <span className="text-primary-color font-nunito">requests</span>
            </div>
            <div className="mt-4 h-2 bg-background-alt rounded-full overflow-hidden">
              <div className="h-full bg-primary-color rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>

          <div className="bg-background-secondary rounded-[1.25rem] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-nunito text-lg text-text-secondary">Response Time</h3>
              <div className="w-12 h-12 rounded-full bg-primary-color/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="font-space-grotesk text-4xl font-bold text-text-primary">{usageStats.averageResponseTime}</p>
              <span className="text-primary-color font-nunito">ms</span>
            </div>
            <div className="mt-4 h-2 bg-background-alt rounded-full overflow-hidden">
              <div className="h-full bg-primary-color rounded-full" style={{ width: '90%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div className="bg-white rounded-[1.25rem] shadow-md p-8 border border-[rgba(40,29,27,0.1)]">
        <h2 className="font-space-grotesk text-2xl font-bold mb-6 text-text-primary">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tariffPlans.map((plan) => (
            <div 
              key={plan.name}
              className={`bg-background-secondary rounded-[1.25rem] p-8 transition-transform hover:transform hover:scale-105 ${
                plan.name === currentPlan.name ? 'border-2 border-primary-color' : ''
              }`}
            >
              <h3 className="font-space-grotesk text-2xl font-bold mb-2 text-text-primary">{plan.name}</h3>
              <p className="font-nunito text-3xl font-bold mb-6 text-primary-color">{plan.price}</p>
              <ul className="mb-8 space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="font-nunito text-lg text-text-secondary flex items-center gap-2">
                    <span className="text-primary-color">•</span> {feature}
                  </li>
                ))}
              </ul>
              <button 
                className={`w-full py-3 rounded-[2rem] font-nunito text-lg font-medium transition-all ${
                  plan.name === currentPlan.name
                    ? "bg-background-alt text-text-secondary cursor-not-allowed"
                    : "btn btn-primary"
                }`}
                disabled={plan.name === currentPlan.name}
              >
                {plan.name === currentPlan.name ? "Current Plan" : "Upgrade"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

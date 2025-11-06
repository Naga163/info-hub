import { useState } from 'react';
import { Cloud, DollarSign, Lightbulb } from 'lucide-react';
import Weather from './components/Weather';
import Currency from './components/Currency';
import Quotes from './components/Quotes';

type Tab = 'weather' | 'currency' | 'quotes';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('weather');

  const tabs = [
    { id: 'weather' as Tab, label: 'Weather', icon: Cloud },
    { id: 'currency' as Tab, label: 'Currency', icon: DollarSign },
    { id: 'quotes' as Tab, label: 'Quotes', icon: Lightbulb },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">InfoHub</h1>
          <p className="text-xl text-gray-600">Your all-in-one information portal</p>
        </header>

        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-md p-2 inline-flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <main className="pb-12">
          {activeTab === 'weather' && <Weather />}
          {activeTab === 'currency' && <Currency />}
          {activeTab === 'quotes' && <Quotes />}
        </main>

        <footer className="text-center text-gray-600 mt-12">
          <p className="text-sm">Built for ByteXL Coding Challenge</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

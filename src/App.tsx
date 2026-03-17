import { HashRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { useData } from './hooks/useData';
import { DashboardPage } from './pages/DashboardPage';
import { PredictionsPage } from './pages/PredictionsPage';
import { TimelinePage } from './pages/TimelinePage';
import { AITimelinePage } from './pages/AITimelinePage';
import { CompanyPage } from './pages/CompanyPage';
import { LearningPage } from './pages/LearningPage';

export default function App() {
  const { events, milestones, companies, predictions, loading, error } = useData();

  return (
    <HelmetProvider>
      <HashRouter>
        <div className="min-h-screen bg-surface-50 flex flex-col">
          <Header />
          <main className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-surface-500">Loading dashboard data...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center max-w-md">
                  <p className="text-danger-600 font-medium mb-2">Failed to load data</p>
                  <p className="text-surface-500 text-sm">{error}</p>
                </div>
              </div>
            ) : (
              <Routes>
                <Route path="/" element={<DashboardPage events={events} />} />
                <Route path="/predictions" element={<PredictionsPage predictions={predictions} />} />
                <Route path="/timeline" element={<TimelinePage events={events} />} />
                <Route
                  path="/ai-advances"
                  element={<AITimelinePage milestones={milestones} />}
                />
                <Route
                  path="/companies/:id?"
                  element={<CompanyPage events={events} companies={companies} milestones={milestones} />}
                />
                <Route path="/learn" element={<LearningPage />} />
              </Routes>
            )}
          </main>
          <Footer />
        </div>
      </HashRouter>
    </HelmetProvider>
  );
}

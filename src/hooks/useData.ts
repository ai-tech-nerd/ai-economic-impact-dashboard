import { useState, useEffect } from 'react';
import type { DisplacementEvent, AIMilestone, CompanyProfile, Prediction } from '../types';

const BASE = import.meta.env.BASE_URL;

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}data/verified/${path}`);
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  return res.json();
}

export function useData() {
  const [events, setEvents] = useState<DisplacementEvent[]>([]);
  const [plannedEvents, setPlannedEvents] = useState<DisplacementEvent[]>([]);
  const [creationEvents, setCreationEvents] = useState<DisplacementEvent[]>([]);
  const [milestones, setMilestones] = useState<AIMilestone[]>([]);
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetchJson<DisplacementEvent[]>('job-displacement-events.json'),
      fetchJson<AIMilestone[]>('ai-milestones.json'),
      fetchJson<CompanyProfile[]>('company-profiles.json').catch(() => []),
      fetchJson<Prediction[]>('predictions.json').catch(() => []),
      fetchJson<DisplacementEvent[]>('planned-layoffs.json').catch(() => []),
      fetchJson<DisplacementEvent[]>('ai-job-creation.json').catch(() => []),
    ])
      .then(([evts, ms, cos, preds, planned, creation]) => {
        // Tag verified events
        setEvents(evts.map((e) => ({ ...e, status: e.status || 'verified' as const })));
        setPlannedEvents(planned);
        setCreationEvents(creation);
        setMilestones(ms);
        setCompanies(cos);
        setPredictions(preds);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { events, plannedEvents, creationEvents, milestones, companies, predictions, loading, error };
}

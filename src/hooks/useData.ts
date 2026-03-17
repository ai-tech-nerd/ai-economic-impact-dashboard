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
    ])
      .then(([evts, ms, cos, preds]) => {
        setEvents(evts);
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

  return { events, milestones, companies, predictions, loading, error };
}

import { useState, useMemo } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { TrendLine } from '../components/dashboard/TrendLine';
import { ChatGPTGrowthChart } from '../components/dashboard/ChatGPTGrowthChart';
import { JobTypesChart } from '../components/dashboard/JobTypesChart';
import { useTimelinePlayback } from '../hooks/useTimelinePlayback';
import {
  filterEventsByDate,
  getTotalJobsCut,
} from '../utils/dataTransformers';
import { formatDate, formatNumber } from '../utils/formatters';
import type { DisplacementEvent } from '../types';

interface TimelinePageProps {
  events: DisplacementEvent[];
}

export function TimelinePage({ events }: TimelinePageProps) {
  const [mode, setMode] = useState<'slider' | 'story'>('slider');
  const playback = useTimelinePlayback();
  const filteredEvents = filterEventsByDate(events, playback.currentDate);

  return (
    <PageLayout
      title="Timeline"
      subtitle="Watch AI workforce displacement unfold over time"
    >
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode('slider')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'slider'
              ? 'bg-primary-600 text-white'
              : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
          }`}
        >
          Slider Mode
        </button>
        <button
          onClick={() => setMode('story')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'story'
              ? 'bg-primary-600 text-white'
              : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
          }`}
        >
          Story Mode
        </button>
      </div>

      {mode === 'slider' ? (
        <SliderMode
          filteredEvents={filteredEvents}
          playback={playback}
        />
      ) : (
        <StoryMode events={events} />
      )}
    </PageLayout>
  );
}

function SliderMode({
  filteredEvents,
  playback,
}: {
  filteredEvents: DisplacementEvent[];
  playback: ReturnType<typeof useTimelinePlayback>;
}) {
  const totalSoFar = getTotalJobsCut(filteredEvents);

  // Get 3 most recent events for the ticker
  const recentEvents = useMemo(() => {
    return [...filteredEvents]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 3);
  }, [filteredEvents]);

  return (
    <div className="space-y-6">
      {/* Controls panel */}
      <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-surface-900">
              {formatDate(playback.currentDate)}
            </div>
            <div className="text-lg text-primary-600 font-semibold">
              {formatNumber(totalSoFar)} jobs displaced
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={playback.isPlaying ? playback.pause : playback.play}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              {playback.isPlaying ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                  Pause
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                  Play
                </>
              )}
            </button>
            <select
              value={playback.speed}
              onChange={(e) => playback.setSpeed(Number(e.target.value))}
              className="px-2 py-2 border border-surface-300 rounded-lg text-sm"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={4}>4x</option>
            </select>
            <button
              onClick={playback.reset}
              className="px-3 py-2 border border-surface-300 rounded-lg text-sm hover:bg-surface-50"
            >
              Reset
            </button>
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={playback.progress}
          onChange={(e) => playback.seekByProgress(Number(e.target.value))}
          className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
        />
        <div className="flex justify-between text-xs text-surface-400 mt-1">
          <span>Nov 30, 2022</span>
          <span>Present</span>
        </div>
      </div>

      {/* Charts — use filteredEvents directly for live updates */}
      <TrendLine events={filteredEvents} />

      {/* Events — shows most recent events at the current point in time */}
      {recentEvents.length > 0 && (
        <div className="bg-surface-50 rounded-xl border border-surface-200 p-4">
          <div className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">
            Events
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recentEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-white rounded-lg px-3 py-2 border border-surface-100"
              >
                <div className="font-medium text-sm text-surface-800">
                  {evt.companyName}
                </div>
                <div className="text-xs text-danger-600 font-semibold">
                  {formatNumber(evt.jobsCut)} jobs cut
                </div>
                <div className="text-xs text-surface-400">
                  {formatDate(evt.date)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <JobTypesChart events={filteredEvents} />
    </div>
  );
}

const STORY_CHAPTERS = [
  {
    id: 'chatgpt-moment',
    title: 'The ChatGPT Moment',
    dateRange: { start: '2022-11-30', end: '2023-01-31' },
    narrative:
      'On November 30, 2022, OpenAI released ChatGPT. Within two months, it reached 100 million users — the fastest-growing consumer application in history. Companies began experimenting, and the first AI-attributed layoffs followed within months.',
  },
  {
    id: 'first-wave',
    title: 'The First Wave',
    dateRange: { start: '2023-07-01', end: '2024-03-31' },
    narrative:
      'As GPT-4, Claude, and other advanced models launched, companies moved from experimentation to implementation. IBM paused hiring for AI-replaceable roles. BT Group announced 10,000 cuts. Tech, media, and finance led the way.',
  },
  {
    id: 'acceleration',
    title: 'The Acceleration',
    dateRange: { start: '2024-04-01', end: '2024-12-31' },
    narrative:
      'AI capabilities expanded rapidly with multimodal models, coding assistants, and AI agents. Klarna replaced 700 customer service agents with AI. Duolingo cut contractors. The displacement shifted from announcements to implementation.',
  },
  {
    id: 'new-normal',
    title: 'The New Normal',
    dateRange: { start: '2025-01-01', end: '2026-03-31' },
    narrative:
      'By 2025-2026, AI displacement became systemic. Block cut 40% of its workforce citing AI productivity gains. Amazon eliminated 30,000 positions. Salesforce stopped hiring customer support agents. Monday.com replaced its entire SDR team with AI agents. The question shifted from "if" to "how fast."',
  },
];

function StoryMode({ events }: { events: DisplacementEvent[] }) {
  return (
    <div className="space-y-16">
      {STORY_CHAPTERS.map((chapter) => {
        const chapterEvents = events.filter(
          (e) => e.date >= chapter.dateRange.start && e.date <= chapter.dateRange.end,
        );
        return (
          <div key={chapter.id} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-surface-900 mb-2">{chapter.title}</h2>
              <p className="text-sm text-primary-600 mb-4">
                {formatDate(chapter.dateRange.start)} — {formatDate(chapter.dateRange.end)}
              </p>
              <p className="text-surface-600 mb-6">{chapter.narrative}</p>
              <div className="space-y-3">
                {chapterEvents.slice(0, 5).map((evt) => (
                  <div
                    key={evt.id}
                    className="border-l-2 border-primary-400 pl-3 py-1"
                  >
                    <div className="font-medium text-sm text-surface-800">
                      {evt.companyName} — {evt.jobsCut.toLocaleString()} jobs
                    </div>
                    <p className="text-xs text-surface-500">{evt.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              {chapter.id === 'chatgpt-moment' ? (
                <ChatGPTGrowthChart />
              ) : (
                <TrendLine
                  events={chapterEvents}
                  title={chapter.title}
                  subtitle={`${formatDate(chapter.dateRange.start)} — ${formatDate(chapter.dateRange.end)}`}
                  dateRange={chapter.dateRange}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

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
  plannedEvents?: DisplacementEvent[];
  creationEvents?: DisplacementEvent[];
}

/** Visual style for each event type */
function eventCardClasses(type: 'verified' | 'planned' | 'creation') {
  switch (type) {
    case 'planned':
      return 'bg-white rounded-lg px-3 py-2 border-2 border-dashed border-warning-300 bg-warning-50/40';
    case 'creation':
      return 'bg-white rounded-lg px-3 py-2 border border-success-300 bg-success-50/40';
    default:
      return 'bg-white rounded-lg px-3 py-2 border border-surface-100';
  }
}

function eventBorderClasses(type: 'verified' | 'planned' | 'creation') {
  switch (type) {
    case 'planned':
      return 'border-l-2 border-warning-400 pl-3 py-1';
    case 'creation':
      return 'border-l-2 border-success-400 pl-3 py-1';
    default:
      return 'border-l-2 border-primary-400 pl-3 py-1';
  }
}

function EventTypeBadge({ type }: { type: 'verified' | 'planned' | 'creation' }) {
  switch (type) {
    case 'planned':
      return (
        <span className="text-xs px-1.5 py-0.5 rounded-full bg-warning-100 text-warning-700">
          Announced
        </span>
      );
    case 'creation':
      return (
        <span className="text-xs px-1.5 py-0.5 rounded-full bg-success-100 text-success-700">
          Job Creation
        </span>
      );
    default:
      return null;
  }
}

export function TimelinePage({ events, plannedEvents = [], creationEvents = [] }: TimelinePageProps) {
  const [mode, setMode] = useState<'slider' | 'story'>('slider');
  const playback = useTimelinePlayback();
  const filteredEvents = filterEventsByDate(events, playback.currentDate);
  const filteredPlanned = filterEventsByDate(plannedEvents, playback.currentDate);
  const filteredCreation = filterEventsByDate(creationEvents, playback.currentDate);

  return (
    <PageLayout
      title="Timeline"
      subtitle="Watch AI workforce displacement unfold over time"
      embedPath="/timeline"
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
          filteredPlanned={filteredPlanned}
          filteredCreation={filteredCreation}
          playback={playback}
        />
      ) : (
        <StoryMode events={events} plannedEvents={plannedEvents} creationEvents={creationEvents} />
      )}
    </PageLayout>
  );
}

function SliderMode({
  filteredEvents,
  filteredPlanned,
  filteredCreation,
  playback,
}: {
  filteredEvents: DisplacementEvent[];
  filteredPlanned: DisplacementEvent[];
  filteredCreation: DisplacementEvent[];
  playback: ReturnType<typeof useTimelinePlayback>;
}) {
  const totalSoFar = getTotalJobsCut(filteredEvents);
  const plannedTotal = filteredPlanned.reduce((sum, e) => sum + e.jobsCut, 0);

  // Combine all events sorted by date, tag with type, show most recent 6
  const recentEvents = useMemo(() => {
    const tagged: Array<{ evt: DisplacementEvent; type: 'verified' | 'planned' | 'creation' }> = [
      ...filteredEvents.map((evt) => ({ evt, type: 'verified' as const })),
      ...filteredPlanned.map((evt) => ({ evt, type: 'planned' as const })),
      ...filteredCreation.map((evt) => ({ evt, type: 'creation' as const })),
    ];
    return tagged
      .sort((a, b) => a.evt.date.localeCompare(b.evt.date))
      .slice(-6);
  }, [filteredEvents, filteredPlanned, filteredCreation]);

  return (
    <div className="space-y-6">
      {/* Controls panel */}
      <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-surface-900">
              {formatDate(playback.currentDate)}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-lg text-danger-600 font-semibold">
                {formatNumber(totalSoFar)} displaced
              </div>
              {plannedTotal > 0 && (
                <div className="text-sm text-warning-600 font-medium">
                  +{formatNumber(plannedTotal)} announced
                </div>
              )}
              {filteredCreation.length > 0 && (
                <div className="text-sm text-success-600 font-medium">
                  {filteredCreation.length} creation {filteredCreation.length === 1 ? 'event' : 'events'}
                </div>
              )}
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
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
              Recent Events
            </div>
            <div className="flex items-center gap-3 text-xs text-surface-400">
              <span className="flex items-center gap-1">
                <span className="w-3 h-2 rounded-sm border border-surface-300 bg-white" /> Confirmed
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-2 rounded-sm border-2 border-dashed border-warning-300 bg-warning-50/40" /> Announced
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-2 rounded-sm border border-success-300 bg-success-50/40" /> Creation
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recentEvents.map(({ evt, type }) => (
              <div key={evt.id} className={eventCardClasses(type)}>
                <div className="flex items-center gap-2">
                  <div className="font-medium text-sm text-surface-800">
                    {evt.companyName}
                  </div>
                  <EventTypeBadge type={type} />
                </div>
                {type === 'creation' ? (
                  <div className="text-xs text-success-600 font-semibold">
                    AI job creation
                  </div>
                ) : (
                  <div className={`text-xs font-semibold ${type === 'planned' ? 'text-warning-600' : 'text-danger-600'}`}>
                    {formatNumber(evt.jobsCut)} jobs {type === 'planned' ? 'announced' : 'cut'}
                  </div>
                )}
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

function StoryMode({
  events,
  plannedEvents,
  creationEvents,
}: {
  events: DisplacementEvent[];
  plannedEvents: DisplacementEvent[];
  creationEvents: DisplacementEvent[];
}) {
  return (
    <div className="space-y-16">
      {STORY_CHAPTERS.map((chapter) => {
        const chapterVerified = events.filter(
          (e) => e.date >= chapter.dateRange.start && e.date <= chapter.dateRange.end,
        );
        const chapterPlanned = plannedEvents.filter(
          (e) => e.date >= chapter.dateRange.start && e.date <= chapter.dateRange.end,
        );
        const chapterCreation = creationEvents.filter(
          (e) => e.date >= chapter.dateRange.start && e.date <= chapter.dateRange.end,
        );

        // Combine all events for this chapter, tagged with type
        const allChapterEvents: Array<{ evt: DisplacementEvent; type: 'verified' | 'planned' | 'creation' }> = [
          ...chapterVerified.map((evt) => ({ evt, type: 'verified' as const })),
          ...chapterPlanned.map((evt) => ({ evt, type: 'planned' as const })),
          ...chapterCreation.map((evt) => ({ evt, type: 'creation' as const })),
        ].sort((a, b) => a.evt.date.localeCompare(b.evt.date));

        return (
          <div key={chapter.id} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-surface-900 mb-2">{chapter.title}</h2>
              <p className="text-sm text-primary-600 mb-4">
                {formatDate(chapter.dateRange.start)} — {formatDate(chapter.dateRange.end)}
              </p>
              <p className="text-surface-600 mb-6">{chapter.narrative}</p>

              {/* Summary stats for the chapter */}
              {(chapterPlanned.length > 0 || chapterCreation.length > 0) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {chapterVerified.length > 0 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-danger-50 text-danger-700 font-medium">
                      {chapterVerified.length} confirmed
                    </span>
                  )}
                  {chapterPlanned.length > 0 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-warning-50 text-warning-700 font-medium">
                      {chapterPlanned.length} announced
                    </span>
                  )}
                  {chapterCreation.length > 0 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-success-50 text-success-700 font-medium">
                      {chapterCreation.length} creation
                    </span>
                  )}
                </div>
              )}

              <div className="space-y-3">
                {allChapterEvents.slice(0, 8).map(({ evt, type }) => (
                  <div key={evt.id} className={eventBorderClasses(type)}>
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-sm text-surface-800">
                        {evt.companyName} —{' '}
                        {type === 'creation'
                          ? 'AI job creation'
                          : `${evt.jobsCut.toLocaleString()} jobs${type === 'planned' ? ' announced' : ''}`}
                      </div>
                      <EventTypeBadge type={type} />
                    </div>
                    <p className="text-xs text-surface-500">
                      {type === 'creation' && evt.reasonGiven ? evt.reasonGiven : evt.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              {chapter.id === 'chatgpt-moment' ? (
                <ChatGPTGrowthChart />
              ) : (
                <TrendLine
                  events={chapterVerified}
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

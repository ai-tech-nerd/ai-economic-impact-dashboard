import { useState, useCallback, useRef, useEffect, useMemo } from 'react';

const TIMELINE_START = new Date('2022-11-30').getTime();

export function useTimelinePlayback() {
  const endTimestamp = useMemo(() => Date.now(), []);
  const [currentTimestamp, setCurrentTimestamp] = useState(endTimestamp);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const rafRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);

  const currentDate = new Date(currentTimestamp).toISOString().slice(0, 10);
  const progress = (currentTimestamp - TIMELINE_START) / (endTimestamp - TIMELINE_START);

  const play = useCallback(() => {
    setCurrentTimestamp((prev) => {
      // If at end, restart from beginning
      if (prev >= endTimestamp - 86_400_000) return TIMELINE_START;
      return prev;
    });
    setIsPlaying(true);
  }, [endTimestamp]);

  const pause = useCallback(() => setIsPlaying(false), []);

  const seek = useCallback((date: string) => {
    setCurrentTimestamp(new Date(date).getTime());
  }, []);

  const seekByProgress = useCallback(
    (p: number) => {
      const ts = TIMELINE_START + p * (endTimestamp - TIMELINE_START);
      setCurrentTimestamp(ts);
    },
    [endTimestamp],
  );

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentTimestamp(endTimestamp);
  }, [endTimestamp]);

  useEffect(() => {
    if (!isPlaying) return;

    lastFrameRef.current = performance.now();

    const animate = (timestamp: number) => {
      const delta = timestamp - lastFrameRef.current;
      lastFrameRef.current = timestamp;

      // Advance ~1 day per 50ms at 1x speed
      const msPerDay = 86_400_000;
      const increment = (delta / 50) * msPerDay * speed;

      setCurrentTimestamp((prev) => {
        const next = prev + increment;
        if (next >= endTimestamp) {
          setIsPlaying(false);
          return endTimestamp;
        }
        return next;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, speed, endTimestamp]);

  return {
    currentDate,
    currentTimestamp,
    isPlaying,
    speed,
    progress,
    play,
    pause,
    seek,
    seekByProgress,
    setSpeed,
    reset,
    startTimestamp: TIMELINE_START,
    endTimestamp,
  };
}

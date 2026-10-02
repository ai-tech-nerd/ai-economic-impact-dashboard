import type { DisplacementEvent } from '../../types';

export function isRobotics(evt: Pick<DisplacementEvent, 'displacementMode'>) {
  return evt.displacementMode === 'robotics';
}

export function RoboticsBadge() {
  return (
    <span
      className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-robotics-100 text-robotics-700"
      title="Jobs replaced by AI-powered robots or autonomous systems"
    >
      Robotics
    </span>
  );
}

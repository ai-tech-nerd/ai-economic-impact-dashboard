import { motion } from 'framer-motion';
import { AnimatedNumber } from '../shared/AnimatedNumber';

interface TotalCounterProps {
  total: number;
  companyCount: number;
  eventCount: number;
}

export function TotalCounter({ total, companyCount, eventCount }: TotalCounterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-surface-900 to-surface-800 rounded-2xl p-8 text-white text-center"
    >
      <p className="text-surface-400 text-sm uppercase tracking-wider mb-2">
        Total Jobs Displaced by AI
      </p>
      <div className="text-5xl md:text-7xl font-bold mb-4">
        <AnimatedNumber value={total} className="text-primary-400" />
      </div>
      <p className="text-surface-400 text-sm mb-6">
        Since November 30, 2022 (ChatGPT Launch)
      </p>
      <div className="flex justify-center gap-8">
        <div>
          <div className="text-2xl font-bold">
            <AnimatedNumber value={companyCount} duration={1500} />
          </div>
          <p className="text-surface-400 text-xs uppercase tracking-wider">Companies</p>
        </div>
        <div>
          <div className="text-2xl font-bold">
            <AnimatedNumber value={eventCount} duration={1500} />
          </div>
          <p className="text-surface-400 text-xs uppercase tracking-wider">Events</p>
        </div>
      </div>
    </motion.div>
  );
}

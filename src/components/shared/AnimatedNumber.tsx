import { useAnimatedValue } from '../../hooks/useAnimatedValue';
import { formatNumber } from '../../utils/formatters';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedNumber({
  value,
  duration = 2000,
  prefix = '',
  suffix = '',
  className = '',
}: AnimatedNumberProps) {
  const animated = useAnimatedValue(value, duration);

  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}{formatNumber(animated)}{suffix}
    </span>
  );
}

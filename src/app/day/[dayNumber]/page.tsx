import DayClient from './DayClient';

export function generateStaticParams() {
  return Array.from({ length: 30 }, (_, i) => ({ dayNumber: String(i + 1) }));
}

export default function DayPage() {
  return <DayClient />;
}

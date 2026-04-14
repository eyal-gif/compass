import { redirect } from 'next/navigation';

export function generateStaticParams() {
  return [{ week: '1' }, { week: '2' }, { week: '3' }, { week: '4' }];
}

export default function ReviewPage() {
  redirect('/');
}

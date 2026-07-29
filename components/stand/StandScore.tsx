'use client'

import Card from '@/components/ui/Card'

interface Props {
  score: number
}

export default function StandScore({
  score,
}: Props) {
  const level =
    score >= 90
      ? 'Excellent'
      : score >= 75
      ? 'Très bon'
      : score >= 60
      ? 'Bon'
      : 'À améliorer'

  return (
    <Card className="p-8">

      <div className="text-sm uppercase tracking-[0.3em] text-slate-400">
        Stand Score
      </div>

      <div className="mt-4 text-6xl font-black">
        {score}
      </div>

      <div className="mt-3 text-lg font-semibold text-slate-600">
        {level}
      </div>

    </Card>
  )
}
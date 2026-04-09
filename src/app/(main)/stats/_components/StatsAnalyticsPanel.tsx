'use client'

import { useState } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { colors } from '@/styles/tokens/colors'
import type { ClassCompareDatum, WeeklyDatum } from '../statsModel'
import * as styles from '../stats.css'

const c = colors

type MainView = 'weekly' | 'compare' | 'combined'
type MetricTab = 'score' | 'attendance' | 'homework' | 'input'

const METRIC_DEF: Record<MetricTab, { key: keyof WeeklyDatum; label: string; color: string }> = {
  score: { key: 'avgScore', label: '평균 점수', color: c.primary500 },
  attendance: { key: 'attendanceRate', label: '출석률 (%)', color: c.success500 },
  homework: { key: 'hwRate', label: '과제 완료율 (%)', color: c.warning500 },
  input: { key: 'inputCount', label: '저장된 수업 수', color: c.gray600 },
}

const tooltipBox = {
  fontSize: 12,
  borderRadius: 10,
  border: `1px solid ${c.gray100}`,
  boxShadow: '0 4px 12px rgba(54,55,68,0.08)',
}

export default function StatsAnalyticsPanel({
  weekly,
  classCompare,
}: {
  weekly: WeeklyDatum[]
  classCompare: ClassCompareDatum[]
}) {
  const [mainView, setMainView] = useState<MainView>('weekly')
  const [metricTab, setMetricTab] = useState<MetricTab>('score')
  const md = METRIC_DEF[metricTab]

  const mainTabs: { id: MainView; label: string; hint: string }[] = [
    { id: 'weekly', label: '주간 추이', hint: '주차별로 한 지표씩 비교합니다.' },
    { id: 'compare', label: '반별 비교', hint: '반마다 점수·출석·완료율을 나란히 봅니다.' },
    { id: 'combined', label: '지표 함께 보기', hint: '출석·점수·과제 추이를 한 그래프에 표시합니다.' },
  ]

  const currentHint = mainTabs.find((t) => t.id === mainView)?.hint ?? ''

  return (
    <section className={styles.analyticsPanel} aria-labelledby="stats-analytics-title">
      <div className={styles.analyticsHead}>
        <div>
          <h2 id="stats-analytics-title" className={styles.sectionTitle}>
            데이터 분석
          </h2>
          <p className={styles.sectionDesc} style={{ marginTop: 6 }}>
            목업 기간(3월) 수업 기록을 바탕으로 한 참고용 차트예요. 실서비스에서는 기간 필터를 붙일 수 있어요.
          </p>
        </div>

        <div className={styles.viewTabs} role="tablist" aria-label="분석 보기 전환">
          {mainTabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={mainView === t.id}
              className={`${styles.viewTab}${mainView === t.id ? ` ${styles.viewTabActive}` : ''}`}
              onClick={() => setMainView(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {mainView === 'weekly' && (
          <div className={styles.metricTabs} role="tablist" aria-label="주간 지표 선택">
            {(Object.keys(METRIC_DEF) as MetricTab[]).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={metricTab === key}
                className={`${styles.metricTab}${metricTab === key ? ` ${styles.metricTabActive}` : ''}`}
                onClick={() => setMetricTab(key)}
              >
                {METRIC_DEF[key].label}
              </button>
            ))}
          </div>
        )}
      </div>

      {mainView === 'weekly' && (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={weekly} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" stroke={c.gray75} vertical={false} />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 12, fill: c.gray500 }}
              tickLine={false}
              axisLine={{ stroke: c.gray100 }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: c.gray500 }}
              tickLine={false}
              axisLine={false}
              domain={
                metricTab === 'input'
                  ? [0, 'auto']
                  : metricTab === 'score'
                    ? [50, 100]
                    : [0, 100]
              }
            />
            <Tooltip
              formatter={(v) => {
                const n = Number(v ?? 0)
                if (metricTab === 'input') return [`${n}회`, '저장 수업']
                if (metricTab === 'score') return [`${n}점`, '평균 점수']
                return [`${n}%`, md.label]
              }}
              contentStyle={tooltipBox}
            />
            <Bar dataKey={md.key} name={md.label} fill={md.color} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}

      {mainView === 'compare' && (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={classCompare} barGap={6} barCategoryGap="26%">
            <CartesianGrid strokeDasharray="3 3" stroke={c.gray75} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: c.gray500 }}
              tickLine={false}
              axisLine={{ stroke: c.gray100 }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: c.gray500 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(v, name) => {
                const n = Number(v ?? 0)
                const key = String(name ?? '')
                if (key === 'avgScore') return [`${n}점`, '평균 점수']
                if (key === 'attendance') return [`${n}%`, '출석률']
                return [`${n}%`, '완료율']
              }}
              contentStyle={tooltipBox}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              formatter={(value) =>
                value === 'avgScore'
                  ? '평균 점수'
                  : value === 'attendance'
                    ? '출석률'
                    : '완료율'
              }
            />
            <Bar dataKey="avgScore" name="avgScore" fill={c.primary500} radius={[6, 6, 0, 0]} />
            <Bar dataKey="attendance" name="attendance" fill={c.success500} radius={[6, 6, 0, 0]} />
            <Bar dataKey="completion" name="completion" fill={c.warning500} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}

      {mainView === 'combined' && (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={weekly}>
            <CartesianGrid strokeDasharray="3 3" stroke={c.gray75} vertical={false} />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 12, fill: c.gray500 }}
              tickLine={false}
              axisLine={{ stroke: c.gray100 }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: c.gray500 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip contentStyle={tooltipBox} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            <Line
              type="monotone"
              dataKey="attendanceRate"
              name="출석률 (%)"
              stroke={c.success500}
              strokeWidth={2.5}
              dot={{ r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="avgScore"
              name="평균 점수"
              stroke={c.primary500}
              strokeWidth={2.5}
              dot={{ r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="hwRate"
              name="과제 완료율 (%)"
              stroke={c.warning500}
              strokeWidth={2.5}
              dot={{ r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      <p className={styles.chartHint}>{currentHint}</p>
    </section>
  )
}

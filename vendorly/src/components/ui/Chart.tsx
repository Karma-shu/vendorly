import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

// Line Chart Component
interface LineChartProps {
  data: {
    label: string
    value: number
  }[]
  height?: number
  color?: string
  showTrend?: boolean
}

export const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  height = 200, 
  color = '#3B82F6',
  showTrend = true 
}) => {
  if (!data || data.length === 0) return null

  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))
  const range = maxValue - minValue || 1

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = 100 - ((item.value - minValue) / range) * 100
    return `${x},${y}`
  }).join(' ')

  const trend = data.length > 1 ? 
    (data[data.length - 1].value > data[0].value ? 'up' : 
     data[data.length - 1].value < data[0].value ? 'down' : 'neutral') : 'neutral'

  return (
    <div className="relative">
      <svg
        width="100%"
        height={height}
        viewBox="0 0 100 100"
        className="overflow-visible"
      >
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />

        {/* Area under curve */}
        <path
          d={`M0,100 L${points} L100,100 Z`}
          fill={`${color}20`}
          stroke="none"
        />

        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100
          const y = 100 - ((item.value - minValue) / range) * 100
          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r="3"
                fill={color}
                stroke="white"
                strokeWidth="2"
              />
              <title>{`${item.label}: ${item.value}`}</title>
            </g>
          )
        })}
      </svg>

      {/* Trend indicator */}
      {showTrend && (
        <div className="absolute top-2 right-2">
          {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
          {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
          {trend === 'neutral' && <Minus className="w-4 h-4 text-gray-500" />}
        </div>
      )}
    </div>
  )
}

// Bar Chart Component
interface BarChartProps {
  data: {
    label: string
    value: number
    color?: string
  }[]
  height?: number
  showValues?: boolean
}

export const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  height = 300,
  showValues = true 
}) => {
  if (!data || data.length === 0) return null

  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between" style={{ height: `${height}px` }}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (height - 40)
          const color = item.color || '#3B82F6'
          
          return (
            <div key={index} className="flex flex-col items-center space-y-2 flex-1 max-w-16">
              {showValues && (
                <span className="text-xs font-medium text-gray-700">
                  {item.value}
                </span>
              )}
              <div
                className="w-full rounded-t-md transition-all duration-300 hover:opacity-80"
                style={{ 
                  height: `${barHeight}px`,
                  backgroundColor: color,
                  minHeight: '4px'
                }}
                title={`${item.label}: ${item.value}`}
              />
              <span className="text-xs text-gray-600 text-center leading-tight">
                {item.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Donut Chart Component
interface DonutChartProps {
  data: {
    label: string
    value: number
    color: string
  }[]
  size?: number
  centerContent?: React.ReactNode
}

export const DonutChart: React.FC<DonutChartProps> = ({ 
  data, 
  size = 200,
  centerContent 
}) => {
  if (!data || data.length === 0) return null

  const total = data.reduce((sum, item) => sum + item.value, 0)
  if (total === 0) return null

  const radius = (size - 40) / 2
  const innerRadius = radius * 0.6
  const centerX = size / 2
  const centerY = size / 2

  let currentAngle = -90 // Start from top

  const paths = data.map((item, index) => {
    const percentage = (item.value / total) * 100
    const angle = (item.value / total) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle

    const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180)
    const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180)
    const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180)
    const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180)

    const x3 = centerX + innerRadius * Math.cos((endAngle * Math.PI) / 180)
    const y3 = centerY + innerRadius * Math.sin((endAngle * Math.PI) / 180)
    const x4 = centerX + innerRadius * Math.cos((startAngle * Math.PI) / 180)
    const y4 = centerY + innerRadius * Math.sin((startAngle * Math.PI) / 180)

    const largeArcFlag = angle > 180 ? 1 : 0

    const pathData = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
      'Z'
    ].join(' ')

    currentAngle += angle

    return (
      <g key={index}>
        <path
          d={pathData}
          fill={item.color}
          className="hover:opacity-80 transition-opacity duration-200"
        >
          <title>{`${item.label}: ${item.value} (${percentage.toFixed(1)}%)`}</title>
        </path>
      </g>
    )
  })

  return (
    <div className="flex items-center space-x-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          {paths}
        </svg>
        {centerContent && (
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: innerRadius * 1.6,
              height: innerRadius * 1.6
            }}
          >
            {centerContent}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {data.map((item, index) => {
          const percentage = ((item.value / total) * 100).toFixed(1)
          return (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-700">
                {item.label}: {percentage}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Metric Card Component
interface MetricCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    percentage: boolean
  }
  trend?: 'up' | 'down' | 'neutral'
  icon?: React.ReactNode
  color?: string
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  trend,
  icon,
  color = '#3B82F6'
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4" />
      case 'down': return <TrendingDown className="w-4 h-4" />
      default: return <Minus className="w-4 h-4" />
    }
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && (
          <div style={{ color }} className="opacity-60">
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className={`flex items-center space-x-1 mt-1 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="text-sm font-medium">
                {change.percentage ? '+' : ''}{change.value}{change.percentage ? '%' : ''}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Heatmap Component (for showing activity patterns)
interface HeatmapProps {
  data: {
    day: string
    hour: number
    value: number
  }[]
  maxValue?: number
}

export const Heatmap: React.FC<HeatmapProps> = ({ data, maxValue }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const hours = Array.from({ length: 24 }, (_, i) => i)
  
  const max = maxValue || Math.max(...data.map(d => d.value))
  
  const getIntensity = (value: number) => {
    const intensity = value / max
    return `rgba(59, 130, 246, ${intensity})`
  }
  
  const getValue = (day: string, hour: number) => {
    const item = data.find(d => d.day === day && d.hour === hour)
    return item ? item.value : 0
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-25 gap-1 text-xs">
        <div></div>
        {hours.map(hour => (
          <div key={hour} className="text-center text-gray-500">
            {hour % 4 === 0 ? hour : ''}
          </div>
        ))}
        
        {days.map(day => (
          <React.Fragment key={day}>
            <div className="text-gray-600 text-right pr-2 py-1">{day}</div>
            {hours.map(hour => {
              const value = getValue(day, hour)
              return (
                <div
                  key={`${day}-${hour}`}
                  className="w-3 h-3 rounded-sm border border-gray-200"
                  style={{ backgroundColor: getIntensity(value) }}
                  title={`${day} ${hour}:00 - ${value} orders`}
                />
              )
            })}
          </React.Fragment>
        ))}
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Less</span>
        <div className="flex space-x-1">
          {[0, 0.25, 0.5, 0.75, 1].map(intensity => (
            <div
              key={intensity}
              className="w-3 h-3 rounded-sm border border-gray-200"
              style={{ backgroundColor: `rgba(59, 130, 246, ${intensity})` }}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  )
}
"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  temperature: {
    label: "Temperature (°C)",
    color: "hsl(var(--chart-temperature))", // Using a different chart color
  },
}

export function ChartArea() {
  const [chartData, setChartData] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async (isInitial = false) => {
      try {
        if (isInitial) setLoading(true)
        const response = await fetch(`/api/supabase-data?t=${Date.now()}`, { cache: 'no-store' })
        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`)
        const data = await response.json()
        
        if (!data || data.length === 0) {
          setChartData([])
          return
        }
      
        const intervalData = {}
        data.forEach((item, index) => {
          const timestamp = item.timestamp || item.created_at
          if (!timestamp || item.temperature === undefined || item.temperature === null) {
            return // Skip if essential data is missing
          }
          const date = new Date(timestamp)
          if (isNaN(date.getTime())) {
            return // Skip if the date is invalid
          }

          // Group data into 10-minute intervals
          const minutes = Math.floor(date.getMinutes() / 10) * 10
          const timeKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
          
          if (!intervalData[timeKey]) {
            intervalData[timeKey] = { sum: 0, count: 0 }
          }
          intervalData[timeKey].sum += parseFloat(item.temperature)
          intervalData[timeKey].count += 1
        })
        
        const timeAverages = Object.entries(intervalData).map(([time, data]) => ({
          hour: time,
          temperature: parseFloat((data.sum / data.count).toFixed(2))
        }))
        
        timeAverages.sort((a, b) => new Date(a.hour) - new Date(b.hour))
        const recentData = timeAverages.slice(-50) // Get the last 50 data points
        
        setChartData(recentData)

      } catch (error) {
        console.error('An error occurred in fetchData:', error)
        setChartData([])
      } finally {
        if (isInitial) setLoading(false)
      }
    }
    
    fetchData(true)
    const interval = setInterval(() => fetchData(false), 5000) // Auto-update every 5 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="py-0">
      <CardHeader className="px-6 pt-4 pb-3">
        <CardTitle>Temperature Line Chart</CardTitle>
        <CardDescription>
            Average temperature readings, updated every 5 seconds.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center h-[250px]">Loading temperature data...</div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[250px]">No data available</div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart
              data={chartData}
              margin={{ left: 12, right: 12, top: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillTemperature" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--chart-temperature))"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--chart-temperature))"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="hour"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                    const hour = value.split(' ')[1];
                    return hour;
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={['dataMin - 2', 'dataMax + 2']} // Give some vertical padding
                tickFormatter={(value) => `${value}°`}
              />
              <ChartTooltip
                cursor={true}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                        });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="temperature"
                type="monotone"
                stroke="hsl(var(--chart-temperature))"
                strokeWidth={2}
                fill="url(#fillTemperature)"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
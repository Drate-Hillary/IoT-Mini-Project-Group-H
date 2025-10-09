"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
  humidity: {
    label: "Humidity (%)",
    color: "hsl(var(--chart-humidity))",
  },
}

export function HumidityBarChart() {
  const [chartData, setChartData] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [lastUpdate, setLastUpdate] = React.useState(null)

  React.useEffect(() => {
    const fetchData = async (isInitial = false) => {
      try {
        if (isInitial) setLoading(true)
        const response = await fetch(`/api/supabase-data?t=${Date.now()}`, { cache: 'no-store' })
        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`)
        const data = await response.json()
        setLastUpdate(new Date())
        
        console.log('API Response:', data)
        if (!data || data.length === 0) {
          console.log('No data returned from API. Setting chart data to empty.')
          setChartData([])
          return
        }
        
        console.log('Sample record from API:', data[0])
      
        const hourlyData = {}
        data.forEach((item, index) => {
          // --- Start of per-item validation ---
          if (!item || typeof item !== 'object') {
            console.warn(`Record at index ${index} is not a valid object.`, item)
            return
          }
          const timestamp = item.timestamp || item.created_at
          if (!timestamp || !item.humidity) {
            console.warn(`Skipping record at index ${index} due to missing 'timestamp/created_at' or 'humidity'.`, item)
            return
          }
          const date = new Date(timestamp)
          if (isNaN(date.getTime())) {
            console.warn(`Skipping record at index ${index} due to invalid date format for 'created_at'.`, item)
            return
          }

          const minutes = Math.floor(date.getMinutes() / 10) * 10
          const timeKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
          
          if (!hourlyData[timeKey]) {
            hourlyData[timeKey] = { sum: 0, count: 0 }
          }
          hourlyData[timeKey].sum += parseFloat(item.humidity)
          hourlyData[timeKey].count += 1
        })
        
        const timeAverages = Object.entries(hourlyData).map(([time, data]) => ({
          hour: time,
          humidity: parseFloat((data.sum / data.count).toFixed(2))
        }))
        
        timeAverages.sort((a, b) => new Date(a.hour) - new Date(b.hour))
        const recentData = timeAverages.slice(-50)
        
        console.log('Final processed chart data has', recentData.length, 'time intervals.')
        setChartData(recentData)

      } catch (error) {
        console.error('An error occurred in fetchData:', error)
        setChartData([]) // Ensure data is cleared on error
      } finally {
        if (isInitial) setLoading(false)
      }
    }
    
    fetchData(true)
    const interval = setInterval(() => fetchData(false), 5000) // Update every 5 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="py-0">
      <CardHeader className="px-6 pt-4 pb-3">
        <CardTitle>Humidity Bar Chart</CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center h-[250px]">Loading humidity data...</div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[250px]">No data available</div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              data={chartData}
              margin={{ left: 12, right: 12 }}
            >
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
                domain={['dataMin - 5', 'dataMax + 5']} // Give some vertical padding
              />
              <ChartTooltip
                cursor={false}
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
                  />
                }
              />
              <Bar dataKey="humidity" fill="var(--color-humidity)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
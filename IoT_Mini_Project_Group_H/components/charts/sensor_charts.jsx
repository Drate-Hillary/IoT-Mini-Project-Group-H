"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart"
import { toast } from "sonner"

// ## 1. Combined Chart Configuration
// Defines labels and colors for all three data types.
const chartConfig = {
  temperature: {
    label: "Temperature",
    color: "hsl(var(--chart-temperature))",
  },
  humidity: {
    label: "Humidity",
    color: "hsl(var(--chart-humidity))",
  },
  motion_count: {
    label: "Motion Count",
    color: "hsl(var(--chart-motion))",
  },
}

export function ChartArea() {
  // ## 2. State Management
  const [activeChart, setActiveChart] = useState("temperature")
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  // ## 3. Unified Data Fetching and Processing
  useEffect(() => {
    const fetchData = async (isInitial = false) => {
      try {
        if (isInitial) setLoading(true)
        const response = await fetch(`/api/supabase-data?limit=500&t=${Date.now()}`, { cache: 'no-store' })
        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`)
        const data = await response.json()

        if (!data || data.length === 0) {
          setChartData([])
          return
        }

        const intervalData = {}
        data.forEach((item) => {
          const timestamp = item.timestamp || item.created_at
          if (!timestamp || item.temperature === undefined || item.humidity === undefined || item.motion_counts === undefined) {
            return
          }
          const date = new Date(timestamp)
          if (isNaN(date.getTime())) return

          const minutes = Math.floor(date.getMinutes() / 10) * 10
          const timeKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`

          if (!intervalData[timeKey]) {
            intervalData[timeKey] = { tempSum: 0, humiditySum: 0, motionSum: 0, count: 0 }
          }
          
          intervalData[timeKey].tempSum += parseFloat(item.temperature)
          intervalData[timeKey].humiditySum += parseFloat(item.humidity)
          intervalData[timeKey].motionSum += parseInt(item.motion_counts, 10)
          intervalData[timeKey].count += 1
        })

        const processedData = Object.entries(intervalData).map(([time, data]) => ({
          time: time,
          temperature: parseFloat((data.tempSum / data.count).toFixed(2)),
          humidity: parseFloat((data.humiditySum / data.count).toFixed(2)),
          motion_count: data.motionSum,
        }))

        processedData.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
        setChartData(processedData.slice(-50))

      } catch (error) {
        console.error("Chart data fetching error:", error)
        toast.error("Error loading chart data.")
        setChartData([])
      } finally {
        if (isInitial) setLoading(false)
      }
    }

    fetchData(true)
    const interval = setInterval(() => fetchData(false), 5000)
    return () => clearInterval(interval)
  }, [])

  // ## 4. Calculate Summary Totals/Averages
  const summary = useMemo(() => {
    if (chartData.length === 0) {
      return { temperature: "0°C", humidity: "0%", motion_count: "0" };
    }
    const totals = chartData.reduce(
      (acc, curr) => {
        acc.temperature += curr.temperature
        acc.humidity += curr.humidity
        acc.motion_count += curr.motion_count
        return acc
      },
      { temperature: 0, humidity: 0, motion_count: 0 }
    )
    return {
      temperature: `${(totals.temperature / chartData.length).toFixed(2)}°C`,
      humidity: `${(totals.humidity / chartData.length).toFixed(2)}%`,
      motion_count: totals.motion_count.toLocaleString(),
    }
  }, [chartData])

  return (
    <Card>
      {/* ## 5. Interactive Header */}
      <CardHeader className="flex flex-col items-stretch border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-4 py-3 sm:px-6 sm:py-5">
          <CardTitle className="text-base sm:text-lg md:text-xl">Sensor Chart of Temperature, Humidity, and Motion Counts</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Displaying sensor readings.
          </CardDescription>
        </div>
        <div className="flex">
          {Object.keys(chartConfig).map((key) => (
            <button
              key={key}
              data-active={activeChart === key}
              className="data-[active=true]:bg-muted/80 relative flex flex-1 flex-col justify-center gap-1 border-t px-3 py-3 text-left even:border-l sm:border-l sm:border-t-0 sm:px-6 sm:py-4 md:px-8 md:py-6"
              onClick={() => setActiveChart(key)}
            >
              <span className="text-muted-foreground text-[10px] sm:text-xs">
                {chartConfig[key].label}
              </span>
              <span className="text-sm font-bold leading-none sm:text-lg md:text-2xl lg:text-3xl">
                {summary[key]}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      
      {/* ## 6. Conditional Chart Rendering */}
      <CardContent className="px-2 sm:p-6">
        {loading ? (
          <div className="flex h-[250px] w-full items-center justify-center">Loading sensor data...</div>
        ) : chartData.length === 0 ? (
          <div className="flex h-[250px] w-full items-center justify-center">No data available.</div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            {/* If temperature is active, show the AreaChart (line graph) */}
            {activeChart === 'temperature' ? (
              <AreaChart data={chartData} margin={{ left: 12, right: 12, top: 10 }}>
                <defs>
                  <linearGradient id="fillTemperature" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-temperature))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--chart-temperature))" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={['dataMin - 2', 'dataMax + 2']} tickFormatter={(value) => `${value}°`} />
                <ChartTooltip cursor={true} content={<ChartTooltipContent indicator="dot" labelFormatter={(value) => new Date(value).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })} />} />
                <Area dataKey="temperature" type="monotone" stroke="hsl(var(--chart-temperature))" strokeWidth={2} fill="url(#fillTemperature)" />
              </AreaChart>
            ) : (
              /* Otherwise, show the BarChart for humidity and motion */
              <BarChart data={chartData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={['dataMin - 5', 'dataMax + 5']} tickFormatter={(value) => activeChart === 'humidity' ? `${value}%` : value} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent labelFormatter={(value) => new Date(value).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })} />} />
                <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} radius={4} />
              </BarChart>
            )}
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
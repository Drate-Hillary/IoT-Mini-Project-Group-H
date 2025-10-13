"use client"

import { useState, useEffect } from "react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { GiBattery75 } from "react-icons/gi"
import { toast } from "sonner"
import { useTheme } from "next-themes"

export function BatteryVoltageChartRadialStacked() {
  const [batteryData, setBatteryData] = useState({ current: 0, max: 5.0 })
  const [loading, setLoading] = useState(true)
  const { theme } = useTheme()

  const chartConfig = {
    used: {
      label: "Used",
      color: theme === "dark" ? "#ffffff" : "#000000",
    },
    remaining: {
      label: "Remaining",
      color: theme === "dark" ? "#404040" : "#e0e0e0",
    },
  }

  useEffect(() => {
    const fetchBattery = async () => {
      try {
        const res = await fetch('/api/average-data')
        const data = await res.json()
        setBatteryData({ current: parseFloat(data.average_battery) || 0, max: 5.0 })
      } catch (err) {
        console.error('Battery fetch error:', err)
        toast.error('Failed to load battery data!')
      } finally {
        setLoading(false)
      }
    }
    fetchBattery()
    const interval = setInterval(fetchBattery, 5000)
    return () => clearInterval(interval)
  }, [])

  const used = batteryData.current
  const remaining = batteryData.max - batteryData.current
  const chartData = [{ used, remaining }]
  const percentage = ((used / batteryData.max) * 100).toFixed(1)

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <GiBattery75 className="h-5 w-5" />
          Battery Voltage Monitor
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">Real-time battery voltage from IoT device</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-4">
        {loading ? (
          <div className="flex h-[200px] w-full items-center justify-center">Loading...</div>
        ) : (
          <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-w-[200px]">
            <RadialBarChart data={chartData} startAngle={180} endAngle={0} innerRadius={80} outerRadius={130}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 24} className="fill-foreground text-2xl font-bold">
                            {used.toFixed(2)}V
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 4} className="fill-muted-foreground text-sm">
                            {percentage}% Used
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </PolarRadiusAxis>
              <RadialBar dataKey="used" stackId="a" cornerRadius={5} fill="var(--color-used)" className="stroke-transparent stroke-2" />
              <RadialBar dataKey="remaining" stackId="a" cornerRadius={5} fill="var(--color-remaining)" className="stroke-transparent stroke-2" />
            </RadialBarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

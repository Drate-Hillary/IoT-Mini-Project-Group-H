"use client"

import { Activity, PersonStanding } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { FcElectricalSensor } from "react-icons/fc"

// 1. chartData updated for motion counts
const chartData = [
  { day: "Monday", motion_counts: 52 },
  { day: "Tuesday", motion_counts: 75 },
  { day: "Wednesday", motion_counts: 38 },
  { day: "Thursday", motion_counts: 120 },
  { day: "Friday", motion_counts: 94 },
  { day: "Saturday", motion_counts: 150 },
  { day: "Sunday", motion_counts: 130 },
]

// 2. chartConfig updated for motion counts
const chartConfig = {
  motion_counts: {
    label: "Motion Counts",
    color: "hsl(var(--chart-4))",
  },
}

export function MotionCountsChartLine() {
  return (
    <Card className="bg-muted/40">
      <CardHeader>
        <CardTitle className="flex flex-row gap-1 items-center">
          <FcElectricalSensor className="h-8 w-8 text-emerald-700" />
          Motion Counts
        </CardTitle>
        <CardDescription>Detected motion events over the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day" // Updated dataKey
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="motion_counts" // Updated dataKey
              type="natural"
              stroke="var(--color-motion_counts)" // Updated stroke color
              strokeWidth={2}
              // 4. Custom dot icon updated
              dot={({ cx, cy, payload }) => (
                <PersonStanding // Using a more relevant icon
                  key={payload.day}
                  x={cx - 12}
                  y={cy - 12}
                  width={24}
                  height={24}
                  fill="hsl(var(--background))"
                  stroke="var(--color-motion_counts)"
                />
              )}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
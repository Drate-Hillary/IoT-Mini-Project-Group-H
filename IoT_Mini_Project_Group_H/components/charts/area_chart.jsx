"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader,CardTitle, } from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"

export const description = "An interactive area chart"

const chartData = [
  { date: "2024-04-01", temperature: 22.5, humidity: 68, battery_voltage: 4.10, motion_counts: 15 },
  { date: "2024-04-02", temperature: 24.1, humidity: 72, battery_voltage: 4.05, motion_counts: 22 },
  { date: "2024-04-03", temperature: 23.0, humidity: 65, battery_voltage: 4.02, motion_counts: 8 },
  { date: "2024-04-04", temperature: 25.3, humidity: 75, battery_voltage: 3.98, motion_counts: 31 },
  { date: "2024-04-05", temperature: 26.8, humidity: 78, battery_voltage: 3.95, motion_counts: 12 },
  { date: "2024-04-06", temperature: 25.1, humidity: 71, battery_voltage: 3.93, motion_counts: 45 },
  { date: "2024-04-07", temperature: 22.9, humidity: 64, battery_voltage: 3.91, motion_counts: 19 },
  { date: "2024-04-08", temperature: 20.5, humidity: 58, battery_voltage: 3.90, motion_counts: 33 },
  { date: "2024-04-09", temperature: 19.8, humidity: 55, battery_voltage: 3.88, motion_counts: 5 },
  { date: "2024-04-10", temperature: 21.2, humidity: 60, battery_voltage: 3.87, motion_counts: 28 },
  { date: "2024-04-11", temperature: 23.5, humidity: 68, battery_voltage: 3.85, motion_counts: 14 },
  { date: "2024-04-12", temperature: 24.9, humidity: 73, battery_voltage: 3.84, motion_counts: 39 },
  { date: "2024-04-13", temperature: 26.1, humidity: 77, battery_voltage: 3.82, motion_counts: 21 },
  { date: "2024-04-14", temperature: 25.8, humidity: 75, battery_voltage: 3.81, motion_counts: 10 },
  { date: "2024-04-15", temperature: 24.3, humidity: 70, battery_voltage: 3.80, motion_counts: 3 },
  { date: "2024-04-16", temperature: 23.7, humidity: 67, battery_voltage: 3.79, motion_counts: 17 },
  { date: "2024-04-17", temperature: 22.1, humidity: 62, battery_voltage: 3.78, motion_counts: 25 },
  { date: "2024-04-18", temperature: 20.9, humidity: 59, battery_voltage: 3.77, motion_counts: 48 },
  { date: "2024-04-19", temperature: 22.4, humidity: 63, battery_voltage: 3.76, motion_counts: 11 },
  { date: "2024-04-20", temperature: 24.0, humidity: 69, battery_voltage: 3.75, motion_counts: 30 },
  { date: "2024-04-21", temperature: 25.5, humidity: 74, battery_voltage: 3.74, motion_counts: 20 },
  { date: "2024-04-22", temperature: 26.2, humidity: 79, battery_voltage: 3.73, motion_counts: 7 },
  { date: "2024-04-23", temperature: 25.9, humidity: 76, battery_voltage: 3.72, motion_counts: 13 },
  { date: "2024-04-24", temperature: 24.8, humidity: 71, battery_voltage: 3.71, motion_counts: 35 },
  { date: "2024-04-25", temperature: 23.3, humidity: 66, battery_voltage: 3.70, motion_counts: 23 },
  { date: "2024-04-26", temperature: 22.8, humidity: 64, battery_voltage: 3.69, motion_counts: 9 },
  { date: "2024-04-27", temperature: 21.5, humidity: 61, battery_voltage: 3.68, motion_counts: 41 },
  { date: "2024-04-28", temperature: 20.2, humidity: 57, battery_voltage: 3.67, motion_counts: 16 },
  { date: "2024-04-29", temperature: 21.8, humidity: 61, battery_voltage: 3.66, motion_counts: 27 },
  { date: "2024-04-30", temperature: 23.1, humidity: 65, battery_voltage: 3.65, motion_counts: 38 },
  { date: "2024-05-01", temperature: 24.5, humidity: 70, battery_voltage: 3.64, motion_counts: 14 },
  { date: "2024-05-02", temperature: 26.0, humidity: 76, battery_voltage: 3.63, motion_counts: 29 },
  { date: "2024-05-03", temperature: 27.2, humidity: 80, battery_voltage: 3.62, motion_counts: 6 },
  { date: "2024-05-04", temperature: 28.1, humidity: 83, battery_voltage: 3.61, motion_counts: 32 },
  { date: "2024-05-05", temperature: 27.8, humidity: 81, battery_voltage: 3.60, motion_counts: 18 },
  { date: "2024-05-06", temperature: 26.4, humidity: 77, battery_voltage: 3.59, motion_counts: 43 },
  { date: "2024-05-07", temperature: 25.0, humidity: 72, battery_voltage: 3.58, motion_counts: 24 },
  { date: "2024-05-08", temperature: 24.4, humidity: 69, battery_voltage: 3.57, motion_counts: 11 },
  { date: "2024-05-09", temperature: 25.7, humidity: 74, battery_voltage: 3.56, motion_counts: 2 },
  { date: "2024-05-10", temperature: 26.9, humidity: 79, battery_voltage: 3.55, motion_counts: 26 },
  { date: "2024-05-11", temperature: 28.3, humidity: 84, battery_voltage: 3.54, motion_counts: 19 },
  { date: "2024-05-12", temperature: 29.1, humidity: 87, battery_voltage: 3.53, motion_counts: 37 },
  { date: "2024-05-13", temperature: 28.8, humidity: 85, battery_voltage: 3.52, motion_counts: 22 },
  { date: "2024-05-14", temperature: 27.5, humidity: 80, battery_voltage: 3.51, motion_counts: 4 },
  { date: "2024-05-15", temperature: 26.6, humidity: 77, battery_voltage: 3.50, motion_counts: 15 },
  { date: "2024-05-16", temperature: 25.2, humidity: 73, battery_voltage: 3.49, motion_counts: 49 },
  { date: "2024-05-17", temperature: 24.7, humidity: 71, battery_voltage: 3.48, motion_counts: 34 },
  { date: "2024-05-18", temperature: 25.4, humidity: 74, battery_voltage: 3.47, motion_counts: 12 },
  { date: "2024-05-19", temperature: 26.5, humidity: 78, battery_voltage: 3.46, motion_counts: 28 },
  { date: "2024-05-20", temperature: 27.9, humidity: 82, battery_voltage: 3.45, motion_counts: 7 },
  { date: "2024-05-21", temperature: 29.4, humidity: 88, battery_voltage: 3.44, motion_counts: 31 },
  { date: "2024-05-22", temperature: 30.0, humidity: 90, battery_voltage: 3.43, motion_counts: 17 },
  { date: "2024-05-23", temperature: 29.5, humidity: 88, battery_voltage: 3.42, motion_counts: 42 },
  { date: "2024-05-24", temperature: 28.2, humidity: 83, battery_voltage: 3.41, motion_counts: 23 },
  { date: "2024-05-25", temperature: 27.0, humidity: 79, battery_voltage: 3.40, motion_counts: 9 },
  { date: "2024-05-26", temperature: 26.3, humidity: 76, battery_voltage: 3.39, motion_counts: 1 },
  { date: "2024-05-27", temperature: 27.6, humidity: 81, battery_voltage: 3.38, motion_counts: 25 },
  { date: "2024-05-28", temperature: 28.7, humidity: 85, battery_voltage: 3.37, motion_counts: 16 },
  { date: "2024-05-29", temperature: 29.8, humidity: 89, battery_voltage: 3.36, motion_counts: 36 },
  { date: "2024-05-30", temperature: 30.5, humidity: 90, battery_voltage: 3.35, motion_counts: 20 },
  { date: "2024-05-31", temperature: 29.9, humidity: 89, battery_voltage: 3.34, motion_counts: 5 },
  { date: "2024-06-01", temperature: 28.6, humidity: 84, battery_voltage: 3.33, motion_counts: 18 },
  { date: "2024-06-02", temperature: 27.3, humidity: 80, battery_voltage: 3.32, motion_counts: 47 },
  { date: "2024-06-03", temperature: 26.7, humidity: 78, battery_voltage: 3.31, motion_counts: 33 },
  { date: "2024-06-04", temperature: 28.0, humidity: 82, battery_voltage: 3.30, motion_counts: 10 },
  { date: "2024-06-05", temperature: 29.2, humidity: 87, battery_voltage: 3.29, motion_counts: 26 },
  { date: "2024-06-06", temperature: 30.1, humidity: 90, battery_voltage: 3.28, motion_counts: 8 },
  { date: "2024-06-07", temperature: 30.8, humidity: 90, battery_voltage: 3.27, motion_counts: 30 },
  { date: "2024-06-08", temperature: 30.2, humidity: 89, battery_voltage: 3.26, motion_counts: 19 },
  { date: "2024-06-09", temperature: 29.6, humidity: 88, battery_voltage: 3.25, motion_counts: 44 },
  { date: "2024-06-10", temperature: 28.4, humidity: 83, battery_voltage: 3.24, motion_counts: 21 },
  { date: "2024-06-11", temperature: 27.1, humidity: 79, battery_voltage: 3.23, motion_counts: 13 },
  { date: "2024-06-12", temperature: 28.5, humidity: 84, battery_voltage: 3.22, motion_counts: 0 },
  { date: "2024-06-13", temperature: 29.7, humidity: 88, battery_voltage: 3.21, motion_counts: 24 },
  { date: "2024-06-14", temperature: 31.0, humidity: 90, battery_voltage: 3.20, motion_counts: 17 },
  { date: "2024-06-15", temperature: 30.4, humidity: 89, battery_voltage: 3.25, motion_counts: 39 },
  { date: "2024-06-16", temperature: 29.3, humidity: 87, battery_voltage: 3.30, motion_counts: 22 },
  { date: "2024-06-17", temperature: 28.9, humidity: 85, battery_voltage: 3.35, motion_counts: 6 },
  { date: "2024-06-18", temperature: 30.3, humidity: 90, battery_voltage: 3.40, motion_counts: 18 },
  { date: "2024-06-19", temperature: 31.2, humidity: 90, battery_voltage: 3.45, motion_counts: 40 },
  { date: "2024-06-20", temperature: 30.6, humidity: 89, battery_voltage: 3.50, motion_counts: 20 },
  { date: "2024-06-21", temperature: 29.0, humidity: 86, battery_voltage: 3.55, motion_counts: 11 },
  { date: "2024-06-22", temperature: 28.3, humidity: 83, battery_voltage: 3.60, motion_counts: 3 },
  { date: "2024-06-23", temperature: 29.5, humidity: 88, battery_voltage: 3.65, motion_counts: 25 },
  { date: "2024-06-24", temperature: 30.7, humidity: 90, battery_voltage: 3.70, motion_counts: 14 },
  { date: "2024-06-25", temperature: 31.5, humidity: 90, battery_voltage: 3.75, motion_counts: 35 },
  { date: "2024-06-26", temperature: 30.9, humidity: 90, battery_voltage: 3.80, motion_counts: 19 },
  { date: "2024-06-27", temperature: 29.7, humidity: 88, battery_voltage: 3.85, motion_counts: 8 },
  { date: "2024-06-28", temperature: 28.1, humidity: 85, battery_voltage: 3.90, motion_counts: 45 },
  { date: "2024-06-29", temperature: 27.4, humidity: 82, battery_voltage: 3.95, motion_counts: 18 },
  { date: "2024-06-30", temperature: 29.0, humidity: 88, battery_voltage: 4.00, motion_counts: 50 },
];

const chartConfig = {
  temperature: {
    label: "Temperature (°C)",
    color: "hsl(var(--chart-1))",
  },
  humidity: {
    label: "Humidity (%)",
    color: "hsl(var(--chart-2))",
  },
  battery_voltage: {
    label: "Battery (V)",
    color: "hsl(var(--chart-3))",
  },
  motion_counts: {
    label: "Motion",
    color: "hsl(var(--chart-4))",
  },
};

export function ChartArea() {
  const [timeRange, setTimeRange] = React.useState("90d")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Area Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
                <linearGradient id="fillTemperature" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-temperature)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-temperature)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillHumidity" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-humidity)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-humidity)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillBattery_voltage" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-battery_voltage)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-battery_voltage)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillMotion_counts" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-motion_counts)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-motion_counts)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="temperature"
              type="natural"
              fill="url(#fillTemperature)"
              stroke="var(--color-temperature)"
              stackId="a"
            />
            <Area
              dataKey="humidity"
              type="natural"
              fill="url(#fillHumidity)"
              stroke="var(--color-humidity)"
              stackId="a"
            />
            <Area
              dataKey="battery_voltage"
              type="natural"
              fill="url(#fillBattery_voltage)"
              stroke="var(--color-battery_voltage)"
              stackId="a"
            />
            <Area
              dataKey="motion_counts"
              type="natural"
              fill="url(#fillMotion_counts)"
              stroke="var(--color-motion_counts)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

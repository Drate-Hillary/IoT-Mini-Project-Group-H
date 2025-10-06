"use client";

import { BatteryFull } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// 1. chartData updated for battery voltage
const chartData = [
  { day: "Monday", voltage: 4.1 },
  { day: "Tuesday", voltage: 4.0 },
  { day: "Wednesday", voltage: 3.8 },
  { day: "Thursday", voltage: 3.9 },
  { day: "Friday", voltage: 3.7 },
  { day: "Saturday", voltage: 4.2 },
  { day: "Sunday", voltage: 4.1 },
];

// 2. chartConfig updated for battery voltage
const chartConfig = {
  voltage: {
    label: "Voltage (V)",
    color: "hsl(var(--chart-3))", // Using a different color
  },
};

export function BatteryVoltageChartBar() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row gap-1 items-center">
          <BatteryFull className="h-8 w-8" />
          Battery Voltage
        </CardTitle>
        <CardDescription>Average voltage: 3.97V</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day" // Updated dataKey
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey="voltage" // Updated dataKey
              fill="var(--color-voltage)"
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

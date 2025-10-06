"use client";

import { Thermometer } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { AiOutlineArrowUp } from "react-icons/ai";
import { BsThermometerSun } from "react-icons/bs";

// 1. chartData updated for temperature
const chartData = [
  { metric: "temperature", value: 25.4, fill: "var(--color-temperature)" },
];

// 2. chartConfig updated for temperature
const chartConfig = {
  value: {
    label: "Temperature",
  },
  temperature: {
    label: "Temperature",
    color: "hsl(var(--chart-emerald))",
  },
};

export function TemperatureChartRadial() {
  return (
    <Card className="flex flex-col bg-muted/40">
      <CardHeader className="items-center pb-0">
        <CardTitle>
          <div className="flex flex-row gap-1 items-center">
            <BsThermometerSun className="h-6 w-6 text-emerald-800" />
            Temperature
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            innerRadius={80}
            outerRadius={130}
            startAngle={90}
            endAngle={450}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            {/* 4. RadialBar dataKey updated */}
            <RadialBar dataKey="value" background cornerRadius={10} />
            <PolarRadiusAxis
              tick={false}
              tickLine={false}
              axisLine={false}
              domain={[0, 40]} // Set a realistic temperature range (0°C to 40°C)
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {/* 5. Center label updated for temperature */}
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {chartData[0].value.toLocaleString()}°C
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          5.4% <AiOutlineArrowUp className="" />
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

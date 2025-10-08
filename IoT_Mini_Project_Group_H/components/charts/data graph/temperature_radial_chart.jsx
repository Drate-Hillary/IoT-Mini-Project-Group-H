"use client";

import { useState, useEffect } from "react";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BsThermometerSun } from "react-icons/bs";

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
  const [weatherData, setWeatherData] = useState({ temp: 25, location: "Loading..." });

  useEffect(() => {
    fetch('/api/weather')
      .then(res => res.json())
      .then(data => setWeatherData({ temp: data.temp, location: data.location }))
      .catch(err => console.error(err));
  }, []);

  const getTemperatureColor = (temp) => {
    if (temp < 10) return "hsl(200, 80%, 50%)"; // Cold - Blue
    if (temp < 20) return "hsl(180, 70%, 50%)"; // Cool - Cyan
    if (temp < 25) return "hsl(120, 60%, 50%)"; // Mild - Green
    if (temp < 30) return "hsl(45, 90%, 55%)";  // Warm - Yellow
    if (temp < 35) return "hsl(25, 90%, 55%)";  // Hot - Orange
    return "hsl(0, 80%, 50%)";                  // Very Hot - Red
  };

  const chartData = [
    { metric: "temperature", value: weatherData.temp, fill: getTemperatureColor(weatherData.temp) },
  ];
  return (
    <Card className="flex flex-col bg-muted/40">
      <CardHeader className="items-center pb-0">
        <CardTitle>
          <div className="flex flex-row gap-1 items-center">
            <BsThermometerSun className="h-6 w-6 text-emerald-800" />
            Current Temperature
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
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {chartData[0].value?.toFixed(1) || '0.0'}°C
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          {weatherData.location}
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

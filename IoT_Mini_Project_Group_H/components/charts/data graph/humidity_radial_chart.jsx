"use client";

import { useState, useEffect } from "react";
import { Droplets } from "lucide-react";
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

const chartConfig = {
  value: {
    label: "Humidity",
  },
  humidity: {
    label: "Humidity",
    color: "hsl(var(--chart-2))",
  },
};

export function HumidityChartRadial() {
  const [weatherData, setWeatherData] = useState({ humidity: 68, location: "Loading..." });

  useEffect(() => {
    fetch('/api/weather')
      .then(res => res.json())
      .then(data => setWeatherData({ humidity: data.humidity, location: data.location }))
      .catch(err => console.error(err));
  }, []);

  const chartData = [
    { metric: "humidity", value: weatherData.humidity, fill: "var(--color-humidity)" },
  ];
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle className="flex flex-row items-center gap-1">
          <Droplets className="h-6 w-6" />
          Current Humidity
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
              domain={[0, 100]} // Set the scale from 0% to 100%
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
                        {/* 5. Center label updated for humidity */}
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {chartData[0].value?.toFixed(0) || '0'}%
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

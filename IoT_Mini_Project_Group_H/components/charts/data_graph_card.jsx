import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TemperatureChartRadial } from './data graph/temperature_radial_chart'
import { HumidityChartRadial } from './data graph/humidity_radial_chart'
import { TiWeatherPartlySunny } from "react-icons/ti";
import { Separator } from '@/components/ui/separator'

export const metadata = {
  title: "Outdoor Weather Conditions",
  description: "Have a View of Your Outside Weather Conditions",
}

export const DataGraphCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <TiWeatherPartlySunny className='mr-2 inline-block size-5' />
          {metadata.title}
        </CardTitle>
        <CardDescription>
          {metadata.description}
        </CardDescription>
      </CardHeader>
      <Separator className='mb-4' />
      <CardContent>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          <TemperatureChartRadial />
          <HumidityChartRadial />
        </div>
      </CardContent>
    </Card>
  )
}
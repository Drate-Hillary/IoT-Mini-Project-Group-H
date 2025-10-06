import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TemperatureChartRadial } from './data graph/temperature_radial_chart'
import { HumidityChartRadial } from './data graph/humidity_radial_chart'
import { BatteryVoltageChartBar } from './data graph/battery_voltage_chart'
import { MotionCountsChartLine } from './data graph/motion_count_chart'
import { TbDeviceAnalytics } from "react-icons/tb";
import { Separator } from '@/components/ui/separator'

export const metadata = {
  title: "Sensor Data Analytics",
  description: "An overview of individual sensor metrics and historical trends.",
}

export const DataGraphCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <TbDeviceAnalytics className='mr-2 inline-block size-5' />
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
          <BatteryVoltageChartBar />
          <MotionCountsChartLine />
        </div>
      </CardContent>
    </Card>
  )
}
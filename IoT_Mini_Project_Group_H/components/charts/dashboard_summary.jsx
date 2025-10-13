'use client'

import React, { useState, useEffect } from 'react';
import SummaryCard from "@/components/charts/data graph/summary_card"; 
import { IoThermometerOutline, IoWalkOutline } from 'react-icons/io5';
import { TfiDashboard } from 'react-icons/tfi';
import { GiBattery50 } from 'react-icons/gi';
import { BatteryVoltageChartRadialStacked } from './data graph/battery_voltage_chart';

export const DashboardSummary = () => {
  const [averageData, setAverageData] = useState({
    average_temperature: 0,
    average_humidity: 0,
    average_battery: 0,
    average_motion: 0,
  })

  useEffect(() => {
    fetch('/api/average-data')
      .then(res => res.json())
      .then(data => setAverageData(data))
      .catch(err => console.log(err))
  }, [])

  return (
    <div className="grid gap-6 lg:grid-cols-2 mb-4">
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-2">
        <SummaryCard
          title="Temperature"
          value={averageData.average_temperature}
          unit="°C"
          icon={<IoThermometerOutline className="h-8 w-8 text-muted-foreground" />}
        />
        <SummaryCard
          title="Humidity"
          value={averageData.average_humidity}
          unit="%"
          icon={<TfiDashboard className="h-8 w-8 text-muted-foreground" />}
        />
        <SummaryCard
          title="Battery Voltage"
          value={averageData.average_battery}
          unit="V"
          icon={<GiBattery50 className="h-8 w-8 text-muted-foreground" />}
        />
        <SummaryCard
          title="Motion Counts"
          value={averageData.average_motion}
          unit=""
          icon={<IoWalkOutline className="h-8 w-8 text-muted-foreground" />}
        />
      </div>

      <div>
        <BatteryVoltageChartRadialStacked />
      </div>
    </div>
  );
};
'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { VscLoading } from 'react-icons/vsc';
import SensorCard from "@/components/charts/incoming_sensor_datasets_card"
import { ChartArea } from "@/components/charts/sensor_charts"
import { DataGraphCard } from "@/components/charts/data_graph_card"
import { DashboardSummary } from '@/components/charts/dashboard_summary';

export default function Home() {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true); // Start in loading state
  const [error, setError] = useState(null);

  // Encapsulate the fetching logic into a reusable function
  const fetchData = async () => {
    setLoading(true); // Set loading true on each fetch
    setError(null);   // Clear previous errors
    try {
      const res = await fetch('/api/sensor-data');
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await res.json();
      setSensorData(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load sensor data. Please try again.');
    } finally {
      setLoading(false); // Stop loading regardless of outcome
    }
  };

  // Fetch data on initial component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Display a loading indicator while fetching
  if (loading && !sensorData) {
    return (
      <div className="container mx-auto flex h-screen items-center justify-center text-xl">
        <VscLoading className="mr-2 h-6 w-6 animate-spin" />
        Loading sensor data...
      </div>
    );
  }

  // Display an error message if the fetch fails
  if (error) {
    return (
      <div className="container mx-auto flex h-screen flex-col items-center justify-center text-red-500">
        <p className="text-xl">{error}</p>
        <Button onClick={fetchData} className="mt-4">Try Again</Button>
      </div>
    );
  }
  
  return (
    <main className="container mx-auto py-24 sm:py-12 md:py-24 lg:py-28">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <DashboardSummary />
          <ChartArea />
        </div>

        <SensorCard />
        <DataGraphCard />
      </div>
    </main>
  )
}
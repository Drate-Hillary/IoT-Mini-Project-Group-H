"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SummaryCard from "./charts/data graph/summary_card"
import { MdBatchPrediction } from "react-icons/md";
import { TbSum } from "react-icons/tb";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { IoImagesOutline, IoPlayOutline } from "react-icons/io5"
import { Separator } from "./ui/separator"
import { toast } from "sonner"
import { TiInfoLargeOutline } from "react-icons/ti"
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { BsFileEarmarkPdf, BsFiletypeCsv } from "react-icons/bs"

const chartConfig = {
  actual: { label: "Actual", color: "hsl(var(--chart-actual))" },
  predicted: { label: "Predicted", color: "hsl(var(--chart-predicted))" },
  trainMean: { label: "Train Mean", color: "hsl(var(--chart-3))" },
}

export function TemperaturePredictor() {
  const [metrics, setMetrics] = useState({ data_mean: 0, data_std: 0, temp_min: 0, temp_max: 0, total_samples: 0, test_rmse: 0, test_mae: 0, test_r2: 0, train_mean: 0, predicted_next_temp: 0 })
  
  const getPredictionQuality = (r2) => {
    if (r2 > 0.95) return { label: 'Excellent Prediction', color: 'bg-emerald-900 hover:bg-emerald-950', icon: IoCheckmarkDoneCircleOutline }
    if (r2 > 0.85) return { label: 'Good Prediction', color: 'bg-blue-900 hover:bg-blue-950', icon: IoCheckmarkDoneCircleOutline }
    if (r2 > 0.4) return { label: 'Moderate Prediction', color: 'bg-yellow-900 hover:bg-yellow-950', icon: IoIosCheckmarkCircleOutline }
    if (r2 > 0.2) return { label: 'Weak Prediction', color: 'bg-orange-900 hover:bg-orange-950', icon: IoIosCheckmarkCircleOutline }
    if (r2 > 0) return { label: 'Very Weak Prediction', color: 'bg-red-900/40 hover:bg-red-900/80 border-red-600 text-red-400', icon: IoIosCheckmarkCircleOutline }
    return { label: 'Poor Prediction', color: 'bg-red-900/40 hover:bg-red-900/80 border-red-600 text-red-400', icon: IoIosCheckmarkCircleOutline }
  }
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [chartData, setChartData] = useState([])

  const fetchData = async () => {
    try {

      // Fetch prediction results
      const predResponse = await fetch('/api/predict-temperature')
      const predData = await predResponse.json()
      
      if (predData && predData.test_data) {
        setChartData(predData.test_data.slice(-50))
        if (predData.metrics) {
          setMetrics({
            data_mean: predData.metrics.data_mean || 0,
            data_std: predData.metrics.data_std || 0,
            total_samples: predData.metrics.total_samples || 0,
            temp_min: predData.metrics.temp_min || 0,
            temp_max: predData.metrics.temp_max || 0,
            test_rmse: predData.metrics.test_rmse || 0,
            test_mae: predData.metrics.test_mae || 0,
            test_r2: predData.metrics.test_r2 || 0,
            train_mean: predData.metrics.train_mean || 0,
            predicted_next_temp: predData.metrics.next_prediction?.predicted_temp || 0
          })
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const runPrediction = async () => {
    setRunning(true)
    toast.loading('Running prediction model...')
    try {
      const response = await fetch('/api/run-prediction', { method: 'POST' })
      const result = await response.json()
      
      if (result.success) {
        await fetchData()
        toast.success('Prediction completed successfully!')
      } else {
        console.error('Prediction failed:', result.error)
        console.error('Details:', result.details)
        toast.error(`Prediction failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Error running prediction:', error)
      toast.error('Error running prediction. Check console for details.')
    } finally {
      setRunning(false)
      toast.dismiss()
    }
  }

  const downloadPNG = () => {
    const link = document.createElement('a')
    link.href = '/api/download-forecast-image'
    link.download = 'temperature_forecast.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Image downloaded successfully!')
  }

  const downloadPDF = () => {
    const link = document.createElement('a')
    link.href = '/api/download-prediction-report'
    link.download = 'temperature_prediction_report.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('PDF downloaded successfully!')
  }

  useEffect(() => {
    const loadData = async () => {
      await fetchData()
    }
    loadData()
  }, [])

  return (
    <div>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-4">
        <SummaryCard 
          title="Total Samples"
          value={loading ? "..." : metrics.total_samples.toString()}
          unit=" samples"
          icon={<TbSum className="h-8 w-8 text-muted-foreground" />}
        />
        <SummaryCard
          title="Temperature Range"
          value={loading ? "..." : `${metrics.temp_min.toFixed(1)} - ${metrics.temp_max.toFixed(2)}`}
          unit=" °C"
          icon={<MdBatchPrediction className="h-8 w-8 text-muted-foreground" />}
        />
        <SummaryCard
          title="Temperature Mean"
          value={loading ? "..." : metrics.data_mean.toFixed(2)}
          unit=" °C"
          icon={<TbSum className="h-8 w-8 text-muted-foreground" />}
        />
        <SummaryCard
          title="Standard Deviation"
          value={loading ? "..." : metrics.data_std.toFixed(2)}
          unit=" °C"
          icon={<TbSum className="h-8 w-8 text-muted-foreground" />}
        />
      </div>

      <div className={`grid grid-cols-1 gap-6 ${chartData.length > 0 ? 'lg:grid-cols-3' : ''}`}>
        <Card className={chartData.length > 0 ? "lg:col-span-2 shadow-lg" : "shadow-lg"}>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg sm:text-xl">Temperature Prediction Graph</CardTitle>
              <CardDescription className="text-sm">Actual vs Predicted Temperature with Train Mean</CardDescription>
            </div>
            <Button 
              variant="outline" 
              className="bg-emerald-900 hover:bg-emerald-950 border text-white hover:text-white border-emerald-600 w-full sm:w-auto"
              onClick={runPrediction}
              disabled={running}
            >
              <IoPlayOutline className="mr-1" />
              {running ? 'Running...' : 'Run Prediction'}
            </Button>
          </CardHeader>
          <Separator />
          <CardContent>
            {loading ? (
              <div className="flex h-[300px] items-center justify-center">Loading...</div>
            ) : chartData.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center">No prediction data available!</div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px] md:h-[350px] w-full">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="index" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <defs>
                    <linearGradient id="fillActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="10%" stopColor="var(--color-actual)" stopOpacity={0.8} />
                      <stop offset="90%" stopColor="var(--color-actual)" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="fillPredicted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="10%" stopColor="var(--color-predicted)" stopOpacity={0.8} />
                      <stop offset="90%" stopColor="var(--color-predicted)" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="trainMean" stroke="var(--color-trainMean)" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                  <Area type="monotone" dataKey="actual" stroke="var(--color-actual)" strokeWidth={2} fill="url(#fillActual)" fillOpacity={0.4} />
                  <Area type="monotone" dataKey="predicted" stroke="var(--color-predicted)" strokeWidth={2} fill="url(#fillPredicted)" fillOpacity={0.4} />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {chartData.length > 0 && (
        <Card className="bg-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-1 text-base">
              <TiInfoLargeOutline className="size-5"/>
              More Info
            </CardTitle>
            <CardDescription>
              Read more about your temperature prediction.
            </CardDescription>
          </CardHeader>
          <Separator className="mb-4" />
          <CardContent>
            {(() => {
              const quality = getPredictionQuality(metrics.test_r2)
              const Icon = quality.icon
              return (
                <Badge className={`${quality.color} border cursor-pointer h-6 items-center gap-1 mb-4`}>
                  <Icon className="size-4" />
                  {quality.label}
                </Badge>
              )
            })()}
            <Badge className="h-8 mb-4 text-xs sm:text-sm">
              Predicted Temperature: {loading ? "..." : `${metrics.predicted_next_temp?.toFixed(2) || '0.0000'}°C`}
            </Badge>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-4">
                <div>
                  <Label htmlFor="train_mean" className="text-sm font-medium">Train Mean:</Label>
                  <Input id="train_mean" disabled value={loading ? "..." : `${metrics.train_mean?.toFixed(4) || '0.0000'}°C`} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="test_mae" className="text-sm font-medium">Test MAE:</Label>
                  <Input id="test_mae" disabled value={loading ? "..." : `${metrics.test_mae?.toFixed(4) || '0.0000'}°C`} className="mt-1" />
                </div>
              </div>
              
              <Separator orientation="vertical" className="hidden sm:block h-auto" />
              <Separator className="sm:hidden" />
              
              <div className="flex-1 space-y-4">
                <div>
                  <Label htmlFor="test_rmse" className="text-sm font-medium">Test RMSE:</Label>
                  <Input id="test_rmse" disabled value={loading ? "..." : `${metrics.test_rmse?.toFixed(4) || '0.0000'}°C`} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="test_r2" className="text-sm font-medium">Test R²:</Label>
                  <Input id="test_r2" disabled value={loading ? "..." : metrics.test_r2?.toFixed(4) || '0.0000'} className="mt-1" />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 sm:justify-between mt-4">
              <Button onClick={downloadPDF} variant="outline" className="border border-neutral-800 cursor-pointer w-full sm:w-auto">
                <BsFileEarmarkPdf className="mr-2" />
                Download PDF
              </Button>
              <Button onClick={downloadPNG} className="bg-emerald-900 hover:bg-emerald-800 text-white cursor-pointer w-full sm:w-auto">
                <IoImagesOutline className="mr-2" />
                Download PNG
              </Button>
            </div>
          </CardContent>
        </Card>
        )}
      </div>
    </div>
  )
}

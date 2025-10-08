"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { TbCloudDataConnection } from "react-icons/tb";
import { IoCalendarOutline, IoCloudDownloadOutline } from "react-icons/io5";

const formatDate = (date) => {
  if (!date) return null;
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const SensorCard = () => {
  const [sensorReadings, setSensorReadings] = useState([]);
  const [pageSize, setPageSize] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  useEffect(() => {
    const fetchData = () => {
      fetch('/api/supabase-data')
        .then(res => res.json())
        .then(data => setSensorReadings(data))
        .catch(err => console.log(err))
    }
    
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, []);

  const totalPages = Math.ceil(sensorReadings.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentReadings = sensorReadings.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  
  const handlePageSizeChange = (value) => {
    setPageSize(value === 'All' ? sensorReadings.length : Number(value));
    setCurrentPage(1);
  };

  const handleDownloadCSV = () => {
    let filteredData = sensorReadings;
    
    if (startDate || endDate) {
      filteredData = sensorReadings.filter(reading => {
        const readingDate = new Date(reading.created_at);
        if (startDate && readingDate < startDate) return false;
        if (endDate && readingDate > endDate) return false;
        return true;
      });
    }
    
    const headers = ['Entry ID', 'Temperature', 'Humidity', 'Motion Count', 'Battery Voltage', 'Timestamp'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(r => 
        `${r.entry_id},${r.temperature},${r.humidity},${r.motion_counts},${r.battery_voltage},${r.timestamp}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sensor_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className="h-[750px] w-full flex flex-col border border-emerald-700/80 shadow-md shadow-emerald-600">
      <CardHeader>
        <CardTitle className="text-xl font-medium flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <TbCloudDataConnection className="mr-2 size-7" />
            Sensor Data Collections
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 cursor-pointer">
                <IoCloudDownloadOutline className="mr-2 size-4" />
                Export<span className="hidden sm:inline">&nbsp;CSV File</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Export Sensor Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Select a date range to download as a CSV.
                  </p>
                </div>
                <Separator />
                <div className="grid gap-2">
                  {/* Start Date Picker */}
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="start-date" className="text-right">Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="start-date"
                          variant={"outline"}
                          className={cn(
                            "col-span-2 justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <IoCalendarOutline className="mr-2 h-4 w-4" />
                          {startDate ? formatDate(startDate) : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  {/* End Date Picker */}
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="end-date" className="text-right">End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="end-date"
                          variant={"outline"}
                          className={cn(
                            "col-span-2 justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <IoCalendarOutline className="mr-2 h-4 w-4" />
                          {endDate ? formatDate(endDate) : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <Button
                  onClick={handleDownloadCSV}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                 <IoCloudDownloadOutline className="mr-2 size-4" />
                  Download Data
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          A log of recent real-time sensor readings from connected devices.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="p-6 flex-grow overflow-y-auto">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background">
              <TableRow>
                <TableHead className="w-[120px]">Entry ID</TableHead>
                <TableHead>Temperature</TableHead>
                <TableHead>Humidity</TableHead>
                <TableHead>Motion Count</TableHead>
                <TableHead className="text-right">Battery Voltage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentReadings.map((reading) => (
                <TableRow key={reading.entry_id}>
                  <TableCell className="font-medium">{reading.entry_id}</TableCell>
                  <TableCell>{reading.temperature}°C</TableCell>
                  <TableCell>{reading.humidity}%</TableCell>
                  <TableCell>{reading.motion_counts}</TableCell>
                  <TableCell className="text-right">{reading.battery_voltage}V</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row items-center justify-between border-t pt-4 gap-4">
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <span>Rows per page</span>
          <Select value={`${pageSize}`} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent>
              {[100, 200, 250, 300, 500, 'All'].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>of <strong>{sensorReadings.length}</strong> Entries</span>
          
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SensorCard;


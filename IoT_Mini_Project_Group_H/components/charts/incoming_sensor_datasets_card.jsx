"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LuCloudDownload } from "react-icons/lu";
import { TbCloudDataConnection } from "react-icons/tb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Generating 100 sample data entries
const sensorReadings = Array.from({ length: 100 }, (_, i) => ({
  id: `SEN-${(i + 1).toString().padStart(3, '0')}`,
  temperature: +(23 + Math.random() * 5).toFixed(1),
  humidity: Math.floor(60 + Math.random() * 20),
  motion: Math.floor(Math.random() * 35),
  battery: +(3.8 + Math.random() * 0.4).toFixed(2)
}));

const SensorCard = () => {
  // 1. State for page size and current page
  const [pageSize, setPageSize] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);

  // 2. Calculations are now based on the `pageSize` state
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
    setPageSize(Number(value));
    setCurrentPage(1); // Reset to page 1 when page size changes
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
                <LuCloudDownload className="mr-2 size-4" />
                Export<span className="hidden sm:inline">&nbsp;CSV File</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent>Place content for the popover here.</PopoverContent>
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
                <TableRow key={reading.id}>
                  <TableCell className="font-medium">{reading.id}</TableCell>
                  <TableCell>{reading.temperature}°C</TableCell>
                  <TableCell>{reading.humidity}%</TableCell>
                  <TableCell>{reading.motion}</TableCell>
                  <TableCell className="text-right">{reading.battery}V</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row items-center justify-between border-t pt-4 gap-4">
        {/* 3. Page size selector */}
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <span>Rows per page</span>
          <Select value={`${pageSize}`} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50, 100].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
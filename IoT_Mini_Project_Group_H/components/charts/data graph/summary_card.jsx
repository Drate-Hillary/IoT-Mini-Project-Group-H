import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SummaryCard = ({ title, value, unit, icon }) => {
  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm sm:text-base md:text-lg font-medium">{title}</CardTitle>
        <div className="shrink-0">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-xl sm:text-2xl font-bold break-words">
          {value}{unit}
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
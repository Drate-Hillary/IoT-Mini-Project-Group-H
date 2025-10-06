<AreaChart data={filteredData}>
  {/* START: Updated Gradients */}
  <defs>
    <linearGradient id="fillTemperature" x1="0" y1="0" x2="0" y2="1">
      <stop
        offset="5%"
        stopColor="var(--color-temperature)"
        stopOpacity={0.8}
      />
      <stop
        offset="95%"
        stopColor="var(--color-temperature)"
        stopOpacity={0.1}
      />
    </linearGradient>
    <linearGradient id="fillHumidity" x1="0" y1="0" x2="0" y2="1">
      <stop
        offset="5%"
        stopColor="var(--color-humidity)"
        stopOpacity={0.8}
      />
      <stop
        offset="95%"
        stopColor="var(--color-humidity)"
        stopOpacity={0.1}
      />
    </linearGradient>
    <linearGradient id="fillBattery_voltage" x1="0" y1="0" x2="0" y2="1">
      <stop
        offset="5%"
        stopColor="var(--color-battery_voltage)"
        stopOpacity={0.8}
      />
      <stop
        offset="95%"
        stopColor="var(--color-battery_voltage)"
        stopOpacity={0.1}
      />
    </linearGradient>
    <linearGradient id="fillMotion_counts" x1="0" y1="0" x2="0" y2="1">
      <stop
        offset="5%"
        stopColor="var(--color-motion_counts)"
        stopOpacity={0.8}
      />
      <stop
        offset="95%"
        stopColor="var(--color-motion_counts)"
        stopOpacity={0.1}
      />
    </linearGradient>
  </defs>
  {/* END: Updated Gradients */}

  <CartesianGrid vertical={false} />
  <XAxis
    dataKey="date"
    // ... other props remain the same
  />
  <ChartTooltip
    cursor={false}
    content={<ChartTooltipContent indicator="dot" />}
  />

  {/* START: Updated Area components */}
  <Area
    dataKey="temperature"
    type="natural"
    fill="url(#fillTemperature)"
    stroke="var(--color-temperature)"
    stackId="a"
  />
  <Area
    dataKey="humidity"
    type="natural"
    fill="url(#fillHumidity)"
    stroke="var(--color-humidity)"
    stackId="a"
  />
  <Area
    dataKey="battery_voltage"
    type="natural"
    fill="url(#fillBattery_voltage)"
    stroke="var(--color-battery_voltage)"
    stackId="a"
  />
  <Area
    dataKey="motion_counts"
    type="natural"
    fill="url(#fillMotion_counts)"
    stroke="var(--color-motion_counts)"
    stackId="a"
  />
  {/* END: Updated Area components */}
  
  <ChartLegend content={<ChartLegendContent />} />
</AreaChart>

export type Metric = {
  value: number;
  metricKey: string;
  createdAt: Date;
};

export type ChartData = {
  value: number;
  metricKey: string;
  createdAt: string;
};

declare module 'react-native-chart-kit' {
  import { ReactNode } from 'react';
  import { ViewStyle } from 'react-native';

  export interface Dataset {
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }

  export interface ChartData {
    labels: string[];
    datasets: Dataset[];
  }

  export interface ChartConfig {
    backgroundColor?: string;
    backgroundGradientFrom?: string;
    backgroundGradientTo?: string;
    color?: (opacity: number) => string;
    strokeWidth?: number;
    barPercentage?: number;
    priceDecimals?: number;
    decimalPlaces?: number;
    style?: ViewStyle;
  }

  export interface LineChartProps {
    data: ChartData;
    width: number;
    height: number;
    chartConfig: ChartConfig;
    bezier?: boolean;
    style?: ViewStyle;
    withDots?: boolean;
    withShadow?: boolean;
    withInnerLines?: boolean;
    withOuterLines?: boolean;
    withHorizontalLabels?: boolean;
    withVerticalLabels?: boolean;
    yAxisLabel?: string;
    yAxisSuffix?: string;
    yLabelsOffset?: number;
    formatYLabel?: (yValue: string) => string;
    segments?: number;
    fromZero?: boolean;
    onDataPointClick?: (data: { value: number; dataset: Dataset; getColor: (opacity: number) => string }) => void;
  }

  export class LineChart extends React.Component<LineChartProps> {}

  export interface BarChartProps {
    data: ChartData;
    width: number;
    height: number;
    chartConfig: ChartConfig;
    style?: ViewStyle;
    withHorizontalLabels?: boolean;
    withVerticalLabels?: boolean;
    segments?: number;
    fromZero?: boolean;
    showBarTops?: boolean;
    showValuesOnTopOfBars?: boolean;
  }

  export class BarChart extends React.Component<BarChartProps> {}

  export interface PieChartProps {
    data: Array<{
      name: string;
      population: number;
      color: string;
      legendFontColor?: string;
      legendFontSize?: number;
    }>;
    width: number;
    height: number;
    chartConfig?: ChartConfig;
    accessor?: string;
    backgroundColor?: string;
    paddingLeft?: string;
    center?: [number, number];
    absolute?: boolean;
    hasLegend?: boolean;
    style?: ViewStyle;
  }

  export class PieChart extends React.Component<PieChartProps> {}

  export interface ProgressChartProps {
    data: number[] | { data: number[] };
    width: number;
    height: number;
    chartConfig: ChartConfig;
    style?: ViewStyle;
    hideLegend?: boolean;
  }

  export class ProgressChart extends React.Component<ProgressChartProps> {}
} 
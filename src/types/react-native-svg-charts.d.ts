declare module 'react-native-svg-charts' {
  import { ViewStyle } from 'react-native';

  interface LineChartProps {
    style?: ViewStyle;
    data: number[];
    svg?: {
      stroke?: string;
      strokeWidth?: number;
    };
    contentInset?: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    };
    animate?: boolean;
  }

  export class LineChart extends React.Component<LineChartProps> {}
} 
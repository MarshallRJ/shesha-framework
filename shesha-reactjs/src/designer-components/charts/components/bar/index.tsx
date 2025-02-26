import {
  BarController, BarElement, CategoryScale,
  Chart as ChartJS, ChartOptions,
  Legend,
  LinearScale, Title, Tooltip
} from 'chart.js';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useChartDataStateContext } from '../../../../providers/chartData';
import { IChartData, IChartDataProps } from '../../model';

interface BarChartProps extends IChartDataProps {
  data: IChartData;
}

ChartJS.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const { axisProperty: xProperty, valueProperty: yProperty, aggregationMethod, showLegend, showTitle, title, legendPosition, showXAxisScale, showXAxisTitle, showYAxisScale, showYAxisTitle, stacked, legendProperty } = useChartDataStateContext();

  const options: ChartOptions<any> = {
    responsive: true,
    plugins: {
      legend: {
        display: showLegend ? true : false,
        position: legendPosition ?? 'top',
      },
      title: {
        display: showTitle ? true : false,
        text: title?.trim() || `${yProperty} vs ${xProperty} (${aggregationMethod})${legendProperty ? `, grouped by ${legendProperty}` : ''}`,
      },
    },
    scales: {
      x: {
        title: {
          display: showXAxisTitle ? true : false,
          text: xProperty,
        },
        display: showXAxisScale ? true : false,
        stacked: stacked,
        offset: true, // Ensure the x-axis does not coincide with the y-axis
        beginAtZero: false
      },
      y: {
        title: {
          display: showYAxisTitle ? true : false,
          text: `${yProperty} (${aggregationMethod})`,
        },
        display: showYAxisScale ? true : false,
        stacked: stacked,
      }
    }
  };

  return <Bar data={data as any} options={options} />;
};

export default BarChart;

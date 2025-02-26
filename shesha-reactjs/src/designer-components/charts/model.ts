import { IConfigurableFormComponent } from "@/providers";

/**
 * Chart data that will go into the actual chart component from ChartJS
 */
export interface IChartData {
    labels: (string | number | object)[];
    datasets: object[];
}
/**
 * Chart props, used in the chart component and some of its children
 */
export interface IChartsProps {
    dataMode?: TDataMode;
    url?: string;
    chartType?: TChartType;
    showTitle?: boolean;
    title?: string;
    name?: string;
    description?: string;
    showLegend?: boolean;
    legendPosition?: TLegendPosition;
    entityType?: string;
    filters?: string[];
    valueProperty?: string;
    axisProperty?: string;
    isAxisTimeSeries?: boolean;
    timeSeriesFormat?: TTimeSeriesFormat;
    legendProperty?: string;
    allowFilter?: boolean;
    filterProperties?: string[];
    xProperty?: string;
    yProperty?: string;
    tension?: number;
    strokeColor?: string;
    simpleOrPivot?: 'simple' | 'pivot';
    showName?: boolean;
    showDescription?: boolean;
    showXAxisScale?: boolean;
    showXAxisTitle?: boolean;
    showYAxisScale?: boolean;
    showYAxisTitle?: boolean;
    stacked?: boolean;
    aggregationMethod?: TAggregationMethod;
}

/**
 * Chart props, used in the Shesha tool box
 */
export interface IChartProps extends IConfigurableFormComponent, IChartsProps { }

export interface IChartDataProps extends IChartsProps {
    labels?: string[];
    chartData?: number[];
    data?: IChartData;
}

export type TDataMode = 'url' | 'entityType';

export type TChartType = 'polarArea' | 'bar' | 'line' | 'pie';

export type TAggregationMethod = 'count' | 'sum' | 'average' | 'min' | 'max';

export type TLegendPosition = 'top' | 'bottom' | 'left' | 'right';

export type TTimeSeriesFormat = 'day' | 'month' | 'year' | 'day-month' | 'day-month-year' | 'month-year';

/**
 * To be used in the filter component
 */
export type TOperator =
    'equals' |
    'not_equals' |
    'contains' |
    'does_not_contain' |
    'is_empty' |
    'is_not_empty' |
    'is_greater_than' |
    'is_less_than' |
    'is_greater_than_or_equals' |
    'is_less_than_or_equals' |
    'starts_with' |
    'ends_with' |
    'is' |
    'is_not';

export interface IFilter {
    property: string;
    operator: TOperator;
    value: string | number;
}
import { useGet } from '@/hooks';
import { useFormData, useMetadataDispatcher, useNestedPropertyMetadatAccessor } from '@/index';
import { IRefListPropertyMetadata } from '@/interfaces/metadata';
import { useFormEvaluatedFilter } from '@/providers/dataTable/filters/evaluateFilter';
import { useReferenceListDispatcher } from '@/providers/referenceListDispatcher';
import { toCamelCase } from '@/utils/string';
import { LoadingOutlined } from '@ant-design/icons';
import { Alert, Button, Flex, Result, Spin } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { useChartDataActionsContext, useChartDataStateContext } from '../../providers/chartData';
import BarChart from './components/bar';
import FilterComponent from './components/filterComponent';
import LineChart from './components/line';
import PieChart from './components/pie';
import PolarAreaChart from './components/polarArea';
import { IChartData, IChartsProps } from './model';
import useStyles from './styles';
import { applyFilters, formatDate, getAllProperties, getChartDataRefetchParams, prepareBarChartData, prepareLineChartData, preparePieChartData, preparePivotChartData, preparePolarAreaChartData } from './utils';

const ChartControl: React.FC<IChartsProps> = (props) => {
  const { chartType, entityType, valueProperty, filters, legendProperty, aggregationMethod,
    axisProperty, showLegend, showTitle, title, legendPosition, showXAxisScale, showXAxisTitle,
    showYAxisScale, showYAxisTitle, simpleOrPivot, filterProperties, stacked, tension, strokeColor,
    allowFilter, isAxisTimeSeries, timeSeriesFormat
  } = props;
  const { refetch } = useGet({ path: '', lazy: true });
  const state = useChartDataStateContext();
  const { getMetadata } = useMetadataDispatcher();
  const { getReferenceList } = useReferenceListDispatcher();
  const { setData, setIsFilterVisible, setIsLoaded, setFilterdData, setChartFilters, setControlProps } = useChartDataActionsContext();
  const { data: formData } = useFormData();

  const { styles, cx } = useStyles();

  useEffect(() => {
    setControlProps({
      valueProperty, legendProperty, aggregationMethod,
      axisProperty, showLegend, showTitle, title, legendPosition,
      showXAxisScale, showXAxisTitle, showYAxisScale, showYAxisTitle,
      simpleOrPivot, filterProperties, stacked, tension, strokeColor,
      allowFilter, isAxisTimeSeries, timeSeriesFormat
    });
  }, [valueProperty, legendProperty, aggregationMethod,
    axisProperty, showLegend, showTitle, title, legendPosition,
    showXAxisScale, showXAxisTitle, showYAxisScale, showYAxisTitle,
    simpleOrPivot, filterProperties, stacked, tension, strokeColor,
    allowFilter, isAxisTimeSeries, timeSeriesFormat, filters, formData]);

  const memoFilters = useMemo(() => filters, [filters, formData]);

  const propertyMetadataAccessor = useNestedPropertyMetadatAccessor(entityType);
  const evaluatedFilters = useFormEvaluatedFilter({ filter: memoFilters, metadataAccessor: propertyMetadataAccessor });
  useEffect(() => {
    refetch(getChartDataRefetchParams(entityType, valueProperty, evaluatedFilters, legendProperty, axisProperty, filterProperties))
      .then((data) => {
        if (isAxisTimeSeries) {
          data.result.items = data?.result?.items?.sort((a: { [key: string]: any }, b: { [key: string]: any }) => new Date(a[axisProperty]).getTime() - new Date(b[axisProperty]).getTime());
        } else {
          data.result.items = data?.result?.items?.sort((a: { [key: string]: any }, b: { [key: string]: any }) => a[axisProperty] - b[axisProperty]);
        }
        return data;
      })
      .then((data) => {
        data.result.items = formatDate(data.result.items, timeSeriesFormat, [axisProperty]);
        return data;
      })
      .then((data) => {
        getMetadata({ modelType: entityType, dataType: 'entity' }).then((metaData) => {
          for (const metaItem of metaData.properties as Array<IRefListPropertyMetadata>) {
            if (metaItem.dataType === 'reference-list-item') {
              let fieldName = toCamelCase(metaItem.path); // Field to transform in the data
              const refListName = metaItem.referenceListName; // Reference list name from metadata
              const referenceListModule = metaItem.referenceListModule; // Module from metadata

              // Fetch the reference list values for this field
              getReferenceList({ refListId: { module: referenceListModule, name: refListName } }).promise.then((refListItem) => {
                setData(data.result?.items.map(item => {
                  if (item[`${fieldName}`] !== undefined) {
                    // Replace the numeric value with the corresponding reference list name
                    const referenceName = refListItem.items.find((x) => x.itemValue === item[`${fieldName}`])?.item; // Lookup by number

                    item[`${fieldName}`] = referenceName || item[`${fieldName}`]; // Fallback to original value if not found
                  }
                  return item;
                }));
              }).catch((err: any) => console.error('getReferenceList, err metadata', err));
            }
          }
        });
      })
      .then(() => setIsLoaded(true))
      .catch((err: any) => console.error('getChartDataRefetchParams, err data', err));
  }, [chartType, entityType, valueProperty, memoFilters, legendProperty, axisProperty, filterProperties, isAxisTimeSeries,
    timeSeriesFormat, aggregationMethod, showTitle, showLegend, legendPosition, showXAxisScale, showXAxisTitle,
    showYAxisScale, showYAxisTitle, stacked, tension, strokeColor, formData, evaluatedFilters]);

  useEffect(() => {
    if (state.data) {
      setFilterdData(state.data);
    }
  }, [state.data, tension]);

  if (!entityType || !chartType || !valueProperty || !axisProperty) {
    // Collect the missing properties in an array
    const missingProperties: string[] = [];
    if (!entityType) missingProperties.push("'entityType'");
    if (!chartType) missingProperties.push("'chartType'");
    if (!valueProperty) missingProperties.push("'valueProperty'");
    if (!axisProperty) missingProperties.push("'axisProperty'");

    // Dynamically build the description
    const descriptionMessage = `Please make sure that you've specified the following properties: ${missingProperties.join(', ')}.`;

    return (
      <Alert
        showIcon
        message="Chart control properties not set correctly!"
        description={descriptionMessage} // Dynamically constructed description
        type="warning"
      />
    );
  }

  const toggleFilterVisibility = () => {
    setIsFilterVisible(!state.isFilterVisible);
  };

  const resetFilter = () => {
    setChartFilters([]);
    setFilterdData(state.data);
  };

  const onFilter = () => {
    const afterFilterData = applyFilters(state.data, state.chartFilters);
    setFilterdData(afterFilterData);
  };

  let data: IChartData;

  if (!state.isLoaded) {
    return (
      <Flex align="center" justify='center'>
        <Spin indicator={<LoadingOutlined className={cx(styles.chartControlSpinFontSize)} spin />} />
      </Flex>
    );
  }

  return (
    <div className={cx(styles.chartControlContainer)}>
      {allowFilter && (
        <>
          <Flex justify='start' align='center' className={cx(styles.chartControlButtonContainer)}>
            <Button size='small' onClick={toggleFilterVisibility}>
              {state.isFilterVisible ? 'Hide Filter' : 'Show Filter'}
            </Button>
            <Button size='small' onClick={resetFilter}>
              Reset Filter
            </Button>
          </Flex>
          <FilterComponent
            filters={state.chartFilters}
            setFilters={setChartFilters}
            properties={filterProperties?.length > 0 ? filterProperties : getAllProperties(state.filteredData)}
            isVisible={state.isFilterVisible}
            onClose={toggleFilterVisibility}
            onFilter={onFilter}
            resetFilter={resetFilter}
          />
        </>
      )}
      {
        (() => {
          switch (chartType) {
            case 'line':
              data = simpleOrPivot === 'simple'
                ? prepareLineChartData(state.filteredData, axisProperty, valueProperty, strokeColor, aggregationMethod)
                : preparePivotChartData(state.filteredData, axisProperty, legendProperty, valueProperty, strokeColor, aggregationMethod, chartType);
              return <LineChart data={data} />;
            case 'bar':
              data = simpleOrPivot === 'simple'
                ? prepareBarChartData(state.filteredData, axisProperty, valueProperty, strokeColor, aggregationMethod)
                : preparePivotChartData(state.filteredData, axisProperty, legendProperty, valueProperty, strokeColor, aggregationMethod, chartType);
              return <BarChart data={data} />;
            case 'pie':
              data = simpleOrPivot === 'simple'
                ? preparePieChartData(state.filteredData, axisProperty, valueProperty, strokeColor, aggregationMethod)
                : preparePivotChartData(state.filteredData, axisProperty, legendProperty, valueProperty, strokeColor, aggregationMethod, chartType);
              return <PieChart data={data} />;
            case 'polarArea':
              data = simpleOrPivot === 'simple'
                ? preparePolarAreaChartData(state.filteredData, axisProperty, valueProperty, strokeColor, aggregationMethod)
                : preparePivotChartData(state.filteredData, axisProperty, legendProperty, valueProperty, strokeColor, aggregationMethod, chartType);
              return <PolarAreaChart data={data} />;
            default:
              return <Result status="404" title="404" subTitle="Sorry, please select a chart type." />;
          }
        })()
      }
    </div>
  );
};

export default ChartControl;

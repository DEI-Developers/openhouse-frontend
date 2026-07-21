// @ts-nocheck
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useQuery } from '@tanstack/react-query';
import { getStadistics } from '@services/Stadistics';
import CustomHeader from '@components/UI/CustomHeader';
import Breadcrumb from '@components/Dashboard/Breadcrumb';
import StadisticsFilters from '@components/UI/Filters/StadisticsFilters';
import { useEffect } from 'react';
// @ts-ignore
const Chart = ReactApexChart.default;

const Stadistics = () => {
  const [eventId, setEventId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data, isLoading: isLoadingQuery } = useQuery({
    queryKey: ['statistics', eventId],
    queryFn: () => getStadistics(eventId),
    refetchOnWindowFocus: 'always',
  });

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(isLoadingQuery);
    }, 100);
  }, [eventId, isLoadingQuery]);

  if (isLoading) {
    return (
      <div>
        <CustomHeader title="Inicio" />
        <Breadcrumb pageName="Inicio" />

        <div className="flex justify-between items-center mb-4 mt-1 flex-wrap gap-4">
          <h1 className="text-primary text-3xl font-bold">Inicio</h1>
          <StadisticsFilters onApplyFilters={setEventId} />
        </div>

        <div className="flex justify-center items-center">
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <CustomHeader title="Inicio" />
      <Breadcrumb pageName="Inicio" />

      <div className="flex justify-between items-center mb-4 mt-1 flex-wrap gap-4">
        <h1 className="text-primary text-3xl font-bold">Inicio</h1>
        <StadisticsFilters onApplyFilters={setEventId} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data?.map((item, idx) => {
          const { chartData } = item;
          const { options, height, width, ...restChartData } = chartData || {};
          const { chart: { height: chartHeight, ...restChart } = {}, ...restOptions } = options || {};
          const isPie = restChartData.type === 'pie';
          const finalHeight = isPie ? 300 : 400;
          const mobileHeight = isPie ? 280 : 280; 


          return (
            <div
              key={item.id || idx}
              className={`border shadow-sm bg-white rounded-2xl p-4 w-full ${!isPie ? 'md:col-span-2' : ''}`}
            >
              <h4 className="text-sm text-gray-500 mb-1">{item.title}</h4>
              <p className="font-bold text-3xl mb-4">
                {typeof item.total === 'string'
                  ? item.total.replace(/\s*\+\s*0$/, '')
                  : item.total}
              </p>

              <Chart
                {...restChartData}
                height={finalHeight}
                options={{
                  ...restOptions,
                  chart: {
                    ...restChart,
                    width: '100%',
                    height: finalHeight,   
                    toolbar: { show: false },
                  },
                  legend: {
                    ...restOptions.legend,
                    position: isPie ? 'bottom' : 'top',
                  },
                  responsive: [
                    {
                      breakpoint: 768,
                      options: {
                        chart: { height: mobileHeight },
                        legend: { position: 'bottom', fontSize: '11px' },
                        dataLabels: { style: { fontSize: '9px' } },
                      },
                    },
                  ],
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stadistics;

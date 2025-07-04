// @ts-nocheck
import {useState} from 'react';
import Chart from 'react-apexcharts';
import {useQuery} from '@tanstack/react-query';
import {getStadistics} from '@services/Stadistics';
import CustomHeader from '@components/UI/CustomHeader';
import Breadcrumb from '@components/Dashboard/Breadcrumb';
import StadisticsFilters from '@components/UI/Filters/StadisticsFilters';
import {useEffect} from 'react';

const Stadistics = () => {
  const [eventId, setEventId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {data, isLoading: isLoadingQuery} = useQuery({
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {data?.map((item, idx) => (
          <div
            key={item.id || idx}
            className={`border shadow-sm bg-white rounded-2xl p-4 w-full ${item.customClassName || ''}`}
          >
            <h4 className="text-sm text-gray-500 mb-1">{item.title}</h4>
            <p className="font-bold text-3xl mb-4">{item.total}</p>

            <Chart
              {...item.chartData}
              options={{
                ...item.chartData.options,
                chart: {
                  ...(item.chartData.options?.chart || {}),
                  width: '100%',
                  height: 300,
                  toolbar: {show: false},
                },
                responsive: [
                  {
                    breakpoint: 768,
                    options: {
                      chart: {
                        width: '100%',
                        height: 250,
                      },
                      legend: {
                        position: 'bottom',
                      },
                    },
                  },
                ],
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stadistics;

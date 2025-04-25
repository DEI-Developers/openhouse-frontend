// @ts-nocheck
import {useState} from 'react';
import Chart from 'react-apexcharts';
import {useQuery} from '@tanstack/react-query';
import {getStadistics} from '@services/Stadistics';
import CustomHeader from '@components/UI/CustomHeader';
import Breadcrumb from '@components/Dashboard/Breadcrumb';
import StadisticsFilters from '@components/UI/Filters/StadisticsFilters';

const Stadistics = () => {
  const [eventId, setEventId] = useState(null);
  const {data, isLoading} = useQuery({
    queryKey: ['statistics', eventId],
    queryFn: () => getStadistics(eventId),
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return (
      <div>
        <CustomHeader title="Inicio" />
        <Breadcrumb pageName="Inicio" />

        <div className="flex justify-between items-center mb-4 mt-1">
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

      <div className="flex justify-between items-center mb-4 mt-1">
        <h1 className="text-primary text-3xl font-bold">Inicio</h1>
        <StadisticsFilters onApplyFilters={setEventId} />
      </div>

      <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2">
        {data?.map((item) => (
          <div
            key={item.title}
            className={`border shadow bg-white rounded-2xl p-6 ${item.customClassName}`}
          >
            <h4 className="text-sm text-gray-500">{item.title}</h4>
            <p className="font-bold text-3xl">{item.total}</p>
            <Chart {...item.chartData} />
          </div>
        ))}
      </div>
      <div className="hidden col-span-2" />
    </div>
  );
};

export default Stadistics;

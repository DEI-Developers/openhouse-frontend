// @ts-nocheck
import React from 'react';
import Chart from 'react-apexcharts';
import CustomHeader from '@components/UI/CustomHeader';
import Breadcrumb from '@components/Dashboard/Breadcrumb';

const Stadistics = () => {
  return (
    <div>
      <CustomHeader title="Inicio" />
      <Breadcrumb pageName="Inicio" />

      <div className="flex justify-between items-center mb-4 mt-1">
        <h1 className="text-primary text-3xl font-bold">Inicio</h1>
      </div>

      <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2">
        <div className="border shadow bg-white rounded-2xl p-6">
          <h4 className="text-sm text-gray-500">Personas Inscritas</h4>
          <p className="font-bold text-3xl">280</p>
          <Chart {...chart2Config} />
        </div>
        <div className="border shadow bg-white rounded-2xl p-6">
          <h4 className="text-sm text-gray-500">Acompañados</h4>
          <p className="font-bold text-3xl">280</p>
          <Chart {...chart2Config} />
        </div>
        <div className="border shadow bg-white rounded-2xl p-6">
          <h4 className="text-sm text-gray-500">Como se dio cuenta</h4>
          <p className="font-bold text-3xl">280</p>
          <Chart {...chartConfig} />
        </div>
        <div className="border shadow bg-white rounded-2xl p-6">
          <h4 className="text-sm text-gray-500">Carreras</h4>
          <p className="font-bold text-3xl">280</p>
          <Chart {...chartConfig} />
        </div>
      </div>
    </div>
  );
};

const chartConfig = {
  type: 'pie',
  width: 280,
  height: 280,
  series: [44, 55, 13, 43, 22],
  options: {
    title: {
      show: '',
    },
    dataLabels: {
      enabled: true,
    },
    colors: ['#020617', '#ff8f00', '#00897b', '#1e88e5', '#d81b60'],
    legend: {
      show: false,
    },
  },
};

const chart2Config = {
  type: 'bar',
  height: 240,
  series: [
    {
      name: 'Sales',
      data: [50, 40, 300, 320, 500, 350, 200, 230, 500],
    },
  ],
  options: {
    chart: {
      toolbar: {
        show: false,
      },
    },
    title: {
      show: '',
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['#003C71'],
    plotOptions: {
      bar: {
        columnWidth: '40%',
        borderRadius: 2,
      },
    },
    xaxis: {
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        style: {
          colors: '#616161',
          fontSize: '12px',
          fontFamily: 'inherit',
          fontWeight: 400,
        },
      },
      categories: [
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    },
    yaxis: {
      labels: {
        style: {
          colors: '#616161',
          fontSize: '12px',
          fontFamily: 'inherit',
          fontWeight: 400,
        },
      },
    },
    grid: {
      show: true,
      borderColor: '#dddddd',
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 5,
        right: 20,
      },
    },
    fill: {
      opacity: 0.8,
    },
    tooltip: {
      theme: 'dark',
    },
  },
};

export default Stadistics;

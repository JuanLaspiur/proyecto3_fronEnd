import React, { Component } from "react";
import Chart from "react-apexcharts";

const LineChart = ({ chartOptions }) => {
  return (
    <div className="app">
      <div className="row">
        <div className="mixed-chart">
          <Chart
            options={chartOptions.options}
            series={chartOptions.series}
            type="line"
            width="500"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default LineChart;

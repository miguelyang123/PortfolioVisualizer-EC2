import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  PointElement,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";
import assetsData from "../data/assets.json";

ChartJS.register(
  CategoryScale,
  PointElement,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Chart({ assetList, columns, index, p1Data, p2Data, p3Data }) {
  //ticker change to nameCn

  function assetsToCn(str) {
    let n = "";
    assetsData.every((a) => {
      if (a.ticker === str) {
        n = a.nameCn;
        return false;
      } else {
        return true;
      }
    });
    return n;
  }

  let asset1Labels = [],
    asset2Labels = [],
    asset3Labels = [],
    allocation1Data = [],
    allocation2Data = [],
    allocation3Data = [];
  assetList.forEach((a) => {
    if (a.allocation1 !== "0" && a.allocation1 !== "") {
      asset1Labels.push(assetsToCn(a.ticker));
      allocation1Data.push(a.allocation1);
    }
    if (a.allocation2 !== "0" && a.allocation2 !== "") {
      asset2Labels.push(assetsToCn(a.ticker));
      allocation2Data.push(a.allocation2);
    }
    if (a.allocation3 !== "0" && a.allocation3 !== "") {
      asset3Labels.push(assetsToCn(a.ticker));
      allocation3Data.push(a.allocation3);
    }
  });

  const pie1Data = {
    labels: asset1Labels,
    datasets: [
      {
        data: allocation1Data,
        backgroundColor: [
          "rgba(255, 99, 132)",
          "rgba(54, 162, 235)",
          "rgba(255, 206, 86)",
          "rgba(75, 192, 192)",
          "rgba(153, 102, 255)",
          "rgba(255, 159, 64)",
        ],
        // borderColor: [
        //   "rgba(255, 99, 132, 1)",
        //   "rgba(54, 162, 235, 1)",
        //   "rgba(255, 206, 86, 1)",
        //   "rgba(75, 192, 192, 1)",
        //   "rgba(153, 102, 255, 1)",
        //   "rgba(255, 159, 64, 1)",
        // ],
        borderWidth: 1,
      },
    ],
  };
  const pie2Data = {
    labels: asset2Labels,
    datasets: [
      {
        data: allocation2Data,
        backgroundColor: [
          "rgba(255, 99, 132)",
          "rgba(54, 162, 235)",
          "rgba(255, 206, 86)",
          "rgba(75, 192, 192)",
          "rgba(153, 102, 255)",
          "rgba(255, 159, 64)",
        ],
        borderWidth: 1,
      },
    ],
  };
  const pie3Data = {
    labels: asset3Labels,
    datasets: [
      {
        data: allocation3Data,
        backgroundColor: [
          "rgba(255, 99, 132)",
          "rgba(54, 162, 235)",
          "rgba(255, 206, 86)",
          "rgba(75, 192, 192)",
          "rgba(153, 102, 255)",
          "rgba(255, 159, 64)",
        ],
        borderWidth: 1,
      },
    ],
  };
  function pieOptions(str) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
        },
        title: {
          display: true,
          text: str,
        },
      },
    };
  }

  const lineData = {
    labels: index,
    datasets: [
      {
        label: columns[0],
        data: p1Data,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: columns[1],
        data: p2Data,
        borderColor: "rgb(255, 159, 64)",
        backgroundColor: "rgb(255, 159, 64, 0.5)",
      },
      {
        label: columns[2],
        data: p3Data,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
      },
    },
  };
  // const options = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  // };
  let width = 300,
    height = 400;
  return (
    <div className="container">
      <div>
        {/* <h1>Chart</h1>
      <h2>狀態:{state}</h2> */}
        <div className="row justify-content-center pieChart">
          <div className="col-auto col-md-4 pie1">
            <Pie
              data={pie1Data}
              options={pieOptions("Portfolio #1")}
              width={width}
              height={height}
            />
          </div>
          <div className="col-auto col-md-4 pie2">
            <Pie
              data={pie2Data}
              options={pieOptions("Portfolio #2")}
              width={width}
              height={height}
            />
          </div>
          <div className="col-auto col-md-4 pie3">
            <Pie
              data={pie3Data}
              options={pieOptions("Portfolio #3")}
              width={width}
              height={height}
            />
          </div>
        </div>
        <div className="col-auto lineChart">
          <Line data={lineData} options={options} width={200} height={180} />
        </div>
      </div>
    </div>
  );
}

export default Chart;

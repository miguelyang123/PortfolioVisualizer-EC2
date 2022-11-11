import React, { useState } from "react";
import Myform from "../components/Myform";
import Chart from "../components/Chart";

function body() {
  //將指定日期減去 X 天
  function minusDays(date, days) {
    let res = new Date(date);
    res.setDate(res.getDate() - days);
    return res;
  }
  function toTwoDigits(num) {
    if (num < 10) num = "0" + num;
    return num;
  }
  //今天預設值
  const now = new Date(),
    dayBefore = minusDays(now, 30),
    dayBeforeWeek = minusDays(now, 7);

  const startDate =
      dayBefore.getFullYear() +
      "-" +
      toTwoDigits(dayBefore.getMonth() + 1) +
      "-" +
      toTwoDigits(dayBefore.getDate()),
    endDate =
      now.getFullYear() +
      "-" +
      toTwoDigits(now.getMonth() + 1) +
      "-" +
      toTwoDigits(now.getDate()),
    minDate =
      dayBeforeWeek.getFullYear() +
      "-" +
      toTwoDigits(dayBeforeWeek.getMonth() + 1) +
      "-" +
      toTwoDigits(dayBeforeWeek.getDate());

  //dateList use localStorage
  let localDataList = JSON.parse(localStorage.getItem("dataList"));
  if (localDataList === null) {
    //Default 4 newAssetList
    localDataList = {
      start: startDate,
      end: endDate,
    };
  }
  const [dateList, setDateList] = useState(localDataList);
  //assetList use localStorage
  const defaultAssetList = [
    {
      ticker: "",
      allocation1: "",
      allocation2: "",
      allocation3: "",
    },
    {
      ticker: "",
      allocation1: "",
      allocation2: "",
      allocation3: "",
    },
    {
      ticker: "",
      allocation1: "",
      allocation2: "",
      allocation3: "",
    },
    {
      ticker: "",
      allocation1: "",
      allocation2: "",
      allocation3: "",
    },
  ];
  let localList = JSON.parse(localStorage.getItem("assetList"));
  if (localList === null) {
    //Default 4 newAssetList
    localList = defaultAssetList;
  }
  const [assetList, setAssetList] = useState(localList);

  //API Data
  const [state, setState] = useState("Waiting");
  const [columns, setColumns] = useState([
    "Portfolio #1",
    "Portfolio #2",
    "Portfolio #3",
  ]);
  const [index, setIndex] = useState();
  const [p1Data, setP1Data] = useState([]);
  const [p2Data, setP2Data] = useState([]);
  const [p3Data, setP3Data] = useState([]);

  return (
    <div>
      <Myform
        startDate={startDate}
        endDate={endDate}
        minDate={minDate}
        dateList={dateList}
        setDateList={setDateList}
        defaultAssetList={defaultAssetList}
        assetList={assetList}
        setAssetList={setAssetList}
        setState={setState}
        setColumns={setColumns}
        setIndex={setIndex}
        setP1Data={setP1Data}
        setP2Data={setP2Data}
        setP3Data={setP3Data}
      />
      <br />
      <div id="chart">
        {/* <Chart
          assetList={assetList}
          columns={columns}
          index={index}
          p1Data={p1Data}
          p2Data={p2Data}
          p3Data={p3Data}
        /> */}
        {state === "Loading" && (
          <div className="d-flex justify-content-center" id="loaderBox">
            <div className="loader"></div>
          </div>
        )}
        {state === "OK" && (
          <Chart
            assetList={assetList}
            columns={columns}
            index={index}
            p1Data={p1Data}
            p2Data={p2Data}
            p3Data={p3Data}
          />
        )}
        {state !== "Loading" && state !== "OK" && state !== "Waiting" && (
          <h1 className="d-flex justify-content-center">{state}</h1>
        )}
      </div>
    </div>
  );
}

export default body;

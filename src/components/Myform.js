import React, { useState } from "react";
import { useForm } from "react-hook-form";
import assetsData from "../data/assets.json";
import $ from "jquery";
// import pyodide, { loadPyodide } from "pyodide";
// import script from "../python/script.py";

// await pyodide.loadPackage("numpy");
// pyodide.runPython(`
//   import numpy
//   x=numpy.ones((3, 4))
// `);
// pyodide.globals.get("x").toJs();

// 反向代理 jwt nodejs
//選擇時間 ☑
//圓餅圖
//增加返回頂部

function Myform({
  startDate,
  defaultAssetList,
  endDate,
  minDate,
  dateList,
  setDateList,
  assetList,
  setAssetList,
  setState,
  setResponse,
  setColumns,
  setIndex,
  setP1Data,
  setP2Data,
  setP3Data,
}) {
  // const [output, setOutput] = useState("(loading...)");

  // const runScript = (code) => {
  //   window.pyodide.loadPackage(["bt"]).then(() => {
  //     const output = window.pyodide.runPython(code);
  //     setOutput(output);
  //   });
  // };

  // useEffect(() => {
  //   window.languagePluginLoader.then(() => {
  //     fetch(script)
  //       .then((src) => src.text())
  //       .then(runScript);
  //   });
  // });

  const {
    handleSubmit,
    // register,
    formState: { errors },
  } = useForm();

  const [stateAllocation, setStateAllocation] = useState({
    allocation1: "",
    allocation2: "",
    allocation3: "",
  });

  //Sum Function
  function sumAllocation(a) {
    let sum = 0;
    assetList.forEach((e) => {
      sum += Number(e[a]);
    });
    return sum;
  }

  //assetList Data to JSON format
  function listToJson(data) {
    let jsonData = [
      {
        name: "Portfolio #1",
        assets: [],
      },
      {
        name: "Portfolio #2",
        assets: [],
      },
      {
        name: "Portfolio #3",
        assets: [],
      },
    ];
    let objData = Object.keys(data);
    objData.forEach((e) => {
      let p = 0;
      let aData = data[e].allocation1;
      let assets = {
        ticker: data[e].ticker,
      };
      jsonData[p].assets.push(assets);
      jsonData[p].assets[e].allocation = Number((aData * 0.01).toFixed(2));
    });
    objData.forEach((e) => {
      let p = 1;
      let aData = data[e].allocation2;
      let assets = {
        ticker: data[e].ticker,
      };
      jsonData[p].assets.push(assets);
      jsonData[p].assets[e].allocation = Number((aData * 0.01).toFixed(2));
    });
    objData.forEach((e) => {
      let p = 2;
      let aData = data[e].allocation3;
      let assets = {
        ticker: data[e].ticker,
      };
      jsonData[p].assets.push(assets);
      jsonData[p].assets[e].allocation = Number((aData * 0.01).toFixed(2));
    });
    return jsonData;
  }
  //Use Api Data to Server
  async function dataToServer() {
    setState("Loading");
    let jsonData = [dateList.start, dateList.end, listToJson(assetList)];
    // Form POST
    let URL_API = "/api/courses";
    try {
      const res = await fetch(URL_API, {
        method: "POST",
        body: JSON.stringify(jsonData),
      });
      if (res.ok) {
        if (res.status === 204) {
          setResponse("STATUS CODE: 204");
        } else {
          let resData = await res.json();
          let data = resData.data;
          // setResponse(resData);
          setColumns(resData.columns);
          setIndex(resData.index);
          setP1Data(() => data.map((d) => d[0]));
          setP2Data(() => data.map((d) => d[1]));
          setP3Data(() => data.map((d) => d[2]));
          setState("OK");
        }
        // let resData = await res.json();
        // setState("TEST");
        // console.log(resData);
      } else {
        throw await res.text();
      }
    } catch (err) {
      setState("Response Error!!");
      console.error(err);
      // setResponse(err.toString());
    }
  }

  //Default Required
  function defaultRequired() {
    (sumAllocation("allocation1") === 100 ||
      sumAllocation("allocation1") === 0) &&
      (stateAllocation.allocation1 = "");
    (sumAllocation("allocation2") === 100 ||
      sumAllocation("allocation2") === 0) &&
      (stateAllocation.allocation2 = "");
    (sumAllocation("allocation3") === 100 ||
      sumAllocation("allocation3") === 0) &&
      (stateAllocation.allocation3 = "");
    setStateAllocation(stateAllocation);
  }

  // handleSubmit
  const onSubmit = () => {
    let a1 = sumAllocation("allocation1"),
      a2 = sumAllocation("allocation2"),
      a3 = sumAllocation("allocation3"),
      ifA1 = a1 === 100 || a1 === 0,
      ifA2 = a2 === 100 || a2 === 0,
      ifA3 = a3 === 100 || a3 === 0,
      message = "總和必須是100%或0%";
    //Submit
    if (ifA1 && ifA2 && ifA3) {
      $("html,body").animate({ scrollTop: $("#chart").offset().top }, 10);
      dataToServer();
    }
    //handleRequired
    ifA1
      ? (stateAllocation.allocation1 = "")
      : (stateAllocation.allocation1 = message);
    ifA2
      ? (stateAllocation.allocation2 = "")
      : (stateAllocation.allocation2 = message);
    ifA3
      ? (stateAllocation.allocation3 = "")
      : (stateAllocation.allocation3 = message);
    setStateAllocation(stateAllocation);
  };
  const onError = (e) => {
    setState("Form Submit Error!!");
    console.log(errors, e);
  };

  //add & delet asset

  const newAssetList = {
    ticker: "",
    allocation1: "",
    allocation2: "",
    allocation3: "",
  };
  const handleAssetAdd = () => {
    setAssetList([...assetList, newAssetList]);
    //Save in localStorage
    const list = [...assetList, newAssetList];
    //Save in localStorage
    localStorage.setItem("assetList", JSON.stringify(list));
    defaultRequired();
  };

  const handleAssetRemove = (index) => {
    const list = [...assetList];
    list.splice(index, 1);
    setAssetList(list);
    //Save in localStorage
    localStorage.setItem("assetList", JSON.stringify(list));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    //useState

    let list = { ...dateList };
    list[name] = value;

    setDateList(list);
    //Save in localStorage
    localStorage.setItem("dataList", JSON.stringify(list));
    defaultRequired();
  };

  const handleAssetChange = (e, index) => {
    const { name, value } = e.target;
    // register(e.target.name, { value: e.target.value });
    //useState
    const list = [...assetList];
    list[index][name] = value;
    setAssetList(list);
    //Save in localStorage
    localStorage.setItem("assetList", JSON.stringify(list));
    defaultRequired();
  };

  const handleAssetDefault = () => {
    let r = window.confirm("是否確定清除現在資料並返回預設?");
    if (r === true) {
      setAssetList(defaultAssetList);
      localStorage.clear();
      setDateList({
        start: startDate,
        end: endDate,
      });
      setStateAllocation({
        allocation1: "",
        allocation2: "",
        allocation3: "",
      });
    } else {
      return;
    }
  };

  // const testSubmit = () => {
  //   PythonShell.runString("x=5;print(x)", null, (err, results) => {
  //     if (err) {
  //       console.log("runString ERROR");
  //     } else {
  //       console.log("PythonShell Success!");
  //       console.log(results);
  //     }
  //   });
  // };

  function AssetForm(value, index) {
    // assets.json導入option選項
    let option = assetsData.map((a, k) => {
      return (
        <option key={k} value={a.ticker}>
          {a.nameCn}
        </option>
      );
    });

    //改預設值
    let num = index + 1;

    //是否需要輸入數值 required = "required"
    let required = "";
    return (
      <div key={index} className="row gy-1 gx-md-3">
        <div className="col-md-1">
          <p style={{ whiteSpace: "nowrap" }}>資產{num}</p>
        </div>
        <div className="col-md-4">
          <div className="row">
            <div id="title" className="col-4">
              投資項目
            </div>
            <div className="col input-group">
              <select
                key={value.id}
                // {...register("ticker" + num)}
                name="ticker"
                value={value.ticker}
                onChange={(e) => {
                  handleAssetChange(e, index);
                }}
                className="col form-select myselect"
                aria-label="Default select"
                required
              >
                <option id="option" value="">
                  未選擇
                </option>
                {option}
              </select>
            </div>
          </div>
        </div>
        <div id="allocation" className="col-md-2">
          <div className="row">
            <div id="title" className="col-4">
              <p style={{ margin: 0 }}>Portfolio#1</p>
              <p>總和:{sumAllocation("allocation1")}%</p>
            </div>
            <div className="col">
              <div className="input-group">
                <input
                  key={value.id}
                  // {...register("allocation1-" + num)}
                  name="allocation1"
                  value={value.allocation1}
                  onChange={(e) => {
                    handleAssetChange(e, index);
                  }}
                  type="number"
                  min="0"
                  max="100"
                  className="form-control"
                  id="autoSizingInputGroup"
                  // placeholder="0~100"
                  required={required}
                />
                <div className="input-group-text">%</div>
              </div>
              <input
                name="allocation1"
                value={value.allocation1}
                onChange={(e) => {
                  handleAssetChange(e, index);
                }}
                type="range"
                className="form-range"
                min="0"
                max="100"
                step="5"
              />
              {index === assetList.length - 1 && (
                <div id="adapt">
                  <p style={{ margin: 0 }}>
                    總和:{sumAllocation("allocation1")}%
                  </p>
                  <p style={{ margin: 0, color: "red" }}>
                    {stateAllocation.allocation1}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div id="allocation" className="col-md-2">
          <div className="row">
            <div id="title" className="col-4">
              <p style={{ margin: 0 }}>Portfolio#2</p>
              <p>總和:{sumAllocation("allocation2")}%</p>
            </div>
            <div className="col">
              <div className="input-group">
                <input
                  key={value.id}
                  // {...register("allocation2-" + num)}
                  name="allocation2"
                  value={value.allocation2}
                  onChange={(e) => {
                    handleAssetChange(e, index);
                  }}
                  type="number"
                  min="0"
                  max="100"
                  className="form-control"
                  id="autoSizingInputGroup"
                  // placeholder="0~100"
                  required={required}
                />
                <div className="input-group-text">%</div>
              </div>
              <input
                name="allocation2"
                value={value.allocation2}
                onChange={(e) => {
                  handleAssetChange(e, index);
                }}
                type="range"
                className="form-range"
                min="0"
                max="100"
                step="5"
              />
              {index === assetList.length - 1 && (
                <div id="adapt">
                  <p style={{ margin: 0 }}>
                    總和:{sumAllocation("allocation2")}%
                  </p>
                  <p style={{ margin: 0, color: "red" }}>
                    {stateAllocation.allocation2}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div id="allocation" className="col-md-2">
          <div className="row">
            <div id="title" className="col-4">
              <p style={{ margin: 0 }}>Portfolio#3</p>
              <p>總和:{sumAllocation("allocation3")}%</p>
            </div>
            <div className="col">
              <div className="input-group">
                <input
                  key={value.id}
                  // {...register("allocation3-" + num)}
                  name="allocation3"
                  value={value.allocation3}
                  onChange={(e) => {
                    handleAssetChange(e, index);
                  }}
                  type="number"
                  min="0"
                  max="100"
                  className="form-control"
                  id="autoSizingInputGroup"
                  // placeholder="0~100"
                  required={required}
                />
                <div className="input-group-text">%</div>
              </div>
              <input
                name="allocation3"
                value={value.allocation3}
                onChange={(e) => {
                  handleAssetChange(e, index);
                }}
                type="range"
                className="form-range"
                min="0"
                max="100"
                step="5"
              />
              {index === assetList.length - 1 && (
                <div id="adapt">
                  <p style={{ margin: 0 }}>
                    總和:{sumAllocation("allocation3")}%
                  </p>
                  <p style={{ margin: 0, color: "red" }}>
                    {stateAllocation.allocation3}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-1">
          {assetList.length === 2 && (
            <div className="row justify-content-center">
              <button
                className="col-auto btn btn-outline-danger"
                type="button"
                disabled
              >
                刪除
              </button>
            </div>
          )}
          {assetList.length > 2 && (
            <div className="row justify-content-center">
              <button
                onClick={() => handleAssetRemove(index)}
                type="button"
                className="col-auto btn btn-outline-danger"
              >
                刪除
              </button>
            </div>
          )}
        </div>
        {/* {index === assetList.length - 1 && (
          <div className="row">
            <div id="adapt" className="col"></div>
            <div id="adapt" className="col-md-4"></div>
            <div id="adapt" className="col-md-2">
              <p style={{ marginBottom: "1rem", color: "red" }}>
                {stateAllocation.allocation1}
              </p>
            </div>
            <div id="adapt" className="col-md-2">
              <p style={{ marginBottom: "1rem", color: "red" }}>
                {stateAllocation.allocation2}
              </p>
            </div>
            <div id="adapt" className="col-md-2">
              <p style={{ marginBottom: "1rem", color: "red" }}>
                {stateAllocation.allocation3}
              </p>
            </div>
            <div id="adapt" className="col-md-1"></div>
          </div>
        )} */}
        <div className="col-md">
          {assetList.length - 1 === index && assetList.length < 10 && (
            <div className="row justify-content-center">
              <button
                onClick={handleAssetAdd}
                className="col-4 col-md-2 btn btn-outline-primary add-button"
                type="button"
              >
                增加分配
              </button>
            </div>
          )}
          {assetList.length - 1 === index && (
            <div id="title" className="row justify-content-center">
              <div className="col-auto">
                {stateAllocation.allocation1 !== "" && (
                  <p style={{ margin: "0.2rem", color: "red" }}>
                    Portfolio#1{stateAllocation.allocation1}
                  </p>
                )}
                {stateAllocation.allocation2 !== "" && (
                  <p style={{ margin: "0.2rem", color: "red" }}>
                    Portfolio#2{stateAllocation.allocation2}
                  </p>
                )}
                {stateAllocation.allocation3 !== "" && (
                  <p style={{ margin: "0.2rem", color: "red" }}>
                    Portfolio#3{stateAllocation.allocation3}
                  </p>
                )}
              </div>
              <div id="adapt" className="col-md-1"></div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="form">
      <form
        className="col g-3"
        id="allocation"
        onSubmit={(e) =>
          handleSubmit(
            onSubmit,
            onError
          )(e).catch((e) => {
            console.log("POST Error!", e);
          })
        }
      >
        <div className="container">
          <div className="row">
            <div id="adapt" className="col-1">
              <p className="fw-bold">期間</p>
            </div>
            <div className="col d-flex flex-md-column justify-content-evenly">
              <div className="row mb-1">
                <p className="m-0 pe-1 pe-md-4 col-auto align-self-center ">
                  起始日期
                </p>
                <div className="col-auto">
                  <input
                    type="date"
                    name="start"
                    max={minDate}
                    id=""
                    value={dateList.start}
                    onChange={handleDateChange}
                  />
                </div>
              </div>
              <div className="row mb-1">
                <p className="m-0 pe-1 pe-md-4 col-auto align-self-center">
                  結束日期
                </p>
                <div className="col-auto">
                  <input
                    type="date"
                    name="end"
                    max={endDate}
                    id=""
                    value={dateList.end}
                    onChange={handleDateChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <br />
          <div id="adapt" className="row gy-1 gx-md-3">
            <div className="col">
              <p style={{ whiteSpace: "nowrap" }} className="fw-bold">
                分配
              </p>
            </div>
            <div className="col-4">
              <p className="fw-bold">投資項目</p>
            </div>
            <div className="col-2">
              <p style={{ margin: 0 }} className="fw-bold">
                Portfolio #1
              </p>
            </div>
            <div className="col-2">
              <p style={{ margin: 0 }} className="fw-bold">
                Portfolio #2
              </p>
            </div>
            <div className="col-2">
              <p style={{ margin: 0 }} className="fw-bold">
                Portfolio #3
              </p>
            </div>
            <div className="col-md-1"></div>
          </div>
          {assetList.map((value, index) => AssetForm(value, index))}

          <div className="row">
            <div className="d-grid gap-2 gy-3 d-md-flex justify-content-md-between">
              <button
                onClick={handleAssetDefault}
                className="col-auto btn btn-outline-secondary"
                type="button"
              >
                還原預設
              </button>
              <button
                onClick={() => console.log("123")}
                className="col-auto btn btn-outline-secondary"
                type="button"
              >
                測試
              </button>
              <button
                className="btn btn-success"
                type="submit"
                id="send"
                // onClick={testSubmit}
              >
                送出
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Myform;

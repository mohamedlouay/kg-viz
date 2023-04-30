
let drawDefaultMap;
drawDefaultMap = function (endpoint) {
  endpoint.query(buildQuery_getAllDepsTempAvg()).done(function (json) {
    console.log("new data = ", getData(json));
    //drawCharts(json, regio<ns.features[d].properties.code);
  });
};
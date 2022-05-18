let data = [];
const request = require("request");
const url = "https://api.covid19india.org/data.json";
request({ url: url }, (error, response) => {
  data = JSON.parse(response.body)["cases_time_series"];
  console.log(data);
  loadData();
});

const { InfluxDB } = require("@influxdata/influxdb-client");

const token =
  "dINTrFHP4dortLptY3OZMfaZo7bhGPXRMF4yy3Sh-uedDf2mP9_pxCV5BwQgiwSAUuhblr_V67eYCYWpIukJhw==";
const org = "iudx";
const bucket = "ojas4";

const client = new InfluxDB({ url: "http://localhost:8086", token: token });

const { Point } = require("@influxdata/influxdb-client");
const writeApi = client.getWriteApi(org, bucket);
writeApi.useDefaultTags({ host: "host1" });

// const point = new Point('mem').floatField('used_percent', 23.43234543)

var points = [];
loadData = async () => {
  // var i =-1;
  try {
    // for (let i = 0; i < data.length; i++) {
    //   // const point = new Point('mem').floatField('used_percent', 23.43234543)
    //   points[i] = new Point("covid")
    //     .floatField("cases", `${data?.[i]?.["dailyconfirmed"]}`)
    //     .tag("TAG", "OZ")
    //     .timestamp(new Date(data?.[i]?.["dateymd"]).getDate());
    // }

    const rows = data.map((x) => {
      // i++;
      // console.log(r?.["dailyconfirmed"]);
      return {
        measurement: "covid-cases",
        fields: {
          dailyconfirmed: Number(x.dailyconfirmed),
          dailydeceased: Number(x.dailydeceased),
          dailyrecovered: Number(x.dailyrecovered),
          date: x.date,
          totalconfirmed: Number(x.totalconfirmed),
          totaldeceased: Number(x.totaldeceased),
          totalrecovered: Number(x.totalrecovered),
        },
        timestamp: new Date(x.date).getTime(),
      };
    });

    writeApi.writePoints(rows);

    // for (var j = 0; j < points.length; j++) {
    //   writeApi.writePoint(points[j]);
    //   // console.log(new Date(data?.[j]?.["dateymd"]).Date);
    // }

    console.log("Data stored successfully!");
    writeApi
      .close()
      .then(() => {
        console.log("FINISHED");
      })
      .catch((e) => {
        console.error(e);
        console.log("Finished ERROR");
      });
  } catch (err) {
    console.log(`Error while processing ${err}`);
  }
};

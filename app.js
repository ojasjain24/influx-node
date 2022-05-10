let data = [];
const request = require("request");
const url = "https://api.covid19india.org/data.json";
request({ url: url }, (error, response) => {
  data = JSON.parse(response.body)["cases_time_series"];

  loadData();
});

const { InfluxDB } = require("@influxdata/influxdb-client");

const token =
  "dINTrFHP4dortLptY3OZMfaZo7bhGPXRMF4yy3Sh-uedDf2mP9_pxCV5BwQgiwSAUuhblr_V67eYCYWpIukJhw==";
const org = "iudx";
const bucket = "ojas7";

const client = new InfluxDB({ url: "http://localhost:8086", token: token });

const { Point } = require("@influxdata/influxdb-client");
const writeApi = client.getWriteApi(org, bucket);
writeApi.useDefaultTags({ host: "host1" });

// const point = new Point('mem').floatField('used_percent', 23.43234543)

var points = [];
loadData = async () => {
  // var i =-1;
  try {
    for (let i = 0; i < data.length; i++) {
      // const point = new Point('mem').floatField('used_percent', 23.43234543)
      points[i] = new Point("covid")
        .floatField("cases", `${data?.[i]?.["dailyconfirmed"]}`)
        .tag("TAG", "OZ")
        .timestamp(new Date(data?.[i]?.["dateymd"]));
    }

    //  const rows = [...new Array(data.length)].map((r) => {
    //   i++;
    //   console.log(data?.[i]?.["dailyconfirmed"]);
    //   return {
    //     measurement: 'covid-cases',
    //     tags: { host: 'localhost',
    //     app: 'AppName',
    //     Instance: 'Instance1878' },
    //     fields: { cases : `${data?.[i]?.["dailyconfirmed"]}` },
    //     timestamp: new Date(data?.[i]?.["dateymd"]),
    //   };
    // });
    // writeApi.writePoint(points[0]);

    for (var j = 0; j < points.length; j++) {
      writeApi.writePoint(points[j]);
      console.log(points[j]);
    }

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

const Influx = require("influx");
const app = require("express")();
const PORT = 8000;

app.listen(PORT);

const client = new Influx.InfluxDB({
  database: "ojas_db",
  host: "localhost",
  port: 8086,
  username: "ojas",
  password: "ojas1234",
});

const lastTimestamp = 1629052200000;

app.get("/periodwise/:period", async (req, res) => {
  const today = new Date(lastTimestamp);
  const period = req.params;

  const endDate =
    period.period == "monthly"
      ? new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
      : new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

  try {
    const results = await client.query(
      `select * from covid_cases where time >= ${endDate.getTime()} AND time <= ${today.getTime()}`
    );
    res.status(200).send(results);
  } catch (err) {
    console.log(err);
  }
});

app.get("/average", async (req, res) => {
  const today = new Date(lastTimestamp);

  const endDate = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    today.getDate()
  );

  try {
    const results = await client.query(
      `select moving_average(*, 3) from covid_cases where time >= ${endDate.getTime()} AND time <= ${today.getTime()}`
    );
    res.status(200).send(results);
  } catch (err) {
    console.log(err);
  }
});

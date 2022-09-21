const express = require("express");
const morgan = require("morgan");
const axios = require("axios");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv").config();
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});
app.set("port", process.env.PORT || 8099);
//정해진 포트를 들고오거나 정해진 포트 환경이 없다면 8099를 들고옴
const port = app.get("port");
app.use(morgan()); //서버로 어떤 데이터가 흘러들어 오는지 디테일을 다 보고 싶을때
// app.use(morgan("dev"));//개발 환경에서만 볼때

app.use(cors({ origin: "https://moonjiwon-paqago.netlify.app", credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello Express");
});
app.post("/papago", (req, res) => {
  const target = req.body.target;
  const text = req.body.text;
  const source = req.body.source;
  axios({
    url: "https://openapi.naver.com/v1/papago/n2mt",
    method: "POST",
    params: { source: source, target: target, text: text },
    headers: {
      "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
      "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET,
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  })
    .then((response) => {
      res.json({ result: response.data.message.result.translatedText });
    })
    .catch((error) => {
      console.log(error);
    });
});
app.listen(port, () => {
  console.log(`${port}에서 서버 대기 중`);
});
//get방식은 주소창에 노출 post는 안됨
//post로 넘긴 데이터는 body로 받는다 req.query.txt 아님

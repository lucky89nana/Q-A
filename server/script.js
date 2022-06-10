import http from 'k6/http';
import { sleep } from 'k6';
export let options = {
  vus: 1000, //stimulate how many virtual users
  rps: 1000, // how many requests per second
  duration: '60s', //how long you want it to run
};
//Below randomize the endpoints
export default function () {
  const randomNumber = Math.floor(Math.random() * 90000);
  http.get(`http://localhost:3000/qa/questions/?product_id=${randomNumber}`);
  sleep(1);
  http.get(`http://localhost:3000/qa/questions/${randomNumber}/answers/`);
  sleep(1);
}

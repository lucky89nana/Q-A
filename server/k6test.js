import http from 'k6/http';
import { check, sleep } from 'k6';
export let options = {
  vus: 1000, //stimulate how many virtual users
  rps: 1000, // how many requests per second
  duration: '60s', //how long you want it to run
};
//Below randomize the endpoints
export default function () {
  const randomNumber = Math.floor(Math.random() * 90000);
  const res1 = http.get(
    `http://localhost:3000/qa/questions/?product_id=${randomNumber}`
  );
  check(res1, {
    'status was 200': (r) => r.status === 200,
    'response less than 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);

  const res2 = http.get(
    `http://localhost:3000/qa/questions/${randomNumber}/answers`
  );
  check(res2, {
    'status was 200': (r) => r.status === 200,
    'response less than 2000ms': (r) => r.timings.duration < 2000,
  });
  sleep(1);

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({
    body: `new question ${__VU}: ${__ITER}`,
    name: 'tester',
    email: 'tester@tester.com',
    product_id: 1000000,
  });
  const res3 = http.post(`http://localhost:3000/qa/questions`, body, params);
  check(res3, {
    'status was 201': (r) => r.status === 201,
    'response less than 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}

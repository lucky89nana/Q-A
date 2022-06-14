import http from 'k6/http';
import { check, sleep } from 'k6';
// export let options = {
//   vus: 1000, //stimulate how many virtual users // how many requests per second
//   duration: '30s', //how long you want it to run
// };

export let options = {
  stages: [
    { duration: '10s', target: 100 },
    { duration: '10s', target: 1000 },
    { duration: '20s', target: 0 },
  ],
};

//Below randomize the endpoints
export default function () {
  const randomNumber = Math.floor(Math.random() * (1000011 - 1 + 1)) + 1;

  /*----- get questions test -----*/
  const res1 = http.get(
    `http://localhost:3000/qa/questions/?product_id=${randomNumber}`
  );
  check(res1, {
    'status was 200': (r) => r.status === 200,
    'response less than 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);

  /*----- get answers test -----*/
  // const res2 = http.get(
  //   `http://localhost:3000/qa/questions/${randomNumber}/answers`
  // );
  // check(res2, {
  //   'status was 200': (r) => r.status === 200,
  //   'response less than 500ms': (r) => r.timings.duration < 500,
  // });
  // sleep(1);

  // /*----- post questions test -----*/
  // const params = {
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // };
  // const body = JSON.stringify({
  //   body: `new question ${__VU}: ${__ITER}`,
  //   name: 'tester',
  //   email: 'tester@tester.com',
  //   product_id: 1000000,
  // });
  // const res3 = http.post(`http://localhost:3000/qa/questions`, body, params);
  // check(res3, {
  //   'status was 201': (r) => r.status === 201,
  //   'response less than 500ms': (r) => r.timings.duration < 500,
  // });
  // sleep(1);

  // /*----- post answers test -----*/
  // const body = JSON.stringify({
  //   body: `new answer ${__VU}: ${__ITER}`,
  //   name: 'tester',
  //   email: 'tester@tester.com',
  // });
  // const res4 = http.post(
  //   `http://localhost:3000/qa/questions/${randomNumber}/answers`,
  //   body
  // );
  // check(res4, {
  //   'status was 201': (r) => r.status === 201,
  //   'response less than 500ms': (r) => r.timings.duration < 500,
  // });
  // sleep(1);

  // /*----- put questions helpfulness test -----*/
  // const res5 = http.put(
  //   `http://localhost:3000/qa/questions/${randomNumber}/helpful`
  // );
  // check(res5, {
  //   'status was 204': (r) => r.status === 204,
  //   'response less than 500ms': (r) => r.timings.duration < 500,
  // });
  // sleep(1);
}

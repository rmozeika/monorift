// // This file doesn't go through babel or webpack transformation.
// // Make sure the syntax and sources this file requires are compatible with the current node version you are running
// // See https://github.com/zeit/next.js/issues/1245 for discussions on Universal Webpack or universal Babel
// const { createServer } = require('http')
// const { parse } = require('url')
// const next = require('next')
// // const rp2API = require('RP2/api');
// const rp2 = require('rp2/app');
// const secured = require('rp2/middleware/secured');

// const dev = process.env.NODE_ENV !== 'production'
// const app = next({ dev })
// const handle = app.getRequestHandler();
// async function test() {
//   await rp2.init({});
//   prepare(rp2);
// };
// //test();

// function prepare(api) {
//   app.prepare().then(() => {
//     createServer((req, res) => {
//       // Be sure to pass `true` as the second argument to `url.parse`.
//       // This tells it to parse the query portion of the URL.
//       const parsedUrl = parse(req.url, true)
//       const { pathname, query } = parsedUrl
//       // rp2.repositories.users.findByUsername('darkness94', (err, user) => {
//       //   console.log(user);
//       //   req.user = user;
//       req.api = api;
//       handle(req, res, parsedUrl)
//     // });
//       // if (pathname === '/a') {
//       //   app.render(req, res, '/b', query)
//       // } else if (pathname === '/b') {
//       //   app.render(req, res, '/a', query)
//       // } else {
//       //   handle(req, res, parsedUrl)
//       // }
//     }).listen(3000, err => {
//       if (err) throw err
//       console.log('> Ready on http://localhost:3000')
//     })
//   })
// }
// async function withExpress() {
//   app.prepare().then(() => {
//     const server = rp2;
//     // server.get('/', secured(), (req, res) => {
//     server.get('/', (req, res) => {
//       const parsedUrl = parse(req.url, true)
//       const { pathname, query } = parsedUrl
//       req.api = server.api;

//       handle(req, res, parsedUrl)
//       // const actualPage = '/index'
//       // const queryParams = {} //{ id: req.params.id } 
//       // app.render(req, res, actualPage, queryParams)
//     });

//       createServer(rp2).listen(3000, err =>{
//       if (err) {
//         console.log(err)
//       }
//       console.log('> Ready on http://localhost:3000')
//     })

//   })
// }
// withExpress();
    
//            //  handle(req, res, parsed)
//           // Be sure to pass `true` as the second argument to `url.parse`.
//           // This tells it to parse the query portion of the URL.
//           // const parsedUrl = parse(req.url, true)
//           // const { pathname, query } = parsedUrl
      
//           // if (pathname === '/a') {
//           //   app.render(req, res, '/b', query)
//           // } else if (pathname === '/b') {
//           //   app.render(req, res, '/a', query)
//           // } else {
//           //   handle(req, res, parsedUrl)
//           // }
        


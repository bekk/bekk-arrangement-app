const express = require('express');

const path = require('path');

const port = process.env.PORT || 4567;
const app = express();

//index.html caches aldri. Bundle caches i 5 dager hvis de ikke er endret
app.use(
  express.static('build', {
    etag: true, // Just being explicit about the default.
    lastModified: true, // Just being explicit about the default.
    setHeaders: (res, path) => {
      const hashRegExp = new RegExp('\\.[0-9a-f]{8}\\.');
      if (path.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      } else if (hashRegExp.test(path)) {
        res.setHeader('Cache-Control', 'max-age=432000');
      }
    },
  })
);

app.use('/fonts', express.static('fonts', { maxAge: '5d' }));

app.get('/health', (request, response) => {
  response.send('healthy');
});

app.get('/config', (request, response) =>
  response.send({
    bekkApiUrl: process.env.BEKK_API_URL || 'https://api.dev.bekk.no',
    arrangementSvcUrl:
      process.env.ARRANGEMENT_SVC_URL ||
      'https://api.dev.bekk.no/arrangement-svc',
    employeeSvcUrl:
      process.env.EMPLOYEE_SVC_URL || 'https://api.dev.bekk.no/employee-svc',
    audience: process.env.AUTH0_AUDIENCE || 'QHQy75S7tmnhDdBGYSnszzlhMPul0fAE',
    issuerDomain: process.env.AUTH0_ISSUER_DOMAIN || 'bekk-dev.eu.auth0.com',
    scopes: process.env.SCOPES || 'openid name groups email',
  })
);

app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, 'build/index.html'));
});

app.listen(port);
console.log(`Server started on port ${port}`);

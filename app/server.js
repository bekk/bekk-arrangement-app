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
    }
  })
);

app.use('/fonts', express.static('fonts', { maxAge: '5d' }));

app.get('/health', (request, response) => {
  response.send('healthy');
});

app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, 'build/index.html'));
});

app.listen(port);
console.log(`Server started on port ${port}`);

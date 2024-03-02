// create web server
// create a web server with the http module
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const queryString = require('querystring');
const comments = require('./comments');
const { get } = require('http');
const { parse } = require('path');

// create a web server
http.createServer((req, res) => {
    // get the url
    const urlObj = url.parse(req.url, true);
    const pathname = urlObj.pathname;
    // get the query string
    const query = urlObj.query;

    // get the method
    const method = req.method;

    // set the response header
    res.setHeader('Content-Type', 'text/html;charset=utf-8');

    // set the response
    if (pathname === '/' || pathname === '/index.html') {
        // read the file
        fs.readFile(path.join(__dirname, 'index.html'), 'utf-8', (err, data) => {
            if (err) {
                return res.end('404 Not Found');
            }
            // read the comments
            comments.get().then((data) => {
                res.end(data);
            });
        });
    } else if (pathname === '/add' && method === 'GET') {
        // get the query string
        const query = urlObj.query;
        // add the comment
        comments.add(query).then((data) => {
            // redirect
            res.writeHead(301, {
                Location: '/'
            });
            res.end();
        });
    } else if (pathname === '/add' && method === 'POST') {
        // post the data
        let data = '';
        // get the post data
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.on('end', () => {
            // parse the query string
            const query = queryString.parse(data);
            // add the comment
            comments.add(query).then((data) => {
                // redirect
                res.writeHead(301, {
                    Location: '/'
                });
                res.end();
            });
        });
    } else {
        res.end('404 Not Found');
    }
}).listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});

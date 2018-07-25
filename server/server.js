// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
//const request = require('request');
//const fs = require('fs');
//const http = require('http');
const superagent = require("superagent");

const app = express();

// Body Parser MiddleWare
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// Set static path
app.use(express.static(path.join(__dirname, '../client')));

//Start Server
app.listen(3000, function() {
	console.log('server started at port 3000');
});


app.post('/downloadFileFromServer', function (req, res) {
    console.log('Calling downloadFileFromServer');
    try {
        const filename = 'adhoc_results.csv'; // You will get this in the ouput after the service executes and creates a file
        const netaddress = '127.0.0.1';
        const lzpath =  '/mnt/dropzone'; //Directory from where the file needs to be downloaded 
        const os = '2';
        const username = '';
        const password = '';
        let url = 'http://127.0.0.1:8010';
        url = url + "/FileSpray/DownloadFile?Name="+ filename + "&NetAddress=" + netaddress + "&Path=" + lzpath + "&OS=" + os;
        const superagentreq = superagent
            .get(url)
            .auth(username, password)
            .timeout({
                response: 10000,  // Wait 10 seconds for the server to start sending,
                deadline: 120000, // but allow 2 minute for the file to finish downloading.
            })
            
        superagentreq.pipe(res);
        
        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.set('Content-Type', 'text/csv');
        
    } catch (err) {
        console.log('err', err);
    }
});

// Render index.html on the main page
app.get('*', function(req, res) {
	res.sendFile("index.html", {root: '../client'});
});
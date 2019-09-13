require('dotenv').config()
const express = require("express");
const app = express();
var Airtable = require('airtable');
const body = require("body-parser");
var next = require("next");
const dev = process.env.NODE_ENV !== "production";
var base = new Airtable({apiKey: process.env.AIRTABLE}).base('appYCaIMntmznlXkT');
var server = next({dev});
var handler = server.getRequestHandler();
app.use(body.urlencoded({"extended":true}));
server.prepare().then(()=> {
  app.get("/",(req,res)=> {
    handler(req,res);
  })
  app.get("/_next/*",(req,res)=> {
    handler(req,res);
  });
  app.post("/",(req,res)=> {
    triggered = false;
    base("Redirects").select({
      maxRecords: 100,
      view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
      records.map((item)=> {
        if (item.fields._id == req.body._id) {
          res.send({"taken":true})
          res.end();
          triggered = true;
        }
      })
      fetchNextPage();
    }, (err) => {
      if (!triggered) {
        res.send({"taken":false})
        base("Redirects").create([
          {
            "fields":{
              "_id":req.body._id,
              "_redirect":req.body._redirect
            }
          }
        ]);
      }
    });
  });
  app.get("/:id",(req,res)=> {
    triggered = false;
    base("Redirects").select({
      maxRecords: 100,
      view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
      console.log("----------------")
      records.map((item)=> {
        if (item.fields._id == req.params.id) {
          console.log(item);
          res.statusCode = 302;
          res.setHeader("Location", item.fields._redirect);
          res.end();
          triggered = true;
        }
      })
      fetchNextPage();
    }, (err) => {
      if (!triggered) {
        res.redirect("/")
      }
    });
    
  });
  app.listen(3000,()=> console.log("Running on le port 3000"))
}).catch((err)=> console.log(err));
var port = process.env.PORT || 5000
// var port =80
var express=require("express"),app=express(),http=require("http").Server(app).listen(port);
var upload=require("express-fileupload");
var path=require('path');
var fs = require('fs');  
var aws = require('aws-sdk');
aws.config.loadFromPath('./AwsConfig.json');
console.log("server started");
app.use(upload());
var BUCKET_NAME = 'uploaddemotest';
var s3 = new aws.S3();
app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");


})
var bucketParams = {
    Bucket : BUCKET_NAME
 };                    
                                    
  // Call S3 to create the bucket
 
app.post("/",function (req,res) {
    if(req.files){
        var file=req.files.filename,
        filename=file.name;
     uploadFile(filename,file);
     
     res.sendFile(__dirname+"/sucess.html");

    }
})

function uploadFile(remoteFilename, file) {
    //console.log(fileName);
  
  
    
    s3.putObject({
      ACL: 'public-read',
      Bucket: BUCKET_NAME,
      Key: remoteFilename,
      Body: file.data,
      ContentType: "video"
    }, function(error, response) {
      console.log('uploaded file[' + file.name + '] to [' + remoteFilename + ']');
     // console.log(arguments);
      
    });
  }
app.get('/view', function(req, res) { 
    console.log('dwn')
    s3.listObjects(bucketParams, function(err, data) {
        if (err) {
           console.log("Error", err);
        } else {
           console.log("Success", data.Contents);
          res.send(data.Contents)
        }
     });
    
  });

 
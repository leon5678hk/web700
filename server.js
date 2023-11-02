/*********************************************************************************
* WEB700 – Assignment 4
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Pak Lun Lo Student ID: 154968226 Date: 10/30/2023
*Online (Cyclic) Link: https://calm-ruby-parrot-gown.cyclic.app/htmlDemo
*
********************************************************************************/

const collegeData = require('./modules/collegeData.js');

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
const path = require('path');
var app = express();

collegeData.initialize()
    .then(() => {
 
        app.listen(HTTP_PORT, () => { console.log("server listening on port: " + HTTP_PORT) });
    })
    .catch((err) => {

        console.error("Initialization failed:", err);
    });

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get("/about", function (req, res) {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/htmlDemo", function (req, res) {
    res.sendFile(path.join(__dirname, "/views/htmlDemo.html"));
});

app.get("/students", async (req, res) => {
    const course = req.query.course;


    try {
        if (course) {

            const students = await collegeData.getStudentsByCourse(parseInt(course));
            res.json(students);
        } else {

            const allStudents = await collegeData.getAllStudents();
            res.json(allStudents);
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

app.get("/student/:num",  (req, res) => {
    const studentNum = req.params.num; 


    collegeData.getStudentByNum(parseInt(studentNum))
        .then(function (student) {
            res.json(student);
        })
        .catch(function (error) {
            res.status(500).json(error);
        });
});

app.get("/tas", (req, res) => {

    collegeData.getTAs()
        .then(function (tas) {
            res.json(tas);
        })
        .catch(function (error) {
            res.status(500).json(error);
        });
});

app.get("/courses", (req, res) => {

    collegeData.getCourses()
        .then(function (courses) {
            res.json(courses);
        })
        .catch(function (error) {
            res.status(500).json(error);
        });
});



    /*try {
        const student = await collegeData.getStudentByNum(parseInt(studentNum));
        res.json(student);
        
    } catch (error) {
        res.status(500).json(error);
    }*/

// Serve the addStudent.html page for adding new students
/*app.get("/css", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/theme.css"));
});*/
app.use(express.static('public'))

app.get("/students/add", function (req, res) {
    res.sendFile(path.join(__dirname, "/views/addStudent.html"));
});

app.use(express.urlencoded({ extended: false })); 
app.use(express.json()); 


app.post("/students/add", (req, res) => {
    const studentData = req.body; 

    collegeData.addStudent(studentData) 
        .then(() => {
          
            res.redirect("/students"); 
        })
        .catch((error) => {
            res.status(500).json(error);
        });
});

app.use((req, res) => {
    res.status(404).send("Page Not Foun");
});
/*app.listen(HTTP_PORT, ()=>{console.log("server listening on port: " + HTTP_PORT)});*/


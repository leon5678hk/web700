/*********************************************************************************
* WEB700 – Assignment 5
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Pak Lun Lo Student ID: 154968226 Date: 11/17/2023
*Online (Cyclic) Link: https://calm-ruby-parrot-gown.cyclic.app/
*
********************************************************************************/

const collegeData = require('./modules/collegeData.js');

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
const path = require('path');
const exphbs = require('express-handlebars');
var app = express();

collegeData.initialize()
    .then(() => {
 
        app.listen(HTTP_PORT, () => { console.log("server listening on port: " + HTTP_PORT) });
    })
    .catch((err) => {

        console.error("Initialization failed:", err);
    });

    app.use(function(req, res, next) {
        let route = req.path.substring(1);
        app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
        next();
    });

    app.engine('.hbs', exphbs.engine({
        extname: '.hbs',
        defaultLayout: 'main',
        layoutsDir: path.join(__dirname, 'views', 'layouts'),
        helpers: {
            navLink: function(url, options) {
                return `<li class="nav-item">
                            <a class="nav-link ${url == app.locals.activeRoute ? "active" : "" }" href="${url}">${options.fn(this)}</a>
                        </li>`;
            },
            equal: function(lvalue, rvalue, options) {
                if (arguments.length < 3) throw new Error("Handlebars Helper equal needs 2 parameters");
                if (lvalue != rvalue) {
                    return options.inverse(this);
                } else {
                    return options.fn(this);
                }
            }
        }
    }));

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/about", function (req, res) {
    res.render("about");
});

app.get("/htmlDemo", function (req, res) {
    res.render("htmlDemo");
});

app.get("/students", async (req, res) => {
    const courseParam = req.query.course;

    try {
        if (courseParam) {
            const studentsInCourse = await collegeData.getStudentsByCourse(parseInt(courseParam));
            res.render("students", { students: studentsInCourse });
        } else {
            const allStudents = await collegeData.getAllStudents();

            if (allStudents.length > 0) {
                res.render("students", { students: allStudents });
            } else {
                res.render("students", { message: "No results" });
            }
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

app.get("/student/:num", async (req, res) => {
    const studentNum = parseInt(req.params.num);

    try {
        const student = await collegeData.getStudentByNum(studentNum);
        res.render("student", { student });
    } catch (error) {
        res.status(500).json(error);
    }
});

/*app.get("/tas", (req, res) => {

    collegeData.getTAs()
        .then(function (tas) {
            res.json(tas);
        })
        .catch(function (error) {
            res.status(500).json(error);
        });
});*/

app.get("/courses", async (req, res) => {
    try {
        const allCourses = await collegeData.getCourses();

        if (allCourses.length > 0) {
            res.render("courses", { courses: allCourses });
        } else {
            res.render("courses", { message: "no results" });
        }
    } catch (error) {
        res.status(500).render("courses", { message: "no results" });
    }
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
    res.render("addStudent"); 
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

app.post("/student/update/:num", async (req, res) => {
    const studentNum = parseInt(req.params.num);
    const updatedStudentData = req.body;

    try {
        const existingStudent = await collegeData.getStudentByNum(studentNum);

        if (existingStudent) {
            await collegeData.updateStudent(studentNum, updatedStudentData);
            res.redirect("/students");
        } else {
            res.status(404).json({ error: "Student not found" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

app.get("/course/:id", async (req, res) => {
    const courseId = parseInt(req.params.id);

    try {
        const course = await collegeData.getCourseById(courseId);
        res.render("course", { course });
    } catch (error) {
        res.status(500).json(error);
    }
});


app.set('view engine', '.hbs');



app.use((req, res) => {
    res.status(404).send("Page Not Foun");
});
/*app.listen(HTTP_PORT, ()=>{console.log("server listening on port: " + HTTP_PORT)});*/
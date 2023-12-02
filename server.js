/*********************************************************************************
* WEB700 – Assignment 6
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Pak Lun Lo Student ID: 154968226 Date: 12/2/2023
*Online (Cyclic) Link: https://calm-ruby-parrot-gown.cyclic.app/
*
********************************************************************************/

const collegeData = require('./modules/collegeData.js');

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
const path = require('path');
const exphbs = require('express-handlebars');
const router = express.Router();
var app = express();

collegeData.initialize()
    .then(() => {

        app.listen(HTTP_PORT, () => { console.log("server listening on port: " + HTTP_PORT) });
    })
    .catch((err) => {

        console.error("Initialization failed:", err);
    });

app.use(function (req, res, next) {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    next();
});

app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    helpers: {
        navLink: function (url, options) {
            return `<li class="nav-item">
                            <a class="nav-link ${url == app.locals.activeRoute ? "active" : ""}" href="${url}">${options.fn(this)}</a>
                        </li>`;
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3) throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        },

        eq: function (a, b, options) {
            return a === b ? options.fn(this) : options.inverse(this);
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
            renderStudentsView(res, studentsInCourse);
        } else {
            const allStudents = await collegeData.getAllStudents();

            if (allStudents.length > 0) {
                renderStudentsView(res, allStudents);
            } else {
                res.render("students", { message: "No results" });
            }
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

function renderStudentsView(res, students) {
    if (students.length > 0) {
        res.render("students", { students: students });
    } else {
        res.render("students", { message: "No results" });
    }
}

app.get("/student/:studentNum", (req, res) => {
    collegeData.getStudentByNum(req.params.studentNum)
        .then((studentData) => {
            if (studentData) {
                const student = studentData[0]; 
                collegeData.getCourses()
                    .then((courseData) => {
                        const courses = courseData || [];
                        res.render("student", { student, courses });
                    })
                    .catch((err) => {
                        console.error("Error fetching courses:", err);
                        res.status(500).send("Internal Server Error");
                    });
            } else {
                res.render("student", { student: null, courses: [] });
            }
        })
        .catch((err) => {
            console.error("Error fetching student:", err);
            res.status(500).send("Internal Server Error");
        });
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

app.get("/courses", (req, res) => {
    collegeData.getCourses()
        .then((allCourses) => {
            if (allCourses.length > 0) {
                res.render("courses", { courses: allCourses });
            } else {
                res.render("courses", { message: "No results" });
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            res.status(500).render("courses", { message: "No results" });
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

app.get("/students/add", (req, res) => {
    collegeData.getCourses()
        .then((courses) => {
            res.render("addStudent", { courses });
        })
        .catch((error) => {
            console.error("Error fetching courses:", error);
            res.status(500).send("Internal Server Error");
        });
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

app.get("/students/delete/:studentNum", async (req, res) => {
    try {
        await collegeData.deleteStudentByNum(req.params.studentNum);
        res.redirect("/students");
    } catch (err) {
        res.status(500).send(err.message);
    }
});



app.get("/courses/add", function (req, res) {
    res.render("addCourse");
});

app.post("/courses/add", async (req, res) => {
    const courseData = req.body;

    try {
        await collegeData.addCourse(courseData);
        res.redirect("/courses");
    } catch (error) {
        res.status(500).json(error);
    }
});


app.post("/course/update/:id", async (req, res) => {
    const courseId = parseInt(req.params.id);
    const updatedCourseData = req.body;

    try {
        await collegeData.updateCourse(updatedCourseData);
        res.redirect("/courses");
    } catch (error) {
        res.status(500).json(error);
    }
});

app.get("/course/:id", (req, res) => {
    const courseId = parseInt(req.params.id);
    collegeData.getCourseById(courseId)
        .then((courseData) => {
            const course = courseData[0];
            console.log("Fetched course data:", course);
            res.render("course", { course });
        })
        .catch((error) => {
            console.error("Error fetching course:", error);
            res.status(500).json(error);
        });
});


app.get("/course/delete/:id", async (req, res) => {
    try {
        await collegeData.deleteCourseById(req.params.id);
        res.redirect("/courses");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.set('view engine', '.hbs');



app.use((req, res) => {
    res.status(404).send("Page Not Foun");
});
/*app.listen(HTTP_PORT, ()=>{console.log("server listening on port: " + HTTP_PORT)});*/
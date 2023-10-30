const courses = require("../data/courses.json");
const students = require("../data/students.json");
const fs = require('fs');

class Data {
  constructor(students, courses) {
    this.students = students;
    this.courses = courses;
  }
}

let dataCollection = null;

function initialize() {

  return new Promise(function (resolve, reject) {
    dataCollection = new Data(students, courses);
    resolve();
  });
}

function getAllStudents() {

  return new Promise(function (resolve, reject) { //return new Promise((resolce,reject)=>{
    if (dataCollection.students.length == 0) {
      reject("No results returned")
    } else {
      resolve(dataCollection.students);
    }
  });
}

function getTAs() {
  return new Promise(function (resolve, reject) { //return new Promise ((resolve,reject)=>{
    var tas = dataCollection.students.filter(
      function (students) { //var tas=dataCollection.students.filter(student=>student.TA)
        return students.TA;
      });
    if (tas.length === 0) {
      reject("No results returned");
    } else {
      resolve(tas);
    }
  });
}

function getCourses() {
  return new Promise(function (resolve, reject) {//return new Promise((resolce,reject)=>{
    if (dataCollection.courses.length === 0) {
      reject("No results returned");
    } else {
      resolve(dataCollection.courses);
    }
  });
}

function getStudentsByCourse(course) {
  return new Promise(function (resolve, reject) { //return new Promise ((resolve,reject)=>{
    var studentList = dataCollection.students.filter(//var studentList = dataCollection.students.filter((s) => { if (s.course === course) return s;});
      function (s) {
        if (s.course === course)
          return s;
      });
    if (studentList.length === 0) {
      reject("No results returned");
    } else {
      resolve(studentList);
    }
  });
}

function getStudentByNum(num) {
  return new Promise(function (resolve, reject) { //return new Promise ((resolve,reject)=>{
    var student = students.find(
      function (s) {  //var student = students.find(s => s.studentNum === num);
        return s.studentNum === num;
      });

    if (student) {
      resolve(student);
    } else {
      reject("No results returned");
    }
  });
}

function addStudent(studentData) {
  return new Promise(function (resolve, reject) {
    // Set TA to false if not defined
    studentData.TA = studentData.TA === undefined ? false : true;
    studentData.studentNum = dataCollection.students.length + 1;
    // Set studentNum property based on the length of the students array
    const newStudent = {
      "studentNum": studentData.studentNum, // Automatically generated
      "firstName": studentData.firstName,
      "lastName": studentData.lastName,
      "email": studentData.email,
      "addressStreet": studentData.addressStreet,
      "addressCity": studentData.addressCity,
      "addressProvince": studentData.addressProvince,
      "TA": studentData.TA,
      "status": studentData.status,
      "course": parseInt(studentData.course)
    };
    
    // Push the updated studentData onto the students array
    dataCollection.students.push(newStudent);
    

    // Write the updated data back to students.json
    fs.writeFile('./data/students.json', JSON.stringify(dataCollection.students), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  initialize: initialize,
  getAllStudents: getAllStudents,
  getTAs: getTAs,
  getCourses: getCourses,
  getStudentsByCourse: getStudentsByCourse,
  getStudentByNum: getStudentByNum,
  addStudent: addStudent
};


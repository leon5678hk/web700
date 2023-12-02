const Sequelize = require('sequelize');

// set up sequelize to point to our postgres database
var sequelize = new Sequelize('SenecaDB', 'leon5678hk', 'pgL57BiDnGWP', {
    host: 'ep-tight-water-30056937.us-east-2.aws.neon.tech',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    }, 
    query:{ raw: true }
});

sequelize
    .authenticate()
    .then(function() {
        console.log('Connection has been established successfully.');
    })
    .catch(function(err) {
        console.log('Unable to connect to the database:', err);
    });

class Data {
  constructor(students, courses) {
    this.students = students;
    this.courses = courses;
  }
}


const Student = sequelize.define('Student', {
  studentNum: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  addressStreet: {
    type: Sequelize.STRING,
    allowNull: false
  },
  addressCity: {
    type: Sequelize.STRING,
    allowNull: false
  },
  addressProvince: {
    type: Sequelize.STRING,
    allowNull: false
  },
  TA: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

const Course = sequelize.define('Course', {
  courseId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  courseCode: {
    type: Sequelize.STRING,
    allowNull: false
  },
  courseDescription: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

Student.belongsTo(Course, {
  foreignKey: 'courseId',
  onDelete: 'CASCADE'
});

Course.hasMany(Student, {
  foreignKey: 'courseId',
  onDelete: 'CASCADE'
});


function initialize() {
  return new Promise(async (resolve, reject) => {
    try {
      await sequelize.sync();
      resolve();
    } catch (error) {
      reject("Unable to sync the database");
    }
  });
}

function getAllStudents() {
  return new Promise(async (resolve, reject) => {
    try {
      const students = await sequelize.models.Student.findAll();
      resolve(students);
    } catch (error) {
      reject("No results returned");
    }
  });
}

function getStudentsByCourse(course) {
  return new Promise(async (resolve, reject) => {
    try {
      const students = await Student.findAll({ where: { courseId: course } });
      resolve(students);
    } catch (error) {
      reject("No results returned");
    }
  });
}

function getStudentByNum(studentNum) {
  return new Promise(async (resolve, reject) => {
    try {
      const student = await sequelize.models.Student.findOne({ where: { studentNum: studentNum } });
      if (student) {
        resolve([student]); //
      } else {
        reject("No results returned");
      }
    } catch (error) {
      reject("No results returned");
    }
  });
}

function getCourses() {
  return new Promise(async (resolve, reject) => {
    try {
      const courses = await Course.findAll();
      resolve(courses);
    } catch (error) {
      reject("No results returned");
    }
  });
}


function getCourseById(courseId) {
  return new Promise(async (resolve, reject) => {
    try {
      const course = await sequelize.models.Course.findOne({ where: { courseId: courseId } });
      if (course) {
        resolve([course]); 
      } else {
        reject("No results returned");
      }
    } catch (error) {
      reject("No results returned");
    }
  });
}

function deleteStudentByNum(studentNum) {
  return new Promise((resolve, reject) => {
    sequelize.models.Student.destroy({
      where: {
        studentNum: studentNum
      }
    })
    .then((result) => {
      if (result === 0) {
        reject(new Error("Student not found"));
      } else {
        resolve("Student removed successfully");
      }
    })
    .catch((err) => {
      reject(new Error("Unable to remove student"));
    });
  });
}

function addStudent(studentData) {
  return new Promise(async (resolve, reject) => {
    studentData.TA = studentData.TA ? true : false;

    for (const key in studentData) {
      if (studentData[key] === "") {
        studentData[key] = null;
      }
    }

    try {
      await Student.create(studentData);
      resolve();
    } catch (error) {
      reject("Unable to create student");
    }
  });
}

function updateStudent(studentNum, studentData) {
  return new Promise(async (resolve, reject) => {
    studentData.TA = studentData.TA ? true : false;

    for (const key in studentData) {
      if (studentData[key] === "") {
        studentData[key] = null;
      }
    }

    try {
      await Student.update(studentData, { where: { studentNum: studentNum } });
      resolve();
    } catch (error) {
      reject("Unable to update student");
    }
  });
}

function addCourse(courseData) {
  return new Promise(function (resolve, reject) {
      for (const key in courseData) {
          if (courseData[key] === "") {
              courseData[key] = null;
          }
      }

      sequelize.models.Course.create(courseData)
          .then(() => resolve())
          .catch((error) => reject("Unable to create course: " + error));
  });
}

function updateCourse(courseData) {
  return new Promise(function (resolve, reject) {
      for (const key in courseData) {
          if (courseData[key] === "") {
              courseData[key] = null;
          }
      }

      sequelize.models.Course.update(courseData, {
          where: { courseId: courseData.courseId }
      })
          .then(() => resolve())
          .catch((error) => reject("Unable to update course: " + error));
  });
}

function deleteCourseById(id) {
  return new Promise(function (resolve, reject) {
      sequelize.models.Course.destroy({
          where: { courseId: id }
      })
          .then((rowsDeleted) => {
              if (rowsDeleted > 0) {
                  resolve(); 
              } else {
                  reject("Course not found");
              }
          })
          .catch((error) => reject("Unable to delete course: " + error));
  });
}



module.exports = {
  initialize: initialize,
  getAllStudents: getAllStudents,
  getStudentsByCourse: getStudentsByCourse,
  getStudentByNum: getStudentByNum,
  getCourses: getCourses,
  getCourseById: getCourseById,
  addStudent: addStudent,
  updateStudent: updateStudent,
  addCourse: addCourse,
  updateCourse: updateCourse,
  deleteCourseById: deleteCourseById,
  deleteStudentByNum: deleteStudentByNum
};
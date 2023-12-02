
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


var Project = sequelize.define('Project', {
    project_id: {
        type: Sequelize.INTEGER,
        primaryKey: true, // use "project_id" as a primary key
        autoIncrement: true // automatically increment the value
    },
    title: Sequelize.STRING,
    description: Sequelize.TEXT
},{
    createdAt: false, // disable createdAt
    updatedAt: false // disable updatedAt
});

sequelize.sync().then(function () {

    // create a new "Project" and add it to the database
    Project.create({
        title: 'Project2',
        description: '2nd Project'
    }).then(function (project) {
        // you can now access the newly created Project via the variable project
        console.log("success!")
    }).catch(function (error) {
        console.log("something went wrong!");
    });
});

var BlogEntry = sequelize.define('BlogEntry', {
    title: Sequelize.STRING,  // entry title
    author: Sequelize.STRING, // author of the entry
    entry: Sequelize.TEXT, // main text for the entry
    views: Sequelize.INTEGER, // number of views
    postDate: Sequelize.DATE // Date the entry was posted
});


// Define our "User" and "Task" models

var User = sequelize.define('User', {
    fullName: Sequelize.STRING, // the user's full name (ie: "Jason Bourne")
    title: Sequelize.STRING // the user's title within the project (ie, developer)
});

var Task = sequelize.define('Task', {
    title: Sequelize.STRING, // title of the task
    description: Sequelize.TEXT // main text for the task
});

// Associate Tasks with user & automatically create a foreign key
// relationship on "Task" via an automatically generated "UserId" field

User.hasMany(Task);

sequelize.sync().then(function () {
    
    // Create user "Jason Bourne"
    User.create({
        fullName: "Jason Bourne",
        title: "developer"
    }).then(function (user) {

        console.log("user created");
        
            // Create "Task 1" for the new user
        Task.create({
            title: "Task 1",
            description: "Task 1 description",
            UserId: user.id // set the correct Userid foreign key
        }).then(function(){ console.log("Task 1 created")});

        // Create "Task 2" for the new user
        Task.create({
            title: "Task 2",
            description: "Task 2 description",
            UserId: user.id // set the correct Userid foreign key
        }).then(function(){ console.log("Task 2 created")});
    });

});

var Name = sequelize.define('Name', {
    fName: Sequelize.STRING,  // first Name
    lName: Sequelize.STRING, // Last Name
});

sequelize.sync().then(function () {

    Name.create({
        fName: "Kyler",
        lName: "Odin"
    }).then(function(){ console.log("Kyler Odin created")});

    Name.create({
        fName: "Grier",
        lName: "Garrick"
    }).then(function(){ console.log("Grier Garrick created")});

    Name.create({
        fName: "Kolby",
        lName: "Greyson"
    }).then(function(){ console.log("Kolby Greyson created")});

});

sequelize.sync().then(function () {

    Name.findAll({ 
        attributes: ['fName']
    }).then(function(data){        
        console.log("All first names");
        for(var i =0; i < data.length; i++){
            console.log(data[i].fName);
        }
    });

    Name.findAll({ 
        attributes: ['fName'],
        where: {
            id: 2
        }
    }).then(function(data){
        console.log("All first names where id == 2");
        for(var i =0; i < data.length; i++){
            console.log(data[i].fName);
        }
    });

});
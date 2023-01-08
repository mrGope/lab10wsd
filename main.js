const express = require("express")
const app = express();
const port = 3004;

const mysql=require("./connection").con
//configuration
app.set("view engine","hbs");
app.set("views", "./view");
app.use(express.static(__dirname+"./public"))
//Routing
app.get("/",(req,res)=>{
    res.render("index")
});
app.get("/add", (req, res) => {
    res.render("add")

});
app.get("/search", (req, res) => {
    res.render("search")

});
app.get("/update", (req, res) => {
    res.render("update")

});

app.get("/delete", (req, res) => {
    res.render("delete")

});


app.get("/view", (req, res) => {
    let qry = "select * from webusers ";
    mysql.query(qry, (err, results) => {
        if (err) throw err
        else {
            res.render("view", { data: results });
        }

    });

});


app.get("/addstudent", (req, res) => {
    // fetching data from form
    const { name, phone, email, gender } = req.query

    // Sanitization XSS...
    let qry = "select * from webusers where emailid=? or phoneno=?";
    mysql.query(qry, [email, phone], (err, results) => {
        if (err)
            throw err
        else {

            if (results.length > 0) {
                res.render("add", { checkmesg: true })
            } else {

                // insert query
                let qry2 = "insert into webusers values(?,?,?,?)";
                mysql.query(qry2, [name, phone, email, gender], (err, results) => {
                    if (results.affectedRows > 0) {
                        res.render("add", { mesg: true })
                    }
                })
            }
        }
    })
});


app.get("/searchstudent", (req, res) => {
    // fetch data from the form


    const { phone } = req.query;

    let qry = "select * from webusers where phoneno=?";
    mysql.query(qry, [phone], (err, results) => {
        if (err) throw err
        else {
            if (results.length > 0) {
                res.render("search", { mesg1: true, mesg2: false })
            } else {

                res.render("search", { mesg1: false, mesg2: true })

            }

        }
    });
})


app.get("/removestudent", (req, res) => {

    // fetch data from the form


    const { phone } = req.query;

    let qry = "delete from webusers where phoneno=?";
    mysql.query(qry, [phone], (err, results) => {
        if (err) throw err
        else {
            if (results.affectedRows > 0) {
                res.render("delete", { mesg1: true, mesg2: false })
            } else {

                res.render("delete", { mesg1: false, mesg2: true })

            }

        }
    });
});


app.listen(port,(err)=>{
    if(err)
        throw err
    else
        console.group("Server running at %d port",port);
});
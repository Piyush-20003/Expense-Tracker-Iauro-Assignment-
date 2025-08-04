//import App from "../client/App.js";

const { rejects } = require("assert")
const { isUtf8 } = require("buffer")
const e = require("cors")
const cors = require("cors")
const { NONAME } = require("dns")
const express = require("express")
const app = express()
const fs = require('fs')
const { performServerHandshake } = require("http2")
const { resolve } = require("path")
const { json, buffer } = require("stream/consumers")
const { promiseHooks } = require("v8")
const db = require('E:/VS CODE/React js/Expense Tracker/db')
const { isNull } = require("util")


const util = require('util');
const bcrypt = require('bcrypt')
const saltrounds = 8

app.use(cors())
app.use(express.json())

app.post('/submit',async (req,res)=>{
    const myname = req.body.name
    const Password = req.body.name2

    if (Password.length < 8 ||  myname.trim() === '' || Password.trim() === ''){
        return res.json({message:"Name must not be empty and Password must be at least 8 characters long"})
    }
    try{
        hashed_password = await bcrypt.hash(Password,saltrounds)
        console.log("body : ",req.body)
        console.log("myname : ",myname)
        console.log("Password : ",Password)
        if (myname != null && Password != null){
            db.query("INSERT INTO USER (name, password) VALUES (?, ?)",[myname,hashed_password],(err,result)=>{
            if (err) {
                console.log(err)
                return res.json({message:"Username already exists, Try a different Username"})
            }
            console.log('MySQL Registration : ',myname,Password)
            res.json({message:"Registration Successfull"})
        }) 
        }
    }catch (err){
        console.log(err)
        
        return res.status(500).send("Internal server error")
    }
})
app.post('/login',async(req,res)=>{

    const authHeader = req.headers['authorization']
    if (!authHeader || !authHeader.startsWith('Basic ')){
        return res.status(401).json({success:false, message: "Authorization header error" })
    }
    base64_credential = authHeader.split(' ')[1]
    converted_credential = Buffer.from(base64_credential,'base64').toString('utf-8'); 
    const [myname,Password] = converted_credential.split(':');

    const query = util.promisify(db.query).bind(db);

    if (myname != null && Password != null){
        const results = await query('SELECT id,name,password FROM USER WHERE NAME = ?',[myname])

            if(results.length > 0){
                const hashed_password = results[0].password;
                const ismatch = await bcrypt.compare(Password,hashed_password);

                if (ismatch){
                    res.json({success : true,id: results[0].id, username: results[0].name})
                    console.log("Welocome",myname)
                    console.log('MySQL Login-Check : ',myname,Password)
                }else{
                    res.status(401).json({success: false, message:"Incorrect Password"})
                    console.log("Incorrect passowrd")
                }
            
            }
            else{
                console.log("user doesnt exsist or invalid credential")
                return res.status(401).json({ success: false, message: "User not found" });
            }
        }
    }
    
)
app.post('/add_expense',(req,res)=>{
    const amount = req.body.amount;
    const category = req.body.category;
    const comment = req.body.comment;
    const user_id = req.body.user_id;

     if (category.trim() === '' || amount.trim() === '') {
        return res.status(400).json({ success: false, message: 'Amount and Category required'});
    }

    db.query('INSERT INTO EXPENSE(user_id,category,amount,comments) VALUES(?,?,?,?)',[user_id,category,amount,comment],(err,results)=>{
        if (err){
            console.log("Error in adding expense: ",err)
        }
        res.status(200).json({success:true,message:"Expense Added"})
        console.log("Expenses Added")
    })

})
app.post('/show_expense',(req,res)=>{
    const user_id = req.body.user_id;

    db.query('SELECT * FROM EXPENSE WHERE user_id = ?',[user_id],(err,results)=>{
        if (err){
            console.log("Error in displaying expenses: ",err)
            return res.status(500).send("Internal Server error")
        }
        if (results.length > 0){
               return res.status(200).json({ my_response: results }); 
            
        }else{
            res.status(403).send("Nothing to display")
        }
    })
})
app.post('/delete_expense',(req,res)=>{
    const expense_id = req.body.expense_id;
    const user_id = req.body.user_id;
    db.query('SELECT user_id FROM EXPENSE WHERE user_id = ? and expense_id = ?',[user_id,expense_id],(err,results)=>{
        if (err){
            console.log("Error in step1 delete expense")
            res.status(500).send("Internal Server Error") 
        }
        if (results.length>0){
             db.query('DELETE FROM EXPENSE WHERE expense_id = ?',[expense_id],(err,result)=>{

                if(err){
                    console.log("Error in updating expense: ",err)
                    res.send("Internal server error")
                    return 
                }
                res.send("Deleted Expense with Expense Id: "+expense_id)
            } )
        }else{
            console.log("Invalid Expense Id")
            res.status(403).send("Valid Expense Id required" );

        }
    })
   
})
app.post('/update_expense',(req,res)=>{
    const expense_id = req.body.expense_id;
    const user_id = req.body.user_id;
    const category = req.body.category;
    const amount = req.body.amount;
    const comment = req.body.comment;

    console.log("update called")
    db.query("SELECT user_id FROM EXPENSE WHERE user_id = ? and expense_id = ?",[user_id,expense_id],(err,results)=>{
        if(err){
            console.log(err)
            return res.status(500).send("Internal Server Error")
        }
        if(results.length > 0){
            db.query("UPDATE EXPENSE SET Category = ?, Amount = ?, Comments = ? WHERE expense_id = ?",[category,amount,comment,expense_id],(err,result)=>{
                if (err){
                    console.log(err)
                    return res.status(500).send("Internal Server Error")
                }
                res.status(200).send("Expenses updated")
            })
        }else{
           return res.status(403).send("Valid Expense Id required");
        }
    })

})



app.post('/delete_specific',async (req,res)=>{
    const name1 = req.body.name

    db.query('Delete from user where name = ?',name1,(err)=>{
        if(err){
             console.log(err)
        }
        res.send("User Deleted")
        console.log("User Deleted")
    })
})


app.post('/alive',(req,res)=>{
    //console.log("Server is alive.")
    res.send("Server is alive") 
})

app.post('/hello',(req,res)=>{
    res.send("Hi this is server side")
})
const port = 5000

app.listen(port,() => {
    console.log("Listening to ",port)
})

import { Database } from "./database.js";

Database.connection.query("CREATE DATABASE mydb", (err, result)=>{
    if(err) throw err;
    console.log(`Database created ${result}`);
})
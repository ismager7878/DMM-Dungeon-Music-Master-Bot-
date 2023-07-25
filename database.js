import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

export class Database{
    static connection = null;
    static {
        console.log('connecting to database');
        if(this.connection == null){
            this.connection = mysql.createConnection({
                host: process.env.DBHost,
                user: process.env.DBUser,
                password: process.env.DBPass,
            });
            this.connection.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
              });
        }
    }

    static query = (sql) => {
        this.connection.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Result: " + result);
          });
    }
}
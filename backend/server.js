const express=require('express');
const bodyParser=require('body-parser');

const cors=require('cors');

const dotenv=require('dotenv'); 

const cookieParser=require('cookie-parser');


const app=express();

app.timeout = 10000; // Set timeout to 10 seconds

app.use(express.json());
app.use(cookieParser());

const connectDB=require("./db");
const bookRoutes=require('./routes/bookRoutes');
const authRoutes=require('./routes/authRoutes');
const adminUserRoutes=require('./routes/adminUserRoutes');
const adminRoutes=require('./routes/adminRoutes');


app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin', adminRoutes);




dotenv.config();


app.use(bodyParser.json());

app.use(cors());

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the BookBank API' });
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => 
            console.log(`Server successfully connected to MongoDB and listening on port ${process.env.PORT}`)
        );
    })
    .catch(error => {
        console.error("Failed to start server due to database error.", error);
        process.exit(1);
        
        
    });




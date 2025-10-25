const express=require('express');
const app=express();
// const bodyParser=require('body-parser');

const cors=require('cors');
const frontendOrigin = 'http://localhost:5173'; 

// --- CORS Configuration ---
const corsOptions = {
    origin: frontendOrigin, // Set this to the exact origin of your React app
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // CRITICAL: MUST be true to allow cookies/credentials
    allowedHeaders: 'Content-Type,Authorization', // Include headers you expect
};

// Apply CORS middleware
app.use(cors(corsOptions));

const dotenv=require('dotenv'); 
dotenv.config();

const cookieParser=require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

const connectDB=require("./db");
const bookRoutes=require('./routes/bookRoutes');
const authRoutes=require('./routes/authRoutes');
const adminUserRoutes=require('./routes/adminUserRoutes');
const adminRoutes=require('./routes/adminRoutes');
const loanRoutes=require('./routes/loanRoute');




app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/loans', loanRoutes);







// app.use(bodyParser.json());



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




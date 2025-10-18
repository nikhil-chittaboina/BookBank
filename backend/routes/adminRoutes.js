const express = require('express');
const router = express.Router();


const protect = require('../middlewares/protect'); 
const role = require('../middlewares/role'); 
const { populateDatabase } = require('../utils/openLibraryBooksService'); 


// Apply authentication (protect) and admin authorization (role('admin')) 
// to all system administration endpoints
router.use(protect, role('admin'));

// POST /populate-db (Full URL will be /api/admin/populate-db)
router.post('/populate-db', async (req, res) => {
   
    try {
        const insertedCount = await populateDatabase();
        console.log(req.user);
        res.status(201).json({ 
            message: `Database successfully populated with ${insertedCount} books.`,
            insertedCount 
        });
    } catch (error) {
        // Return 500 status if the population service throws an error
        res.status(500).json({ error: 'Database population failed.', details: error.message });
    }
});



module.exports = router;
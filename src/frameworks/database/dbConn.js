const mongoose = require('mongoose');

class MongoDBConnection {
    static async connect(uri) {
        try {
            await mongoose.connect(uri, {
            });
            console.log('MongoDB connected successfully');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            throw error;
        }
    }

    static disconnect() {
        return mongoose.disconnect();
    }
}

module.exports = MongoDBConnection;

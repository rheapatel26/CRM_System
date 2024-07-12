import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = 'mongodb+srv://therheawayin:XbpaL8jdNczcAKtc@cluster0.3zc2pxs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    console.log('Attempting to connect to MongoDB with URI:', uri);

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

export default connectDB;

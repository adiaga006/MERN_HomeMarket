const mongoose = require("mongoose");
try {
  mongoose.connect(process.env.DB_CLOUD, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  console.log("Dsatabase Connected Successfully");
} catch (err) {
  console.log("Database Not Connected");
}

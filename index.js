const express = require("express")
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 6000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.slzlwhi.mongodb.net/registrationFormDB`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number,
    weight: Number,
    height: Number,
    Previous_or_Existing_Diseases_Conditions: String,
    current_medication: String,
    Allergies: String,
    Family_Medical_History: String,
    Symptoms: String,
    Primary_Care_Physician: String,
    Primary_Care_Physician_contact: Number,
    Contact_Information: Number,
    Emergency_Contact_Information: Number,
    address: String,
});


// model of registration schema
const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/index.html")
})

app.post("/register", async (req, res) => {
    try {
        const { name, email, age, weight, height, Previous_or_Existing_Diseases_Conditions, current_medication, Allergies, Family_Medical_History, Symptoms, Primary_Care_Physician, Primary_Care_Physician_contact, Contact_Information, Emergency_Contact_Information, address } = req.body;

        const existingUser = await Registration.findOne({ email: email });
        // check for existing user
        if (!existingUser) {
            const registrationData = new Registration({
                name,
                email,
                age,
                weight,
                height,
                Previous_or_Existing_Diseases_Conditions,
                current_medication,
                Allergies,
                Family_Medical_History,
                Symptoms,
                Primary_Care_Physician,
                Primary_Care_Physician_contact,
                Contact_Information,
                Emergency_Contact_Information,
                address
            });

            await registrationData.save();
            res.redirect("/success");
        }
        else {
            console.log("user already exist");
            res.redirect("/error");
        }



    } catch (error) {
        console.log(error);
        res.redirect("error");
    }
})

app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/pages/success.html")
})
app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/pages/error.html");
})


app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})
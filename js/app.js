console.log("Patient Record System loaded");

const patientForm = document.getElementById("patientForm");
const patientList = document.getElementById("patientList");
const searchButton = document.getElementById("searchButton");
const searchId = document.getElementById("searchId");
const searchResult = document.getElementById("searchResult");
const savedPatients = localStorage.getItem("patients");
let patients = [];

if (savedPatients) {
    patients = JSON.parse(savedPatients);
}

console.log("Loaded patients:", patients);

function displayPatients() {
    patientList.innerHTML = "";
    patients.forEach(function (patient) {

        const patientParagraph = document.createElement("p");
        patientParagraph.textContent = `Patient ID: ${patient.patientId}, Name: ${patient.firstName} ${patient.lastName}, Date of Birth: ${patient.dateOfBirth}, Age: ${patient.age}, Height: ${patient.height} cm, Weight: ${patient.weight} kg, BMI: ${patient.bmi}, BMI Category: ${patient.bmiCategory}, Sex: ${patient.sex}, Mobile: ${patient.mobile}, Email: ${patient.email}, Health Info: ${patient.healthInfo}`;
        patientList.appendChild(patientParagraph);

    });

}

displayPatients();

patientForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const patientId = document.getElementById("patientId").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const dateOfBirth = document.getElementById("dateOfBirth").value;
    const height = Number(document.getElementById("height").value);
    const weight = Number(document.getElementById("weight").value);
    const sex = document.getElementById("sex").value;
    const mobile = document.getElementById("mobile").value;
    const email = document.getElementById("email").value;
    const healthInfo = document.getElementById("healthInfo").value;

    const duplicateId = patients.some(function (patient) {
        return patient.patientId === patientId;
    });

    if (duplicateId) {
        alert("Patient ID already exists. Please use a unique Patient ID.");
        return;
    }
    if (firstName.length < 2 || firstName.length > 20) {
        alert("First Name must be between 2 and 20 characters.");
        return;
    }

    if (lastName.length < 2 || lastName.length > 30) {
        alert("Last Name must be between 2 and 30 characters.");
        return;
    }

    const namePattern = /^[A-Za-z'-]+$/;
    if (!namePattern.test(firstName) || !namePattern.test(lastName)) {
        alert("First Name and Last Name can only contain letters, apostrophes and hyphens.");
        return;
    }
    if (height < 30 || height > 200) {
        alert("Height must be between 30 and 200 cm.");
        return;
    }


    if (weight < 1 || weight > 200) {
        alert("Weight must be between 1 and 200 kg.");
        return;
    }

    const mobilePattern = /^07[0-9]{9}$/;

    if (!mobilePattern.test(mobile)) {
        alert("Mobile number must start with '07' and be 11 digits long.");
        return;
    }

    const dob = new Date(dateOfBirth);
    const today = new Date();

    if (dob > today) {
        alert("Date of Birth cannot be in the future.");
        return;
    }   

    let age = today.getFullYear() - dob.getFullYear();
    const monthDifference = today.getMonth() - dob.getMonth();

    if (
        monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())
        
    )  {
          age--;
}



if (age < 0 || age > 120) {
    alert("Age must be between 0 and 120 years.");
    return;
}

console.log("Calculated Age:", age);

const heightInMetres = height / 100;
const bmi = weight / (heightInMetres * heightInMetres);
const roundedBmi = bmi.toFixed(1);
console.log("Calculated BMI:", roundedBmi); 

let bmiCategory = "";

if (bmi < 18.5) {
    bmiCategory = "Underweight";
} else if (bmi < 25) {
    bmiCategory = "Normal";
} else if (bmi < 30) {
    bmiCategory = "Overweight";
} else {
    bmiCategory = "Obese";
}

const patient = {
    patientId: patientId,
    firstName: firstName,
    lastName: lastName,
    dateOfBirth: dateOfBirth,
    age: age,
    height: height,
    weight: weight,
    bmi: roundedBmi,
    bmiCategory: bmiCategory,
    sex: sex,
    mobile: mobile,
    email: email,
    healthInfo: healthInfo
};


patients.push(patient);
localStorage.setItem("patients", JSON.stringify(patients));
displayPatients();
console.log(patient);
console.log("Add Patient Button clicked");
console.log("Patients:", patients);

});

searchButton.addEventListener("click", function () {
    const idToFind =searchId.value.trim();
    const foundPatient = patients.find(function (patient) {
        return patient.patientId === idToFind;
    });


    if (foundPatient) {
        searchResult.textContent = `Patient ID: ${foundPatient.patientId}, Name: ${foundPatient.firstName} ${foundPatient.lastName}, Date of Birth: ${foundPatient.dateOfBirth}, Age: ${foundPatient.age}, Height: ${foundPatient.height} cm, Weight: ${foundPatient.weight} kg, BMI: ${foundPatient.bmi}, BMI Category: ${foundPatient.bmiCategory}, Sex: ${foundPatient.sex}, Mobile: ${foundPatient.mobile}, Email: ${foundPatient.email}, Health Info: ${foundPatient.healthInfo}`;

    } else {
        searchResult.textContent = "Patient not found.";
    }

    console.log("Searching for:", idToFind);
    console.log("Found patient:", foundPatient);

});
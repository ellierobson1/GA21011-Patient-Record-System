console.log("Patient Record System loaded");

// Get references to the HTML elements used by patient record system

const patientForm = document.getElementById("patientForm");
const patientList = document.getElementById("patientList");
const searchButton = document.getElementById("searchButton");
const searchId = document.getElementById("searchId");
const searchResult = document.getElementById("searchResult");
const savedPatients = localStorage.getItem("patients");
const deleteButton = document.getElementById("deleteButton");
const deleteId = document.getElementById("deleteId");
const deleteResult = document.getElementById("deleteResult");
const editButton = document.getElementById("editButton");
const editId = document.getElementById("editId");
const editResult = document.getElementById("editResult");

// Store patients in an array and track whether a patient is being edited
let patients = [];
let editingPatientId = null;

// Load patients from Local Storage if available, convert JSON string back to an array of objects, and assign it to the patients variable

if (savedPatients) {
    patients = JSON.parse(savedPatients);
}

console.log("Loaded patients:", patients);

// Function to display patients in the patient array

function displayPatients() {
    patientList.innerHTML = "";

    patients.forEach(function (patient) {

        // Create card for each patient record

        const patientCard = document.createElement("div");
        patientCard.classList.add("patient-card");

        // Create heading for patient record
        const patientHeader = document.createElement("h3")

        patientHeader.textContent =
            `${patient.firstName} ${patient.lastName} - Patient ID: ${patient.patientId}`;

        patientCard.appendChild(patientHeader);

        // Create paragraph for patient details

        const patientDetails = document.createElement("p");

        patientDetails.innerHTML = `
    <strong>Date of Birth:</strong> ${patient.dateOfBirth}<br>
    <strong>Age:</strong> ${patient.age} years<br>
    <strong>Sex:</strong> ${patient.sex}<br>
    <strong>Height:</strong> ${patient.height} cm<br>
    <strong>Weight:</strong> ${patient.weight} kg<br>
    <strong>BMI:</strong> ${patient.bmi} (${patient.bmiCategory})
`;

        patientCard.appendChild(patientDetails);


        // Create contact details 
        const contactDetails = document.createElement("div");
        contactDetails.classList.add("patient-contact");

        contactDetails.innerHTML = `
             <h4>Contact Details</h4>
             <strong>Mobile:</strong> ${patient.mobile} <br>
            <strong>Email:</strong> ${patient.email}


            `;

        patientCard.appendChild(contactDetails);
        // Create health information section
        const healthDetails = document.createElement("div");
        healthDetails.classList.add("patient-health");

        healthDetails.innerHTML = `
            <h4>Health Information</h4>
            <p>${patient.healthInfo || "No health information recorded."}</p>
            `;

        patientCard.appendChild(healthDetails);


        // Add completed card to patient list 
        patientList.appendChild(patientCard);

    });

}
    displayPatients();

    patientForm.addEventListener("submit", function (event) {
        // Prevent the form from refreshing the page on submission
        event.preventDefault();

        const patientId = document.getElementById("patientId").value;
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const dateOfBirth = document.getElementById("dateOfBirth").value;
        //Convert height and weight values from string to number for calculations

        const height = Number(document.getElementById("height").value);
        const weight = Number(document.getElementById("weight").value);
        const sex = document.getElementById("sex").value;
        const mobile = document.getElementById("mobile").value;
        const email = document.getElementById("email").value;
        const healthInfo = document.getElementById("healthInfo").value;
        //--------------VALIDATE PATIENT DETAILS-----------------

        // Check that the patient ID is unique, before adding or updating

        const duplicateId = patients.some(function (patient) {
            return patient.patientId === patientId &&
                patient.patientId !== editingPatientId;
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

        //Prevent future dates for date of birth and check that age is between 0 and 120 years

        if (dob > today) {
            alert("Date of Birth cannot be in the future.");
            return;
        }

        // Calculate patient age based on date of birth

        let age = today.getFullYear() - dob.getFullYear();
        const monthDifference = today.getMonth() - dob.getMonth();

        // Subtract one year from age if the current month and day are before the birth month and day

        if (
            monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())

        ) {
            age--;
        }

        if (age < 0 || age > 120) {
            alert("Age must be between 0 and 120 years.");
            return;
        }

        console.log("Calculated Age:", age);

        // Convert height from cm to m and calculate BMI

        const heightInMetres = height / 100;
        const bmi = weight / (heightInMetres * heightInMetres);

        // Round BMI to one decimal place
        const roundedBmi = bmi.toFixed(1);
        console.log("Calculated BMI:", roundedBmi);

        let bmiCategory = "";

        // Determine BMI category based on calculated BMI value

        if (bmi < 18.5) {
            bmiCategory = "Underweight";
        } else if (bmi < 25) {
            bmiCategory = "Normal";
        } else if (bmi < 30) {
            bmiCategory = "Overweight";
        } else {
            bmiCategory = "Obese";
        }

        // Create a patient object with all validated patient details

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
        // Update the existing record when editing, otherwise add a new patient record to the patients array

        if (editingPatientId !== null) {

            const patientIndex = patients.findIndex(function (patient) {
                return patient.patientId === editingPatientId;
            });

            // Replace the existing patient record with the updated patient object in the patients array

            patients[patientIndex] = patient;

            editingPatientId = null;

            editResult.textContent = "Patient details updated successfully.";
            editId.value = "";
        } else {

            patients.push(patient);

        }

        // Save the updated patient array to Local Storage

        localStorage.setItem("patients", JSON.stringify(patients));

        // Refresh the displayed patient records
        displayPatients();

        // Reset the form fields after submission
        patientForm.reset();

        console.log(patient);
        console.log("Add Patient Button clicked");
        console.log("Patients:", patients);

    });

    //---------------SEARCH PATIENT------------------

    searchButton.addEventListener("click", function () {
        const idToFind = searchId.value.trim();

        // Find a patient whose patientId matches the input value
        const foundPatient = patients.find(function (patient) {
            return patient.patientId === idToFind;
        });


        if (foundPatient) {
            searchResult.textContent = `Patient ID: ${foundPatient.patientId}, Name: ${foundPatient.firstName} ${foundPatient.lastName}, Date of Birth: ${foundPatient.dateOfBirth}, Age: ${foundPatient.age}, Height: ${foundPatient.height} cm, Weight: ${foundPatient.weight} kg, BMI: ${foundPatient.bmi}, BMI Category: ${foundPatient.bmiCategory}, Sex: ${foundPatient.sex}, Mobile: ${foundPatient.mobile}, Email: ${foundPatient.email}, Health Info: ${foundPatient.healthInfo} `;

        } else {
            searchResult.textContent = "Patient not found.";
        }

        console.log("Searching for:", idToFind);
        console.log("Found patient:", foundPatient);

    });

    //---------------DELETE PATIENT------------------

    deleteButton.addEventListener("click", function () {
        const idToDelete = deleteId.value.trim();
        console.log("Patient ID to delete:", idToDelete);

        // Find the array position of the patient that should be deleted

        const patientIndex = patients.findIndex(function (patient) {
            return patient.patientId === idToDelete;

        });

        if (patientIndex === -1) {
            deleteResult.textContent = "Patient not found.";
            return;
        }

        // Remove one patient from the array at the identified position

        patients.splice(patientIndex, 1);
        localStorage.setItem("patients", JSON.stringify(patients));
        displayPatients();
        deleteResult.textContent = "Patient deleted successfully.";


    });

    //---------------EDIT PATIENT------------------

    editButton.addEventListener("click", function () {
        const idToEdit = editId.value.trim();

        const foundPatient = patients.find(function (patient) {
            return patient.patientId === idToEdit;
        });

        if (!foundPatient) {
            editResult.textContent = "Patient not found";
            return;

        }

        // Store the patient's ID so the submit event knows to edit the existing record instead of adding a new one
        editingPatientId = foundPatient.patientId;

        // Populate the form fields with the found patient's details for editing

        document.getElementById("patientId").value = foundPatient.patientId;
        document.getElementById("firstName").value = foundPatient.firstName;
        document.getElementById("lastName").value = foundPatient.lastName;
        document.getElementById("dateOfBirth").value = foundPatient.dateOfBirth;
        document.getElementById("height").value = foundPatient.height;
        document.getElementById("weight").value = foundPatient.weight;
        document.getElementById("sex").value = foundPatient.sex;
        document.getElementById("mobile").value = foundPatient.mobile;
        document.getElementById("email").value = foundPatient.email;
        document.getElementById("healthInfo").value = foundPatient.healthInfo;

        editResult.textContent = "Patient found. You can now edit the details in the form above.";
    });

console.log("Patient Record System loaded");

// Get references to the HTML elements used by patient record system

const patientForm = document.getElementById("patientForm");
const submitButton = document.getElementById("submitButton");
const formMessage = document.getElementById("formMessage");
const patientList = document.getElementById("patientList");
const searchButton = document.getElementById("searchButton");
const searchResult = document.getElementById("searchResult");
const savedPatients = localStorage.getItem("patients");
const deleteButton = document.getElementById("deleteButton");
const deleteResult = document.getElementById("deleteResult");
const editButton = document.getElementById("editButton");
const manageId = document.getElementById("manageId");
const editResult = document.getElementById("editResult");
const totalPatients = document.getElementById("totalPatients");
const averageBmiMale = document.getElementById("averageBmiMale");
const averageBmiFemale = document.getElementById("averageBmiFemale");
const underweightCount = document.getElementById("underweightCount");
const normalCount = document.getElementById("normalCount");
const overWeightCount = document.getElementById("overweightCount");
const obeseCount = document.getElementById("obeseCount")
const female50Plus = document.getElementById("female50Plus");
const sortPatients = document.getElementById("sortPatients");
const filterBmi = document.getElementById("filterBmi");


// Store patients in an array and track whether a patient is being edited
let patients = [];
let editingPatientId = null;
submitButton.textContent = "Add Patient";

// Load patients from Local Storage if available, convert JSON string back to an array of objects, and assign it to the patients variable

if (savedPatients) {
    patients = JSON.parse(savedPatients);
}

console.log("Loaded patients:", patients);

// Display patient records on the page

function displayPatients() {
    patientList.innerHTML = "";

    let patientsToDisplay = patients;

    // Filter patient records by BMI category
    if (filterBmi.value !== "all") {

        patientsToDisplay = patients.filter(function (patient) {
            return patient.bmiCategory === filterBmi.value;

        });

    }

    // Display a message to the user when there are no records to show
    if (patientsToDisplay.length === 0) {
        patientList.textContent =
            "No patient records to display. Add a new patient using the form.";
        return;
    }

    patientsToDisplay.forEach(function (patient) {

        // Create card for each patient record
        const patientCard = document.createElement("div");
        patientCard.classList.add("patient-card");

        // Create heading for patient record
        const patientHeader = document.createElement("h3");

        patientHeader.innerHTML =
    `${patient.firstName} ${patient.lastName} <span class="patient-id">| Patient ID: ${patient.patientId}</span>`;

        patientCard.appendChild(patientHeader);


        // Create paragraph for patient details

        const patientDetails = document.createElement("div");
        patientDetails.classList.add("patient-details");

        patientDetails.innerHTML = `
    <p><strong>Date of Birth</strong><span>${patient.dateOfBirth}</span></p>
    <p><strong>Age</strong><span>${patient.age ?? "Not recorded"}</span></p>
    <p><strong>Sex</strong><span>${patient.sex}</span></p>
    <p><strong>Height</strong><span>${patient.height} cm</span></p>
    <p><strong>Weight</strong><span>${patient.weight} kg</span></p>

    <p><strong>BMI</strong><span>${patient.bmi ?? "Not recorded"} ${patient.bmiCategory ? "(" + patient.bmiCategory + ")" : ""}</span></p>
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

// Sort patient records by surname 

sortPatients.addEventListener("change", function () {

    if (sortPatients.value === "surnameAZ") {

        patients.sort(function (a, b) {
            return a.lastName.localeCompare(b.lastName);
        });

    }

    if (sortPatients.value === "surnameZA") {
        patients.sort(function (a, b) {
            return b.lastName.localeCompare(a.lastName)
        });
    }

    displayPatients();

});


// Filter patient records when BMI category changes 
filterBmi.addEventListener("change", function () {
    displayPatients();

});

// Update patient statistics

function updateStatistics() {
    totalPatients.textContent = patients.length;

    // Get all male patients
    const malePatients = patients.filter(function (patient) {
        return patient.sex === "Male" && !isNaN(Number(patient.bmi));
    });

    // Calculate the total BMI of all male patients

    let totalMaleBmi = 0;

    malePatients.forEach(function (patient) {
        totalMaleBmi += Number(patient.bmi);
    });

    // Calculate average male BMI

    if (malePatients.length > 0) {
        const maleAverage = totalMaleBmi / malePatients.length;
        averageBmiMale.textContent = maleAverage.toFixed(1);

    } else {
        averageBmiMale.textContent = "0";
    }

    // Get all female patients

    const femalePatients = patients.filter(function (patient) {
        return patient.sex === "Female" && !isNaN(Number(patient.bmi));
    });

    // Calculate the total BMI of all female patients
    let totalFemaleBmi = 0;

    femalePatients.forEach(function (patient) {
        totalFemaleBmi += Number(patient.bmi);
    });

    // Calculate average female BMI 

    if (femalePatients.length > 0) {
        const femaleAverage = totalFemaleBmi / femalePatients.length;
        averageBmiFemale.textContent = femaleAverage.toFixed(1);
    } else {
        averageBmiFemale.textContent = "0";

    }


    // Count patients in each BMI category
    const underweightPatients = patients.filter(function (patient) {
        return patient.bmiCategory === "Underweight";
    });

    const normalPatients = patients.filter(function (patient) {
        return patient.bmiCategory === "Normal";
    });

    const overweightPatients = patients.filter(function (patient) {
        return patient.bmiCategory === "Overweight";
    });

    const obesePatients = patients.filter(function (patient) {
        return patient.bmiCategory === "Obese";
    });

    // Display the number of patients in each BMI category
    underweightCount.textContent = underweightPatients.length;
    normalCount.textContent = normalPatients.length;
    overweightCount.textContent = overweightPatients.length;
    obeseCount.textContent = obesePatients.length;


    // Count female patients aged 50 or above 

    const femalePatients50Plus = patients.filter(function (patient) {
        return patient.sex === "Female" && patient.age >= 50;

    });

    female50Plus.textContent = femalePatients50Plus.length;

}

displayPatients();
updateStatistics();

patientForm.addEventListener("submit", function (event) {
    // Prevent the form from refreshing the page on submission
    event.preventDefault();

    const patientId = document.getElementById("patientId").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const dateOfBirth = document.getElementById("dateOfBirth").value;
    // Convert height and weight values from string to number for calculations

    const height = Number(document.getElementById("height").value);
    const weight = Number(document.getElementById("weight").value);
    const sex = document.getElementById("sex").value;
    const mobile = document.getElementById("mobile").value;
    const email = document.getElementById("email").value;
    const healthInfo = document.getElementById("healthInfo").value;

    // Validate patient details 
    // Check that the patient ID is unique, before adding or updating

    const duplicateId = patients.some(function (patient) {
        return patient.patientId.toLowerCase() === patientId.toLowerCase() &&
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

    const namePattern = /^[A-Za-z '-]+$/;
    if (!namePattern.test(firstName) || !namePattern.test(lastName)) {
        alert("First Name and Last Name can only contain letters, apostrophes, spaces and hyphens.");
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

    // Prevent future dates for date of birth and check that age is between 0 and 120 years

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
        submitButton.textContent = "Add Patient";
        formMessage.textContent = "Patient details updated successfully.";

        manageId.value = "";
    } else {

        patients.push(patient);

    }

    // Save patient records to Local Storage

    localStorage.setItem("patients", JSON.stringify(patients));

    // Refresh the displayed patient records
    displayPatients();
    updateStatistics();

    // Reset the form fields after submission
    patientForm.reset();

    console.log(patient);
    console.log("Add Patient Button clicked");
    console.log("Patients:", patients);

});

//Search for patient by patient ID

searchButton.addEventListener("click", function () {
    const idToFind = manageId.value.trim();

    // Find a patient whose patientId matches the input value
    const foundPatient = patients.find(function (patient) {
       return patient.patientId.toLowerCase() === idToFind.toLowerCase();
    });


    if (foundPatient) {
        searchResult.innerHTML = `
    <strong>Patient found:</strong><br>
    ${foundPatient.firstName} ${foundPatient.lastName}<br>
    Patient ID: ${foundPatient.patientId}<br>
    Date of Birth: ${foundPatient.dateOfBirth}<br>
    Sex: ${foundPatient.sex}<br>
    BMI: ${foundPatient.bmi || "Not recorded"}<br>
    Mobile: ${foundPatient.mobile}<br>
    Email: ${foundPatient.email}
`;
    } else {
        searchResult.textContent = "Patient not found.";
    }

    console.log("Searching for:", idToFind);
    console.log("Found patient:", foundPatient);

});

//Delete patient record by patient ID

deleteButton.addEventListener("click", function () {
    const idToDelete = manageId.value.trim();
    console.log("Patient ID to delete:", idToDelete);

    // Find the array position of the patient that should be deleted

    const patientIndex = patients.findIndex(function (patient) {
        return patient.patientId.toLowerCase() === idToDelete.toLowerCase();

    });

    if (patientIndex === -1) {
        deleteResult.textContent = "Patient not found.";
        return;
    }

    // Ask the user to confirm that they want to delete the patient

    const confirmDelete = confirm(
        "Are you sure you want to delete this patient record?"
    );

    if (!confirmDelete) {
        deleteResult.textContent = "Delete cancelled";
        return;
    }

    // Remove one patient from the array at the identified position

    patients.splice(patientIndex, 1);
    localStorage.setItem("patients", JSON.stringify(patients));
    displayPatients();
    updateStatistics();
    deleteResult.textContent = "Patient deleted successfully.";


});

//Edit an existing patient record by patient ID

editButton.addEventListener("click", function () {
    const idToEdit = manageId.value.trim();

   const foundPatient = patients.find(function (patient) {
    return patient.patientId.toLowerCase() === idToEdit.toLowerCase();
});

    if (!foundPatient) {
        editResult.textContent = "Patient not found";
        return;

    }

    // Store the patient's ID so the submit event knows to edit the existing record instead of adding a new one
    editingPatientId = foundPatient.patientId;
    submitButton.textContent = "Update Patient";

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

//Clears the form fields and gets rid of patient details updated message
patientForm.addEventListener("input", function () {
    formMessage.textContent = "";
});
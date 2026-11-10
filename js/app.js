

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
const recordManagementButtons = document.getElementById("recordManagementButtons");
const manageId = document.getElementById("manageId");
const editResult = document.getElementById("editResult");
const totalPatients = document.getElementById("totalPatients");
const averageBmiMale = document.getElementById("averageBmiMale");
const averageBmiFemale = document.getElementById("averageBmiFemale");
const underweightCount = document.getElementById("underweightCount");
const normalCount = document.getElementById("normalCount");
const overweightCount = document.getElementById("overweightCount");
const obeseCount = document.getElementById("obeseCount");
const female50Plus = document.getElementById("female50Plus");
const sortPatients = document.getElementById("sortPatients");
const filterBmi = document.getElementById("filterBmi");
const clearButton = document.getElementById("clearButton");
const cancelEditButton = document.getElementById("cancelEditButton");
const formHeading = document.getElementById("formHeading");
const formInstructions = document.getElementById("formInstructions");
const resetFiltersButton = document.getElementById("resetFiltersButton");
const exportCsvButton = document.getElementById("exportCsvButton");

// Pagination controls
const previousPage = document.getElementById("previousPage");
const nextPage = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");

let currentPage = 1;
const recordsPerPage = 10;

// Store patients in an array and track whether a patient is being edited
let patients = [];
let highlightedPatientId = null;
let editingPatientId = null;
let matchingSearchIds = null;
submitButton.textContent = "Add Patient";
clearButton.hidden = false;

// Load patients from Local Storage if available, convert JSON string
//  back to an array of objects, and assign it to the patients variable

if (savedPatients) {
    patients = JSON.parse(savedPatients);
}


// Display patient records on the page

function displayPatients() {
    patientList.innerHTML = "";

    let patientsToDisplay = [...patients];

    // Show only patients matching the combined search
    if (matchingSearchIds !== null) {
        patientsToDisplay = patientsToDisplay.filter(function (patient) {
            return matchingSearchIds.includes(patient.patientId);
        });
    }

    // Filter patient records by BMI category
    if (filterBmi.value !== "all") {

        patientsToDisplay = patientsToDisplay.filter(function (patient) {
            return patient.bmiCategory === filterBmi.value;

        });

    }

    // Sort patient records by surname if sorting option is selected
    if (sortPatients.value === "surnameAZ") {
        patientsToDisplay.sort(function (a, b) {
            return a.lastName.localeCompare(b.lastName);
        });
    }

    if (sortPatients.value === "surnameZA") {
        patientsToDisplay.sort(function (a, b) {
            return b.lastName.localeCompare(a.lastName);
        });
    }

    // Calculate number of pages based on the number of patient records and records per page
    const totalPages = Math.max(1, Math.ceil(patientsToDisplay.length / recordsPerPage));

    // Keep the current page within the available range of pages
    currentPage = Math.min(currentPage, totalPages);

    // Calculate which records to display based on the current page and records per page
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const patientsOnPage = patientsToDisplay.slice(startIndex, endIndex);

    // Update pagination controls 
    pageInfo.textContent = "Page " + currentPage + " of " + totalPages;
    previousPage.disabled = currentPage === 1;
    nextPage.disabled = currentPage === totalPages;

    // Show the total number of patient records displayed

    const recordCount = document.getElementById("recordCount");
    const firstRecord = patientsOnPage.length === 0 ? 0 : startIndex + 1;
    const lastRecord = startIndex + patientsOnPage.length;

    recordCount.textContent = "Showing " + firstRecord + "–" + lastRecord +
        " of " + patientsToDisplay.length + " patient records.";

    // Display a message to the user when there are no records to show
    if (patientsOnPage.length === 0) {


        if (patients.length === 0) {
            patientList.innerHTML = "<tr><td colspan='7'>No patient records available. Please add a new patient.</td></tr>";
        } else {
            patientList.innerHTML = "<tr><td colspan='7'>No matching patients found. Try a different name or adjust your filters.</td></tr>";
        }
        return;
    }


    patientsOnPage.forEach(function (patient) {

        // Create table row for each patient record
        const patientRow = document.createElement("tr");

        // Highlight the patient table row if it matches the searched patient ID
        if (highlightedPatientId !== null &&
            String(patient.patientId).toLowerCase() === highlightedPatientId.toLowerCase()) {
            patientRow.classList.add("highlighted");
        }

        // Create the patient table row
        patientRow.innerHTML = `
    <td>${patient.patientId}</td>
    <td>${patient.firstName} ${patient.lastName}</td>
    <td>${patient.age ?? "Not recorded"}</td>
    <td>${patient.sex}</td>
    <td>${patient.bmi ?? "Not recorded"}</td>
    <td>${patient.bmiCategory || "Not recorded"}</td>
    <td>
        <button type="button" class="view-details-button">
            View Details
        </button>
    </td>
`;

        // Add the patient row to the patient table
        patientList.appendChild(patientRow);

        // Show or hide the patient details when the "View Details" button is clicked
        const viewDetailsButton = patientRow.querySelector(".view-details-button");
        viewDetailsButton.setAttribute("aria-expanded", "false");
        viewDetailsButton.addEventListener("click", function () {

            // Check if the patient details are already displayed
            const existingDetails = patientRow.nextElementSibling;

            if (existingDetails && existingDetails.classList.contains("patient-details-row")) {
                existingDetails.remove();
                viewDetailsButton.textContent = "View Details";
                viewDetailsButton.setAttribute("aria-expanded", "false");
                return;
            }
            // Create expanded patient details row
            const detailRow = document.createElement("tr");
            detailRow.classList.add("patient-details-row");

            const detailCell = document.createElement("td");
            detailCell.colSpan = 7;

            const details = document.createElement("div");
            details.classList.add("expanded-details");

            // Create the content for the expanded patient details
            const fields = [
                ["Date of Birth", patient.dateOfBirth],
                ["Height", patient.height != null ? patient.height + " cm" : "Not recorded"],
                ["Weight", patient.weight != null ? patient.weight + " kg" : "Not recorded"],
                ["Mobile", patient.mobile],
                ["Email", patient.email],
                ["Health Info", patient.healthInfo]
            ];

            fields.forEach(function (field) {
                const paragraph = document.createElement("p");
                const label = document.createElement("strong");

                label.textContent = field[0] + ": ";
                paragraph.appendChild(label);
                paragraph.appendChild(
                    document.createTextNode(field[1] || "Not recorded")
                );

                details.appendChild(paragraph);
            });

            detailCell.appendChild(details);
            detailRow.appendChild(detailCell);

            // Display the details underneath the selected patient
            patientRow.after(detailRow);

            // Update the button when details are expanded
            viewDetailsButton.textContent = "Hide Details";
            viewDetailsButton.setAttribute("aria-expanded", "true");

        });

    });

}


// Go to the previous page
previousPage.addEventListener("click", function () {
    if (currentPage > 1) {
        currentPage--;
        displayPatients();
    }
});

// Go to the next page
nextPage.addEventListener("click", function () {
    currentPage++;
    displayPatients();
});


// Search patients automatically as the user types
manageId.addEventListener("input", function () {
    const searchTerm = manageId.value.trim().toLowerCase();

    matchingSearchIds = null;
    highlightedPatientId = null;
    recordManagementButtons.hidden = true;
    searchResult.textContent = "";
    editResult.textContent = "";
    deleteResult.textContent = "";

    matchingSearchIds = patients
        .filter(function (patient) {
            const fullName = (
                patient.firstName + " " + patient.lastName
            ).toLowerCase();

            return patient.patientId.toLowerCase().includes(searchTerm) ||
                patient.firstName.toLowerCase().includes(searchTerm) ||
                patient.lastName.toLowerCase().includes(searchTerm) ||
                fullName.includes(searchTerm);
        })
        .map(function (patient) {
            return patient.patientId;
        });

    currentPage = 1;
    displayPatients();
});

sortPatients.addEventListener("change", function () {
    currentPage = 1; // Reset to the first page when sorting changes
    displayPatients();

});


// Filter patient records when BMI category changes 
filterBmi.addEventListener("change", function () {
    currentPage = 1; // Reset to the first page when filtering changes
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
    }).length;

    normalCount.textContent = patients.filter(function (patient) {
        return patient.bmiCategory === "Normal";
    }).length;

    overweightCount.textContent = patients.filter(function (patient) {
        return patient.bmiCategory === "Overweight";
    }).length;

    obeseCount.textContent = patients.filter(function (patient) {
        return patient.bmiCategory === "Obese";
    }).length;



    // Count female patients aged 50 or above
    female50Plus.textContent = patients.filter(function (patient) {
        return patient.sex === "Female" && patient.age >= 50;
    }).length;

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

    // Convert height from cm to m and calculate BMI

    const heightInMetres = height / 100;
    const bmi = weight / (heightInMetres * heightInMetres);

    // Round BMI to one decimal place
    const roundedBmi = bmi.toFixed(1);

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
        clearButton.hidden = false;
        formMessage.textContent = "Patient details updated successfully.";
        cancelEditButton.hidden = true;
        formHeading.textContent = "  Add Patient Record";
        formInstructions.textContent = "Enter patient details below to add a new record.";
        document.getElementById("patientId").disabled = false;
    } else {

        patients.unshift(patient);
        formMessage.textContent = "Patient added successfully.";

    }

    // Save patient records to Local Storage

    localStorage.setItem("patients", JSON.stringify(patients));

    // Refresh the live search after adding or editing a patient
    manageId.dispatchEvent(new Event("input"));

    displayPatients();
    updateStatistics();

    // Reset the form fields after submission
    patientForm.reset();


});

//Search for patient by patient ID

searchButton.addEventListener("click", function () {
    recordManagementButtons.hidden = true;
    editResult.textContent = "";
    deleteResult.textContent = "";
    matchingSearchIds = null; // Reset the matching search IDs when searching by patient ID

    const idToFind = manageId.value.trim();

    // Find a patient whose patientId matches the input value

    const matchingPatients = patients.filter(function (patient) {
        const searchTerm = idToFind.toLowerCase();

        const fullName = (
            patient.firstName + " " + patient.lastName
        ).toLowerCase();

        return patient.patientId.toLowerCase() === searchTerm ||
            patient.firstName.toLowerCase() === searchTerm ||
            patient.lastName.toLowerCase() === searchTerm ||
            fullName === searchTerm;
    });

    if (matchingPatients.length > 1) {
        matchingSearchIds = matchingPatients.map(function (patient) {
            return patient.patientId;
        });

        searchResult.classList.remove("error");
        searchResult.textContent =
            matchingPatients.length + " patients match your search. " +
            "Their records are displayed in the table below. " +
            "Use a Patient ID to select a record for editing or deleting.";

        highlightedPatientId = null;
        recordManagementButtons.hidden = true;
        currentPage = 1;
        filterBmi.value = "all";

        displayPatients();
        return;
    }


   const foundPatient = matchingPatients.length === 1
    ? matchingPatients[0]
    : null;

    highlightedPatientId = foundPatient ? foundPatient.patientId : null;


    // Reset the BMI filter if it is hiding the searched patient
    if (foundPatient && filterBmi.value !== "all" &&
        foundPatient.bmiCategory !== filterBmi.value) {

        filterBmi.value = "all";
    }
    // Go to the page containing the searched patient
    if (foundPatient) {
        recordManagementButtons.hidden = false; // Show the edit and delete buttons when a patient is found
        let patientsToSearch = [...patients];

        // Apply the current BMI filter
        if (filterBmi.value !== "all") {
            patientsToSearch = patientsToSearch.filter(function (patient) {
                return patient.bmiCategory === filterBmi.value;
            });
        }

        // Apply the current sorting order
        if (sortPatients.value === "surnameAZ") {
            patientsToSearch.sort(function (a, b) {
                return a.lastName.localeCompare(b.lastName);
            });
        }

        if (sortPatients.value === "surnameZA") {
            patientsToSearch.sort(function (a, b) {
                return b.lastName.localeCompare(a.lastName);
            });
        }

        const patientIndex = patientsToSearch.findIndex(function (patient) {
            return patient.patientId === foundPatient.patientId;
        });

        if (patientIndex !== -1) {
            currentPage = Math.floor(patientIndex / recordsPerPage) + 1;
        }
    }

    displayPatients();

    if (foundPatient) {
        searchResult.classList.remove("error");
        searchResult.innerHTML = `
    <strong>Patient found:</strong><br>
    ${foundPatient.firstName} ${foundPatient.lastName}<br>
    Patient ID: ${foundPatient.patientId}<br>
    Date of Birth: ${foundPatient.dateOfBirth}<br>
    Sex: ${foundPatient.sex}<br>
    Age: ${foundPatient.age ?? "Not recorded"}<br>
    BMI: ${foundPatient.bmi || "Not recorded"}<br>
   BMI Category: ${foundPatient.bmiCategory || "Not recorded"}<br>
    Mobile: ${foundPatient.mobile}<br>
    Email: ${foundPatient.email}
`;
    } else {
        searchResult.classList.add("error");
        if (idToFind === "") {
            searchResult.textContent = "Please enter a Patient ID to search.";
        } else {
            searchResult.textContent = "Patient not found.";
        }
    }

});

//Delete patient record by patient ID

deleteButton.addEventListener("click", function () {
    searchResult.textContent = "";
    editResult.textContent = "";


    const idToDelete = manageId.value.trim();

    // Validate that a patient ID has been entered before attempting to delete

    if (idToDelete === "") {
        deleteResult.textContent = "Please enter a Patient ID to delete.";
        return;
    }

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
        deleteResult.textContent = "Delete cancelled.";
        return;
    }

    // Remove one patient from the array at the identified position

    patients.splice(patientIndex, 1);
    recordManagementButtons.hidden = true; // Hide the edit and delete buttons after deletion
    localStorage.setItem("patients", JSON.stringify(patients));

   // Refresh the live search after deleting a patient
manageId.dispatchEvent(new Event("input"));

updateStatistics();
deleteResult.textContent = "Patient deleted successfully.";
});

//Edit an existing patient record by patient ID

editButton.addEventListener("click", function () {
    searchResult.textContent = "";
    deleteResult.textContent = "";
    formMessage.textContent = "";



    const idToEdit = manageId.value.trim();
    if (idToEdit === "") {
        editResult.textContent = "Please enter a Patient ID to edit.";
        return;
    }

    const foundPatient = patients.find(function (patient) {
        const searchTerm = idToEdit.toLowerCase();

        const fullName = (
            patient.firstName + " " + patient.lastName
        ).toLowerCase();

        return patient.patientId.toLowerCase() === searchTerm ||
            patient.firstName.toLowerCase() === searchTerm ||
            patient.lastName.toLowerCase() === searchTerm ||
            fullName === searchTerm;
    });

    if (!foundPatient) {
        editResult.textContent = "Patient not found";
        return;

    }

    // Store the patient's ID so the submit event knows to edit the existing record instead of adding a new one
    editingPatientId = foundPatient.patientId;
    submitButton.textContent = "Update Patient";
    cancelEditButton.hidden = false;
    clearButton.hidden = true;
    formHeading.textContent = "  Edit Patient Record";
    formInstructions.textContent = "Edit the patient details below and click 'Update Patient' to save changes.";

    // Automatically scroll to the form for editing when a patient is found
    patientForm.scrollIntoView({ behavior: "smooth" });

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
    document.getElementById("patientId").disabled = true;
    editResult.textContent = "Patient found. You can now edit the details in the form below.";
});

//Clears the form fields and gets rid of patient details updated message
patientForm.addEventListener("input", function () {
    formMessage.textContent = "";
});

//Cancel editing and reset the form to add a new patient
cancelEditButton.addEventListener("click", function () {
    editingPatientId = null;
    patientForm.reset();

    document.getElementById("patientId").disabled = false;
    submitButton.textContent = "Add Patient";
    cancelEditButton.hidden = true;
    clearButton.hidden = false;
    formHeading.textContent = "  Add Patient Record";
    recordManagementButtons.hidden = true; // Hide the edit and delete buttons when cancelling edit
    formMessage.textContent = "Edit cancelled. You can now add a new patient.";
    editResult.textContent = "";
});

// Clear form fields and reset the form to add a new patient
clearButton.addEventListener("click", function () {
    patientForm.reset();
    formMessage.textContent = "Form cleared. You can now add a new patient.";
});

resetFiltersButton.addEventListener("click", function () {
    filterBmi.value = "all";
    sortPatients.value = "";
    manageId.value = "";
    matchingSearchIds = null;
    highlightedPatientId = null;
    currentPage = 1;
    displayPatients();
});

// Highlight the selected navigation link
const navigationLinks = document.querySelectorAll(".main-navigation a");

navigationLinks.forEach(link => {
    link.addEventListener("click", () => {
        navigationLinks.forEach(navLink => {
            navLink.classList.remove("active");
        });

        link.classList.add("active");
    });
});

// Export patient records to CSV
exportCsvButton.addEventListener("click", function () {

    // Start with a copy of all patient records
    let patientsToExport = [...patients];

    // Apply the current search results
    if (matchingSearchIds !== null) {
        patientsToExport = patientsToExport.filter(function (patient) {
            return matchingSearchIds.includes(patient.patientId);
        });
    }

    // Apply the selected BMI filter
    if (filterBmi.value !== "all") {
        patientsToExport = patientsToExport.filter(function (patient) {
            return patient.bmiCategory === filterBmi.value;
        });
    }

    // Apply the current surname sorting
    if (sortPatients.value === "surnameAZ") {
        patientsToExport.sort(function (a, b) {
            return a.lastName.localeCompare(b.lastName);
        });
    }

    if (sortPatients.value === "surnameZA") {
        patientsToExport.sort(function (a, b) {
            return b.lastName.localeCompare(a.lastName);
        });
    }

    // Do not export if no patients match the current filters
    if (patientsToExport.length === 0) {
        alert("No patient records available to export.");
        return;
    }


    // Define the CSV column headings
    const csvHeaders = [
        "Patient ID",
        "First Name",
        "Surname",
        "Date of Birth",
        "Age",
        "Sex",
        "Height (cm)",
        "Weight (kg)",
        "BMI",
        "BMI Category",
        "Mobile",
        "Email",
        "Health Info"
    ];

    // Create a row for each patient
    const csvRows = patientsToExport.map(function (patient) {
        return [
            patient.patientId,
            patient.firstName,
            patient.lastName,
            patient.dateOfBirth,
            patient.age,
            patient.sex,
            patient.height,
            patient.weight,
            patient.bmi,
            patient.bmiCategory,
            patient.mobile,
            patient.email,
            patient.healthInfo
        ];

    });


    // Safely format each value for CSV
    function escapeCsv(value) {
        let text = String(value ?? "");

        // Prevent spreadsheet formulas from being executed
        if (/^[\s]*[=+\-@\t\r]/.test(text)) {
            text = "'" + text;
        }

        return '"' + text.replace(/"/g, '""') + '"';
    }

    // Combine headings and patient rows
    const csvContent = [csvHeaders, ...csvRows]
        .map(function (row) {
            return row.map(escapeCsv).join(",");
        })
        .join("\r\n");

    // Create the downloadable CSV file
    const csvFile = new Blob(["\uFEFF", csvContent], {
        type: "text/csv;charset=utf-8;"
    });

    const downloadUrl = URL.createObjectURL(csvFile);
    const downloadLink = document.createElement("a");

    downloadLink.href = downloadUrl;
    downloadLink.download = "patient-records.csv";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    URL.revokeObjectURL(downloadUrl);

});
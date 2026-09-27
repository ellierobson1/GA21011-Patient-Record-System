console.log("Patient Record System loaded");

const patientForm = document.getElementById("patientForm");
const patientList = document.getElementById("patientList");
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
        patientParagraph.textContent = `Patient ID: ${patient.patientId}, Name: ${patient.firstName} ${patient.lastName}, DOB: ${patient.dateOfBirth}, Height: ${patient.height} cm, Weight: ${patient.weight} kg, Sex: ${patient.sex}, Mobile: ${patient.mobile}, Email: ${patient.email}, Health Info: ${patient.healthInfo}`;
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
    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;
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

    const patient = {
        patientId: patientId,
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: dateOfBirth,
        height: height,
        weight: weight,
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

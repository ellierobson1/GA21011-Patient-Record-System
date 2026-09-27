console.log("Patient Record System loaded");

const patientForm = document.getElementById("patientForm");
let patients = [];

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
    console.log(patient);
    console.log("Add Patient Button clicked");

});

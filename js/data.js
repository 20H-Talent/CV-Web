
/** Contructor to NewUser */
function NewUser(
  name,
  phone,
  zip,
  email,
  gender,
  birthDate,
  username,
  password,
  city,
  country,
  street,
  experience,
  languages,
  skills,
  jobTitle,
  company,
  website,
  profilePicture
) {
  this.name = name;
  this.phone = phone;
  this.zip = zip;
  this.email = email;
  this.gender = gender;
  this.birthDate = birthDate;
  this.username = username;
  this.password = password;
  this.city = city,
  this.street = street,
  this.country = country,
  this.experience = experience;
  this.languages = languages;
  this.skills = skills;
  this.jobTitle = jobTitle;
  this.company = company;
  this.website = website;
  this.profilePicture = profilePicture;
}

let registered;

/** Listener event to submit*/
$("#registerSubmit").submit(function(e) {
  console.log("submit actived...");
  e.preventDefault();

  /** 
  * @name getCheckedBox  Create array with checked inputs in checkbox input. 
  * @param {string} idinput - id input checkbox.
  */
  function getCheckedBox (idinput){
    return $(idinput +' input[type="checkbox"]:checked').map(function() {
      return $(this).val();
    }).get();
  }

  let password = $("#inputPassword5").val();
  let name = $("#validationname").val();
  let phone = $("#InputPhone").val();
  let zip = $("#validationZip").val();
  let email = $("#validationInputEmail").val();
  let gender = $('#genders input[type="radio"]:checked').val();
  let birthDate = $("#validationbirthDate").val();
  let username = $("#validationUsername").val();
  let city = $("#validationCity").val();
  let country = $("#validationCountry").val();
  let street = $("#validationStreet").val();
  let experience = $("#experience").val();

  let languages = getCheckedBox('#languages');
  let skills = getCheckedBox('#skills');

  let jobTitle = $("#validationJobTitle").val();
  let company = $("#validationCompany").val();
  let website = $("#validationRepository").val();

  let profilePicture = document.querySelector("input[type=file]").files[0];

  // *** CHECK variables ****
  console.log(
    name,
    phone,
    zip,
    email,
    gender,
    birthDate,
    username,
    password,
    city,
    country,
    street,
    experience,
    languages,
    skills,
    jobTitle,
    company,
    website,
    profilePicture
  );

  if (!CheckPassword(password)) {
    $("#inputPassword5")
      .addClass("border-danger is-invalid")
      .focus();
    $("#passwordHelpBlock")
      .removeClass("text-muted")
      .addClass("text-danger");
  } else {
    if ($("#inputPassword5").hasClass("border-danger")) {
      $("#inputPassword5").removeClass("border-danger is-invalid");
      $("#passwordHelpBlock")
        .addClass("text-muted")
        .removeClass("text-danger");
    }
    registered = new NewUser(
      name,
      phone,
      zip,
      email,
      gender,
      birthDate,
      username,
      password,
      city,
      country,
      street,
      experience,
      languages,
      skills,
      jobTitle,
      company,
      website,
      profilePicture
    );
    
    console.log(registered);
    
    /** Take values from NewUser object to create formBody */
    function createRequestBody(userJson) {

      let userData = {};

      userData = {
        "languages": userJson.languages,
        "skills": userJson.skills,
        "name": userJson.name,
        "username": userJson.username,
        "email": userJson.email,
        "gender": userJson.gender,
        "address": {
          "city": userJson.city,
          "street": userJson.street,
          "country": userJson.country,
          "zipcode": userJson.zip
        },
        "company": userJson.company,
        "jobTitle": userJson.jobTitle,
        "website": userJson.website,
        "birthDate": userJson.birthDate,
        "experience": userJson.experience,
        };
      
      return userData;
    }

    /** Send info to API */
    function sendNewUser() {
      let userBody = createRequestBody(registered);
      console.log(typeof userBody);

      fetch("https://cv-mobile-api.herokuapp.com/api/users", {
        method: "POST",
        body: JSON.stringify(userBody)
      })
        .then(res => res.json())
        .then(response => console.log(response))
        .catch(error => console.log(error.message));
    }

    // Need check the send info before.

    sendNewUser();
    // this.reset();
    // $("#preview").attr("src", "");
    return registered;
  }
});

/** Check Password format
 * @param {string} inputtxt */ 
function CheckPassword(inputtxt) {
  var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
  if (inputtxt.match(passw)) {
    // alert("Correct, try another...");
    return true;
  } else {
    // alert("Wrong...!");
    return false;
  }
}

/** Create previewFile in form. */
function previewFile() {
  let preview = document.querySelector("#preview");
  let file = document.querySelector("input[type=file]").files[0];
  let reader = new FileReader();

  reader.addEventListener(
    "load",
    function() {
      preview.src = reader.result;
    },
    false
  );

  if (file) {
    reader.readAsDataURL(file);
  }
}

console.log(NewUser);

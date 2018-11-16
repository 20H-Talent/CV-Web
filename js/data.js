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

/** Render all items from one objetct 
 * @name getAllElements - function return element from object list.
 * @param url - field need fill in html.
*/
getAllElements = function(url) {
  $.ajax({
    url: `https://cv-mobile-api.herokuapp.com/api/`+url,
    dataType: "json"
  }).done(function(data) {
    console.log(data);
    /** checkbox element*/
    /** clean container */
    console.log("¿Scoope?, ", url);
    $('#'+url).empty();
    /** insert value */
    data.forEach(function(val) {
      let check = `<div class="form-check custom-checkbox">
        <input class="form-check-input" type="checkbox" id='${val.label.toLowerCase()}-check' name='${url}[]' value='${val._id}'>
        <label class="form-check-label mr-5" for='${val.label.toLowerCase()}-check'>${val.label}</label>
      </div>`;

      document.getElementById(url).innerHTML += check;
    });

    return data;
  });
}

skills = getAllElements("skills");
languages = getAllElements("langs");

console.log("skills:", skills);
console.log("languages:", languages);

let registered;

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

/** Listener event to submit*/
$("#registerSubmit").submit(function(e) {
  console.log("submit actived...");
  e.preventDefault();

  /**
   * @name getCheckedBox  Create array with checked inputs in checkbox input.
   * @param {string} idinput - id input checkbox.
   */
  function getCheckedBox(idinput) {
    return $(idinput + ' input[type="checkbox"]:checked')
      .map(function() {
        return $(this).val();
      })
      .get();
  }

  /** Take values from NewUser object to create formBody */
  function createRequestBody(userJson) {
    let userData = {};

    userData = {
      name: userJson.name,
      username: userJson.username,
      email: userJson.email,
      phone: userJson.phone,
      gender: userJson.gender,
      address: {
        country: userJson.country,
        city: userJson.city,
        street: userJson.street,
        zipcode: userJson.zip
      },
      company: userJson.company,
      jobTitle: userJson.jobTitle,
      languages: userJson.languages,
      skills: userJson.skills,
      experience: userJson.experience,
      website: userJson.website,
      birthDate: userJson.birthDate
    };

    return userData;
  }

  /** Send info to API */
  function sendNewUser() {
    let userBody = createRequestBody(registered);
    console.log(typeof userBody, userBody);

    fetch("https://cv-mobile-api.herokuapp.com/api/users", {
      method: "POST",
      body: JSON.stringify(userBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(response => {
        let pong = response;
        let fileForm = new FormData();
        fileForm.append("img", registered.profilePicture);
        let id_user = response._id;
        console.log("ID: ", id_user, ". Pong: ", pong);
        fetch(`https://cv-mobile-api.herokuapp.com/api/files/upload/user/${id_user}`, {
          method: "POST",
          body: fileForm
        })
          .then(response => {console.log("Sucess:", response);
          if (response.status==200) {
            alert('Enviado correctamente');
          } else {
            alert(`Error en el envio. ${response.statusText}`);
          }})
          .catch(error => console.log("Error:", error.message));
      })
      // .then(response => console.log("Sucess:", JSON.stringify(response._id)))
      .then(response => console.log("Sucess:", response))
      .catch(error => console.log("Error:", error.message));
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

  let languages = getCheckedBox("#languages");
  let skills = getCheckedBox("#skills");

  let jobTitle = $("#validationJobTitle").val();
  let company = $("#validationCompany").val();
  let website = $("#validationRepository").val();

  let profilePicture = document.querySelector("input[type=file]").files[0];

  // *** CHECK variables ****
  // console.log(
  //   name,
  //   phone,
  //   zip,
  //   email,
  //   gender,
  //   birthDate,
  //   username,
  //   password,
  //   city,
  //   country,
  //   street,
  //   experience,
  //   languages,
  //   skills,
  //   jobTitle,
  //   company,
  //   website,
  //   profilePicture
  // );

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

    // Need check the send info before.

    sendNewUser();
    // this.reset();
    // $("#preview").attr("src", "");
    return registered;
  }
});

console.log(NewUser);

function NewCompany(
    name,
    phone,
    email,
    docType, // CIF-NIF
    docNumber, // String
    zip,
    street,
    city,
    country,
    website,
    logo,
    bio,
    employes, // Numbers
    socialUrls) { // Array de objectos
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.docType = docType; // CIF-NIF
    this.docNumber = docNumber;// String
    this.zip = zip;
    this.street = street;
    this.city = city;
    this.country = country;
    this.website = website;
    this.logo = logo;
    this.bio = bio;
    this.jobOffers = []; // Objeto?
    this.employes = employes; // Numbers
    this.socialUrls = socialUrls; // Array de objectos
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

$("#registerCompanySubmit").submit(function(e) {
  console.log("sumit actived.");
  e.preventDefault();
  
  // Need check CIF-NIF
  // método para la clase String que indica si la cadena se corresponde con un nif válido o no. 7 u 8 cifras y letra mayúscula

  String.prototype.isNif=function()
  {
    return /^(\d{7,8})([A-HJ-NP-TV-Z])$/.test(this) && ("TRWAGMYFPDXBNJZSQVHLCKE"[(RegExp.$1%23)]==RegExp.$2);
  };

// ejemplo de uso 
  //  alert("12341234H".isNif());  // devolverá false
  //  alert("00000000T".isNif()); // devolverá true

  /**
   * Function to sanitaze strings before to input.
   * @param {string} string 
   * @returns {string} string sanitaze.
   */
  function sanitarize(string) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return string.replace(reg, (match)=>(map[match]));
  }


  let name = sanitarize($("#validationCompname").val());
  let phone = $("#InputPhone").val();
  let email = $("#validationInputEmail").val();
  let docType = $("#SelectDocType").val().toLowerCase(); // CIF-NIF
  let docNumber = sanitarize($("#docNumber").val());// String
  let zip = sanitarize($("#validationZip").val());
  let street = sanitarize($("#validationStreet").val());
  let city = sanitarize($("#validationCity").val());
  let country = sanitarize($("#validationCountry").val());
  let website = $("#validationWebsite").val();
  let logo = document.querySelector("input[type=file]").files[0];;
  let bio = sanitarize($("#validationBio").val());
  let jobOffers = []; // Objeto?
  let employes = $("#validationemployees").val(); // Numbers

  let socialUrls = [];
  $("input[type=url]").each(function() {
    let key = $(this).attr("name");
    let url = $(this).val();
    socialUrls.push({"platform": key, "url": url});
  })
  console.log("SM", socialUrls);
  // let socialUrls = []

  console.log(
    name,
    phone,
    email,
    docType,
    docNumber,
    zip,
    street,
    city,
    country,
    "web: ", website,
    "logo: ", logo,
    "bio", bio,
    jobOffers,
    employes,
    socialUrls,
  );

  if (!(docNumber.isNif())) {
    $("#docNumber")
      .addClass("border-danger is-invalid").prop('title', 'No valid number.')
      .focus();
      $('[data-toggle="tooltip"]').tooltip('show');
    // $("#passwordHelpBlock")
    //   .removeClass("text-muted")
    //   .addClass("text-danger");
  } else {
    if ($("#docNumber").hasClass("border-danger")) {
      $("#docNumber").removeClass("border-danger is-invalid").prop('title', '');
      // $("#passwordHelpBlock")
      //   .addClass("text-muted")
      //   .removeClass("text-danger");
    }

  registered = new NewCompany(
    name,
    phone,
    email,
    docType,
    docNumber,
    zip,
    street,
    city,
    country,
    website,
    logo,
    bio,
    employes,
    socialUrls,
  )

  function createRequestBody() {
    let body = {
    "name": registered.name,
    "phone": registered.phone,
    "email": registered.email,
    "docType": registered.docType,
    "docNumber": registered.docNumber,
    "address": {
      "country": registered.country,
      "street": registered.street,
      "city": registered.city,
      "zipcode": registered.zip,
    },
    "website":registered. website,
    "logo": "",
    "bio": registered.bio,
    "employes": registered.employes,
    "socialUrls": registered.socialUrls,
    }
    return body;
  }

  function sendNewCompany() {
    let BodyCompany = createRequestBody();

    fetch("https://cv-mobile-api.herokuapp.com/api/companies", {
        method: "POST",
        body: JSON.stringify(BodyCompany),
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(res => res.json())
      .then(response => {
        let pong = response;
        let fileForm = new FormData();
        fileForm.append("img", registered.logo);
        let id_company = response._id;
        console.log("ID: ", id_company, ". Pong: ", pong);
        fetch(`https://cv-mobile-api.herokuapp.com/api/files/upload/company/${id_company}`, {
          method: "POST",
          body: fileForm
        })
        .then(response => console.log(response))
        .catch(error => console.log(error.message));
  })}

  sendNewCompany();
  }
})
$(document).ready(function () {
  $("#fname").on("blur", function () {
    if ($(this).val() && $(this).val().match("^[a-zA-Z]{2,16}$")) {
      console.log("Valid name");
    } else {
      console.log("That's not a name");
    }
  });

  $("#lname").on("blur", function () {
    if ($(this).val() && $(this).val().match("^[a-zA-Z]{2,16}$")) {
      console.log("Valid lastname");
    } else {
      console.log("That's not a lastname");
    }
  });

  function validatePhone(txtPhone) {
    const filter =
      /(?:(?:\+373|373|\(373\)|\+\(373\))? ?\(?([2-7][0-9])\)? ?([0-9]{6}))/gm;
    return filter.test(txtPhone);
  }
  $("#phone").on("blur", function () {
    if (!validatePhone($(this).val())) {
      console.log("Invalid phone number format");
    } else {
      alert("Success");
    }
  });

  function isEmail(email) {
    const regex =
      /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }
  $("#email").on("blur", function () {
    if (!isEmail($(this).val())) {
      return console.log("Invalid email format.");
    }
    console.log("success");
  });

  $("#form").on('submit', function(event) {
    event.preventDefault();

     // Prepare a JSON object to hold non-file data
     const jsonData = {};
        
     // Populate jsonData from form inputs
     $(this).find('input, textarea').each(function() {
         jsonData[$(this).attr('name')] = $(this).val();
     });

    $.ajax({
        url: 'https://echo.free.beeceptor.com',
        type: 'POST',
        dataType: "json",
        data: jsonData,
        success: function(response) {
            $('#response').html('<p>Response from server:' + response + '</p>');
        },
        error: function(xhr, status, error) {
            $('#response').html('<p>An error occurred:' + error + '</p>');
        }
    });
  });
});

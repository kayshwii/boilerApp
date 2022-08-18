//submitting user info
$("#frmUserForm").submit(function() { //event: submitting the form
    saveUserForm();
    return true;
});

//check the user form
function checkUserForm() { //check for empty fields
    var d = new Date();
    var month = d.getMonth() + 1;
    var date = d.getDate();
    var year = d.getFullYear();
    var currentDate = year + '/' + (('' + month).length < 2 ? '0' : '') + month + '/' + (('' + date).length < 2 ? '0' : '') + date; //formats the string to be yyyy/mm/dd by adding a 0 to the front if there is only a single digit
    if (($("#boilerID").val() != "") &&
    ($("#datePurch").val() != "") && ($("#datePurch").val() <= currentDate) &&
    ($("#maxPressure option:selected").val() != "Select Max Pressure") &&
    ($("#maxTemp option:selected").val() != "Select Max Temperature")) {
        return true;
    }
    else {
        return false;
    }

}

//save the user form
function saveUserForm() { //will create "user" json object and save it to "user" storage key in localStorage
    if (checkUserForm()) {
        var user = {//creates object user with key value pairs
            "BoilerID": $("#boilerID").val(), 
            "DatePurchased": $("#datePurch").val(),
            "MaxPressure": $("#maxPressure option:selected").val(),
            "MaxTemp": $("#maxTemp option:selected").val(),
            "NewPassword": $("#changePassword").val()
        };
        try {//turn the user object into a json object and send to localStorage
            localStorage.setItem("user", JSON.stringify(user));
            alert("Saving Info");
            $.mobile.changePage("#pageMenu");
            window.location.reload();
        }
        catch (e) {
            if(window.navigator.vendor === "Google Inc"){
                if (e == DOMException.QUOTA_EXCEEDED_ERR){
                    alert("Error: Local storage limit exceeds");
                }
            }
            else if (e == QUOTA_EXCEEDED_ERR) {
                alert("Error: Saving to local storage");
            }
            console.log(e);
        }
    }
    else { //if checkUserForm returns false give an alert
        alert("Please complete the form");
    }
}

//load the stored values from the user form
function showUserForm() {
    try {
        var user = JSON.parse(localStorage.getItem("user")); //retrieve contents of user json object
    }
    catch (e) {
        if (window.navigator.vendor ===
            "Google Inc.") {
            if (e == DOMException.QUOTA_EXCEEDED_ERR) {
              alert(
                "Error: Local Storage limit exceeds."
              );
            }
          } else if (e == QUOTA_EXCEEDED_ERR) {
            alert("Error: Saving to local storage.");
          }
          console.log(e);
    }
    if (user != null) {
        //retrieve the values from user so we can assign them to appropriate fields when showUserForm is called
        $("#boilerID").val(user.BoilerID);
        $("#datePurch").val(user.DatePurchased);
        $('#maxPressure option[value =' + user.MaxPressure + ']').attr('selected', 'selected');
        $("#maxPressure option:selected").val(user.MaxPressure);
        $('#maxPressure').selectmenu('refresh', true);
        $('#maxTemp option[value =' + user.MaxTemp + ']').attr('selected', 'selected');
        $("#maxTemp option:selected").val(user.MaxTemp);
        $('#maxTemp').selectmenu('refresh', true);
        $("#changePassword").val(user.NewPassword);
    }
}
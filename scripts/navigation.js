// add text value to the password text field
function addValueToPassword(button) { //pass the button to the function
    var currVal = $("#passcode").val(); //jquery element #id selector: $(#id). select the value from the element with id passcode
    if (button == "bksp") { //do something with the button value
        $("#passcode").val(currVal.substring(0,currVal.length-1)); //extract the substring from index 0 to 1 character less than the length of the string
    }
    else {
        $("#passcode").val(currVal.concat(button)); //append the value of the button to the string currVal
    }
}

//retrieves password from local storage if it exists otherwise returns default password
function getPassword() {
    if (typeof (Storage) == "undefined") {
        alert ("Your browser doesn't support HTML5 localStorage. Please upgrade");
    }
    else if (localStorage.getItem("user") != null) {
        return JSON.parse(localStorage.getItem("user")).NewPassword;
    }
    else { //default password
        return "2345";
    }
}

$("#btnEnter").click(function() {
    var password = getPassword();
    if (document.getElementById("passcode").value == password) {
        if (localStorage.getItem("user") == null) { //if user not created direct to creation page
            $("#btnEnter").attr("href", "#pageBoilerInfo").button();
        }
        else {
             $("#btnEnter").attr("href", "#pageMenu").button();
        }
    }
    else {
        alert ("Incorrect password. Please try again.");
    }
});
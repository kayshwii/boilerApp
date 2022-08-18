//check to see which page is active then call the appropriate functions
$(document).on("pageshow", function () {
    if ($('.ui-page-active').attr('id') == "pageBoilerInfo") {
        showUserForm();
    }
    else if ($('.ui-page-active').attr('id') == "pageRecords") {
        loadUserInformation();
        listRecords();
    }
    else if ($('.ui-page-active').attr('id') == "pageAdvice") {
        advicePage();
        resizeGraph();
    } 
    else if ($('.ui-page-active').attr('id') == "pageGraph") {
        drawGraph();
        resizeGraph();
  }
});

function loadUserInformation() {
    try {
        var user = JSON.parse(localStorage.getItem("user"));
    }
    catch (e) {
        if (window.navigator.vendor === "Google Inc.") {
            if (e == DOMException.QUOTA_EXCEEDED_ERR) {
                alert("Error: Local storage limit exceeds");
            }
        }
        else if (e == QUOTA_EXCEEDED_ERR) {
            alert("Error: saving to local storage");
        }
        console.log(e);
    }
    if (user != null) {
        $("#divUserSection").empty();

        //display pressure info
        if (user.MaxPressure == "Big") {
            user.MaxPressure = "BigPressure";
        }
        else if (user.MaxPressure == "Med") {
            user.MaxPressure = "MedPressure";
        }
        else if (user.MaxPressure == "Low") {
            user.MaxPressure = "LowPressure";
        }

        //display temp info
        if (user.MaxTemp == "Super") {
            user.MaxTemp = "SuperHot";
        }
        else if (user.MaxTemp == "Hot") {
            user.MaxTemp = "HotHot";
        }
        else if (user.MaxTemp == "Lukewarm") {
            user.MaxTemp = "LukewarmHot";
        }

        //display relevant user info
        $("#divUserSection").append("Boiler ID: " + user.BoilerID +
        "<br>Date Purchased: " + user.DatePurchased +
        "<br>Pressure Rating: " + user.MaxPressure +
        "<br>Temperature Rating: " + user.MaxTemp);
        $("#divUserSection").append("<br><a href='#pageBoilerInfo' data-mini='true' data-role='button' data-icon='edit' data-iconpos='left' data-inline='true' >Edit Profile</a>");
        $('#divUserSection [data-role="button"]').button(); //refresh the button
    }
}

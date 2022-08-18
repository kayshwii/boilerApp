//remove all records from localStorage
$("#btnClearHistory").click(function() {
  localStorage.removeItem("tbRecords");
  listRecords();
  alert("all records deleted");
});

/*Lots of functions here. Going to break it down for myself to reference in the future
* when btnAddRecord is clicked the function is triggered and changes the value of btnSubmitRecord to "Add"
* we use this value to to trigger another function to clear the record form on pageNewRecordForm
*/
$("#btnAddRecord").click(function () {
    //button("refresh") function forces jQuery to refresh the text on the button
    $("#btnSubmitRecord").val("Add").button("refresh");
  });

/*we want to recycle pageNewRecordForm for adding and editing information about the boiler
* when the page is called with a value of "Add" it will have blank inputs to enter info
* when called with value "Edit" we will load stored data into the form
*/
$("#pageNewRecordForm").on("pageshow", function() {
    var formOperation = $("#btnSubmitRecord").val();

    if (formOperation == "Add") {
        clearRecordForm();
    }
    else if (formOperation == "Edit") {
        //load the stored data to be edited
        showRecordForm($("#btnSubmitRecord").attr("indexToEdit"));
    }
});

/*after clicking the button the submit event is triggered for the form with id fromNewRecordForm
* when the form is submitted with value of "Add", addRecord() then go back to pageRecords
* go to callEdit to see what happens with the value Edit
*/
$("#frmNewRecordForm").submit(function() {
    var formOperation = $("#btnSubmitRecord").val();

    if (formOperation == "Add") {
        addRecord();
        $.mobile.changePage("#pageRecords");
    } 
    else if (formOperation == "Edit") {
        editRecord($("#btnSubmitRecord").attr("indexToEdit"));
        $.mobile.changePage("#pageRecords");
        $("#btnSubmitRecord").removeAttr("indexToEdit");
    }
    //return false or get some kind of error i cant quite comprehend
    return false;
})

//we recycle the form with this function when a new record is added
function clearRecordForm() {
    $('#recordDate').val("");
    $('#recordPressure').val("");
    $('#recordTemp').val("");
    return true;
}

/*first if checkRecordForm returns true then this function creates the "record" JSON object and save to local
* once a record is created it's pushed to the end of the tbRecords array. then stringify it to return it to 
* local storage woth setItem. clearRecordForm is called to clean up the form, listRecords is called to update
* the history section of the records page. at the end it returns true to the calling function.
*/
function addRecord() {
    if (checkRecordForm()) {
        var record = {
            "Date" : $("#recordDate").val(),
            "Pressure" : $("#recordPressure").val(),
            "Temp" : $("#recordTemp").val()
        };
        
        try {
            var tbRecords = JSON.parse(localStorage.getItem("tbRecords")); //assign the array to a variable
            if (tbRecords == null) { //if this is the first record then we create the array
              tbRecords = [];
            }
            tbRecords.push(record);
            tbRecords.sort(compareDates);
            localStorage.setItem("tbRecords", JSON.stringify(tbRecords));
            alert("Saving information");
            clearRecordForm();
            listRecords();
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
    }
    else {
        alert("Please dude...");
    }
    return true;
}

//simple function to verify the form data is all entered correctly
function checkRecordForm() {
    var d = new Date();
    var month = d.getMonth() + 1;
    var date = d.getDate();
    var year = d.getFullYear();
    var currentDate = year + '/' + (('' + month).length < 2 ? '0' : '') + month + '/' + (('' + date).length < 2 ? '0' : '') + date;

    if (($("#recordDate").val() != "" )&& ($("#recordDate").val() <= currentDate) &&
    ($("#recordPressure").val() != "") &&
    ($("#recordTemp").val() != "")) {
        return true;
    }
    else {
        return false;
    }
}

/*this function updates the history section in pageRecords. first it compares dates to order the records
* then it creates a table with html elements to display the data.
*/
function listRecords() {
    try {
        var tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
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
    if (tbRecords != null) {
        //set the records in order by date
        tbRecords.sort(compareDates);

        //initialize the table in the history section with id tblRecords
        $("#tblRecords").html(
            "<thead>" +
            "   <tr>" +
            "     <th>Date</th>" +
            "     <th>Pressure</th>" +
            "     <th>Temperature</th>" +
            "     <th>Edit / Delete</th>" +
            "   </tr>" +
            "</thead>" +
            "<tbody>" +
            "</tbody>");
            
        /*loop to insert each record to the table. each time it loops: create a new record number (i) and append a new table to the history section
        * it also creates the edit and delete buttons that call the edit function to that record number.
        */
        for (var i = 0; i < tbRecords.length; i++) {
            var rec = tbRecords[i];
            $("#tblRecords tbody").append(
                "<tr>" +
                "   <td>" + rec.Date + "</td>" +
                "   <td>" + rec.Pressure + "</td>" +
                "   <td>" + rec.Temp + "</td>" +
                "   <td><a data-inline='true' data-mini='true' data-role='button' href='#pageNewRecordForm' onclick='callEdit(" + i + ")' data-icon='edit' data-iconpos='notext'></a>" +
                "   <a data-inline ='true' data-mini='true' data-role='button' href='#' onclick='callDelete(" + i + ")' data-icon='delete' data-iconpos='notext'></a></td>" +
                "</tr>"
            );
        }
        //refresh the buttons or they wont appear
        $('#tblRecords [data-role="button"]').button();
    }
    else {
        //if there is no data, create an empty array
        tbRecords = [];
        $("#tblRecords").html("");
    }
    return true;
}

/*we want to display records in order. this function takes two records as parameters which we call a and b. 
* creates two variables x and y using the Date field. it then compares the dates and returns a 1 or -1
*/
function compareDates(a, b) {
    var x = new Date(a.Date);
    var y = new Date(b.Date);
  
    if (x > y) {
      return 1;
    } else {
      return -1;
    }
}

/*get the records from a specified index and assign them so when we call this function we can display the data
 * the values of the form fields are updated using corresponding values from rec variable
 */
function showRecordForm(index) {
  try {
    var tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
    var rec = tbRecords[index];
    $('#recordDate').val(rec.Date);
    $('#recordPressure').val(rec.Pressure);
    $('#recordTemp').val(rec.Temp);
  } catch (e) {
    if (window.navigator.vendor === "Google Inc.") {
      if (e == DOMException.QUOTA_EXCEEDED_ERR) {
        alert("Error: Local Storage limit exceeds."
        );
      }
    } else if (e == QUOTA_EXCEEDED_ERR) {
      alert("Error: Saving to local storage.");
    }

    console.log(e);
  }
}

/*when the value of btnSubmitRecord is "Edit" the attribute indexToEdit is added to the button and the value of the attribute
* is set to the index of the record that was passed to the function. when this function is called from the edit button it takes
* us to pageNewRecordForm but with the forms filled out with data from the record's index
*/
function callEdit(index) {
    $("#btnSubmitRecord").attr("indexToEdit", index);
    $("#btnSubmitRecord").val("Edit").button("refresh");
}
 
function callDelete(index) {
    deleteRecord(index);
    listRecords();
}

/*very similar to addRcords. after checkRecordForm returns true we will getItem the tbRecords and store them in a variable. 
* then we convert them to an array with JSON.parse, The records associated with the index are then subsituted with a new JSON
* object defined by the form field values (Name : value)
*/
function editRecord(index) {
    if (checkRecordForm()) {
      try {
        var tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
        tbRecords[index] = {
          "Date": $('#recordDate').val(),
          "Pressure": $('#recordPressure').val(),
          "Temp": $('#recordTemp').val(),
        };
        tbRecords.sort(compareDates);
        localStorage.setItem("tbRecords", JSON.stringify(tbRecords)); //stringify to save array to local storage
        alert("Saving Information");
        clearRecordForm();
        listRecords();
      } catch (e) {
        if (window.navigator.vendor === "Google Inc.") {
          if (e == DOMException.QUOTA_EXCEEDED_ERR) {
            alert("Error: Local Storage limit exceeds."
            );
          }
        } else if (e == QUOTA_EXCEEDED_ERR) {
          alert("Error: Saving to local storage.");
        }
  
        console.log(e);
      }
    } else {
      alert("Please complete the form properly.");
    }
}

/*same as before we get the records and assign them. now we invoke the splice function to remove items from the array.
 * tbRecords.splice(index, 1) removes one item starting from the location given by the index. if we empty the array we 
 * remove the whole array with removeItem
 */
function deleteRecord(index) {
    try {
      var tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
      tbRecords.splice(index, 1);
  
      if (tbRecords.length == 0) {
        //remove entire array from localStorage
        localStorage.removeItem("tbRecords");
      } else {
        localStorage.setItem("tbRecords", JSON.stringify(tbRecords));
      }
    } catch (e) {
      if (window.navigator.vendor === "Google Inc.") {
        if (e == DOMException.QUOTA_EXCEEDED_ERR) {
          alert("Error: Local Storage limit exceeds."
          );
        }
      } else if (e == QUOTA_EXCEEDED_ERR) {
        alert("Error: Saving to local storage.");
      }
  
      console.log(e);
    }
}




function drawGraph() {
    if (localStorage.getItem("tbRecords") === null) {
        alert ("No records exist.");
        $(location).attr("href, #pageMenu");
    }
    else {
        setupCanvas();
        var pressureArray = new Array();
        var dateArray = new Array();
        getPressureHistory(pressureArray, dateArray);
        
        //create array with length of 2
        var pressureLower = new Array(2);
        var pressureUpper = new Array(2);
        getPressureBounds(pressureLower, pressureUpper);

        drawLines(pressureArray, pressureLower, pressureUpper, dateArray);
        labelAxes();
    }
}

function setupCanvas() {
    var c = document.getElementById("GraphCanvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, 500, 500);
}

function getPressureHistory(pressureArray, dateArray) {
    var tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
    tbRecords.sort(compareDates);

    /*loop through each record and store the Date value in var date
    * pull the month and day out of the date value to send them to the date array
    * send the pressure values to the pressure array converted to real numbers
    */
    for (var i = 0; i < tbRecords.length; i++) {
        var date = new Date(tbRecords[i].Date);

        //these methods start at 0 so we add 1 to compensate
        var m = date.getMonth() + 1;
        var d = date.getDate() + 1;

        //x-axis label
        dateArray[i] = (m + "/" + d);

        //point to plot. value is in string format so use parseFloat to convert to real number
        pressureArray[i] = parseFloat(tbRecords[i].Pressure)
    }
}

//get the MaxPressure and set upper and lower bounds
function getPressureBounds(pressureLower, pressureUpper) {
    var user = JSON.parse(localStorage.getItem("user"));
    var pressureLevel = user.MaxPressure;

    if (pressureLevel == "Big") {
        pressureUpper[0] = pressureUpper[1] = 200;
        pressureLower[0] = pressureLower[1] = 150;
    }
    else if (pressureLevel == "Med") {
        pressureUpper[0] = pressureUpper[1] = 99;
        pressureLower[0] = pressureLower[1] = 50;
    }
    else {
        pressureUpper[0] = pressureUpper[1] = 49;
        pressureLower[0] = pressureLower[1] = 25;
    }
}

function drawLines(pressureArray, pressureUpper, pressureLower, dateArray) {
    var pressureLine = new RGraph.Line("GraphCanvas", pressureArray, pressureUpper, pressureLower)
    .Set("labels", dateArray)
    .Set("colors", ["blue", "green", "red"])
    .Set("shadow", true)
    .Set("shadow.offsetx", 1)
    .Set("shadow.offsety", 1)
    .Set("linewidth", 1)
    .Set("numxticks", 6)
    .Set("scale.decimals", 0)
    .Set("xaxispos", "bottom")
    .Set("gutter.left", 50)
    .Set("tickmarks", "filledcircle")
    .Set("ticksize", 5)
    .Set("chart.labels.ingraph", [, , ["Pressure", "blue", "yellow", 1, 80], , ])
    .Set("chart.title", "Pressure")
    .Draw();
}

function labelAxes() {
    var c = document.getElementById("GraphCanvas");
    var ctx = c.getContext("2d");
    ctx.font = "11px Georgia";
    ctx.fillStyle = "green";
    ctx.fillText("Date(MM/DD)", 400, 470);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillText("Pressure Value", -250, 10);
  }
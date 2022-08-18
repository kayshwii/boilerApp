function advicePage() {
    //check to make sure tbRecords exists
    if (localStorage.getItem("tbRecords") === null) {
        alert("No records exist.");
        //return control to pageMenu
        $(location).attr("href", "#pageMenu");
    }
    else {
        //get user from localStorage. parse it. store user.MaxTemp in var TempLevel
        var user = JSON.parse(localStorage.getItem("user"));
        var TempLevel = user.MaxTemp;
        //get records. sort by date. get last record (-1)
        var tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
        tbRecords.sort(compareDates);
        var i = tbRecords.length - 1; //var i = last record 
        var Temp = tbRecords[i].Temp; //var temp = the last recorded Temp
    
        var c = document.getElementById("AdviceCanvas"); //var c is the canvas
        var ctx = c.getContext("2d"); //ctx is the context
        ctx.fillStyle = "#c0c0c0"; //fill it gray
        ctx.fillRect(0, 0, 550, 550); //starting point, h/w
        ctx.font = "22px Arial";
        drawAdviceCanvas(ctx, TempLevel, Temp);
    }
}


function drawAdviceCanvas(ctx, TempLevel, Temp) {
    ctx.font = "22px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Your current Temperature is " + Temp + " F.", 25, 320);
  
    if (TempLevel == "Super") {
        ctx.fillText("Your target Temperature range is: 400-450 F;", 25, 350);
        levelAwrite(ctx, Temp); //write the textual advice
        levelAMeter(ctx, Temp); //render the meter with a dial
    }
    else if (TempLevel == "Hot") {
        ctx.fillText("Your target Temperature range is: 200-300 F;", 25, 350);
        levelBwrite(ctx, Temp);
        levelBMeter(ctx, Temp);
    }
    else if (TempLevel == "Lukewarm") {
        ctx.fillText("Your target Temperature range is: 100-150 F;", 25, 350);
        levelCwrite(ctx, Temp);
        levelCMeter(ctx, Temp);
    }
}

//Temp passed as argument will decide which writeAdvice function to call
function levelAwrite(ctx, Temp) {
    if ((Temp >= 400) && (Temp <= 450)) {
        writeAdvice(ctx, "green");
    }
    else if ((Temp > 450) && (Temp <= 475)) {
        writeAdvice(ctx, "yellow");
    }
    else {
        writeAdvice(ctx, "red");
    }
}

function levelBwrite(ctx, Temp) {
    if ((Temp >= 200) && (Temp <= 300)) {
        writeAdvice(ctx, "green");
    }
    else if ((Temp > 300) && (Temp <= 350)) {
        writeAdvice(ctx, "yellow");
    }
    else {
        writeAdvice(ctx, "red");
    }
}

function levelCwrite(ctx, Temp) {
    if ((Temp >= 100) && (Temp <= 150)) {
        writeAdvice(ctx, "green");
    }
    else if ((Temp > 150) && (Temp <= 175)) {
        writeAdvice(ctx, "yellow");
    }
    else {
        writeAdvice(ctx, "red");
    }
}

//color gets passed to writeAdvice as the second parameter level to decide which advice to write
function writeAdvice(ctx, level) {
    var adviceLine1 = "";
    var adviceLine2 = "";
  
    if (level == "red") {
        adviceLine1 = "DANGER!! Turn down temperature immediately to";
        adviceLine2 = "prevent damage to system or injury to user.";
    }
    else if (level == "yellow") {
        adviceLine1 = "Caution: Temperature above recommended threshold.";
        adviceLine2 = "Check settings to maintain stability.";
    }
    else if (level = "green") {
        adviceLine1 = "Temperature within optimal range.";
    }
    ctx.fillText("Your Temp-level is " + level + ".", 25, 380);
    ctx.fillText(adviceLine1, 25, 410);
    ctx.fillText(adviceLine2, 25, 440);
}

/*the Temp value will determine the range of the meter. max value for A is 500 so it should be set to 500
* else if the temp exceeds 500, the meter will raise the range of the chart
* the CornerGuage meter from RGraph takes 4 parameters (canvasID, lower value, upper value, display value)
* chart.colors.ranges property is set with a 2d array containing 3 arrays of elements 
* once the guage is set up we call the drawMeter function and pass in the cg object
*/
function levelAMeter(ctx, Temp) {
    if (Temp <= 500) {
        var cg = new RGraph.CornerGauge("AdviceCanvas", 400, 500, Temp).Set("chart.colors.ranges", [
            [475, 500, "red"],
            [450, 475, "yellow"],
            [400, 450, "#0f0"]]);
    }
    else {
        var cg = new RGraph.CornerGauge("AdviceCanvas", 400, Temp, Temp).Set("chart.colors.ranges", [
            [475, 500, "red"],
            [450, 475, "yellow"],
            [400, 450, "#0f0"],
            [500.5, Temp, "red"]]);
    }
    drawMeter(cg);
}

function levelBMeter(ctx, Temp) {
    if (Temp <= 400) {
        var cg = new RGraph.CornerGauge("AdviceCanvas", 200, 400, Temp).Set("chart.colors.ranges", [
            [350, 400, "red"],
            [300, 350, "yellow"],
            [200, 300, "#0f0"]]);
    }
    else {
        var cg = new RGraph.CornerGauge("AdviceCanvas", 200, Temp, Temp).Set("chart.colors.ranges", [
            [350, 400, "red"],
            [300, 350, "yellow"],
            [200, 300, "#0f0"],
            [400.5, Temp, "red"]]);
    }
    drawMeter(cg);
}

function levelCMeter(ctx, Temp) {
    if (Temp <= 200) {
        var cg = new RGraph.CornerGauge("AdviceCanvas", 100, 200, Temp).Set("chart.colors.ranges", [
            [175, 200, "red"],
            [150, 175, "yellow"],
            [100, 150, "#0f0"]]);
    }
    else {
        var cg = new RGraph.CornerGauge("AdviceCanvas", 100, Temp, Temp).Set("chart.colors.ranges", [
            [175, 200, "red"],
            [150, 175, "yellow"],
            [100, 150, "#0f0"],
            [200.5, Temp, "red"]]);
    }
    drawMeter(cg);
}

function drawMeter(g) {
    g.Set("chart.value.text.units.post", " F")
    .Set("chart.value.text.boxed", false)
    .Set("chart.value.text.size", 14)
    .Set("chart.value.text.font", "Verdana")
    .Set("chart.value.text.bold", true)
    .Set("chart.value.text.decimals", 1)
    .Set("chart.shadow.offsetx", 5)
    .Set("chart.shadow.offsety", 5)
    .Set("chart.scale.decimals", 1)
    .Set("chart.title", "Temp Level")
    .Set("chart.radius", 250)
    .Set("chart.centerx", 50)
    .Set("chart.centery", 250)
    .Draw();
}

function resizeGraph() {
  if ($(window).width() < 700) {
    $("#GraphCanvas").css({
      "width": $(window).width() - 50
    });
    $("#AdviceCanvas").css({
      "width": $(window).width() - 50
    });
  }
}

$(window).resize(function () {
    resizeGraph();
});
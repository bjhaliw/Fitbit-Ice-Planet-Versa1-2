import clock from "clock";
import * as document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { HeartRateSensor } from "heart-rate";
import { me as appbit } from "appbit";
import { today } from "user-activity";

// Update the clock every second
clock.granularity = "seconds";

// Get a handle on the <text> element
const clockLabel = document.getElementById("clockLabel");
const clockLabelRight = document.getElementById("clockLabelRight")
const dateLabel = document.getElementById("dateLabel");
const heartRateLabel = document.getElementById("heartRateLabel")
const stepsLabel = document.getElementById("stepsLabel")
const caloriesLabel = document.getElementById("caloriesLabel")

if (HeartRateSensor && appbit.permissions.granted("access_heart_rate")) {
  const hrm = new HeartRateSensor();
  hrm.start();
  
   hrm.addEventListener("reading", () => {
    heartRateLabel.text = `${hrm.heartRate}`;
   });
}

function getAllStats() {
    if (appbit.permissions.granted("access_activity")) {
      stepsLabel.text = `${today.adjusted.steps}`;
      caloriesLabel.text = `${today.adjusted.calories}`
    } 
}
   
// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours()
  
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  }
  
  hours = util.zeroPad(hours);
  let mins = util.zeroPad(today.getMinutes());
  let secs = util.zeroPad(today.getSeconds());
   
  clockLabel.text = hours.toString().substring(0,1) + "\n" + mins.toString().substring(0,1)
  clockLabelRight.text = hours.toString().substring(1,2) + "\n" + mins.toString().substring(1, 2)
  
  dateLabel.text = `${evt.date.toString().substring(0, 10)}`
  
  getAllStats()
}

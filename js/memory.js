const COOKIE_NAME = "sample_memory";
const COOKIE_DURATION = 30;

export function saveSampleDataInMemory(data) {
    if(data.length <= 0) {
        alert("Couldn't save 0 samples in the memory :(");
        return;
    }
    if(!document.cookie)
        setCookie(COOKIE_NAME, data, COOKIE_DURATION);
    else{
        if(confirm("Are you sure you want to overwrite your existing data in the memory?")){
            setCookie(COOKIE_NAME, data, COOKIE_DURATION);
        }else return;
    }

    alert("Samples are successfully saved in the memory!");
}

export function loadSampleDataFromMemory(){    
    if(!document.cookie){
        alert("There are no samples in the memory :(");
        return null;
    }

    return getCookie(COOKIE_NAME);
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

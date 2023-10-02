// CODE ARRANGEMENT:
//   > FUNCTIONS
//   > VARIABLES
//   > CODE


// ===========================================
// ============== FUNCTIONS ==================
// ===========================================

async function Translator(text, from, to) { // TRANSLATES THE INPUT LANGUAGE TO TRANSLATED OUTPUT LANGAUGE
  try {
    let response = await fetch(`https://api.mymemory.translated.net/get?q=${text}&langpair=${from}|${to}`)
    let data = await response.json()
    if (data.matches.length == 0) {//IF NO DATA RECIEVED FROM API SERVER
      return 0
    }
    return data.matches[0].translation
  } catch (error) {
    print(error)
  }
}

async function Lang_Detector(text) { // CALLS 'LANGUAGE DETECTION API' FOR DETECTION OF INPUT LANGUAGE
  try {
    let response = await fetch(`https://ws.detectlanguage.com/0.2/detect?q=${text}`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer e38b89e1a1be25fa22a6716e13562bab'
      }
    })
    let data = await response.json()
    return data.data.detections[0].language
  } catch (error) {
    print(error)
  }
}


async function Display_Translation(lang, text) { // DISPLAYS TRANSLATION AS OUTPUT
  // //lines for debugging
  // console.log('from lang : ' + lang);
  // console.log('to lang : ' + To_Lang.value);
  // ///////////////
  if (To_Lang.value == lang) {
    Display_Alert(`You cannot convert a language into its same language`)
  } else {

    data = await Translator(text, lang, To_Lang.value)
    if (data == 0) {
      Display_Alert('No data received from server (API PROBLEM CAUSING ERROR)')
    } else {
      To_Text.value = data
      Loader_Stop()
    }
  }
}


function Display_Alert(message) { // ALERTS USER WITH A MESSAGE
  Loader_Stop()
  Alert_msg.innerText = message
  Alert.style.display = 'flex'
}


function Remove_Alert() { // REMOVES ALERT WINDOW WHEN 'OK' BUTTON IS PRESSED
  if (Alert_box.classList.contains('closing_animation')) {
    Alert_box.classList.remove('closing_animation')
  }
  Alert.style.display = 'none'
}


function populate_dropdown_menus() { // POPULATES DROP-DOWN MENU ON STARTING
  for (let key in Languages) {
    let x = document.createElement('option')
    let y = document.createElement('option')
    x.value = key
    y.value = key
    x.innerText = Languages[key]
    y.innerText = Languages[key]
    From_Lang.appendChild(x)
    To_Lang.appendChild(y)
  }
}


function Loader_Reset() {
  Loader_counter = -1
  circles.forEach((e) => {
    e.style.backgroundColor = 'white'
  })
}


function Loader_Start() {
  Loader_window.style.display = 'flex'
  Loader = setInterval(() => {
    Loader_counter++
    if (Loader_counter == circles.length) {
      Loader_Reset()
    } else {
      circles[Loader_counter].style.backgroundColor = '#007fff'
    }
  }, 300);
}


function Loader_Stop() {
  clearInterval(Loader)
  Loader_window.style.display = 'none'
}

async function SpeakText(from) {
  if (from == 'speakbtn_left') {
    if (From_Text.value == '') {
      Display_Alert('You have not typed anything yet.')
    } else {
      let lang = await Lang_Detector(From_Text.value)
      let utterance = new SpeechSynthesisUtterance(From_Text.value)
      utterance.lang = lang
      speechSynthesis.speak(utterance)
    }
  } else {
    if (To_Text.value == '') {
      Display_Alert('Nothing here to translate')
    } else {
      let utterance = new SpeechSynthesisUtterance(To_Text.value)
      utterance.lang = To_Lang.value
      speechSynthesis.speak(utterance)
    }
  }
}


// ===========================================
// ============== VARIABLES ==================
// ===========================================


let Translate_button = document.getElementById('Translate_button')
let From_Text = document.getElementById('From_Text')
let To_Text = document.getElementById('To_Text')
let Alert = document.querySelector('.Alert')
let Alert_button = document.getElementById('Alert_button')
let Alert_box = document.querySelector('.Alert_box')
let Alert_msg = document.querySelector('.Alert_msg')
let From_Lang = document.getElementById('From_Lang')
let To_Lang = document.getElementById('To_Lang')
let circles = document.querySelectorAll('.circle')
let console_btn = document.querySelectorAll('.console_btn')
let Loader;
let Loader_counter = -1
let Loader_window = document.querySelector('.Loader_window')


// ===========================================
// ================= CODE ====================
// ===========================================

Remove_Alert()
populate_dropdown_menus()

Translate_button.addEventListener('click', async () => { // WHEN TRANSLATE BUTTON IS CLICKED
  To_Text.value = ''
  if (From_Text.value == '') {// IF INPUT IS EMPTY
    Display_Alert('You have not written anything to Translate')
  } else {
    Loader_Start()
    if (From_Lang.value == 'auto') { // IF 'AUTO DETECT' INPUT LANGUAGE IS SELECTED
      // console.log('Auto Detect');
      let lang = await Lang_Detector(From_Text.value)
      Display_Translation(lang, From_Text.value)
    } else {
      // console.log('Language selected');
      let lang = await Lang_Detector(From_Text.value)
      // IF INPUT LANGUAGE IS NOT SAME AS SELECT INPUT LANGUAGE
      if (From_Lang.value == lang) {
        Display_Translation(lang, From_Text.value)
      } else {
        Display_Alert('Input language is not same as selected langauge')
      }
    }
  }
})

Alert_button.addEventListener('click', () => {
  Alert_box.classList.add('closing_animation')
  setTimeout(() => {
    Remove_Alert()
  }, 300);
})

console_btn.forEach((element) => {
  element.addEventListener('click', () => {
    if (element.id == 'copybtn_left') {
      navigator.clipboard.writeText(From_Text.value)
    } else if (element.id == 'copybtn_right') {
      navigator.clipboard.writeText(To_Text.value)
    } else if (element.id == 'speakbtn_left') {
      SpeakText('speakbtn_left')
    } else if (element.id == 'speakbtn_right') {
      SpeakText('speakbtn_right')
    }
  })
})


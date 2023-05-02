// ----------SKAPA HJULET---------------------
var data = [ // De olika slices sommer kommer att finnas i hjulet
  { "name": "Test1", "value1": "", "value2": "", "score": 0 },
  { "name": "Test2", "value1": "", "value2": "", "score": 0 },
  { "name": "Test3", "value1": "", "value2": "", "score": 0 },
  { "name": "Test4", "value1": "", "value2": "", "score": 0 },
  // { "name": "Test5", "value1": "", "value2": "" },
  // { "name": "Test6", "value1": "", "value2": "" },
  // { "name": "Test7", "value1": "", "value2": "" },
  // { "name": "Test8", "value1": "", "value2": "" },
  // { "name": "Test9", "value1": "", "value2": "" },
];
createWheel();
function createWheel() {
  var padding = { top: 0, right: 0, bottom: 0, left: 0 },
  w = window.innerHeight * 0.7 - padding.top - padding.bottom,
  h = window.innerHeight * 0.7 - padding.top - padding.bottom,
  r = Math.min(w, h) / 2;
  color = d3.scale.category20();//category20c()

  if (data.length === 13) {
    console.log(" is 13");
    var color = d3.scale.ordinal()
    .domain([0, 1, 2, 3])
    .range(['#2B3A55', '#2AA784', '#F6B2BB', '#2AA784', '#F6B2BB']);
  } 
  else if((data.length + 2) % 3 === 0) {
    console.log(" is a multiple of three");
    var color = d3.scale.ordinal()
    .domain([0, 1, 2, 3])
    .range(['#2B3A55', '#2AA784', '#F6B2BB', '#2AA784']);
  } else {
    console.log(" is not a multiple of three");
    var color = d3.scale.ordinal()
    .domain([0, 1, 2,])
    .range(['#2B3A55', '#2AA784', '#F6B2BB']);
  }
  
  d3.select("#chart svg").remove();

  var svg = d3.select('#chart')
    .append("svg")
    .data([data])
    .attr("width", w + padding.left + padding.right)
    .attr("height", h + padding.top + padding.bottom);
  var container = svg.append("g")
    .attr("class", "chartholder")
    .attr("transform", "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")");

  var vis = container.append("g");

  var pie = d3.layout.pie().sort(null).value(function (d) { return 1; });
  // declare an arc generator function
  var arc = d3.svg.arc().outerRadius(r);
  // select paths, use arc generator to draw
  var arcs = vis.selectAll("g.slice")
    .data(pie)
    .enter()
    .append("g")
    .attr("class", "slice");

  arcs.append("path").attr("fill", function (d, i) {
    return color(i);
  }).attr("d", function (d) {
    return arc(d);
  });

  // Lägger till text i hjulet
  arcs.append("text").attr("transform", function (d) {
    d.innerRadius = 0;
    d.outerRadius = r;
    d.angle = (d.startAngle + d.endAngle) / 2;
    return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius - 10) + ")";
  }).attr("text-anchor", "end").text(function (d, i) {
    return data[i].name;
  });
}

// --------------SPELAR-LOGIK---------------

function displayData() {
  let container = document.getElementById('data-container');
  container.innerHTML = '';

  for (let i = 0; i < data.length; i++) {
    let div = document.createElement('div');
    div.classList.add('players')
    div.classList.add('flex')
    div.classList.add('btn-gap')
    div.innerHTML = `
      <p>${data[i].name}</p>
      <p class="playerScore">${data[i].score}</p>
      <button class="remove-btn" onclick="removeData(${i})"><i class="fa-solid fa-minus"></i></button>
    `;
    container.appendChild(div);
  }
}

function addData() {
  let name = prompt('Enter data name:');
  if (name) {
    let newData = { name: name, value1: '', value2: '', score: 0 };
    data.push(newData);
    displayData();
  }
  createWheel();
}

function removeData(index) {
  data.splice(index, 1);
  displayData();
  createWheel();
}

function resetScore() {
  for(let i = 0; i < data.length; i++) {
    data[i].score = 0;
  }
  displayData();
}

document.getElementById('add-data-btn').addEventListener('click', addData);

displayData();

// --------------- Kod för vinst rutan ----------------- 
const closeButton = document.getElementById('close-popup');
const popup = document.getElementById('victory-popup');

closeButton.addEventListener('click', function() {
  popup.classList.remove('flex');
  popup.classList.add('d-none');
});

function showWinner(winner) {
  let element = document.querySelector('.winnerEl');
  element.textContent = winner;
  popup.classList.remove('d-none');
  popup.classList.add('flex');
}

window.onclick = function(event) {
  console.log('outside')
  if (event.target != popup) {
    popup.classList.remove('flex');
    popup.classList.add('d-none');
  }
}

// -------------SNURR OCH SLUMP------------------
var btn = document.getElementById('start');
// Deklarerar hjulet i proppeller.js
var wheel = new Propeller(document.getElementById('chart'), {
  speed: 0,
  inertia: 1,
  onRotate: () => {
    console.log(wheel.speed)
    if (wheel.speed < 0.008) { // så hjulet stannar när det snurrar sakta nog
      wheel.speed = 0;
      btn.disabled = false;
      btn.style.opacity = 1;
      btn.style.background = "var(--green)";
      determineWinner(22.5);
    }
  }
});
wheel.unbind(); //Stänger av så det inte går att styra hjulet med musen

btn.addEventListener('click', () => {
  btn.disabled = true;
  btn.style.opacity = 0.5;
  btn.style.background = "gray";
  wheel.speed = randomGenerator(3.1, 8.1); //Två olika farter som hjulet kommer att snurra mellan
  time = randomGenerator(2000, 5000); //Två olika tider som hjulet kommer att snurra mellan
  interval = setInterval(() => {
    wheel.inertia = 0.991;
    clearInterval(interval)
  }, time)
  wheel.inertia = 1;
  console.log(data)
});

function determineWinner(angle) {
  fillValues();
  for (let i = 0; i < data.length; i++) {
    if (wheel.angle > data[i].value1 && wheel.angle < data[i].value2) {
      let element = document.getElementsByClassName('winnerEl');
      showWinner(data[i].name);
      data[i].score = data[i].score + 1;
      displayData();
      if(data[i].score === 3) {
        startWinnerConfetti();
      } else {
        startConfetti();
      }
    }
  }

}

function fillValues() {
  let interval = 360 / data.length;
  let start = 0;
  for (let i = data.length - 1; i >= 0; i--) {
    data[i].value1 = start;
    data[i].value2 = start + interval;
    start += interval;
  }
}

function randomGenerator(min, max) {
  time = Math.floor(Math.random() * (max - min)) + min;
  console.log(min, max, time)
  return time;
}

// ----------------Logik på sidan------------

function headerClick(evt, tab) {
  console.log(tab)
  var i, x, tablinks;
  x = document.getElementsByClassName("bar");
  for (i = 0; i < x.length; i++) {
    x[i].classList.add('d-none');
  }
  tablinks = document.getElementsByClassName("btn");
  for (i = 0; i < x.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tab).classList.remove('d-none');
  evt.currentTarget.className += " active";
}

//---------------confetti--------------

function startConfetti() {
  (async () => {  
    await tsParticles.load("tsparticles", {
      "fullScreen": {
        "zIndex": 1
      },
      "particles": {
        "number": {
          "value": 0
        },
        "color": {
          "value": [
            "#00FFFC",
            "#FC00FF",
            "#fffc00"
          ]
        },
        "shape": {
          "type": [
            "circle",
            "square"
          ],
          "options": {}
        },
        "opacity": {
          "value": 1,
          "animation": {
            "enable": true,
            "minimumValue": 0,
            "speed": 2,
            "startValue": "max",
            "destroy": "min"
          }
        },
        "size": {
          "value": 4,
          "random": {
            "enable": true,
            "minimumValue": 2
          }
        },
        "links": {
          "enable": false
        },
        "life": {
          "duration": {
            "sync": true,
            "value": 5
          },
          "count": 1
        },
        "move": {
          "enable": true,
          "gravity": {
            "enable": true,
            "acceleration": 10
          },
          "speed": {
            "min": 10,
            "max": 20
          },
          "decay": 0.1,
          "direction": "none",
          "straight": false,
          "outModes": {
            "default": "destroy",
            "top": "none"
          }
        },
        "rotate": {
          "value": {
            "min": 0,
            "max": 360
          },
          "direction": "random",
          "move": true,
          "animation": {
            "enable": true,
            "speed": 60
          }
        },
        "tilt": {
          "direction": "random",
          "enable": true,
          "move": true,
          "value": {
            "min": 0,
            "max": 360
          },
          "animation": {
            "enable": true,
            "speed": 60
          }
        },
        "roll": {
          "darken": {
            "enable": true,
            "value": 25
          },
          "enable": true,
          "speed": {
            "min": 15,
            "max": 25
          }
        },
        "wobble": {
          "distance": 30,
          "enable": true,
          "move": true,
          "speed": {
            "min": -15,
            "max": 15
          }
        }
      },
      "emitters": {
        "life": {
          "count": 1,
          "duration": 0.1,
          "delay": 0.4
        },
        "rate": {
          "delay": 0.1,
          "quantity": 150
        },
        "size": {
          "width": 0,
          "height": 0
        }
      }
    });
  })();
}

function startWinnerConfetti() {
  (async () => {
    tsParticles.load("tsparticles", {
      emitters: [
        {
          startCount: 200,
          life: {
            duration: 5,
            count: 1,
          },
          position: {
            x: 0,
            y: 30,
          },
          particles: {
            move: {
              speed: 200,
              direction: "top-right",
            },
          },
        },
        {
          startCount: 200,
          life: {
            duration: 5,
            count: 1,
          },
          position: {
            x: 100,
            y: 30,
          },
          particles: {
            move: {
              speed: 200,
              direction: "top-left",
            },
          },
        },
      ],
      preset: "confetti",
    });
  })();
}

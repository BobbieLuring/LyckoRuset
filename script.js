// ----------SKAPA HJULET---------------------
var data = [ // De olika slices sommer kommer att finnas i hjulet
  { "name": "Test1", "value1": "", "value2": "" },
  { "name": "Test2", "value1": "", "value2": "" },
  { "name": "Test3", "value1": "", "value2": "" },
  { "name": "Test4", "value1": "", "value2": "" },
  { "name": "Test5", "value1": "", "value2": "" },
  { "name": "Test6", "value1": "", "value2": "" },
  { "name": "Test7", "value1": "", "value2": "" },
  { "name": "Test8", "value1": "", "value2": "" },
  { "name": "Test9", "value1": "", "value2": "" },
  { "name": "Test10", "value1": "", "value2": "" },
];
createWheel();
function createWheel() {
  var padding = { top: 0, right: 0, bottom: 0, left: 0 },
    w = 600 - padding.left - padding.right,
    h = 600 - padding.top - padding.bottom,
    r = Math.min(w, h) / 2;
    // color = d3.scale.category20();//category20c()
    var color = d3.scale.ordinal()
  .domain([0, 1, 2])
  .range(['#2B3A55', '#2AA784', '#F6B2BB']);
    

  // om man vill ha outline
  // var padding = { top: 10, right: 10, bottom: 10, left: 10 },
  //   w = 600 - padding.left - padding.right,
  //   h = 600 - padding.top - padding.bottom,
  //   r = Math.min(w, h) / 2,
  //   color = d3.scale.category20();
  
  d3.select("#chart svg").remove();

  var svg = d3.select('#chart')
    .append("svg")
    .data([data])
    .attr("width", w + padding.left + padding.right)
    .attr("height", h + padding.top + padding.bottom);
  var container = svg.append("g")
    .attr("class", "chartholder")
    .attr("transform", "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")");
  
    // Add black outline
    // container.append("path")
    // .attr("fill", "none")
    // .attr("stroke", "black")
    // .attr("stroke-width", 4)
    // .attr("d", d3.svg.arc().outerRadius(r + 2).innerRadius(0).startAngle(0).endAngle(Math.PI * 2));

  var vis = container.append("g");

  var pie = d3.layout.pie().sort(null).value(function (d) { return 1; });
  // declare an arc generator function
  var arc = d3.svg.arc().outerRadius(r);
  // select paths, use arc generator to draw
  var colors = assignColors(data);
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

  // add the text baksjdh
  arcs.append("text").attr("transform", function (d) {
    d.innerRadius = 0;
    d.outerRadius = r;
    d.angle = (d.startAngle + d.endAngle) / 2;
    return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius - 10) + ")";
  }).attr("text-anchor", "end").text(function (d, i) {
    return data[i].name;
  });
}

function assignColors(data) {
  var colors = ['#2B3A55', '#2AA784', '#F6B2BB'];
  var assigned = [];
  data.forEach(function(d, i) {
    if (i === 0) {
      assigned.push(colors[Math.floor(Math.random() * colors.length)]);
    } else {
      var prev = assigned[i - 1];
      var choices = colors.filter(function(color) {
        return color !== prev;
      });
      assigned.push(choices[Math.floor(Math.random() * choices.length)]);
    }
  });
  return assigned;
}
// var color = colors[0];
// if (i > 0) {
//   var availableColors = colors.filter(function(c) { return c !== previousColor; });
//   color = availableColors[Math.floor(Math.random() * availableColors.length)];
// }
// previousColor = color;
// return color;

// --------------SPELAR-LOGIK---------------

function displayData() {
  let container = document.getElementById('data-container');
  container.innerHTML = '';

  for (let i = 0; i < data.length; i++) {
    let div = document.createElement('div');
    // div.style.fontFamily = 'var(--helvetica)'
    // div.style.width = '200px';
    div.classList.add('players')
    div.classList.add('flex')
    div.classList.add('btn-gap')
    div.innerHTML = `
      <p>${data[i].name}</p>
      <button class="remove-btn" onclick="removeData(${i})"><i class="fa-solid fa-minus"></i></button>
    `;
    container.appendChild(div);
  }
}

// Function to add new data
function addData() {
  let name = prompt('Enter data name:');
  if (name) {
    let newData = { name: name, value1: '', value2: '' };
    data.push(newData);
    displayData();
  }
  createWheel();
}

// Function to remove data
function removeData(index) {
  data.splice(index, 1);
  displayData();
  createWheel();
}

// Event listener for add data button
document.getElementById('add-data-btn').addEventListener('click', addData);

// Display the initial data
displayData();

// -------------SNURR OCH SLUMP------------------
var btn = document.getElementById('start');
// Deklarerar hjulet i proppeller.js
var wheel = new Propeller(document.getElementById('chart'), {
  speed: 0,
  inertia: 1,
  onRotate: () => {
    if (wheel.speed < 0.003) {
      wheel.speed = 0;
      btn.disabled = false;
      btn.style.opacity = 1;
      btn.style.background = "var(--green)";
      determineWinner(22.5);
      //btn.click();
    }
  }
});
wheel.unbind(); //Stänger av så det inte går att styra hjulet med musen

btn.addEventListener('click', () => {
  console.log('hej')
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
  // console.log()
  fillValues();
  for (let i = 0; i < data.length; i++) {
    if (wheel.angle > data[i].value1 && wheel.angle < data[i].value2) {
      console.log(data[i].name + ' vann')
      // let node = document.getElementById('result').children;
      //node[1].innerHTML = parseInt(node[1].innerHTML) + 1;
      // console.log(node[2].id)
      // for(let y = 0; y < node.length; y++){
      // console.log(data[i].name, node[y].innerHTML)
      // if(data[i].name == node[y].id){
      //   console.log('hejsan')
      //   node[y].innerHTML = parseInt(node[y].innerHTML) + 1;
      // }
      // }
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

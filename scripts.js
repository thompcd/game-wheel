var carousel = document.querySelector('.carousel');
var cells = carousel.querySelectorAll('.carousel__cell');
var cellsRange = document.querySelector('.cells-range');
var cellCount = cellsRange.min; // cellCount set from cells-range input value
var selectedIndex = 0;
var cellWidth = carousel.offsetWidth;
var cellHeight = carousel.offsetHeight;
var isHorizontal = false;
var rotateFn = isHorizontal ? 'rotateY' : 'rotateX';
var radius, theta;
// console.log( cellWidth, cellHeight );
cellsRange.addEventListener( 'input', changeCarousel );
changeCarousel();

function rotateCarousel() {
  var angle = theta * selectedIndex * -1;
  carousel.style.transform = 'translateZ(' + -radius + 'px) ' + 
      rotateFn + '(' + angle + 'deg)';
}

let rotateToggle = false;
let formVisible = false;
let rotateInterval;

//spin carousel on toggle
var spinButton = document.querySelector('#spinner');
spinButton.addEventListener("click", function() {
  // not spinning
  if (rotateToggle){
    spinButton.classList.remove('blink');
    spinButton.classList.add('green-btn');
    spinButton.classList.remove('red-btn');
    spinButton.innerHTML = "Spin!";
    rotateToggle = false;
    if (rotateInterval !== null)
    {
      clearInterval(rotateInterval);              
    }
  }
  else{
    //spinning
    rotateToggle = true;
    spinButton.classList.add('blink');
    spinButton.classList.remove('green-btn');
    spinButton.classList.add('red-btn');
    spinButton.innerHTML = "Stop"
    rotateInterval = setInterval(() => {
        if (rotateToggle)
        {
          selectedIndex++;
          rotateCarousel();
        }
      }, 100)
    }
  });

    var showNamesFormButton = document.querySelector('#showNamesFormButton');
    showNamesFormButton.addEventListener("click", function() {
        formVisible = !formVisible; // toggle form visibility tracker
        toggleDiv("newName")
        if (formVisible){
          showNamesFormButton.innerHTML = "Hide Names Menu";
        }
        else{
          showNamesFormButton.innerHTML = "Update Names";
        }
    });

    var addNamesButton = document.querySelector('#addNew');
    addNamesButton.addEventListener("click", function() {
        cellCount++;
        new_name();
    });

    var updateNamesButton = document.querySelector('#updateNamesButton');
    updateNamesButton.addEventListener("click", function() {
      update_names();
    });

    var resetNamesButton = document.querySelector('#resetNamesButton');
    resetNamesButton.addEventListener("click", function() {
      reset_names();
    });

  function toggleDiv(id) {
    var div = document.getElementById(id);
    div.style.display = div.style.display == "none" ? "block" : "none";

    //attempted to animate a collapse, but html needs restructured
    // var height = div.clientHeight;
    // var width = div.clientWidth;

    // div.style.height = height + 'px';
    // div.style.width = width + 'px';

    // if(div.style.visibility == 'hidden'){
    //   div.style.visibility = 'visible';
    //   //div.style.opacity = '1';
    //   div.style.height = height + 'px';
    //   div.style.width = width + 'px';
    //   div.style.padding = '.5em';
    // }
    // else{
    //   div.style.visibility = 'hidden';
    //   //div.style.opacity = '0';
    //   div.style.height = '0';
    //   div.style.width = '0';
    //   div.style.padding = '0';
    // }
  }


// var nextButton = document.querySelector('.next-button');
// nextButton.addEventListener( 'click', function() {
//   if(this.innerHTML == "Start") {
//     window.setInterval(function() {
//       selectedIndex++;
//   rotateCarousel();
//     }, 100);
//   } else if(this.innerHTML == "Stop") {
//   } else { //reset
//   }
//   // selectedIndex++;
//   // rotateCarousel();
//   });

function changeCarousel() {
cellCount = cellsRange.value;
theta = 360 / cellCount;
var cellSize = isHorizontal ? cellWidth : cellHeight;
radius = Math.round( ( cellSize / 2) / Math.tan( Math.PI / cellCount ) );
for ( var i=0; i < cells.length; i++ ) {
    var cell = cells[i];
    if ( i < cellCount ) {
      // visible cell
      cell.style.opacity = 1;
      var cellAngle = theta * i;
      cell.style.transform = rotateFn + '(' + cellAngle + 'deg) translateZ(' + radius + 'px)';
    } else {
      // hidden cell
      cell.style.opacity = 0;
      cell.style.transform = 'none';
    }
}

rotateCarousel();
}

/*
Add a new form to the page
*/
async function new_name()
{
  console.log(`evaluating adding new name. current value = ${cellsRange.value}, max value = ${cellsRange.max}`);
  if (Number(cellsRange.value) < Number(cellsRange.max)){
    cellsRange.value++;
  }
  else{
    console.log("could not add new name, max limit reached");
    alert(`You have reached the maximum number of names.`)
    return;
  }
  var ct = cellsRange.value;
  var div1 = document.createElement('div');
  div1.innerHTML = document.getElementById('newNameTemplate').innerHTML;
  div1.id = "nameTable" + ct;
  div1.querySelector(".name-text").innerHTML = "Name " + ct + ":";
  div1.querySelector(".name-input").id = "NameInput" + ct;
  
  var cellDiv = document.createElement('div');
  cellDiv.innerHTML = document.getElementById('newCellTemplate').innerHTML;
  cellDiv.id = `name${ct}`;
  console.log(`Created ${cellDiv.id}`);

  var deleteButton = div1.querySelector(".delete-button");
  deleteButton.id = "DeleteButton" + ct;
  deleteButton.innerHTML = "X";
  deleteButton.onclick = function (){delete_name(deleteButton.id)};
  console.log(`Created ${deleteButton.id}`);
  console.log(deleteButton)
  
  await document.getElementById('nameTableWrapper').appendChild(div1);
  await document.getElementById('carousel').appendChild(cellDiv);
  changeCarousel();
}

// function to delete the newly added set of elements
function delete_name(eleId)
{
    cellCount--;
  console.log(`attempting to delete ${eleID}`);
  d = document;
  var ele = d.getElementById(eleId);
  var parentEle = d.getElementById('newName');
  parentEle.removeChild(ele);
}

function update_names(){
    cellCount = cellsRange.value;
    console.log( `cell length ${cellCount}`)

    for ( var i=0; i < cellCount; i++ ) {
        var cell = cells[i];
        console.log(`Updating name within NameInput${i+1}`)
        var cellNameInput = document.querySelector(`#NameInput${i+1}`).value;
        cell.innerHTML = cellNameInput;
        console.log(`testing inner html of cell: ${cell.innerHTML}`);
    }
    changeCarousel();
}

function reset_names(){
  //cellsRange.value = cellsRange.min;
  var carousel = document.getElementById("carousel");
  carousel.removeChild(carousel.childNodes[0]);
  cellCount--;
  changeCarousel();


  //await document.getElementById('carousel').removeChild(cellDiv);
  

}

window.addEventListener('load', function() {    
    //cellsRange.value = cells.cellCount;
    this.console.log(`cell range value ${cellsRange.value}`);

    console.log('All assets are loaded')
})


// var orientationRadios = document.querySelectorAll('input[name="orientation"]');
// ( function() {
// for ( var i=0; i < orientationRadios.length; i++ ) {
//     var radio = orientationRadios[i];
//     radio.addEventListener( 'change', onOrientationChange );
// }
// })();

// function onOrientationChange() {
// var checkedRadio = document.querySelector('input[name="orientation"]:checked');
// isHorizontal = checkedRadio.value == 'horizontal';
// rotateFn = isHorizontal ? 'rotateY' : 'rotateX';
// changeCarousel();
// }

// // set initials
// onOrientationChange();
let map
let divSquare = '<div id="s$coord" class="square $color"></div>'
let divFigure = '<div id="f$coord" class="figure">$figure</div>'


$(function () {
    start();
});

function start() {
    map = new Array(64);
    addSquares();
    showFigures('rnbqkbnrpppppppp11111111111111111111111111111111PPPPPPPPRNBQKBNR');
}

function setDraggable() {
    $('.figure').draggable();
    $('.board').draggable();
}

function setTouchDraggable () {
    document.addEventListener("touchstart", touch2Mouse, true);
    document.addEventListener("touchmove", touch2Mouse, true);
    document.addEventListener("touchend", touch2Mouse, true);
}

function touch2Mouse(e)
{
  var theTouch = e.changedTouches[0];
  var mouseEv;

  switch(e.type)
  {
    case "touchstart": mouseEv="mousedown"; break;  
    case "touchend":   mouseEv="mouseup"; break;
    case "touchmove":  mouseEv="mousemove"; break;
    default: return;
  }

  var mouseEvent = document.createEvent("MouseEvent");
  mouseEvent.initMouseEvent(mouseEv, true, true, window, 1, theTouch.screenX, theTouch.screenY, theTouch.clientX, theTouch.clientY, false, false, false, false, 0, null);
  theTouch.target.dispatchEvent(mouseEvent);

  e.preventDefault();
}



function setDroppable() {
        $('.square').droppable({
            drop: function(event, ui) {
                let frCoord = ui.draggable.attr('id').substring(1);
                let toCoord = this.id.substring(1);
                moveFigure(frCoord, toCoord);
            }
        })
}

function moveFigure(frCoord, toCoord) {
    console.log('move ' + ' from ' + frCoord + ' to ' + toCoord);
    figure = map[frCoord]
    showFigureAt(frCoord, '1');
    showFigureAt(toCoord, figure);
    
}


function addSquares() {
    $('.board').html('')
    for (let coord = 0; coord < 64; coord++)
        $('.board').append(divSquare
            .replace('$coord', coord)
            .replace('$color', 
                isBlackSquareAt(coord) ? 'black' : 'white'))
    
    setDroppable();
}

function showFigures(figures) {
    for (let coord = 0; coord < 64; coord++)
        showFigureAt(coord, figures.charAt(coord));
}

function showFigureAt(coord, figure) {
    map[coord] = figure;
    $('#s' + coord).html(divFigure
        .replace('$coord', coord)
        .replace('$figure', getChessSymbol (figure)))
        setTouchDraggable ();
        setDraggable();
}

function getChessSymbol(figure) {
    switch(figure) {
        case 'K' : return '&#9812;';
        case 'Q' : return '&#9813';
        case 'R' : return '&#9814';
        case 'B' : return '&#9815';
        case 'N' : return '&#9816';
        case 'P' : return '&#9817';
        case 'k' : return '&#9818';
        case 'q' : return '&#9819';
        case 'r' : return '&#9820';
        case 'b' : return '&#9821';
        case 'n' : return '&#9822';
        case 'p' : return '&#9823';
        default : return '';
    }
}

function isBlackSquareAt(coord) {
    return (coord % 8 + Math.floor(coord / 8)) % 2;
}
function returnDoubleMoney (dollar=5) {
    return dollar * 2;
}


console.log (returnDoubleMoney (6))
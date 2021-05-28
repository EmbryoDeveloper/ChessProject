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
    init() 
 
}

function setDraggable() {
    $('.figure').draggable();
    $('.board').draggable();
}

function touchHandler (event) {
    let touches = event.changedTouhes,
        first = touches[0],
        type = '';
        switch(event.type) {
            case 'touchstart': type = 'mousedown';
                break;
            case 'touchmove': type = 'mousemove';
                break;
            case 'touchend': type = 'mouseup';
                break;
            default: return;
        }

        let simulatedEvent = document.createEvent('MouseEvent');
        simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX,
            first.screenY, first.clientX, first.clientY, false, false, false, false, 0, null);
        first.target.dispatchEvent(simulatedEvent);
        event.preventDefault();
};

function init() {
    document.addEventListener('touchstart', touchHandler, true);
    document.addEventListener('touchmove', touchHandler, true);
    document.addEventListener('touchend', touchHandler, true);
    document.addEventListener('touchcancel', touchHandler, true);
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
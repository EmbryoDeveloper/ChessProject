let map
let divSquare = '<div id="s$coord" class="square $color"></div>'
let divFigure = '<div id="f$coord" class="figure">$figure</div>'


$(function () {
    start();   
});

$(function ($) {

    // Detect touch support
    $.support.touch = 'ontouchend' in document;
  
    // Ignore browsers without touch support
    if (!$.support.touch) {
      return;
    }
  
    var mouseProto = $.ui.mouse.prototype,
        _mouseInit = mouseProto._mouseInit,
        _mouseDestroy = mouseProto._mouseDestroy,
        touchHandled;
  
    /**
     * Simulate a mouse event based on a corresponding touch event
     * @param {Object} event A touch event
     * @param {String} simulatedType The corresponding mouse event
     */
    function simulateMouseEvent (event, simulatedType) {
  
      // Ignore multi-touch events
      if (event.originalEvent.touches.length > 1) {
        return;
      }
  
      event.preventDefault();
  
      var touch = event.originalEvent.changedTouches[0],
          simulatedEvent = document.createEvent('MouseEvents');
      
      // Initialize the simulated mouse event using the touch event's coordinates
      simulatedEvent.initMouseEvent(
        simulatedType,    // type
        true,             // bubbles                    
        true,             // cancelable                 
        window,           // view                       
        1,                // detail                     
        touch.screenX,    // screenX                    
        touch.screenY,    // screenY                    
        touch.clientX,    // clientX                    
        touch.clientY,    // clientY                    
        false,            // ctrlKey                    
        false,            // altKey                     
        false,            // shiftKey                   
        false,            // metaKey                    
        0,                // button                     
        null              // relatedTarget              
      );
  
      // Dispatch the simulated event to the target element
      event.target.dispatchEvent(simulatedEvent);
    }
  
    /**
     * Handle the jQuery UI widget's touchstart events
     * @param {Object} event The widget element's touchstart event
     */
    mouseProto._touchStart = function (event) {
  
      var self = this;
  
      // Ignore the event if another widget is already being handled
      if (touchHandled || !self._mouseCapture(event.originalEvent.changedTouches[0])) {
        return;
      }
  
      // Set the flag to prevent other widgets from inheriting the touch event
      touchHandled = true;
  
      // Track movement to determine if interaction was a click
      self._touchMoved = false;
  
      // Simulate the mouseover event
      simulateMouseEvent(event, 'mouseover');
  
      // Simulate the mousemove event
      simulateMouseEvent(event, 'mousemove');
  
      // Simulate the mousedown event
      simulateMouseEvent(event, 'mousedown');
    };
  
    /**
     * Handle the jQuery UI widget's touchmove events
     * @param {Object} event The document's touchmove event
     */
    mouseProto._touchMove = function (event) {
  
      // Ignore event if not handled
      if (!touchHandled) {
        return;
      }
  
      // Interaction was not a click
      this._touchMoved = true;
  
      // Simulate the mousemove event
      simulateMouseEvent(event, 'mousemove');
    };
  
    /**
     * Handle the jQuery UI widget's touchend events
     * @param {Object} event The document's touchend event
     */
    mouseProto._touchEnd = function (event) {
  
      // Ignore event if not handled
      if (!touchHandled) {
        return;
      }
  
      // Simulate the mouseup event
      simulateMouseEvent(event, 'mouseup');
  
      // Simulate the mouseout event
      simulateMouseEvent(event, 'mouseout');
  
      // If the touch interaction did not move, it should trigger a click
      if (!this._touchMoved) {
  
        // Simulate the click event
        simulateMouseEvent(event, 'click');
      }
  
      // Unset the flag to allow other widgets to inherit the touch event
      touchHandled = false;
    };
  
    /**
     * A duck punch of the $.ui.mouse _mouseInit method to support touch events.
     * This method extends the widget with bound touch event handlers that
     * translate touch events to mouse events and pass them to the widget's
     * original mouse event handling methods.
     */
    mouseProto._mouseInit = function () {
      
      var self = this;
  
      // Delegate the touch handlers to the widget's element
      self.element.bind({
        touchstart: $.proxy(self, '_touchStart'),
        touchmove: $.proxy(self, '_touchMove'),
        touchend: $.proxy(self, '_touchEnd')
      });
  
      // Call the original $.ui.mouse init method
      _mouseInit.call(self);
    };
  
    /**
     * Remove the touch event handlers
     */
    mouseProto._mouseDestroy = function () {
      
      var self = this;
  
      // Delegate the touch handlers to the widget's element
      self.element.unbind({
        touchstart: $.proxy(self, '_touchStart'),
        touchmove: $.proxy(self, '_touchMove'),
        touchend: $.proxy(self, '_touchEnd')
      });
  
      // Call the original $.ui.mouse destroy method
      _mouseDestroy.call(self);
    };
  
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

// function touchHandler (event) {
//     let touches = event.changedTouhes,
//         first = touches[0],
//         type = '';
//         switch(event.type) {
//             case 'touchstart': type = 'mousedown';
//                 break;
//             case 'touchmove': type = 'mousemove';
//                 break;
//             case 'touchend': type = 'mouseup';
//                 break;
//             default: return;
//         }

//         let simulatedEvent = document.createEvent('MouseEvent');
//         simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX,
//             first.screenY, first.clientX, first.clientY, false, false, false, false, 0, null);
//         first.target.dispatchEvent(simulatedEvent);
//         event.preventDefault();
// };

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
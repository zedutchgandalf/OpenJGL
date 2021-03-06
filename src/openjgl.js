var ojglVersion = "0.1";
var ojglFPS = 0;

var _ojglCurrentState;
var _ojglGUIElements = [];

/**
 * Initialize OpenJGL.
 *
 * @throws {InvalidArgumentError} Whenever an invalid canvas id or game state is passed (or one of them is null).
 * @param {string}    canvasId         The id of the canvas object to use for your game.
 * @param {GameState} newGameState     The initial game state.
 * @param {Vector2}   canvasSize       The size you want your canvas to be. (Optional)
 * @param {Vector2}   screenResolution The resolution you want the screen to have. (Optional)
 */
function ojglInit(canvasId, newGameState, canvasSize, screenResolution) {
    "use strict";
    var SOURCE = "ojglInit";

    if (typeof canvasId !== 'string') {
        throw new InvalidArgumentError("canvasId", "The canvas id should be a string!");
    }

    ojglChangeState(newGameState);

    var canvas = document.getElementById(canvasId);

    if (canvasSize instanceof Vector2) {
        canvas.width = canvasSize.x;
        canvas.height = canvasSize.y;
    }

    canvas.style.background = "#000";

    var screen = new Screen(canvas, screenResolution);

    ojglMouse.init(screen);

    var lastClick = 0;

    var time = 0;
    var frames = 0;
    var prevTime = 0;
    var lastUpdate = new Date().getTime();

    // Start the update and render loops
    var intervalID = setInterval(function GameLoop() {
        var SOURCE = "Main Game Loop";

        time = new Date().getTime();
        frames++;

        if (time - prevTime >= 1000) {
            ojglFPS = frames;
            frames = 0;
            prevTime = time;
        }

        if (_ojglGUIElements.length > 0 //
            && ojglMouse.clicked //
            && ojglMouse.clicked.time > lastClick) {

            var p = new Vector2(ojglMouse.clicked.x, ojglMouse.clicked.y);
            lastClick = ojglMouse.clicked.time;
            for (var i in _ojglGUIElements) {
                var element = _ojglGUIElements[i];
                
                if (element.containsPoint(p) //
                    && typeof element.onclick === "function") {
                    
                    element.onclick();
                }
            }
        }

        try {
            _ojglCurrentState.update(time - lastUpdate);
            lastUpdate = time;
        } catch (e) {

            if (e instanceof ReferenceError) {
                clearInterval(intervalID);
                if (e.message.indexOf("update") >= 0) {
                    throw new OJGLError("You must specify a function 'update(deltaTime)' on the current gamestate!", e);
                } else {
                    throw e;
                }
            }

        }

        try {
            screen.clear();
            _ojglCurrentState.render(screen);
            ojglMouse.render(screen);
        } catch (e) {

            if (e instanceof ReferenceError) {
                clearInterval(intervalID);
                if (e.message.indexOf("render") >= 0) {
                    throw new OJGLError("You must specify a function 'render(screen)' in the current gamestate!", e);
                } else {
                    throw e;
                }
            }

        }

    }, 0);
}

/**
 * Change the current game state.
 * 
 * @throws {InvalidArgumentError} Whenever an invalid game state is passed (or the passed game state is null).
 * @param {GameState} newGameState The new game state.
 */
function ojglChangeState(newGameState) {
    "use strict";
    var SOURCE = "ojglChangeState";

    if (!(newGameState instanceof GameState)) {
        throw new InvalidArgumentError("newGameState", "The object passed was not a subtype of GameState: " + newGameState);
    }

    Log.info("Changing gamestate to " + newGameState, SOURCE);

    if (typeof _ojglCurrentState !== 'undefined') {
        _ojglCurrentState.willDisappear();
    }
    _ojglCurrentState = newGameState;
    newGameState.willAppear();
}
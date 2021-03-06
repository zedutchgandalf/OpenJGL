/**
 * Creates a new Sprite.
 *
 * @constructor
 * @param {string} image The URL of the image to make a sprite from.
 */
function Sprite(image, onload) {
    this.image = new Image();
    this.image.src = image;

    var sprite = this;
    this.image.onload = function OnImageLoad(event) {
        sprite.size = new Vector2(sprite.image.width, sprite.image.height);
        Log.info(sprite.size + " sprite loaded: " + sprite.image.src, "OnImageLoad");
        
        if (typeof onload === 'function') {
            onload();
        } else if(typeof onload !== 'undefined') {
            throw new InvalidArgumentError("onload", "onload should be a function! Received: " + onload);
        }
    }
}

/**
 * Render this sprite to a screen.
 *
 * @param {Screen}  screen   The screen to render this sprite to.
 * @param {Vector2} position The position to render this sprite on.
 */
Sprite.prototype.render = function (screen, position) {
    screen.render(this.image, position, this.size);
};

/**
 * @override
 * @returns {string} The textual representation of this object.
 */
Sprite.prototype.toString = function () {
    return "Sprite { " + this.image.src + " }"
};
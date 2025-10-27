/**
 * Created by mr_nili on 10/15/2017.
 */

function ImageRotator(target) {
    this.canvas = document.createElement('canvas');
    target.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.canvas.class = 'canvas'
}


ImageRotator.prototype = {

    setImages: function(images) {
        this.images = images
    },

    drawFrame: function(index) {
        if (!index) { index = 0 }

        this.index = Math.floor(index);

        var l = this.images.length;

        function obtainIndex(i) {
            i = ((i % l) + l) % l;
            return i
        }

        var frame = this.images[obtainIndex(this.index)];

        this.ctx.clearRect(0, 0, this.width, this.height);
        // this.ctx.globalAlpha = 1
        this.ctx.drawImage(frame, 0, 0, this.width, this.height)
    },

    resizeFrame: function(width, height) {
        this.width  = this.canvas.width  = width;
        this.height = this.canvas.height = height;
        this.drawFrame(this.index);
    }
};
function BitBar(canvasId, titleId, countId, title, color, fillColor, currentBits, maxBits) {
    this.title = title;
    this.currentBits = currentBits;
    this.maxBits = maxBits;
    this.canvas = document.getElementById(canvasId);
    this.canvasContext = this.canvas.getContext('2d');
    this.originalImage = new Image();
    this.titleElement = document.getElementById(titleId);
    this.countElement = document.getElementById(countId);
    this.updateTitle = function(title) {
        this.title = title;
        this.renderTitle();
    };
    this.updateColor = function(color) {
        this.color = this.hexToColor(color);
        this.render();
    };
    this.updateFillColor = function(fillColor) {
        this.fillColor = this.hexToColor(fillColor);
        this.render();
    };
    this.updateCurrentBitCount = function(currentBits) {
        if (currentBits > this.maxBits) {
            this.currentBits = this.maxBits;
        } else {
            this.currentBits = currentBits;
        }
        this.render();
    };
    this.updateMaxBitCount = function(maxBits) {
        if (maxBits < this.currentBits) {
            this.currentBits = maxBits;
        }
        this.maxBits = maxBits;
        this.render();
    };
    this.getCurrentBitPercentage = function() {
        return this.currentBits / this.maxBits;
    };
    this.renderTitle = function() {
        this.titleElement.style.color = this.color.hex;
        this.titleElement.innerText = this.title;
    };
    this.renderBar = function() {
        let imageData = this.canvasContext.getImageData(0, 0, this.originalImage.width, this.originalImage.height);
        let barOffset = 62;
        let rightBarOffset = 7;
        let barWidth = imageData.width - barOffset - rightBarOffset;
        let barCutoff = Math.round(barOffset + barWidth * this.getCurrentBitPercentage());

        for (let i = 0; i < imageData.height; i++) {
            for (let j = 0; j < imageData.width; j++) {
                let start = (i * (imageData.width * 4)) + (j * 4);

                if (imageData.data[start] === 0 && imageData.data[start+1] === 0 && imageData.data[start+2] === 0) {
                    if (j < barCutoff) {
                        imageData.data[start] = this.color.R;
                        imageData.data[start+1] = this.color.G;
                        imageData.data[start+2] = this.color.B;
                    } else {
                        imageData.data[start] = this.fillColor.R;
                        imageData.data[start+1] = this.fillColor.G;
                        imageData.data[start+2] = this.fillColor.B;
                    }
                }
            }
        }

        this.canvasContext.putImageData(imageData, 0, 0);
    };
    this.renderBitCount = function() {
        this.countElement.style.color = this.color.hex;
        this.countElement.innerText = "B " + this.currentBits + " / " + this.maxBits;
    };
    this.render = function() {
        let x = 0,
            y = 0,
            xI = this.originalImage.width,
            yI = this.originalImage.height;

        this.canvas.width = xI;
        this.canvas.height = yI;
        this.canvasContext.drawImage(this.originalImage, x, y, xI, yI, x, y, xI, yI);

        this.renderTitle();
        this.renderBar();
        this.renderBitCount();
    };
    this.hexToColor = function(color) {
        let colorString = color.replace('#', '');

        if (colorString.length !== 3 && colorString.length !== 6) {
            throw "This color is not a hex color";
        }

        if (colorString.length === 3) {
            colorString = colorString[0] + colorString[0] + colorString[1] + colorString[1] + colorString[2] + colorString[2];
        }

        let R = parseInt(colorString.substr(0, 2), 16);
        let G = parseInt(colorString.substr(2, 2), 16);
        let B = parseInt(colorString.substr(4, 2), 16);

        return {R, G, B, hex: "#" + colorString};
    };

    this.color = this.hexToColor(color);
    this.fillColor = this.hexToColor(fillColor);

    this.originalImage.onload = function() {
        this.render();
    }.bind(this);

    this.originalImage.src = './img/frame.png';
}
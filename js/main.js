/**
 * Created by ludwigschamboeck on 19.11.14.
 */

// image
var image = document.getElementById('image');
var imageWidth = image.width;
var imageHeight = image.height;


// template
var template = document.getElementById('template');
var templateWidth = template.width;
var templateHeight = template.height;


// create Image Objects of image and template
var imageObj = new Image();
var templateObj = new Image();

// pixel values
var imageData;
var templateData;

// amount of blocks
var amountBlocksX = imageWidth / templateWidth;
var amountBlocksY = imageHeight / templateHeight;

// size of blocks
var blocksWidth = imageWidth / amountBlocksX;
var blocksHeight = imageHeight / amountBlocksY;

// Array of R,G and B values of Template
var templateR = [];
var templateG = [];
var templateB = [];


var row, col, max, num;


imageObj.onload = function() {
    imageData = getImageData( imageObj );

    templateObj.onload = function() {
        /*
        * array:
        * R - array[0]
        * G - array[1]
        * B - array[2]
        * A - array[3]
        * */
        templateData = getImageData( templateObj );

        // set arrays
        for(var i=0; i < templateData.data.length; i+=4) {
            templateR.push(templateData.data[i]);
            templateG.push(templateData.data[i+1]);
            templateB.push(templateData.data[i+2]);
        }

        // array of all coeffiecients
        var coCoeffizienten = [amountBlocksX * amountBlocksY];

        var block = 0;
        for(var i=0; i < amountBlocksY; i++) {
            for(var j=0; j < amountBlocksX; j++) {
                // Array of R,G and B values of Image
                var imageR = [];
                var imageG = [];
                var imageB = [];

                for(var y = blocksHeight*i; y < blocksHeight*(i+1); y++) {
                    for(var x = blocksWidth*j; x < blocksWidth*(j+1); x++) {
                        // set rgb values of each block
                        imageR.push(templateData.data[x]);
                        imageG.push(templateData.data[x+1]);
                        imageB.push(templateData.data[x+2]);
                    }
                }

                // calculate correlation of template and blocks
                var coCoeffienzentR = correlation(templateR, imageR);
                var coCoeffienzentG = correlation(templateG, imageG);
                var coCoeffienzentB = correlation(templateB, imageB);

                var coCoeffientenAverage = 0;

                // average of correlation
                coCoeffientenAverage = ((coCoeffienzentR + coCoeffienzentG + coCoeffienzentB) / 3);
                coCoeffizienten[block] = coCoeffientenAverage;

                block ++;
            }
        }

        // calculate highest coefficient
        var index = 0;
        max = coCoeffizienten[0];
        for(num = 1; num < coCoeffizienten.length; num++) {
            if(coCoeffizienten[num] > max) {
                max = coCoeffizienten[num];
                index = num;
            }
        }
        row = Math.floor(index / amountBlocksX);
        col = index % amountBlocksY + 1;

        console.log("row: " + row + ", col: " + col);
        var text = "Correlation: " + max;
        //document.getElementById('output').innerHTML = text;

        // draw rectangle on position
        var c = document.getElementById("difference");
        var ctx = c.getContext("2d");
        var img = document.getElementById("image");
        var pat = ctx.createPattern(img,"repeat");
        ctx.rect((blocksWidth*col)-blocksWidth,blocksHeight*row,blocksWidth,blocksHeight);
        ctx.fillStyle = pat;
        ctx.strokeStyle="red";
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.fill();


    };
    templateObj.src = 'img/template.jpg';


};
imageObj.src = 'img/butterfly.jpg';





// Pearson product-moment correlation coefficient
function correlation(x, y) {
    var shortestArrayLength = 0;

    if(x.length == y.length) {
        shortestArrayLength = x.length;
    } else if(x.length > y.length) {
        shortestArrayLength = y.length;
    } else {
        shortestArrayLength = x.length;
    }

    var xy = [];
    var x2 = [];
    var y2 = [];

    for(var i=0; i<shortestArrayLength; i++) {
        xy.push(x[i] * y[i]);
        x2.push(x[i] * x[i]);
        y2.push(y[i] * y[i]);
    }

    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_x2 = 0;
    var sum_y2 = 0;

    for(var i=0; i< shortestArrayLength; i++) {
        sum_x += x[i];
        sum_y += y[i];
        sum_xy += xy[i];
        sum_x2 += x2[i];
        sum_y2 += y2[i];
    }

    var step1 = (shortestArrayLength * sum_xy) - (sum_x * sum_y);
    var step2 = (shortestArrayLength * sum_x2) - (sum_x * sum_x);
    var step3 = (shortestArrayLength * sum_y2) - (sum_y * sum_y);
    var step4 = Math.sqrt(step2 * step3);
    var answer = step1 / step4;

    return answer;
}

// get data pixel per pixel
function getImageData( image ) {

    var canvas = document.createElement( 'canvas' );
    canvas.width = image.width;
    canvas.height = image.height;

    var context = canvas.getContext( '2d' );
    context.drawImage( image, 0, 0 );

    return context.getImageData( 0, 0, image.width, image.height );

}
import Poly  from "./Poly.js";
import Vertex from "./Vertex.js";
import { getMJP, getInvertedMJP } from "./Scene.js";
import { getParallelMatrix, getPerspectiveMatrix } from "./ProjectionMatrix.js";
import { multiplyMatrices, matrixMultiplicationPoints } from "./Matrix.js";
import Camera from "./Camera.js";

export default class Solid {
    constructor(id, list) {

        this.id = id;  
        this.polysList = list;
    }

    calcWireframe(faces, axis, ctx, sruWidth, sruHeight, canvasWidth, canvasHeight) {
        let degree = 360/faces;
        let rad = degree*(Math.PI/180);
        // console.log("rad: ", rad);
        let incrementRad = rad;
        let radX, radY, radZ;
        // this.polysList[0].invertVertex(canvasHeight);
        
        let tempPolysList = this.polysList;
        for (let i = 1; i < faces; i++) {
            if (axis === 'x') {
                radX = rad;
                radY = 0;
                radZ = 0;
            } else if (axis === 'y') {
                radX = 0;
                radY = rad;
                radZ = 0;
            } else if (axis === 'z') {
                radX = 0;
                radY = 0;
                radZ = rad;
            }
            tempPolysList.push(new Poly(this.polysList[0].id, this.polysList[0].vertexList.map(v => new Vertex(v.x, v.y, 0))));
            tempPolysList[i].rotatePolygon(radX, radY, radZ, axis);
            rad += incrementRad;
            
        }
        let sruX = {
            min: -sruWidth,
            max: sruWidth
        }
        let sruY = {
            min: -sruHeight,
            max: sruHeight
        }

        let windowX = {
            min: 0,
            max: canvasWidth
        }
        let windowY = {
            min: 0,
            max: canvasHeight
        }
        let camera = new Camera([120, 120, 120], [1, 100, 5]);  // paralelo frontal
        // let camera = new Camera([25, 15, 80], [20, 10, 25]);
        
        // let mjpMatrix = getMJP(sruX, sruY, windowX, windowY);
        let mjpMatrix = getInvertedMJP(sruX, sruY, windowX, windowY);

        // console.log("mjpMatrix: ", mjpMatrix);

        // let projectionMatrix = getPerspectiveMatrix(camera, 80);
        let projectionMatrix = getParallelMatrix();
        // console.log("projectionMatrix: ", projectionMatrix);

        let srcMatrix = camera.getSRCMatrix();
        // console.log("srcMatrix: ", srcMatrix);

        let auxMatrix = multiplyMatrices(mjpMatrix, projectionMatrix);
        // console.log("auxMatrix: ", auxMatrix);

        let matrixSRU_SRT = multiplyMatrices(auxMatrix, srcMatrix);
        // console.log("matrixSRU_SRT: ", matrixSRU_SRT);

        let auxPolyList = tempPolysList;
        // console.log("size: ", tempPolysList[0].vertexList.length)
        // console.log("size templist: ", auxPolyList.length)

        // console.log("temp[4]: ", tempPolysList[4].vertexList)
        
        for(let i = 0; i < tempPolysList.length; i++){
            for(let j = 0; j < tempPolysList[i].vertexList.length; j++){
                tempPolysList[i].vertexList[j].x = tempPolysList[i].vertexList[j].x.toFixed(3);
                tempPolysList[i].vertexList[j].y = tempPolysList[i].vertexList[j].y.toFixed(3);
                tempPolysList[i].vertexList[j].z = tempPolysList[i].vertexList[j].z.toFixed(3);
                let x = tempPolysList[i].vertexList[j].x;
                let y = tempPolysList[i].vertexList[j].y;
                let z = tempPolysList[i].vertexList[j].z;

                let auxPoints = [[x], 
                                 [y], 
                                 [z], 
                                 [1]];
                // console.log("matrixSRU_SRT: ", matrixSRU_SRT);
                // console.log("auxPoints: ", auxPoints);
                
                let resultMatrix = multiplyMatrices(matrixSRU_SRT, auxPoints);
                // console.log("resultMatrix: ", resultMatrix);

                auxPolyList[i].vertexList[j].x = resultMatrix[0]/resultMatrix[3];
                auxPolyList[i].vertexList[j].y = resultMatrix[1]/resultMatrix[3];
                auxPolyList[i].vertexList[j].z = resultMatrix[2][0];
                
            }
        }

        for (let i = 0; i < faces; i++) {
            auxPolyList[i].drawPolygon(ctx);
            if (i < faces - 1) {
                this.drawWireframe(ctx, auxPolyList[i], auxPolyList[i + 1]);  
            } else {
                this.drawWireframe(ctx, auxPolyList[i], auxPolyList[0]); // Fecha o polígono
            }
        }

        // for (let i = 0; i < faces; i++) {
        //     // this.drawWireframe(ctx, this.polysList[i], this.polysList[i + 1], canvasWidth, canvasHeight);]
        //     // console.log("teste: ", tempPolysList[i].vertexList);
        //     // console.log("teste: ", auxPolyList[i].vertexList);

        //     // this.projectAndDraw(ctx, tempPolysList[i], canvasWidth, canvasHeight);
        //     // tempPolysList[i].drawPolygon(ctx);
        //     // tempPolysList[]
        //     auxPolyList[i].drawPolygon(ctx);
        //     this.drawWireframe(ctx, auxPolyList[i], auxPolyList[i + 1]);  
        //     // tempPolysList[i].drawPolygon(ctx);           

        // }
        // ctx.strokeStyle = this.getRandomColor();
        // ctx.beginPath();
        // ctx.moveTo(auxPolyList.vertexList[auxPolyList.vertexList.length - 1].x, auxPolyList.vertexList[auxPolyList.vertexList.length - 1].y);
        // ctx.lineTo(auxPolyList.vertexList[0].x, auxPolyList.vertexList[0].y);
        // ctx.stroke();
        // ctx.closePath();
    
        // ctx.strokeStyle = this.getRandomColor();
        // ctx.beginPath();
        // ctx.moveTo(auxPolyList.vertexList[auxPolyList.vertexList.length - 1].x, auxPolyList.vertexList[auxPolyList.vertexList.length - 1].y);
        // ctx.lineTo(auxPolyList.vertexList[0].x, auxPolyList.vertexList[0].y);
        // ctx.stroke();
        // ctx.closePath();

        // this.polysList = auxPolyList;
        // for(let i = 0; i < this.polysList.length; i++){
        //     console.log(this.polysList[i]);

        // }

    }


    
    drawWireframe(ctx, poly1, poly2){
        ctx.lineWidth = 2;
    
        for (let i = 0; i < poly1.vertexList.length; i++) {
            // Gera uma cor aleatória para cada linha
            ctx.strokeStyle = this.getRandomColor();
            
            ctx.beginPath();
            ctx.moveTo(poly1.vertexList[i].x, poly1.vertexList[i].y);
            ctx.lineTo(poly2.vertexList[i].x, poly2.vertexList[i].y);
            ctx.stroke();
            ctx.closePath();
        }
        
    }

    getRandomColor() {
        // Gera uma cor aleatória no formato hexadecimal
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }


    
}

    // projectAndDraw(ctx, poly, canvasWidth, canvasHeight) {
    //     let width = canvasWidth;
    //     let height = canvasHeight;
    //     console.log("width, height: ", width, height);
    //     let PERSPECTIVE = width * 1000; // The field of view of our 3D scene
    //     let PROJECTION_CENTER_X = width / 2; // x center of the canvas
    //     let PROJECTION_CENTER_Y = height / 2;
    //     for(let i = 0; i < poly.vertexList.length; i++) {
    //         ctx.globalAlpha = Math.abs(1 - poly.vertexList[i].z / width);

    //         // The scaleProjected will store the scale of the element based on its distance from the 'camera'
    //         let scaleProjected = PERSPECTIVE / (PERSPECTIVE + poly.vertexList[i].z);
    //         console.log("scaleProjected: ", scaleProjected);
    //         // The xProjected is the x position on the 2D world
    //         let xProjected = (poly.vertexList[i].x * scaleProjected); 
    //         console.log("xProjected: ", xProjected);
    //         // The yProjected is the y position on the 2D world
    //         let yProjected = (poly.vertexList[i].y * scaleProjected);
    //         console.log("yProjected: ", yProjected);
    //         ctx.fillRect(xProjected - 3, yProjected - 3, 3 * 2 * scaleProjected, 3 * 2 * scaleProjected);
    //     }
    //   }
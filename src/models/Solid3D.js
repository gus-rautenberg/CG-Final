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

    calcWireframe(faces, axis, ctx, canvasWidth, canvasHeight) {
        let degree = 360/faces;
        let rad = degree*(Math.PI/180);
        console.log("rad: ", rad);
        let incrementRad = rad;
        let radX, radY, radZ;
        // this.polysList[0].invertVertex(canvasHeight);
        
        let tempPolysList = this.polysList;
        for (let i = 1; i < faces; i++) {
            // if (axis === 'x') {
            //     radX = rad;
            //     radY = 0;
            //     radZ = 0;
            // } else if (axis === 'y') {
            //     radX = 0;
            //     radY = rad;
            //     radZ = 0;
            // } else if (axis === 'z') {
            //     radX = 0;
            //     radY = 0;
            //     radZ = rad;
            // }
            tempPolysList.push(new Poly(this.polysList[i-1].id, this.polysList[i-1].vertexList.map(v => new Vertex(v.x, v.y, 0))));
            tempPolysList[i].rotatePolygon(rad, rad, rad, axis);
            // rad += incrementRad;
            
        }
        let windowX = {
            min: 0,
            max: canvasWidth
        }
        let windowY = {
            min: 0,
            max: canvasHeight
        }
        let camera = new Camera([0, 0, 0], [1, 0, 0]);
        // let mjpMatrix = getMJP(windowX, windowY, windowX, windowY);
        // let mjpMatrix = getInvertedMJP(windowX, windowY, windowX, windowY);

        // console.log("mjpMatrix: ", mjpMatrix);

        // let projectionMatrix = getPerspectiveMatrix(camera);
        // // let projectionMatrix = getParallelMatrix();
        // console.log("projectionMatrix: ", projectionMatrix);

        // let srcMatrix = camera.getSRCMatrix();
        // console.log("srcMatrix: ", srcMatrix);

        // let auxMatrix = multiplyMatrices(mjpMatrix, projectionMatrix);
        // console.log("auxMatrix: ", auxMatrix);

        // let matrixSRU_SRT = multiplyMatrices(auxMatrix, srcMatrix);
        // console.log("matrixSRU_SRT: ", matrixSRU_SRT);

        let auxPolyList = tempPolysList;
        // console.log("size: ", tempPolysList[0].vertexList.length)
        // console.log("size templist: ", auxPolyList.length)

        // console.log("temp[4]: ", tempPolysList[4].vertexList)
        
        for(let i = 0; i < tempPolysList.length; i++){
            for(let j = 0; j < tempPolysList[i].vertexList.length; j++){
                let x = tempPolysList[i].vertexList[j].x;
                let y = tempPolysList[i].vertexList[j].y;
                let z = tempPolysList[i].vertexList[j].z;
                tempPolysList[i].vertexList[j].x = tempPolysList[i].vertexList[j].x.toFixed(3);
                tempPolysList[i].vertexList[j].y = tempPolysList[i].vertexList[j].y.toFixed(3);
                tempPolysList[i].vertexList[j].z = tempPolysList[i].vertexList[j].z.toFixed(3);

                let auxPoints = [x, y, z, 1];
                // console.log("matrixSRU_SRT: ", matrixSRU_SRT);
                console.log("auxPoints: ", auxPoints);
                
                // let resultMatrix = matrixMultiplicationPoints(matrixSRU_SRT, auxPoints);
                // console.log("resultMatrix: ", resultMatrix);

                // auxPolyList[i].vertexList[j].x = resultMatrix[0]/resultMatrix[3];
                // auxPolyList[i].vertexList[j].y = resultMatrix[1]/resultMatrix[3];
                // auxPolyList[i].vertexList[j].z = resultMatrix[2]/resultMatrix[3];
                
            }
        }
        for (let i = 0; i < faces - 1; i++) {
            // this.drawWireframe(ctx, this.polysList[i], this.polysList[i + 1], canvasWidth, canvasHeight);]
            // console.log("teste: ", tempPolysList[i].vertexList);
            // console.log("teste: ", auxPolyList[i].vertexList);

            // this.projectAndDraw(ctx, tempPolysList[i], canvasWidth, canvasHeight);
            // tempPolysList[i].drawPolygon(ctx);
            // tempPolysList[]
            tempPolysList[i].drawPolygon(ctx);              

        }
        this.polysList = tempPolysList;
        for(let i = 0; i < this.polysList.length; i++){
            console.log(this.polysList[i]);

        }

    }

    projectAndDraw(ctx, poly, canvasWidth, canvasHeight) {
        let width = canvasWidth;
        let height = canvasHeight;
        console.log("width, height: ", width, height);
        let PERSPECTIVE = width * 1000; // The field of view of our 3D scene
        let PROJECTION_CENTER_X = width / 2; // x center of the canvas
        let PROJECTION_CENTER_Y = height / 2;
        for(let i = 0; i < poly.vertexList.length; i++) {
            ctx.globalAlpha = Math.abs(1 - poly.vertexList[i].z / width);

            // The scaleProjected will store the scale of the element based on its distance from the 'camera'
            let scaleProjected = PERSPECTIVE / (PERSPECTIVE + poly.vertexList[i].z);
            console.log("scaleProjected: ", scaleProjected);
            // The xProjected is the x position on the 2D world
            let xProjected = (poly.vertexList[i].x * scaleProjected); 
            console.log("xProjected: ", xProjected);
            // The yProjected is the y position on the 2D world
            let yProjected = (poly.vertexList[i].y * scaleProjected);
            console.log("yProjected: ", yProjected);
            ctx.fillRect(xProjected - 3, yProjected - 3, 3 * 2 * scaleProjected, 3 * 2 * scaleProjected);
        }
      }

    drawWireframe(ctx, poly1, poly2){
        ctx.beginPath();
        ctx.lineWidth = 2;
         
        for (let i = 0; i < poly1.vertexList.length; i++) {
            
            poly1.drawWireframeX(ctx, poly1.vertexList[i], poly2.vertexList[i]);
        }
        ctx.closePath();
        ctx.stroke();
    }



}
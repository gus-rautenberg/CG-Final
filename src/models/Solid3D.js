import Poly  from "./Poly.js";
import Vertex from "./Vertex.js";
import { getMJP, getInvertedMJP } from "./Scene.js";
import { getParallelMatrix, getPerspectiveMatrix } from "./ProjectionMatrix.js";
import { multiplyMatrices, matrixMultiplicationPoints, translateMatrix3D } from "./Matrix.js";
import Camera, { normalizarVetor, produtoEscalar } from "./Camera.js";
import Edge from "./Edge.js";
import Face from "./Face.js";
import Pintor from "./Pintor.js";
import ZBuffer from "./ZBuffer.js";
import ConstantShade from "./ConstantShade.js";
import GouroudShade from "./GouroudShade.js";
import ZBufferGouraud from "./ZBufferGouroud.js";
import ZBufferPhong from "./ZBufferPhong.js";
import PhongShade from "./PhongShade.js";

export default class Solid {
    facesList = [];
    visibleFaceList = [];
    notVisibleFaceList = [];
    color = [10, 10, 1];
    newVisibleFaceList = [];
    newTempFaceList = [];
    camera;

    material = {
        ka :  [0.97, 0.34, 0.6],
        kd :  [0.7, 0.50, 0.7],
        ks :  [0.67, 0.3, 0.6],
        n :   100,
    }
    constructor(id, list) {

        this.id = id;  
        this.sliceList = list;
    }
    getMaterial() {
        return this.material;
    }

    translateSolid(x, y, z) {
        console.log("entrou aqui transladar")
        console.log("translacao x, y, z: ", x, y, z);
        let tranlateMatrix = translateMatrix3D(x, y, z);
        console.log("translacao matriz: ", tranlateMatrix);
        for (let i = 0; i < this.sliceList.length; i++) {
            console.log("this.sliceList[i]: ", this.sliceList[i]);
            let matrix = [[this.sliceList[i].vertexList[0].x, this.sliceList[i].vertexList[1].x, this.sliceList[i].vertexList[2].x], 
                          [this.sliceList[i].vertexList[0].y, this.sliceList[i].vertexList[1].y, this.sliceList[i].vertexList[2].y], 
                          [this.sliceList[i].vertexList[0].z, this.sliceList[i].vertexList[1].z, this.sliceList[i].vertexList[2].z],
                          [1, 1, 1, 1]];
            console.log("matrix translacao: ", matrix);
            
            let result = multiplyMatrices(tranlateMatrix, matrix)
            console.log("resultTranslacao: ", result);
            this.sliceList[i].vertexList[0].x = result[0][0];
            this.sliceList[i].vertexList[0].y = result[1][0];
            this.sliceList[i].vertexList[0].z = result[2][0];

            this.sliceList[i].vertexList[1].x = result[0][1];
            this.sliceList[i].vertexList[1].y = result[1][1];
            this.sliceList[i].vertexList[1].z = result[2][1];

            this.sliceList[i].vertexList[2].x = result[0][2];
            this.sliceList[i].vertexList[2].y = result[1][2];
            this.sliceList[i].vertexList[2].z = result[2][2];

            this.sliceList[i].vertexList[3].x = result[0][3];
            this.sliceList[i].vertexList[3].y = result[1][3];
            this.sliceList[i].vertexList[3].z = result[2][3];

        }
        this.wireFrameAgain(this.sliceList);
        this.shading2();
        

    }
    wireFrameAgain(sliceList) {
        let tempSliceList = this.sliceList;
        let tempFacesList = [];

        for (let i = 0; i < this.fatias; i++) {
            let index = i;
            if(i == this.fatias-1) {
                index = 0;
            } 
            for(let j = 0; j < tempSliceList[index].vertexList.length; j++){
                const currentFaceEdges = [];
                let edgeSlice1;
                let edgeToSlice2;
                let edgeSlice2;
                let edgeToSlice1;
                if(j == tempSliceList[index].vertexList.length - 1){
                    if(i == this.fatias-1) {
                        edgeSlice1 = new Edge(tempSliceList[i].vertexList[j], tempSliceList[i].vertexList[0], "edgeSlice1 " + i);
                        edgeToSlice2 = new Edge(tempSliceList[i].vertexList[0], tempSliceList[index].vertexList[0], 'edgeToSlice2 ' + i);
                        edgeSlice2 = new Edge(tempSliceList[index].vertexList[0], tempSliceList[index].vertexList[j], 'edgeSlice2 ' + i);
                        edgeToSlice1 = new Edge(tempSliceList[index].vertexList[j], tempSliceList[i].vertexList[j], 'edgeToSlice1 ' + i);
                    } else {
                        edgeSlice1 = new Edge(tempSliceList[i].vertexList[j], tempSliceList[i].vertexList[0], "edgeSlice1 " + i);
                        edgeToSlice2 = new Edge(tempSliceList[i].vertexList[0], tempSliceList[i+1].vertexList[0], 'edgeToSlice2 ' + i);
                        edgeSlice2 = new Edge(tempSliceList[i+1].vertexList[0], tempSliceList[i+1].vertexList[j], 'edgeSlice2 ' + i);
                        edgeToSlice1 = new Edge(tempSliceList[i+1].vertexList[j], tempSliceList[i].vertexList[j], 'edgeToSlice1 ' + i);
                    }


                } else {  

                    if(i == this.fatias-1) {
                        edgeSlice1 = new Edge(tempSliceList[i].vertexList[j], tempSliceList[i].vertexList[j+1], 'edgeSlice1 ' + i);
                        edgeToSlice2 = new Edge(tempSliceList[i].vertexList[j+1], tempSliceList[index].vertexList[j+1], 'edgeToSlice2 ' + i);
                        edgeSlice2 = new Edge(tempSliceList[index].vertexList[j+1], tempSliceList[index].vertexList[j], 'edgeSlice2 ' + i);
                        edgeToSlice1 = new Edge(tempSliceList[index].vertexList[j], tempSliceList[i].vertexList[j], 'edgeToSlice1 ' + i);
                    } else {
                        edgeSlice1 = new Edge(tempSliceList[i].vertexList[j], tempSliceList[i].vertexList[j+1], 'edgeSlice1 ' + i);
                        edgeToSlice2 = new Edge(tempSliceList[i].vertexList[j+1], tempSliceList[i+1].vertexList[j+1], 'edgeToSlice2 ' + i);
                        edgeSlice2 = new Edge(tempSliceList[i+1].vertexList[j+1], tempSliceList[i+1].vertexList[j], 'edgeSlice2 ' + i);
                        edgeToSlice1 = new Edge(tempSliceList[i+1].vertexList[j], tempSliceList[i].vertexList[j], 'edgeToSlice1 ' + i);
                    }

                }

                currentFaceEdges.push(edgeSlice1);
                currentFaceEdges.push(edgeToSlice2);
                currentFaceEdges.push(edgeSlice2);
                currentFaceEdges.push(edgeToSlice1);
                const face = new Face(currentFaceEdges);
                if(face.isCounterClockwise()) {
                    console.log("faceTesteLogica Verdadeiro: ", face);
                    // this.facesList.push(face);
                    tempFacesList.push(face);
                } else {
                    console.log("faceTesteLogica Falso: ", face);
                    tempFacesList.push(face);

                // this.facesList.push(face);
                
                }
            }


        }
        

        console.log("TEMPPOLYLIST: ", tempSliceList);
        // let camera = new Camera([120, 120, 120], [1, 100, 5]);  // paralelo frontal
        // let camera = new Camera([0, 0, 0], [200, 0 , 0]); // rodar em X
        let camera = new Camera(this.cameraPoint, this.focalPoint); // rodar em X
        console.log("CameraCriada", camera)
        this.drawVisibleFaces(this.ctx, camera, tempFacesList);
        
        // let mjpMatrix = getMJP(sruX, sruY, windowX, windowY);
        let mjpMatrix = getInvertedMJP(this.sruX, this.sruY, this.windowX, this.windowY);

        console.log("mjpMatrix: ", mjpMatrix);
        let projectionMatrix;;
        if (this.visao == 'perspectiva') {
            projectionMatrix = getPerspectiveMatrix(camera);

        } else if (this.visao == "paralela") {
            projectionMatrix = getParallelMatrix();
        }
        // let 
        console.log("projectionMatrix: ", projectionMatrix);

        let srcMatrix = camera.getSRCMatrix();
        console.log("srcMatrix: ", srcMatrix);

        let auxMatrix = multiplyMatrices(mjpMatrix, projectionMatrix);
        console.log("auxMatrix: ", auxMatrix);

        let matrixSRU_SRT = multiplyMatrices(auxMatrix, srcMatrix);
        // console.log("matrixSRU_SRT: ", matrixSRU_SRT);

        this.sliceList = tempSliceList;
        // console.log("size: ", tempSliceList[0].vertexList.length)
        // console.log("size templist: ", auxSliceList.length)

        // console.log("temp[4]: ", tempSliceList[4].vertexList)
        let newTempFaceList = [];
        let newEdgesList = [];
        for(let k = 0; k < tempFacesList.length; k++){
            for(let s = 0; s< tempFacesList[k].listEdges.length; s++){
                tempFacesList[k].listEdges[s].vertexInit.x = tempFacesList[k].listEdges[s].vertexInit.x;
                tempFacesList[k].listEdges[s].vertexInit.y = tempFacesList[k].listEdges[s].vertexInit.y;
                tempFacesList[k].listEdges[s].vertexInit.z = tempFacesList[k].listEdges[s].vertexInit.z;

                tempFacesList[k].listEdges[s].vertexEnd.x = tempFacesList[k].listEdges[s].vertexEnd.x;
                tempFacesList[k].listEdges[s].vertexEnd.y = tempFacesList[k].listEdges[s].vertexEnd.y;
                tempFacesList[k].listEdges[s].vertexEnd.z = tempFacesList[k].listEdges[s].vertexEnd.z;

                let xInit = tempFacesList[k].listEdges[s].vertexInit.x;
                let yInit = tempFacesList[k].listEdges[s].vertexInit.y;
                let zInit = tempFacesList[k].listEdges[s].vertexInit.z;

                let xEnd = tempFacesList[k].listEdges[s].vertexEnd.x;    
                let yEnd = tempFacesList[k].listEdges[s].vertexEnd.y;
                let zEnd = tempFacesList[k].listEdges[s].vertexEnd.z;
                let auxInitPoints = [[xInit],
                                 [yInit],
                                 [zInit],
                                 [1]];

                let auxEndPoints = [[xEnd],
                                 [yEnd],
                                 [zEnd],
                                 [1]];
                let resultInitMatrix = multiplyMatrices(matrixSRU_SRT, auxInitPoints);
                let resultEndMatrix = multiplyMatrices(matrixSRU_SRT, auxEndPoints);
                console.log("result1: ", resultInitMatrix, "result2: ", resultEndMatrix);
                let resultInit = new Vertex(resultInitMatrix[0]/resultInitMatrix[3], resultInitMatrix[1]/resultInitMatrix[3], resultInitMatrix[2][0]);
                let resultEnd = new Vertex(resultEndMatrix[0]/resultEndMatrix[3], resultEndMatrix[1]/resultEndMatrix[3], resultEndMatrix[2][0]);
                let newEdge = new Edge(resultInit, resultEnd, tempFacesList[k].listEdges[s].edgeID);
                console.log("newEdge: ", newEdge);
                newEdgesList.push(newEdge);
                
            }
            console.log("newEdgesList: ", newEdgesList);
            let newVisibleFace = new Face(newEdgesList);
            newTempFaceList[k] = newVisibleFace;
            newEdgesList = [];
        }

        let newVisibleFaceList = [];
        let edgesList = [];

        console.log("this.visibleFaceList.length")
        for(let k = 0; k < this.visibleFaceList.length; k++){
            for(let s = 0; s< this.visibleFaceList[k].listEdges.length; s++){
                this.visibleFaceList[k].listEdges[s].vertexInit.x = this.visibleFaceList[k].listEdges[s].vertexInit.x;
                this.visibleFaceList[k].listEdges[s].vertexInit.y = this.visibleFaceList[k].listEdges[s].vertexInit.y;
                this.visibleFaceList[k].listEdges[s].vertexInit.z = this.visibleFaceList[k].listEdges[s].vertexInit.z;

                this.visibleFaceList[k].listEdges[s].vertexEnd.x = this.visibleFaceList[k].listEdges[s].vertexEnd.x;
                this.visibleFaceList[k].listEdges[s].vertexEnd.y = this.visibleFaceList[k].listEdges[s].vertexEnd.y;
                this.visibleFaceList[k].listEdges[s].vertexEnd.z = this.visibleFaceList[k].listEdges[s].vertexEnd.z;

                let xInit = this.visibleFaceList[k].listEdges[s].vertexInit.x;
                let yInit = this.visibleFaceList[k].listEdges[s].vertexInit.y;
                let zInit = this.visibleFaceList[k].listEdges[s].vertexInit.z;

                let xEnd = this.visibleFaceList[k].listEdges[s].vertexEnd.x;    
                let yEnd = this.visibleFaceList[k].listEdges[s].vertexEnd.y;
                let zEnd = this.visibleFaceList[k].listEdges[s].vertexEnd.z;
                let auxInitPoints = [[xInit],
                                 [yInit],
                                 [zInit],
                                 [1]];

                let auxEndPoints = [[xEnd],
                                 [yEnd],
                                 [zEnd],
                                 [1]];
                let resultInitMatrix = multiplyMatrices(matrixSRU_SRT, auxInitPoints);
                let resultEndMatrix = multiplyMatrices(matrixSRU_SRT, auxEndPoints);
                console.log("result1: ", resultInitMatrix, "result2: ", resultEndMatrix);
                let resultInit = new Vertex(resultInitMatrix[0]/resultInitMatrix[3], resultInitMatrix[1]/resultInitMatrix[3], resultInitMatrix[2][0]);
                let resultEnd = new Vertex(resultEndMatrix[0]/resultEndMatrix[3], resultEndMatrix[1]/resultEndMatrix[3], resultEndMatrix[2][0]);
                let newEdge = new Edge(resultInit, resultEnd, this.visibleFaceList[k].listEdges[s].edgeID);
                console.log("newEdge: ", newEdge);
                edgesList.push(newEdge);
                
            }
            console.log("EdgesList: ", edgesList);
            let newVisibleFace = new Face(edgesList);
            newVisibleFaceList[k] = newVisibleFace;
            edgesList = [];
        }
        this.newVisibleFaceList = newVisibleFaceList;
        this.newTempFaceList = newTempFaceList;
        this.camera = camera;

        let count = 0;

            // let result = this.testeVisibilidade(tempFacesList[i], camera.getVRP(), ctx, i);
        for(let i = 0; i < newVisibleFaceList.length; i++){
            this.ctx.beginPath();
            this.ctx.strokeStyle = "Black";

            this.ctx.moveTo(newVisibleFaceList[i].listEdges[0].vertexInit.x, newVisibleFaceList[i].listEdges[0].vertexInit.y);
            newVisibleFaceList[i].listEdges.forEach(edge => {
                console.log("testeDoWireframe: ", edge, "X DIFF: ", edge.vertexEnd.x - edge.vertexInit.x, " Y Diff ", edge.vertexEnd.y - edge.vertexInit.y);
                this.ctx.lineTo(edge.vertexEnd.x, edge.vertexEnd.y);
            });
            this.ctx.closePath();
            this.ctx.stroke();
        }

        //WIREFRAME


        
        // console.log(this.facesList);
        let pintor = new Pintor();
        for(let i = 0; i < this.facesList.length; i++){
            // console.log("Centroiude: ", this.facesList[i].centroide);
            pintor.getDistance(this.facesList[i], camera.getVRP());
            // console.log("Dist: ", pintor.distance);
        }
    }

    calcWireframe(fatias, axis, ctx, sruX, sruY, windowX, windowY, cameraPoint, focalPoint, visao) {
        this.fatias = fatias;
        this.ctx = ctx;
        this.sruX = sruX;
        this.sruY = sruY;
        this.windowX = windowX;
        this.windowY = windowY; 
        this.cameraPoint = cameraPoint;
        this.focalPoint = focalPoint;   
        this.visao = visao;

        let tempFacesList = [];
        let degree = 360/fatias;
        let rad = degree*(Math.PI/180);
        // console.log("rad: ", rad);
        let incrementRad = rad;
        let radX, radY, radZ;
        // this.sliceList[0].invertVertex(canvasHeight);
        console.log("sliceList: ", this.sliceList);
        let tempSliceList = this.sliceList;
        for (let i = 1; i < fatias; i++) {
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
            tempSliceList.push(new Poly(this.sliceList[0].id, this.sliceList[0].vertexList.map(v => new Vertex(v.x, v.y, 0))));
            tempSliceList[i].rotatePolygon(radX, radY, radZ, axis);
            rad += incrementRad;
            
        }
        
        
        console.log("testeWireframe: ", tempSliceList);
        for (let i = 0; i < fatias; i++) {
            let index = i;
            if(i == fatias-1) {
                index = 0;
            } 
            for(let j = 0; j < tempSliceList[index].vertexList.length; j++){
                const currentFaceEdges = [];
                let edgeSlice1;
                let edgeToSlice2;
                let edgeSlice2;
                let edgeToSlice1;
                if(j == tempSliceList[index].vertexList.length - 1){
                    if(i == fatias-1) {
                        edgeSlice1 = new Edge(tempSliceList[i].vertexList[j], tempSliceList[i].vertexList[0], "edgeSlice1 " + i);
                        edgeToSlice2 = new Edge(tempSliceList[i].vertexList[0], tempSliceList[index].vertexList[0], 'edgeToSlice2 ' + i);
                        edgeSlice2 = new Edge(tempSliceList[index].vertexList[0], tempSliceList[index].vertexList[j], 'edgeSlice2 ' + i);
                        edgeToSlice1 = new Edge(tempSliceList[index].vertexList[j], tempSliceList[i].vertexList[j], 'edgeToSlice1 ' + i);
                    } else {
                        edgeSlice1 = new Edge(tempSliceList[i].vertexList[j], tempSliceList[i].vertexList[0], "edgeSlice1 " + i);
                        edgeToSlice2 = new Edge(tempSliceList[i].vertexList[0], tempSliceList[i+1].vertexList[0], 'edgeToSlice2 ' + i);
                        edgeSlice2 = new Edge(tempSliceList[i+1].vertexList[0], tempSliceList[i+1].vertexList[j], 'edgeSlice2 ' + i);
                        edgeToSlice1 = new Edge(tempSliceList[i+1].vertexList[j], tempSliceList[i].vertexList[j], 'edgeToSlice1 ' + i);
                    }


                } else {  

                    if(i == fatias-1) {
                        edgeSlice1 = new Edge(tempSliceList[i].vertexList[j], tempSliceList[i].vertexList[j+1], 'edgeSlice1 ' + i);
                        edgeToSlice2 = new Edge(tempSliceList[i].vertexList[j+1], tempSliceList[index].vertexList[j+1], 'edgeToSlice2 ' + i);
                        edgeSlice2 = new Edge(tempSliceList[index].vertexList[j+1], tempSliceList[index].vertexList[j], 'edgeSlice2 ' + i);
                        edgeToSlice1 = new Edge(tempSliceList[index].vertexList[j], tempSliceList[i].vertexList[j], 'edgeToSlice1 ' + i);
                    } else {
                        edgeSlice1 = new Edge(tempSliceList[i].vertexList[j], tempSliceList[i].vertexList[j+1], 'edgeSlice1 ' + i);
                        edgeToSlice2 = new Edge(tempSliceList[i].vertexList[j+1], tempSliceList[i+1].vertexList[j+1], 'edgeToSlice2 ' + i);
                        edgeSlice2 = new Edge(tempSliceList[i+1].vertexList[j+1], tempSliceList[i+1].vertexList[j], 'edgeSlice2 ' + i);
                        edgeToSlice1 = new Edge(tempSliceList[i+1].vertexList[j], tempSliceList[i].vertexList[j], 'edgeToSlice1 ' + i);
                    }

                }

                currentFaceEdges.push(edgeSlice1);
                currentFaceEdges.push(edgeToSlice2);
                currentFaceEdges.push(edgeSlice2);
                currentFaceEdges.push(edgeToSlice1);
                const face = new Face(currentFaceEdges);
                if(face.isCounterClockwise()) {
                    console.log("faceTesteLogica Verdadeiro: ", face);
                    // this.facesList.push(face);
                    tempFacesList.push(face);
                } else {
                    console.log("faceTesteLogica Falso: ", face);
                    tempFacesList.push(face);

                // this.facesList.push(face);
                
                }
            }


        }
        

        console.log("TEMPPOLYLIST: ", tempSliceList);
        // let camera = new Camera([120, 120, 120], [1, 100, 5]);  // paralelo frontal
        // let camera = new Camera([0, 0, 0], [200, 0 , 0]); // rodar em X
        let camera = new Camera(cameraPoint, focalPoint); // rodar em X
        console.log("CameraCriada", camera)
        this.drawVisibleFaces(ctx, camera, tempFacesList);
        
        // let mjpMatrix = getMJP(sruX, sruY, windowX, windowY);
        let mjpMatrix = getInvertedMJP(sruX, sruY, windowX, windowY);

        console.log("mjpMatrix: ", mjpMatrix);
        let projectionMatrix;;
        if (visao == 'perspectiva') {
            projectionMatrix = getPerspectiveMatrix(camera);

        } else if (visao == "paralela") {
            projectionMatrix = getParallelMatrix();
        }
        // let 
        console.log("projectionMatrix: ", projectionMatrix);

        let srcMatrix = camera.getSRCMatrix();
        console.log("srcMatrix: ", srcMatrix);

        let auxMatrix = multiplyMatrices(mjpMatrix, projectionMatrix);
        console.log("auxMatrix: ", auxMatrix);

        let matrixSRU_SRT = multiplyMatrices(auxMatrix, srcMatrix);
        // console.log("matrixSRU_SRT: ", matrixSRU_SRT);

        this.sliceList = tempSliceList;
        // console.log("size: ", tempSliceList[0].vertexList.length)
        // console.log("size templist: ", auxSliceList.length)

        // console.log("temp[4]: ", tempSliceList[4].vertexList)
        let newTempFaceList = [];
        let newEdgesList = [];
        
        for(let k = 0; k < tempFacesList.length; k++){
            for(let s = 0; s< tempFacesList[k].listEdges.length; s++){
                tempFacesList[k].listEdges[s].vertexInit.x = tempFacesList[k].listEdges[s].vertexInit.x;
                tempFacesList[k].listEdges[s].vertexInit.y = tempFacesList[k].listEdges[s].vertexInit.y;
                tempFacesList[k].listEdges[s].vertexInit.z = tempFacesList[k].listEdges[s].vertexInit.z;

                tempFacesList[k].listEdges[s].vertexEnd.x = tempFacesList[k].listEdges[s].vertexEnd.x;
                tempFacesList[k].listEdges[s].vertexEnd.y = tempFacesList[k].listEdges[s].vertexEnd.y;
                tempFacesList[k].listEdges[s].vertexEnd.z = tempFacesList[k].listEdges[s].vertexEnd.z;

                let xInit = tempFacesList[k].listEdges[s].vertexInit.x;
                let yInit = tempFacesList[k].listEdges[s].vertexInit.y;
                let zInit = tempFacesList[k].listEdges[s].vertexInit.z;

                let xEnd = tempFacesList[k].listEdges[s].vertexEnd.x;    
                let yEnd = tempFacesList[k].listEdges[s].vertexEnd.y;
                let zEnd = tempFacesList[k].listEdges[s].vertexEnd.z;
                let auxInitPoints = [[xInit],
                                 [yInit],
                                 [zInit],
                                 [1]];

                let auxEndPoints = [[xEnd],
                                 [yEnd],
                                 [zEnd],
                                 [1]];
                let resultInitMatrix = multiplyMatrices(matrixSRU_SRT, auxInitPoints);
                let resultEndMatrix = multiplyMatrices(matrixSRU_SRT, auxEndPoints);
                console.log("result1: ", resultInitMatrix, "result2: ", resultEndMatrix);
                let resultInit = new Vertex(resultInitMatrix[0]/resultInitMatrix[3], resultInitMatrix[1]/resultInitMatrix[3], resultInitMatrix[2][0]);
                let resultEnd = new Vertex(resultEndMatrix[0]/resultEndMatrix[3], resultEndMatrix[1]/resultEndMatrix[3], resultEndMatrix[2][0]);
                let newEdge = new Edge(resultInit, resultEnd, tempFacesList[k].listEdges[s].edgeID);
                console.log("newEdge: ", newEdge);
                newEdgesList.push(newEdge);
                
            }
            console.log("newEdgesList: ", newEdgesList);
            let newVisibleFace = new Face(newEdgesList);
            newTempFaceList[k] = newVisibleFace;
            newEdgesList = [];
        }

        let newVisibleFaceList = [];
        let edgesList = [];

        console.log("this.visibleFaceList.length")
        for(let k = 0; k < this.visibleFaceList.length; k++){
            for(let s = 0; s< this.visibleFaceList[k].listEdges.length; s++){
                this.visibleFaceList[k].listEdges[s].vertexInit.x = this.visibleFaceList[k].listEdges[s].vertexInit.x;
                this.visibleFaceList[k].listEdges[s].vertexInit.y = this.visibleFaceList[k].listEdges[s].vertexInit.y;
                this.visibleFaceList[k].listEdges[s].vertexInit.z = this.visibleFaceList[k].listEdges[s].vertexInit.z;

                this.visibleFaceList[k].listEdges[s].vertexEnd.x = this.visibleFaceList[k].listEdges[s].vertexEnd.x;
                this.visibleFaceList[k].listEdges[s].vertexEnd.y = this.visibleFaceList[k].listEdges[s].vertexEnd.y;
                this.visibleFaceList[k].listEdges[s].vertexEnd.z = this.visibleFaceList[k].listEdges[s].vertexEnd.z;

                let xInit = this.visibleFaceList[k].listEdges[s].vertexInit.x;
                let yInit = this.visibleFaceList[k].listEdges[s].vertexInit.y;
                let zInit = this.visibleFaceList[k].listEdges[s].vertexInit.z;

                let xEnd = this.visibleFaceList[k].listEdges[s].vertexEnd.x;    
                let yEnd = this.visibleFaceList[k].listEdges[s].vertexEnd.y;
                let zEnd = this.visibleFaceList[k].listEdges[s].vertexEnd.z;
                let auxInitPoints = [[xInit],
                                 [yInit],
                                 [zInit],
                                 [1]];

                let auxEndPoints = [[xEnd],
                                 [yEnd],
                                 [zEnd],
                                 [1]];
                let resultInitMatrix = multiplyMatrices(matrixSRU_SRT, auxInitPoints);
                let resultEndMatrix = multiplyMatrices(matrixSRU_SRT, auxEndPoints);
                console.log("result1: ", resultInitMatrix, "result2: ", resultEndMatrix);
                let resultInit = new Vertex(resultInitMatrix[0]/resultInitMatrix[3], resultInitMatrix[1]/resultInitMatrix[3], resultInitMatrix[2][0]);
                let resultEnd = new Vertex(resultEndMatrix[0]/resultEndMatrix[3], resultEndMatrix[1]/resultEndMatrix[3], resultEndMatrix[2][0]);
                let newEdge = new Edge(resultInit, resultEnd, this.visibleFaceList[k].listEdges[s].edgeID);
                console.log("newEdge: ", newEdge);
                edgesList.push(newEdge);
                
            }
            console.log("EdgesList: ", edgesList);
            let newVisibleFace = new Face(edgesList);
            newVisibleFaceList[k] = newVisibleFace;
            edgesList = [];
        }
        this.newVisibleFaceList = newVisibleFaceList;
        this.newTempFaceList = newTempFaceList;
        this.camera = camera;

        let count = 0;

            // let result = this.testeVisibilidade(tempFacesList[i], camera.getVRP(), ctx, i);
        for(let i = 0; i < newVisibleFaceList.length; i++){
            ctx.beginPath();
            ctx.strokeStyle = "Black";

            ctx.moveTo(newVisibleFaceList[i].listEdges[0].vertexInit.x, newVisibleFaceList[i].listEdges[0].vertexInit.y);
            newVisibleFaceList[i].listEdges.forEach(edge => {
                console.log("testeDoWireframe: ", edge, "X DIFF: ", edge.vertexEnd.x - edge.vertexInit.x, " Y Diff ", edge.vertexEnd.y - edge.vertexInit.y);
                ctx.lineTo(edge.vertexEnd.x, edge.vertexEnd.y);
            });
            ctx.closePath();
            ctx.stroke();
        }

        //WIREFRAME


        
        // console.log(this.facesList);
        let pintor = new Pintor();
        for(let i = 0; i < this.facesList.length; i++){
            // console.log("Centroiude: ", this.facesList[i].centroide);
            pintor.getDistance(this.facesList[i], camera.getVRP());
            // console.log("Dist: ", pintor.distance);
        }
        for(let i = 0; i < tempFacesList.length; i++){
            // console.log(i + " Visibilidade: ", this.testeVisibilidade(tempFacesList[i], camera.getVRP()));
        }
    }

    setMaterial(material) {
        this.material = material;
    }
    shading2(){
        let zBufferFrame = Array.from({ length: this.windowY.max }, () => Array.from({ length: this.windowX.max }, () => null));
        


        if(type === "constante") {
            for(let i = 0; i < this.newVisibleFaceList.length; i++){
                let material = this.getMaterial();
                let constantShade = new ConstantShade(this.iA, this.L, this.newVisibleFaceList[i], this.camera, this.material);
                constantShade.constantRun();
                let zBuffer = new ZBuffer(this.windowX, this.windowY, this.newVisibleFaceList[i]);
                zBuffer.render(this.ctx, zBufferFrame, this.color);
                
            }

        }
        else if(type === "gouraud") {
            for(let i = 0; i < this.newVisibleFaceList.length; i++){
                let material = this.getMaterial();

                let gouroudShade = new GouroudShade(this.iA, this.L, this.newVisibleFaceList[i], this.camera, material, this.newTempFaceList);
                gouroudShade.gouroudRun();
                let zBufferGouraud = new ZBufferGouraud(this.windowX, this.windowY, this.newVisibleFaceList[i]);
                zBufferGouraud.render(this.ctx, zBufferFrame, this.color);
    
            }
        }
        else if(type === "phong") {
            for(let i = 0; i < this.newVisibleFaceList.length; i++){
                let material = this.getMaterial();

                let phongShade = new PhongShade(this.iA, this.L, this.newVisibleFaceList[i], this.camera, material, this.newTempFaceList);
    
                let zBufferPhong = new ZBufferPhong(this.windowX, this.windowY, this.newVisibleFaceList[i]);
                zBufferPhong.render(this.ctx, zBufferFrame, phongShade, this.newTempFaceList, this.L, this.camera);
    
                // console.log("zbuffer " + i + ": ", zBuffer.getFace());
            }
        }

        for (let currentY = windowY.min; currentY < windowY.max; currentY++) {
            for(let currentX = windowX.min; currentX < windowX.max; currentX++) {
                if (zBufferFrame[currentY][currentX] != null) {
                    ctx.fillStyle = zBufferFrame[currentY][currentX].color;
                    ctx.fillRect(currentX, currentY, 1, 1);
                }
            }
        }
    }

    shading(ctx, type, windowX, windowY, L, iA, material) {
        this.type = type;
        this.L = L;
        this.iA = iA;
        this.setMaterial(material);
        // let L = {vector : [1050, -500, -900], Il : [170, 140, 120]};	//gouroud
        let zBufferFrame = Array.from({ length: windowY.max }, () => Array.from({ length: windowX.max }, () => null));
        


        if(type === "constante") {
            for(let i = 0; i < this.newVisibleFaceList.length; i++){
                let material = this.getMaterial();
                let constantShade = new ConstantShade(iA, L, this.newVisibleFaceList[i], this.camera, material);
                constantShade.constantRun();
                let zBuffer = new ZBuffer(windowX, windowY, this.newVisibleFaceList[i]);
                zBuffer.render(ctx, zBufferFrame, this.color);
                
            }

        }
        else if(type === "gouraud") {
            for(let i = 0; i < this.newVisibleFaceList.length; i++){
                let material = this.getMaterial();

                let gouroudShade = new GouroudShade(iA, L, this.newVisibleFaceList[i], this.camera, material, this.newTempFaceList);
                gouroudShade.gouroudRun();
                let zBufferGouraud = new ZBufferGouraud(windowX, windowY, this.newVisibleFaceList[i]);
                zBufferGouraud.render(ctx, zBufferFrame, this.color);
    
            }
        }
        else if(type === "phong") {
            for(let i = 0; i < this.newVisibleFaceList.length; i++){
                let material = this.getMaterial();

                let phongShade = new PhongShade(iA, L, this.newVisibleFaceList[i], this.camera, material, this.newTempFaceList);
    
                let zBufferPhong = new ZBufferPhong(windowX, windowY, this.newVisibleFaceList[i]);
                zBufferPhong.render(ctx, zBufferFrame, phongShade, this.newTempFaceList, L, this.camera);
    
                // console.log("zbuffer " + i + ": ", zBuffer.getFace());
            }
        }

        for (let currentY = windowY.min; currentY < windowY.max; currentY++) {
            for(let currentX = windowX.min; currentX < windowX.max; currentX++) {
                if (zBufferFrame[currentY][currentX] != null) {
                    ctx.fillStyle = zBufferFrame[currentY][currentX].color;
                    ctx.fillRect(currentX, currentY, 1, 1);
                }
            }
        }
    
    }
    reverseFace(face) {

        let edgeSlice1 = new Edge(face.listEdges[0].vertexInit, face.listEdges[3].vertexInit, face.listEdges[0].edgeID);
        let edgeToSlice2 = new Edge(face.listEdges[3].vertexInit, face.listEdges[2].vertexInit, face.listEdges[3].edgeID);
        let edgeSlice2 = new Edge(face.listEdges[2].vertexInit, face.listEdges[1].vertexInit, face.listEdges[2].edgeID);
        let edgeToSlice1 = new Edge(face.listEdges[1].vertexInit, face.listEdges[0].vertexInit, face.listEdges[1].edgeID);
        const currentFaceEdges = [];
        currentFaceEdges.push(edgeSlice1);
        currentFaceEdges.push(edgeToSlice2);
        currentFaceEdges.push(edgeSlice2);
        currentFaceEdges.push(edgeToSlice1);
        const newFace = new Face(currentFaceEdges);
        // Recriar as arestas para manter a consistência da orientação

        console.log("reverseFace: ", newFace.isCounterClockwise())
        return face;
    }



    drawFaceOK(ctx, face) {
        if (!ctx) {
            console.error("Canvas context (ctx) is undefined");
            return;
        }
        ctx.beginPath();
        ctx.strokeStyle = "black";
        face.listEdges.forEach(edge => {
            ctx.moveTo(edge.vertexInit.x, edge.vertexInit.y);
            ctx.lineTo(edge.vertexEnd.x, edge.vertexEnd.y);
        });
        ctx.closePath();
        ctx.stroke();
    }

    testeVisibilidade(face, vrp, ctx, index) {
        const x = (vrp[0] - face.centroide[0]); // (Math.pow(vrp[0] - face.centroide[0], 2));
        const y = (vrp[1] - face.centroide[1]); // (Math.pow(vrp[1] - face.centroide[1], 2));
        const z = (vrp[2] - face.centroide[2]); // (Math.pow(vrp[2] - face.centroide[2], 2));
        const O = [x, y, z];
        const oNormalized = normalizarVetor(O)
        // console.log("o: ", O);
        console.log("oNormalizado: ", oNormalized, " face normal: ", face.getNormal());

        const result = produtoEscalar(oNormalized, face.getNormal());
        console.log("RESULTTODO: ", result);
        // if(result > 0){
        //     this.drawFaces(ctx, index);
        // }
        return result;
    }
        

    drawVisibleFaces(ctx, camera, list) {
        console.log("LISTA: ", list);
        if (!ctx) {
            console.error("Canvas context (ctx) is undefined");
            return;
        }
    
        if (list.length === 0) {
            console.warn("No faces to draw");
            return;
        }
        
        for(let i = 0; i < list.length; i++){
            const visibility = this.testeVisibilidade(list[i], camera.getVRP());
            if (visibility > 0) {
                this.visibleFaceList.push(list[i]);

            }
            else {
                this.notVisibleFaceList.push(list[i]);

            }
        }
    }


    drawWireframe(ctx, poly1, poly2, index){
        ctx.lineWidth = 2;
        // poly1.drawPolygon(ctx);
        for (let i = 0; i < poly1.vertexList.length; i++) {
            // Gera uma cor aleatória para cada linha
            ctx.strokeStyle = this.getRandomColor();
            
            ctx.beginPath();    
            ctx.moveTo(poly1.vertexList[i].x, poly1.vertexList[i].y);
            ctx.lineTo(poly2.vertexList[i].x, poly2.vertexList[i].y);
            // console.log("drawWireframe: ", poly1.vertexList[i].x, poly1.vertexList[i].y, poly2.vertexList[i].x, poly2.vertexList[i].y);
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


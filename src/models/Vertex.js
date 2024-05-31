import { xRotationMatrix3D, yRotationMatrix3D, zRotationMatrix3D, matrixMultiplicationPoints } from "./Matrix.js";
export default class Vertex {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }



    rotateX(teta){
        // console.log("teta: ", teta);
        console.log("ANTES: this.x, this.y, this.z:", this.x, this.y, this.z);

        // let temp = (this.y* Math.cos(teta)) - (this.z * Math.sin(teta));
        // let temp1 = (this.y * Math.sin(teta)) + (this.z * Math.cos(teta));
        // // console.log("temp, temp1: ", temp, temp1);
        // this.y = temp;
        // this.z = temp1;    
        // console.log("this.x, this.y, this.z:", this.x, this.y, this.z);

        let matrix = xRotationMatrix3D(teta);
        let pointsMatrix = [this.x, this.y, this.z, 1];	
        let resultMatrix = matrixMultiplicationPoints(matrix, pointsMatrix);

        console.log("resultMatrix: ", resultMatrix);
        

        this.x = resultMatrix[0];
        this.y = resultMatrix[1];
        this.z = resultMatrix[2];

        console.log("DEPOIS: this.x, this.y, this.z:", this.x, this.y, this.z);
    };

    rotateY(teta){
        // let temp = (this.x * Math.cos(teta)) - (this.z * Math.sin(teta));
        // let temp1 = (this.x * Math.sin(teta)) + (this.z * Math.cos(teta)); // (this.x * -1) + (this.z * Math.cos(teta))
        // this.x = temp;
        // this.z = temp1;    

        let matrix = yRotationMatrix3D(teta);
        let pointsMatrix = [this.x, this.y, this.z, 1];	
        let resultMatrix = matrixMultiplicationPoints(matrix, pointsMatrix);
        
        this.x = resultMatrix[0];
        this.y = resultMatrix[1];
        this.z = resultMatrix[2];

    };

    rotateZ(teta){
        // let temp = (this.x* Math.cos(teta)) - (this.y * Math.sin(teta));
        // let temp1 = (this.x * Math.sin(teta)) + (this.y * Math.cos(teta));
        // this.x = temp;
        // this.y = temp1;    

        let matrix = zRotationMatrix3D(teta);
        let pointsMatrix = [this.x, this.y, this.z, 1];	
        let resultMatrix = matrixMultiplicationPoints(matrix, pointsMatrix);
        
        this.x = resultMatrix[0];
        this.y = resultMatrix[1];
        this.z = resultMatrix[2];

    };
    // rotateVertex(x, y, z, axis){
    //     this.rotateX(x);
    //     this.rotateY(y);
    //     this.rotateZ(z);
        
    // }

    rotateVertex(x, y, z, axis){
        if(axis === 'x'){
            console.log("RotateVertex: entrou no X")
            this.rotateX(x);
        } else if(axis === 'y'){
            console.log("RotateVertex: entrou no Y")

            this.rotateY(y);
        } else if(axis === 'z'){
            console.log("RotateVertex: entrou no Z")

            this.rotateZ(z);
        }
    } 

    invertVertexY(yMax){
        this.y = yMax - this.y;
        
    }

}
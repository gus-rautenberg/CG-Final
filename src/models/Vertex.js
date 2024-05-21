export default class Vertex {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }



    rotateX(teta){
        // console.log("teta: ", teta);
        // console.log("ANTES: this.x, this.y, this.z:", this.x, this.y, this.z);

        let temp = (this.y* Math.cos(teta)) - (this.z * Math.sin(teta));
        let temp1 = (this.y * Math.sin(teta)) + (this.z * Math.cos(teta));
        // console.log("temp, temp1: ", temp, temp1);
        this.y = temp;
        this.z = temp1;    
        // console.log("this.x, this.y, this.z:", this.x, this.y, this.z);
    };

    rotateY(teta){
        let temp = (this.x* Math.cos(teta)) - (this.z * Math.sin(teta));
        let temp1 = (this.x * Math.sin(teta)) + (this.z * Math.cos(teta)); // (this.x * -1) + (this.z * Math.cos(teta))
        this.x = temp;
        this.z = temp1;    
    };

    rotateZ(teta){
        let temp = (this.x* Math.cos(teta)) - (this.y * Math.sin(teta));
        let temp1 = (this.x * Math.sin(teta)) + (this.y * Math.cos(teta));
        this.x = temp;
        this.y = temp1;    
    };

    rotateVertex(x, y, z, axis){
        if(axis === 'x'){
            this.rotateX(x);
        } else if(axis === 'y'){
            this.rotateY(y);
        } else if(axis === 'z'){
            this.rotateZ(z);
        }
    } 

}
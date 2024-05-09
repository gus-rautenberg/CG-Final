export default class Vertex {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    rotateX(teta){
        let temp = (this.y* Math.cos(teta)) - (this.z * Math.sin(teta));
        let temp1 = (this.y * Math.sin(teta)) + (this.z * Math.cos(teta));
        this.y = temp;
        this.z = temp1;    
    };

}
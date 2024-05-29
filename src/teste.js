function getH(v1, v2) {
    let h = [];
    h = this.sumVectors(v1, v2);
    let x = h[0]/Math.sqrt(Math.pow(h[0],2) + Math.pow(h[1],2) + Math.pow(h[2],2));
    let y = h[1]/Math.sqrt(Math.pow(h[0],2) + Math.pow(h[1],2) + Math.pow(h[2],2));
    let z = h[2]/Math.sqrt(Math.pow(h[0],2) + Math.pow(h[1],2) + Math.pow(h[2],2));
    h = [x, y, z];

    return h;
}

console.log(getH([0.174, 0.177, 0.969], [0.829, 0.274, 0.488]));
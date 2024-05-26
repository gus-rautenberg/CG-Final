export default class Pintor {
   distance;

   getDistance(face, vrp) {
        this.distance = Math.sqrt(Math.pow(vrp[0] - face.centroide[0], 2) + Math.pow(vrp[1] - face.centroide[1], 2) + Math.pow(vrp[2] - face.centroide[2], 2));
        // console.log("this.distance: ", this.distance);
        return this.distance;
   }

}
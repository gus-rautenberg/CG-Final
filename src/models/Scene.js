


export function getMJP(windowX, windowY, viewPortU, viewPortV) {
    
    let value1 = (viewPortU.max - viewPortU.min)/(windowX.max-windowX.min);
    let value2 = (-windowX.min*((viewPortU.max - viewPortU.min)/(windowX.max-windowX.min))) + viewPortU.min;
    let value3 = (viewPortV.max - viewPortV.min)/(windowY.max-windowY.min);
    let value4 = (-windowY.min*((viewPortV.max - viewPortV.min)/(windowY.max-windowY.min))) + viewPortV.min;
    return [ [value1, 0, 0, value2],
    [0, value3, 0, value4],
    [0, 0, 1, 0],
    [0, 0, 0, 1]];
}




export function getInvertedMJP(windowX, windowY, viewPortU, viewPortV) {
    
    let value1 = (viewPortU.max - viewPortU.min)/(windowX.max-windowX.min);
    let value2 = (-windowX.min*((viewPortU.max - viewPortU.min)/(windowX.max-windowX.min))) + viewPortU.min;
    let value3 = (viewPortV.max - viewPortV.min)/(windowY.max-windowY.min);
    let value4 = (windowY.min*((viewPortV.max - viewPortV.min)/(windowY.max-windowY.min))) + viewPortV.max;
    return [ [value1, 0, 0, value2],
    [0, value3, 0, value4],
    [0, 0, 1, 0],
    [0, 0, 0, 1]];
}
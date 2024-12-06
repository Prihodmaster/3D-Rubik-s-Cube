const sizeCubie = 6;
const cubeContainer = document.getElementById('cube');

let isRotateScope = false;
let isDragging = false;
let startX = 0;
let startY = 0;
let startRotateScopeX = 0;
let startRotateScopeY = 0;
const rotationCenter = { x: 9, y: 9 }; 
let rotateX = -15, rotateY = -45;
let stickerBounds;
let activeFace = null;
let locationClass = null;
let locationFace = 0;
let isTwoFingerGesture = false;
cubeContainer.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

const colorFace = (front, back, up, down, left, right) =>  { 
    return {front, back, up, down, left, right}
 };

const cubeColor = {
    front: [
        colorFace('red', 'black', 'yellow', 'black', 'green', 'black'),
        colorFace('red', 'black', 'yellow', 'black', 'black', 'black'),
        colorFace('red', 'black', 'yellow', 'black', 'black', 'blue'),
        colorFace('red', 'black', 'black', 'black', 'green', 'black'),
        colorFace('red', 'black', 'black', 'black', 'black', 'black'),
        colorFace('red', 'black', 'black', 'black', 'black', 'blue'),
        colorFace('red', 'black', 'black', 'white', 'green', 'black'),
        colorFace('red', 'black', 'black', 'white', 'black', 'black'),
        colorFace('red', 'black', 'black', 'white', 'black', 'blue'),
    ],
    middle: [
        colorFace('black', 'black', 'yellow', 'black', 'green', 'black'),
        colorFace('black', 'black', 'yellow', 'black', 'black', 'black'),
        colorFace('black', 'black', 'yellow', 'black', 'black', 'blue'),
        colorFace('black', 'black', 'black', 'black', 'green', 'black'),
        colorFace('black', 'black', 'black', 'black', 'black', 'black'),
        colorFace('black', 'black', 'black', 'black', 'black', 'blue'),
        colorFace('black', 'black', 'black', 'white', 'green', 'black'),
        colorFace('black', 'black', 'black', 'white', 'black', 'black'),
        colorFace('black', 'black', 'black', 'white', 'black', 'blue'),
    ],
    back: [
        colorFace('black', 'orange', 'yellow', 'black', 'green', 'black'),
        colorFace('black', 'orange', 'yellow', 'black', 'black', 'black'),
        colorFace('black', 'orange', 'yellow', 'black', 'black', 'blue'),
        colorFace('black', 'orange', 'black', 'black', 'green', 'black'),
        colorFace('black', 'orange', 'black', 'black', 'black', 'black'),
        colorFace('black', 'orange', 'black', 'black', 'black', 'blue'),
        colorFace('black', 'orange', 'black', 'white', 'green', 'black'),
        colorFace('black', 'orange', 'black', 'white', 'black', 'black'),
        colorFace('black', 'orange', 'black', 'white', 'black', 'blue')
    ]
};

const cubeArray = [...cubeColor.front, ...cubeColor.middle, ...cubeColor.back];
let prevColorArray = JSON.parse(JSON.stringify(cubeArray));

const positions = [
    { x: 0, y: 0, z: 1 }, { x: 1, y: 0, z: 1 }, { x: 2, y: 0, z: 1 },
    { x: 0, y: 1, z: 1 }, { x: 1, y: 1, z: 1 }, { x: 2, y: 1, z: 1 },
    { x: 0, y: 2, z: 1 }, { x: 1, y: 2, z: 1 }, { x: 2, y: 2, z: 1 },
    { x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, { x: 2, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 }, { x: 1, y: 1, z: 0 }, { x: 2, y: 1, z: 0 },
    { x: 0, y: 2, z: 0 }, { x: 1, y: 2, z: 0 }, { x: 2, y: 2, z: 0 },
    { x: 0, y: 0, z: -1 }, { x: 1, y: 0, z: -1 }, { x: 2, y: 0, z: -1 },
    { x: 0, y: 1, z: -1 }, { x: 1, y: 1, z: -1 }, { x: 2, y: 1, z: -1 },
    { x: 0, y: 2, z: -1 }, { x: 1, y: 2, z: -1 }, { x: 2, y: 2, z: -1 }
];

const mappingZ = {
    cw: [
        [0, 'left', 6, 'down'],
        [0, 'up', 6, 'left'],
        [1, 'up', 3, 'left'],
        [2, 'right', 0, 'up'],
        [2, 'up', 0, 'left'],
        [3, 'left', 7, 'down'],
        [5, 'right', 1, 'up'],
        [6, 'left', 8, 'down'],
        [6, 'down', 8, 'right'],
        [7, 'down', 5, 'right'],
        [8, 'right', 2, 'up'],
        [8, 'down', 2, 'right'],

        [0, 'front', 6, 'front'],
        [1, 'front', 3, 'front'],
        [2, 'front', 0, 'front'],
        [3, 'front', 7, 'front'],
        [4, 'front', 4, 'front'],
        [5, 'front', 1, 'front'],
        [6, 'front', 8, 'front'],
        [7, 'front', 5, 'front'],
        [8, 'front', 2, 'front']
    ],
    ccw: [
        [0, 'left', 2, 'up'],
        [0, 'up', 2, 'right'],
        [1, 'up', 5, 'right'],
        [2, 'right', 8, 'down'],
        [2, 'up', 8, 'right'],
        [3, 'left', 1, 'up'],
        [5, 'right', 7, 'down'],
        [6, 'left', 0, 'up'],
        [6, 'down', 0, 'left'],
        [7, 'down', 3, 'left'],
        [8, 'right', 6, 'down'],
        [8, 'down', 6, 'left'],

        [0, 'front', 2, 'front'],
        [1, 'front', 5, 'front'],
        [2, 'front', 8, 'front'],
        [3, 'front', 1, 'front'],
        [4, 'front', 4, 'front'],
        [5, 'front', 7, 'front'],
        [6, 'front', 0, 'front'],
        [7, 'front', 3, 'front'],
        [8, 'front', 6, 'front']
    ]
}

const mappingX = {
    cw: [
        [0, 'up', 6, 'front'],
        [9, 'up', 3, 'front'],
        [18, 'up', 0, 'front'],
        [0, 'front', 6, 'down'],
        [3, 'front', 15, 'down'],
        [6, 'front', 24, 'down'],
        [6, 'down', 24, 'back'],
        [15, 'down', 21, 'back'],
        [24, 'down', 18, 'back'],
        [24, 'back', 18, 'up'],
        [21, 'back', 9, 'up'],
        [18, 'back', 0, 'up'],

        [0, 'left', 6, 'left'],
        [3, 'left', 15, 'left'],
        [6, 'left', 24, 'left'],
        [9, 'left', 3, 'left'],
        [12, 'left', 12, 'left'],
        [15, 'left', 21, 'left'],
        [18, 'left', 0, 'left'],
        [21, 'left', 9, 'left'],
        [24, 'left', 18, 'left']
    ],
    ccw: [
        [0, 'up', 18, 'back'],
        [9, 'up', 21, 'back'],
        [18, 'up', 24, 'back'],
        [0, 'front', 18, 'up'],
        [3, 'front', 9, 'up'],
        [6, 'front', 0, 'up'],
        [6, 'down', 0, 'front'],
        [15, 'down', 3, 'front'],
        [24, 'down', 6, 'front'],
        [24, 'back', 6, 'down'],
        [21, 'back', 15, 'down'],
        [18, 'back', 24, 'down'],

        [0, 'left', 18, 'left'],
        [3, 'left', 9, 'left'],
        [6, 'left', 0, 'left'],
        [9, 'left', 21, 'left'],
        [12, 'left', 12, 'left'],
        [15, 'left', 3, 'left'],
        [18, 'left', 24, 'left'],
        [21, 'left', 15, 'left'],
        [24, 'left', 6, 'left']
    ]
};

const mappingY = {
    ccw: [
        [0, 'front', 2, 'right'],
        [0, 'left', 2, 'front'],
        [1, 'front', 11, 'right'],
        [2, 'front', 20, 'right'],
        [2, 'right', 20, 'back'],
        [9, 'left', 1, 'front'],
        [11, 'right', 19, 'back'],
        [18, 'left', 0, 'front'],
        [18, 'back', 0, 'left'],
        [19, 'back', 9, 'left'],
        [20, 'back', 18, 'left'],
        [20, 'right', 18, 'back'],

        [0, 'up', 2, 'up'],
        [1, 'up', 11, 'up'],
        [2, 'up', 20, 'up'],
        [9, 'up', 1, 'up'],
        [10, 'up', 10, 'up'],
        [11, 'up', 19, 'up'],
        [18, 'up', 0, 'up'],
        [19, 'up', 9, 'up'],
        [20, 'up', 18, 'up']
    ],
    cw: [
        [0, 'front', 18, 'left'],
        [0, 'left', 18, 'back'],
        [1, 'front', 9, 'left'],
        [2, 'front', 0, 'left'],
        [2, 'right', 0, 'front'],
        [9, 'left', 19, 'back'],
        [11, 'right', 1, 'front'],
        [18, 'left', 20, 'back'],
        [18, 'back', 20, 'right'],
        [19, 'back', 11, 'right'],
        [20, 'back', 2, 'right'],
        [20, 'right', 2, 'front'],

        [0, 'up', 18, 'up'],
        [1, 'up', 9, 'up'],
        [2, 'up', 0, 'up'],
        [9, 'up', 19, 'up'],
        [10, 'up', 10, 'up'],
        [11, 'up', 1, 'up'],
        [18, 'up', 20, 'up'],
        [19, 'up', 11, 'up'],
        [20, 'up', 2, 'up']
    ]
};

const calculateMapping = (array, shift, changeSide) => {
    const sides = {
        front: 'back',
        left: 'right',
        up: 'down'
    };
    return array.map(subArray =>
        subArray.map(item =>
            changeSide in sides && item === changeSide ? sides[changeSide] :
            typeof item === 'number' ? item + shift : item
        )
    );
};

const mapping = {
    front: {
        cw: mappingZ.cw,
        ccw: mappingZ.ccw
    },
    middleZ: {
        cw: calculateMapping(mappingZ.cw, 9),
        ccw: calculateMapping(mappingZ.ccw, 9)
    },
    back: {
        cw: calculateMapping(mappingZ.cw, 18, 'front'),
        ccw: calculateMapping(mappingZ.ccw, 18, 'front')
    },

    left: {
        cw: mappingX.cw,
        ccw: mappingX.ccw
    },
    middleX: {
        cw: calculateMapping(mappingX.cw, 1),
        ccw: calculateMapping(mappingX.ccw, 1)
    },
    right: {
        cw: calculateMapping(mappingX.cw, 2, 'left'),
        ccw: calculateMapping(mappingX.ccw, 2, 'left')
    },

    top: {
        cw: mappingY.cw,
        ccw: mappingY.ccw
    },
    middleY: {
        cw: calculateMapping(mappingY.cw, 3),
        ccw: calculateMapping(mappingY.ccw, 3)
    },
    bottom: {
        cw: calculateMapping(mappingY.cw, 6, 'up'),
        ccw: calculateMapping(mappingY.ccw, 6, 'up')
    },
};

const shuffleColorsInCubeArray = () => {
    cubeArray.forEach(cube => {
        const blackPositions = Object.keys(cube).filter(key => cube[key] === 'black');
        const otherColors = Object.keys(cube)
            .filter(key => cube[key] !== 'black')
            .map(key => cube[key]);
        
        for (let i = otherColors.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [otherColors[i], otherColors[j]] = [otherColors[j], otherColors[i]];
        }

        Object.keys(cube).forEach(key => {
            if (!blackPositions.includes(key)) cube[key] = otherColors.shift();
        });
    });
};




// let isTwoFingerGesture = false;


// const getCoordinates = e => {
//     if (e.touches && e.touches.length > 0) {
//         return {
//             x: e.touches[0].clientX,
//             y: e.touches[0].clientY,
//             isTwoFinger: e.touches.length === 2 // Добавляем проверку на двухпальцевый жест
//         };
//     }
//     return {
//         x: e.clientX,
//         y: e.clientY,
//         isTwoFinger: false // Мышь всегда однопальцевая
//     };
// };

// const handleStart = e => {
//     e.preventDefault();
//     const { x, y } = getCoordinates(e);
//     const face = e.target.closest('.face');
//     const sticker = e.target.closest('.sticker');

//     if (face && sticker) {
//         isDragging = true;
//         startX = x;
//         startY = y;
//         activeFace = face;
//         stickerBounds = sticker.querySelectorAll('[class^="side"]');
//         locationClass = Array.from(face.classList).find(cls => cls.startsWith('location-'));
//         console.log(locationClass);
//     } 
//     else if (!['face', 'sticker'].some(className => e.target.classList.contains(className))) {
//         isRotateScope = true;
//         startRotateScopeX = x;
//         startRotateScopeY = y;
//     }
// }

// const handleMove = e =>  {
//     const { x, y } = getCoordinates(e);
//     if (isDragging && activeFace) {
//         stickerBounds.forEach(side => {
//             const bounds = side.getBoundingClientRect();
//             if (x > bounds.left && x < bounds.right && y > bounds.top && y < bounds.bottom) {
//                 const direction = side.className.split('-')[1];
//                 rotateFaceMouse(direction);
//                 isDragging = false;
//                 return;
//             }
//         });
//     } else if (isRotateScope) {
//         const deltaX = x - startRotateScopeX;
//         const deltaY = y - startRotateScopeY;
//         rotateY += deltaX * 0.2; // Умножение на 0.2 для замедления вращения
//         rotateX -= deltaY * 0.2;
//         cubeContainer.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
//         startRotateScopeX = x;
//         startRotateScopeY = y;
//     }
// }

// const handleEnd = () => {
//     if (isDragging) {
//         isDragging = false;
//         activeFace = null;
//         faceBounds = null;
//         startX = 0;
//         startY = 0;
//         stickerBounds = null;
//         locationClass = null;
//     }
//     if (isRotateScope) {
//         isRotateScope = false;
//     }
// }






const getCoordinates = e => {
    if (e.touches && e.touches.length > 0) {
        return {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
            isTwoFinger: e.touches.length === 2
        };
    }
    return {
        x: e.clientX,
        y: e.clientY,
        isTwoFinger: false
    };
};

const handleStart = e => {
    const { x, y, isTwoFinger } = getCoordinates(e);
    if (isTwoFinger) {
        isTwoFingerGesture = true;
        return;
    }

    e.preventDefault();
    const face = e.target.closest('.face');
    const sticker = e.target.closest('.sticker');

    if (face && sticker) {
        isDragging = true;
        startX = x;
        startY = y;
        activeFace = face;
        stickerBounds = sticker.querySelectorAll('[class^="side"]');
        locationClass = Array.from(face.classList).find(cls => cls.startsWith('location-'));
        console.log(locationClass);
    } else if (!['face', 'sticker'].some(className => e.target.classList.contains(className))) {
        isRotateScope = true;
        startRotateScopeX = x;
        startRotateScopeY = y;
    }
};

const handleMove = e => {
    const { x, y, isTwoFinger } = getCoordinates(e);
    if (isTwoFingerGesture) {
        return;
    }

    e.preventDefault(); 
    if (isDragging && activeFace) {
        stickerBounds.forEach(side => {
            const bounds = side.getBoundingClientRect();
            if (x > bounds.left && x < bounds.right && y > bounds.top && y < bounds.bottom) {
                const direction = side.className.split('-')[1];
                rotateFaceMouse(direction);
                isDragging = false;
                return;
            }
        });
    } else if (isRotateScope) {
        const deltaX = x - startRotateScopeX;
        const deltaY = y - startRotateScopeY;
        rotateY += deltaX * 0.2; 
        rotateX -= deltaY * 0.2;
        cubeContainer.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        startRotateScopeX = x;
        startRotateScopeY = y;
    }
};

const handleEnd = e => {
    if (isTwoFingerGesture) {
        isTwoFingerGesture = false;
        return;
    }

    if (isDragging) {
        isDragging = false;
        activeFace = null;
        faceBounds = null;
        startX = 0;
        startY = 0;
        stickerBounds = null;
        locationClass = null;
    }
    if (isRotateScope) {
        isRotateScope = false;
    }
};

document.addEventListener('mousedown', handleStart);
document.addEventListener('mousemove', handleMove);
document.addEventListener('mouseup', handleEnd);

document.addEventListener('touchstart', handleStart, { passive: false });
document.addEventListener('touchmove', handleMove, { passive: false });
document.addEventListener('touchend', handleEnd);


const createFace = (face, color) => {
    const faceElement = document.createElement('div');
    faceElement.classList.add('face', face);

    const stickerElement = document.createElement('div');
    stickerElement.classList.add('sticker');
    stickerElement.style.backgroundColor = color;

    const sides = ['side-up', 'side-right', 'side-down', 'side-left'];
    sides.forEach(side => {
        const sideElement = document.createElement('div'); 
        sideElement.classList.add(side);
        stickerElement.appendChild(sideElement); 
    });

    faceElement.appendChild(stickerElement);

    if(stickerElement.style.backgroundColor !== 'black'){
        faceElement.classList.add(`location-${locationFace}`);
        locationFace++;
    }

    switch(face) {
        case 'front':
            faceElement.style.transform = `translateZ(3rem)`;
            break;
        case 'back':
            faceElement.style.transform = `rotateY(180deg) translateZ(3rem)`;
            break;
        case 'left':
            faceElement.style.transform = `rotateY(-90deg) translateZ(3rem)`;
            break;
        case 'right':
            faceElement.style.transform = `rotateY(90deg) translateZ(3rem)`;
            break;
        case 'up':
            faceElement.style.transform = `rotateX(90deg) translateZ(3rem)`;
            break;
        case 'down':
            faceElement.style.transform = `rotateX(-90deg) translateZ(3rem)`;
            break;
    }
    return faceElement;
};

const createCube = () => {
    locationFace = 0;
    cubeArray.slice(0, 27).forEach((cube, index) => {
        const cubeElement = document.createElement('div');
        cubeElement.classList.add('cubie');
        // cubeElement.style.transform = `translate3d(${cubeArray[index].positions.x * sizeCubie}rem, ${cubeArray[index].positions.y *sizeCubie}rem, ${cubeArray[index].positions.z *sizeCubie}rem)`;
        cubeElement.style.transform = `translate3d(${positions[index].x * sizeCubie}rem, ${positions[index].y *sizeCubie}rem, ${positions[index].z *sizeCubie}rem)`;

        for (const face in cube) {
            if(face!=='positions'){
            const faceElement = createFace(face, cube[face]);
            cubeElement.appendChild(faceElement);}
        }

        cubeContainer.appendChild(cubeElement);
    });
};


createCube();
let cubies = document.querySelectorAll('.cubie');

const updateCubeArray = (face, sign) => {
    rotateFace(face, sign);
    prevColorArray = JSON.parse(JSON.stringify(cubeArray));
    cubies.forEach(element => element.remove());
    createCube();
    cubies = document.querySelectorAll('.cubie');
}

const updateColorFront = mapping => {
    mapping.forEach(([currentId, side, sourceId, sourceSide]) => {
        cubeArray[currentId][side] = prevColorArray[sourceId][sourceSide];
    });
};

const rotateFace = (face, sign) => {
    switch (`${face+sign}`) {
        case 'front+': updateColorFront(mapping.front.cw);
            break;
        case 'front-': updateColorFront(mapping.front.ccw)
            break;
        case 'middleZ+': updateColorFront(mapping.middleZ.cw);
            break;
        case 'middleZ-': updateColorFront(mapping.middleZ.ccw)
            break;
        case 'back+': updateColorFront(mapping.back.cw);
            break;
        case 'back-': updateColorFront(mapping.back.ccw)
            break;

        case 'left+': updateColorFront(mapping.left.cw);
            break;
        case 'left-': updateColorFront(mapping.left.ccw)
            break;
        case 'middleX+': updateColorFront(mapping.middleX.cw);
            break;
        case 'middleX-': updateColorFront(mapping.middleX.ccw)
            break;
        case 'right+': updateColorFront(mapping.right.cw);
            break;
        case 'right-': updateColorFront(mapping.right.ccw)
            break;

        case 'top+': updateColorFront(mapping.top.cw);
            break;
        case 'top-': updateColorFront(mapping.top.ccw)
            break;
        case 'middleY+': updateColorFront(mapping.middleY.cw);
            break;
        case 'middleY-': updateColorFront(mapping.middleY.ccw)
            break;
        case 'bottom+': updateColorFront(mapping.bottom.cw);
            break;
        case 'bottom-': updateColorFront(mapping.bottom.ccw)
            break;
    }
};


const onAllAnimationsComplete = (lastCubie, face, sign) => {
    lastCubie.addEventListener('transitionend', e => {
        if (e.propertyName === 'transform') updateCubeArray(face, sign);
    })
}

const rotateZ = (face, sign) => {
    switch(face) {
        case 'front': rotateFaceZ(face, sign, [0, 9])
            break;
        case 'middleZ': rotateFaceZ(face, sign, [9, 18])
            break;
        case 'back': rotateFaceZ(face, sign, [18, 27])
            break;
    }
}
const rotateFaceZ = (face, sign, interval) => {
    const pos = positions.slice(interval[0], interval[1]);
    Array.from(cubies).slice(interval[0], interval[1]).forEach((cubie, index, array) => {
        cubie.style.transformOrigin = `${rotationCenter.x}rem ${rotationCenter.y}rem`;
        cubie.style.transform = 
        `
        rotateZ(${sign}90deg) 
        translateX(${pos[index].x*sizeCubie}rem) 
        translateY(${pos[index].y*sizeCubie}rem) 
        translateZ(${pos[index].z*sizeCubie}rem)
        `;
        if (index === array.length - 1) onAllAnimationsComplete(cubie, face, sign)
    });
}



const rotateXX = (face, sign) => {
    switch(face) {
        case 'left': rotateFaceX(face, sign, 0)
            break;
        case 'middleX': rotateFaceX(face, sign, 1)
            break;
        case 'right': rotateFaceX(face, sign, 2)
            break;
    }
}
const rotateFaceX = (face, sign, interval) => {
    const pos = positions.filter((_, index) => index % 3 === interval);

    Array.from(cubies).filter((_, index) => index % 3 === interval).forEach((cubie, index, array) => {
        cubie.style.transformOrigin = `${rotationCenter.x}rem ${rotationCenter.y}rem`;
        cubie.style.transform = 
        `
        rotateX(${sign}90deg) 
        translateX(${pos[index].x*sizeCubie}rem) 
        translateY(${pos[index].y*sizeCubie}rem) 
        translateZ(${pos[index].z*sizeCubie}rem)
        `;
        if (index === array.length - 1) onAllAnimationsComplete(cubie, face, sign)
    });
}




const findIndicesCubieY = (step) => {
    const indices = [];
    for (let i = step; i < cubeArray.length; i += 9) {
        for (let j = 0; j < 3; j++) {
            if (i + j < cubeArray.length) indices.push(i + j) 
        }
    }
    return indices;
};

const rotateYY = (face, sign) => {
    switch(face) {
        case 'top': rotateFaceY(face, sign, 0)
            break;
        case 'middleY': rotateFaceY(face, sign, 3)
            break;
        case 'bottom': rotateFaceY(face, sign, 6)
            break;
    }
}

const rotateFaceY = (face, sign, interval) => {
    const pos = findIndicesCubieY(interval).map(index => positions[index]);
    findIndicesCubieY(interval).map(index => Array.from(cubies)[index]).forEach((cubie, index, array) => {
        cubie.style.transformOrigin = `${rotationCenter.x}rem ${rotationCenter.y}rem`;
        cubie.style.transform = 
        `
        rotateY(${sign}90deg) 
        translateX(${pos[index].x*sizeCubie}rem) 
        translateY(${pos[index].y*sizeCubie}rem) 
        translateZ(${pos[index].z*sizeCubie}rem)
        `;
        if (index === array.length - 1) onAllAnimationsComplete(cubie, face, sign)
    });
}



const arrayRotateFunc = [
    rotateXX.bind(null, 'left', '-'), rotateXX.bind(null, 'left', '+'), 
    rotateXX.bind(null, 'middleX', '-'), rotateXX.bind(null, 'middleX', '+'), 
    rotateXX.bind(null, 'right', '-'), rotateXX.bind(null, 'right', '+'),

    rotateYY.bind(null, 'top', '-'), rotateYY.bind(null, 'top', '+'), 
    rotateYY.bind(null, 'middleY', '-'), rotateYY.bind(null, 'middleY', '+'), 
    rotateYY.bind(null, 'bottom', '-'), rotateYY.bind(null, 'bottom', '+'),

    rotateZ.bind(null, 'front', '-'), rotateZ.bind(null, 'front', '+'), 
    rotateZ.bind(null, 'middleZ', '-'), rotateZ.bind(null, 'middleZ', '+'), 
    rotateZ.bind(null, 'back', '-'), rotateZ.bind(null, 'back', '+')
]

const locationMappings = {
    'location-0': [0, 1, 6, 7],
    'location-3': [2, 3, 6, 7],
    'location-5': [4, 5, 6, 7],
    'location-8': [0, 1, 8, 9],
    'location-10': [2, 3, 8, 9],
    'location-11': [4, 5, 8, 9],
    'location-13': [0, 1, 10, 11],
    'location-16': [2, 3, 10, 11],
    'location-18': [4, 5, 10, 11],

    'location-7': [13, 12, 6, 7],
    'location-25': [15, 14, 6, 7],
    'location-40': [17, 16, 6, 7],
    'location-12': [13, 12, 8, 9],
    'location-27': [15, 14, 8, 9],
    'location-45': [17, 16, 8, 9],
    'location-20': [13, 12, 10, 11],
    'location-32': [15, 14, 10, 11],
    'location-53': [17, 16, 10, 11],

    'location-35': [16, 17, 6, 7],
    'location-22': [14, 15, 6, 7],
    'location-2': [12, 13, 6, 7],
    'location-42': [16, 17, 8, 9],
    'location-26': [14, 15, 8, 9],
    'location-9': [12, 13, 8, 9],
    'location-48': [16, 17, 10, 11],
    'location-29': [14, 15, 10, 11],
    'location-15': [12, 13, 10, 11],

    'location-38': [5, 4, 6, 7],
    'location-36': [3, 2, 6, 7],
    'location-33': [1, 0, 6, 7],
    'location-44': [5, 4, 8, 9],
    'location-43': [3, 2, 8, 9],
    'location-41': [1, 0, 8, 9],
    'location-51': [5, 4, 10, 11],
    'location-49': [3, 2, 10, 11],
    'location-46': [1, 0, 10, 11],

    'location-34': [0, 1, 16, 17],
    'location-37': [2, 3, 16, 17],
    'location-39': [4, 5, 16, 17],
    'location-21': [0, 1, 14, 15],
    'location-23': [2, 3, 14, 15],
    'location-24': [4, 5, 14, 15],
    'location-1': [0, 1, 12, 13],
    'location-4': [2, 3, 12, 13],
    'location-6': [4, 5, 12, 13],

    'location-14': [0, 1, 13, 12],
    'location-17': [2, 3, 13, 12],
    'location-19': [4, 5, 13, 12],
    'location-28': [0, 1, 15, 14],
    'location-30': [2, 3, 15, 14],
    'location-31': [4, 5, 15, 14],
    'location-47': [0, 1, 17, 16],
    'location-50': [2, 3, 17, 16],
    'location-52': [4, 5, 17, 16]
  };
const rotateFaceMouse = direction => {
    console.log(direction)
  const directionsMap = {
    down: 0,
    up: 1,
    left: 2,
    right: 3,
  };

  if (!locationMappings[locationClass]) {
    console.warn(`locationClass ${locationClass} не найден в locationMappings`);
    return;
  }

  const index = directionsMap[direction];
  if (index === undefined) {
    console.warn(`Неправильное направление: ${direction}`);
    return;
  }

  const funcIndex = locationMappings[locationClass][index];
  if (!arrayRotateFunc[funcIndex]) {
    console.warn(`Функция с индексом ${funcIndex} не найдена`);
    return;
  }
  arrayRotateFunc[funcIndex]();

};



const timerDisplay = document.getElementById('timerDisplay');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const generateButton = document.getElementById('genetareButton');

let timer = null;
let secondsElapsed = 0;

const updateTimer = () => {
    const minutes = Math.floor(secondsElapsed / 60);
    const seconds = secondsElapsed % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

const flashRed = () => {
    timerDisplay.style.color = '#e91e63';
    setTimeout(() => {
        timerDisplay.style.color = '';
    }, 500);
}

const handleStartButton = () => {
    if (!timer) {
        flashRed();
        timer = setInterval(() => {
            secondsElapsed++;
            updateTimer();
        }, 1000);
    }
};

const handleResetButton = () => {
    flashRed();
    clearInterval(timer);
    timer = null;
    secondsElapsed = 0;
    updateTimer();
};

const handleGenerateButton = () => {
    shuffleColorsInCubeArray();
    updateCubeArray();
};

const addButtonEvent = (button, callback) => {
    button.addEventListener('click', callback);
    button.addEventListener('touchstart', e => {
        e.preventDefault(); 
        callback();
    }, { passive: false });
};

addButtonEvent(startButton, handleStartButton);
addButtonEvent(resetButton, handleResetButton);
addButtonEvent(generateButton, handleGenerateButton);


window.addEventListener('load', () => {
    const createCloud = (src, top, animationDuration, delay) => {
        const cloud = document.createElement('div');
        cloud.classList.add('cloud');
        cloud.style.background = `url(${src}) no-repeat center`;
        cloud.style.backgroundSize = 'contain';
        cloud.style.top = top; 
        cloud.style.left = '-300px'; 
        cloud.style.animation = `moveClouds ${animationDuration} linear infinite ${delay}`;
        document.body.appendChild(cloud);
    }

    createCloud('./images/cloud-1.png', '10%', '80s', '0s');  
    createCloud('./images/cloud-2.png', '35%', '50s', '16s');  
    createCloud('./images/cloud-3.png', '70%', '140s', '16s'); 
});











thickness = 2.5;
thicknessWC = 1;
length = 2.5;
lengthTop = 6.75;
gapWidth = 4.2;
pi = 3.141592653589793;
webcamSide = 23.5;
webcamSideCut = 20;
webcamHeight = 8;
barOffset = 15;
barLength = 60;
barDrop = 15;
wireHolderWidth = 2.75;
wireGapWidth = 5;
// Good w and w/o band
glassTouchpadHeight = 16.8;
glassTouchpadWidth = 7.55;

difference() {
// Create the base shape
cube([glassTouchpadWidth + thickness * 2, glassTouchpadHeight + thickness * 2, lengthTop]);
// Take out the part not at the top or left side
translate([-thickness, 0, length]) cube([glassTouchpadWidth + thickness * 2, glassTouchpadHeight + thickness, lengthTop - length]);
// Take the center out for glass
translate([thickness, thickness, 0]) cube([glassTouchpadWidth, glassTouchpadHeight, length]);
// Take the gap out
translate([thickness + glassTouchpadWidth / 2 - gapWidth / 2, 0, 0]) cube([gapWidth, thickness, length]);
}



// Add eye tracking bracket
translate([thickness + glassTouchpadWidth, 0, length / 2]) {
rotate([(asin(barDrop /barLength)), atan(barOffset/barLength), 0]) {
cube([thickness, thickness, barLength]);

// Make Wire holder
translate([0, 0, barLength / 8]) {
cube([wireHolderWidth /2 + thickness, thickness, thickness]);
translate([wireHolderWidth /2 + thickness / 2, -thickness - wireHolderWidth, 0]) cube([thickness, thickness * 2 + wireHolderWidth, thickness]);
translate([-wireHolderWidth /2 - thickness / 2, 0, 0]) {
cube([wireHolderWidth /2 + thickness, thickness, thickness]);
translate([0, -thickness - wireHolderWidth, 0]) cube([thickness, thickness + wireHolderWidth, thickness]);
}
}
// Make webcam holder
translate([0, 0, barLength]) {
translate([thickness / 2, 0, -thicknessWC]) {
rotate([10, -20, 4]) {
// Includes fudge factor to get the bar to line up with the box because it is angled
translate([0, -25 / 2 + thicknessWC / 2, -webcamHeight]) {
difference() {
cube([webcamSide + thicknessWC * 2, webcamSide + thicknessWC * 2, thicknessWC + webcamHeight]);
translate([thicknessWC, thicknessWC, -thicknessWC]) cube([webcamSide, webcamSide, webcamHeight + thicknessWC]);
translate([0, thicknessWC/2 + webcamSide / 2 - wireGapWidth / 2, -thicknessWC]) cube([webcamSide + thicknessWC, wireGapWidth, webcamHeight * 3 / 4]);
translate([thicknessWC + (webcamSide - webcamSideCut) / 2, thicknessWC + (webcamSide - webcamSideCut) / 2, webcamHeight]) cube([webcamSideCut, webcamSideCut, thicknessWC]);
}
}
}
}
}
}
}


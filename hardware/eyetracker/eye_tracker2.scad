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


// Make webcam holder
rotate([30, 0, 0]) {
translate([0, -17.5, 13]) {
difference() {
cube([webcamSide + thicknessWC * 2, webcamSide + thicknessWC * 2, thicknessWC + webcamHeight]);
translate([thicknessWC, thicknessWC, -thicknessWC]) cube([webcamSide, webcamSide, webcamHeight + thicknessWC]);
translate([0, thicknessWC/2 + webcamSide / 2 - wireGapWidth / 2, -thicknessWC]) cube([webcamSide + thicknessWC, wireGapWidth, webcamHeight * 3 / 4]);
translate([thicknessWC + (webcamSide - webcamSideCut) / 2, thicknessWC + (webcamSide - webcamSideCut) / 2, webcamHeight]) cube([webcamSideCut, webcamSideCut, thicknessWC]);
}
}
}


thickness = 1;
prismHeightGlass = 12;
prismHeight = 12;
prismWidth = 7;
prismDepth = 14;
prismDepthGlass = 14;
mirrorSide = 25.7;
mirrorSideEdge = 4;
mirrorDepth = 2.5;
difference() {
translate([0, -thickness, 0]) cube([prismWidth, prismHeight + thickness * 3, prismDepth + thickness * 2]);
translate([0, thickness, thickness]) cube([prismWidth - thickness, prismHeight, prismDepth]);
translate([0, thickness + thickness / 2, thickness + thickness / 2]) cube([prismWidth, prismHeight - thickness, prismDepth - thickness]);

}
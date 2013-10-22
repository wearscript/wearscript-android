thickness = 1;
prismHeight = 11.8;
prismWidth = 3;
prismDepth = 14.5;
mirrorSide = 25.7;
mirrorSideEdge = 4;
mirrorDepth = 2.5;
glassLength = 22;
difference() {
translate([0, 0, 0]) cube([prismWidth + glassLength, prismHeight + thickness * 2, prismDepth + thickness * 2]);
translate([0, thickness, thickness]) cube([prismWidth + glassLength - thickness, prismHeight, prismDepth]);
translate([0, thickness * 3, 0]) cube([prismWidth + glassLength - thickness, prismHeight - thickness * 4, prismDepth]);
}

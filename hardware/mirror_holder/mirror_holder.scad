thickness = 1;
prismHeight = 11.8;
prismWidth = 5;
prismDepth = 14.5;
mirrorSide = 25.7;
mirrorSideEdge = 4;
mirrorDepth = 2.5;
difference() {
translate([0, -thickness, 0]) cube([prismWidth, prismHeight + thickness * 3, prismDepth + thickness * 2]);
translate([0, thickness, thickness]) cube([prismWidth, prismHeight, prismDepth]);
translate([0, thickness, thickness]) circle(5);
}
rotate([-40, 0, 0]) {
translate([-mirrorSide, -.5, -2.5]) {
difference() {
cube([mirrorSide + 2 * thickness, mirrorSide + 2 * thickness, mirrorDepth + thickness]);
translate([thickness, thickness, thickness]) cube([mirrorSide, mirrorSide, mirrorDepth]);
translate([thickness + (mirrorSide/4) - mirrorSideEdge, thickness + (mirrorSide/4) - mirrorSideEdge, 0]) cube([mirrorSide - mirrorSideEdge, mirrorSide - mirrorSideEdge, mirrorDepth]);
}
}
}

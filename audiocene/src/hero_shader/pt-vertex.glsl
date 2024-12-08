uniform float u_time;
uniform float u_positionFrequency;
uniform float u_strength;
uniform float u_warpFrequency;
uniform float u_warpStrength;

varying vec3 vPosition;
varying vec2 vUv;
varying float vUpDot;

#include ../includes/simplexNoise2d.glsl

float getElevation(vec2 position){
vUv = uv;

vec2 warpedPosition = position;
warpedPosition += u_time *0.2;
warpedPosition += simplexNoise2d(warpedPosition * u_positionFrequency * u_warpFrequency) * u_warpStrength;

    float elevation = 0.0;
    elevation += simplexNoise2d(warpedPosition * u_positionFrequency) / 2.0;
    elevation += simplexNoise2d(warpedPosition * u_positionFrequency *2.0) / 4.0;
    elevation += simplexNoise2d(warpedPosition * u_positionFrequency * 4.0) / 8.0;

float elevationSign = sign(elevation);
    elevation = pow(abs(elevation), 2.0) * elevationSign;
    elevation *= u_strength;


    return elevation;
}

void main() {
//Neighbours positions
float shift = 0.01;
vec3 positionA = position + vec3(shift, 0.0, 0.0);
vec3 positionB = position + vec3(0.0, 0.0, -shift);


    //Elevation
float elevation = getElevation(csm_Position.xz);
csm_Position.y += elevation;
positionA.y = getElevation(positionA.xz);
positionB.y = getElevation(positionB.xz);

//Compute normal
vec3 toA = normalize(positionA - csm_Position);
vec3 toB = normalize(positionB - csm_Position);
csm_Normal = cross(toA, toB);

//Varyings
vPosition = csm_Position;
vPosition.xz += u_time * 0.2;
vUpDot = dot(csm_Normal, vec3(0.0, 1.0, 0.0));
}

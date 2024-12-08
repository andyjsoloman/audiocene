uniform vec3 u_colorWaterDeep;
uniform vec3 u_colorWaterSurface;
uniform vec3 u_colorSand;
uniform vec3 u_colorGrass;
uniform vec3 u_colorSnow;
uniform vec3 u_colorRock;

varying vec3 vPosition;
varying vec2 vUv;
varying float vUpDot;

#include ../includes/simplexNoise2d.glsl

void main() {


    vec2 center = vec2(0.5); // Center of the circle
    float radius = 0.5; // Adjust radius for visibility

    // Calculate distance from center
    float dist = distance(vUv, center);

    // Discard fragments outside the circle
    if (dist > radius) {
        discard;
    }


//Color
vec3 color = vec3(1.0);

//Water
float surfaceWaterMix = smoothstep(- 1.0, - 0.1, -vPosition.y);
color = mix(u_colorWaterDeep, u_colorWaterSurface, surfaceWaterMix);

// Sand
float sandMix = step(- 0.1, -vPosition.y);
color = mix(color, u_colorSand, sandMix);

//Grass
float grassMix = step(-0.06, -vPosition.y);
color = mix(color, u_colorGrass, grassMix);

//Rock
float rockMix = vUpDot;
rockMix = 1.0 - step(0.8, rockMix);
rockMix *= step(-0.06, -vPosition.y);
color = mix(color, u_colorRock, rockMix);

//Snow
float snowThreshold = 0.45;
snowThreshold += simplexNoise2d(vPosition.xz * 15.0) * 0.1;
float snowMix = step(snowThreshold, -vPosition.y);
color = mix(color, u_colorSnow, snowMix);




//Final color
csm_DiffuseColor = vec4(color, 1.0);


}
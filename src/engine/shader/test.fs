#version 300 es

precision mediump float;

out vec4 fsout_frag_color;
in vec2 fsin_texcoord;

uniform sampler2D un_texture;
uniform vec3      un_lightdir;
uniform vec2      un_terrain_pos;
uniform float     un_terrain_scale;
uniform float     un_time;

#define YSCALE 4.0


const mat3 ACESInputMat = mat3(
    0.59719, 0.35458, 0.04823,
    0.07600, 0.90834, 0.01566,
    0.02840, 0.13383, 0.83777
);

// ODT_SAT => XYZ => D60_2_D65 => sRGB
const mat3 ACESOutputMat = mat3(
     1.60475, -0.53108, -0.07367,
    -0.10208,  1.10813, -0.00605,
    -0.00327, -0.07276,  1.07602
);

vec3 RRTAndODTFit(vec3 v)
{
    vec3 a = v * (v + 0.0245786) - 0.000090537;
    vec3 b = v * (0.983729 * v + 0.4329510) + 0.238081;
    return a / b;
}

vec3 ACESFitted(vec3 color)
{
    color = color * ACESInputMat;

    // Apply RRT and ODT
    color = RRTAndODTFit(color);

    color = color * ACESOutputMat;

    // Clamp to [0, 1]
    color = clamp(color, 0.0, 1.0);

    return color;
}



vec2 uv_to_world( vec2 uv )
{
    uv.y = 1.0 - uv.y;

    vec2 pos = un_terrain_pos;
    pos += un_terrain_scale * vec2(textureSize(un_texture, 0)) * uv;
    return pos;
}


float SOS( vec2 uv )
{
    float h = 0.0;
    float a = 1.0;
    float w = 1.0;

    vec2[4] dirs = vec2[4](
        vec2(-1.5, 0.25),
        vec2(0.1, -0.25),
        vec2(-3.3, -1.25),
        vec2(1.0, 0.25)
    );

    for (int i=0; i<16; i++)
    {
        float dx = texture(un_texture, uv+0.7*float(i)).a * 2.0 - 1.0;
        float dz = texture(un_texture, uv-0.5113*float(i)).a * 2.0 - 1.0;

        vec2 dir = normalize(vec2(dx, dz));
        float xz = dot(dir, uv);

        h += a * sin(w*xz + 4.0*un_time);
        a *= 0.5;
        w *= 2.0;
    }

    return h;
}


float sampleHeight( vec2 uv )
{
    float height = texture(un_texture, uv).a;

    if (height < 0.55)
    {
        // vec2 dir = normalize(vec2(-1.5, 0.25));
        // float xz = dot(dir, uv);

        // height = SOS(uv_to_world(0.025*uv)); // sin(128.0*xz + 8.0*un_time) * 0.5 + 0.5;
    }

    return YSCALE * height;
}


vec3 ComputeNormal( vec2 tsize, vec2 texcoord )
{
    float hc = sampleHeight(texcoord);
    float hl = sampleHeight(texcoord + tsize*vec2(-1,  0));
    float hu = sampleHeight(texcoord + tsize*vec2( 0, -1));

    vec3 up   = vec3(0, hu, 0) - vec3(0, hc, tsize.y);
    vec3 left = vec3(0, hl, 0) - vec3(tsize.x, hc, 0);

    return normalize(cross(up, left));
}


float TraceShadow( vec2 origin, vec3 dir, float height )
{
    vec2  tsize = vec2(1.0) / vec2(textureSize(un_texture, 0));

    vec2  rp = origin;
    vec3  rd = 1.0 * vec3(tsize.x, 1.0, tsize.y) * dir;
    float rh = height;

    float result = 0.99;

    for (int i=0; i<16; i++)
    {
        rp += rd.xz;
        rh += 0.1*rd.y;

        float h = sampleHeight(rp);

        if (h > rh)
        {
            result *= 0.86;
        }
    }


    return result;
}


void main()
{
    vec2 tsize = vec2(1.0) / vec2(textureSize(un_texture, 0));
    vec4 rgba  = texture(un_texture, fsin_texcoord).rgba;

    vec3  color  = rgba.rgb;
    float height = sampleHeight(fsin_texcoord);
    vec3  normal = ComputeNormal(tsize, fsin_texcoord);

    // color *= TraceShadow(fsin_texcoord, normalize(-un_lightdir), height);

    // float lambert = max(dot(N, normalize(-un_lightdir)), 0.0);
    float lambert = dot(normal, normalize(-un_lightdir)) * 0.5 + 0.5;
    color *= lambert;

    // {
        // color = normal * 0.5 + 0.5;
    // }
    // color = ACESFitted(color);
  
    fsout_frag_color = vec4(color, 1.0);
}




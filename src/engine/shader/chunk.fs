#version 300 es

precision mediump float;

out vec4 fsout_frag_color;

in vec3 fsin_fragpos;
in vec2 fsin_texcoord;

uniform sampler2D un_texture;
uniform vec3 un_corner;


float TraceShadow( vec2 origin, vec3 dir, float height )
{
    // vec2  tsize = vec2(1.0) / vec2(textureSize(un_texture, 0));

    // vec2  rp = origin;
    // vec3  rd = 1.0 * vec3(tsize.x, 1.0, tsize.y) * dir;
    // float rh = height;

    float result = 0.99;

    // for (int i=0; i<16; i++)
    // {
    //     rp += rd.xz;
    //     rh += 0.1*rd.y;

    //     float h = sampleHeight(rp);

    //     if (h > rh)
    //     {
    //         result *= 0.86;
    //     }
    // }


    return result;
}


void main()
{
    vec3 albedo = texture(un_texture, fsin_texcoord).rgb;

    // vec2 tsize = vec2(1.0) / vec2(textureSize(un_texture, 0));
    // vec4 rgba  = texture(un_texture, fsin_texcoord).rgba;

    vec3 result = albedo;

    // if (fsin_texcoord.x < 0.01 || fsin_texcoord.x > 0.99)
    // {
    //     result *= 0.0;
    // }

    // if (fsin_texcoord.y < 0.01 || fsin_texcoord.y > 0.99)
    // {
    //     result *= 0.0;
    // }

    // vec2 corner = un_corner.xy;
    // float light = 1.0 / (1.0 + max(corner.y + fsin_texcoord.y, 0.0));
    // result *= light;

    fsout_frag_color = vec4(result, 1.0);
    // fsout_frag_color = vec4(1.0, 0.0, 0.0, 1.0);
}




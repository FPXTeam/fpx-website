"use client";

import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";

type PatternShape="Checks"|"Stripes"|"Edge";
const PatternShapes:Record<PatternShape,number>={Checks:0,Stripes:1,Edge:2};

interface CustomConfig{
  preset:"custom";
  color1:string;color2:string;color3:string;
  rotation?:number;proportion?:number;scale?:number;speed?:number;
  distortion?:number;swirl?:number;swirlIterations?:number;
  softness?:number;offset?:number;shape?:PatternShape;shapeSize?:number;
}
interface NoiseConfig{opacity:number;scale?:number}
interface AnimatedGradientProps{config:CustomConfig;noise?:NoiseConfig;style?:CSSProperties;className?:string}

export function AnimatedGradient({config,noise,style,className}:AnimatedGradientProps){
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const containerRef=useRef<HTMLDivElement>(null);
  const frameIdRef=useRef<number>();
  const startTimeRef=useRef(0);
  const[failed,setFailed]=useState(false);
  const params=useMemo(()=>({
    color1:config.color1,color2:config.color2,color3:config.color3,
    rotation:config.rotation??0,proportion:config.proportion??35,scale:config.scale??1,
    speed:config.speed??25,distortion:config.distortion??12,swirl:config.swirl??80,
    swirlIterations:config.swirlIterations??10,softness:config.softness??100,
    offset:config.offset??0,shape:config.shape??"Checks",shapeSize:config.shapeSize??10
  }),[config]);

  useEffect(()=>{
    if(failed)return;
    const canvas=canvasRef.current,container=containerRef.current;
    if(!canvas||!container)return;
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
    const gl=canvas.getContext("webgl2",{premultipliedAlpha:true,alpha:true,antialias:true});
    if(!gl){setFailed(true);return}
    const vs=gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs,`#version 300 es
in vec4 a_position;
void main(){gl_Position=a_position;}`);
    gl.compileShader(vs);
    const fs=gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs,FRAGMENT_SHADER);gl.compileShader(fs);
    if(!gl.getShaderParameter(vs,gl.COMPILE_STATUS)||!gl.getShaderParameter(fs,gl.COMPILE_STATUS)){setFailed(true);return}
    const program=gl.createProgram()!;
    gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)){setFailed(true);return}
    gl.useProgram(program);
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    const pos=gl.getAttribLocation(program,"a_position");gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
    const u=(name:string)=>gl.getUniformLocation(program,name);
    const uniforms={time:u("u_time"),resolution:u("u_resolution"),pixelRatio:u("u_pixelRatio"),scale:u("u_scale"),rotation:u("u_rotation"),color1:u("u_color1"),color2:u("u_color2"),color3:u("u_color3"),proportion:u("u_proportion"),softness:u("u_softness"),shape:u("u_shape"),shapeScale:u("u_shapeScale"),distortion:u("u_distortion"),swirl:u("u_swirl"),swirlIterations:u("u_swirlIterations")};
    const resize=()=>{const width=container.clientWidth,height=container.clientHeight,pixelRatio=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.max(1,Math.round(width*pixelRatio));canvas.height=Math.max(1,Math.round(height*pixelRatio));canvas.style.width=`${width}px`;canvas.style.height=`${height}px`;gl.viewport(0,0,canvas.width,canvas.height)};
    resize();const observer=new ResizeObserver(resize);observer.observe(container);startTimeRef.current=performance.now();
    const animate=(time:number)=>{
      const elapsed=(time-startTimeRef.current)/1000,speed=(params.speed/100)*5;
      gl.uniform1f(uniforms.time,elapsed*speed+params.offset*.01);gl.uniform2f(uniforms.resolution,canvas.width,canvas.height);gl.uniform1f(uniforms.pixelRatio,Math.min(window.devicePixelRatio||1,2));gl.uniform1f(uniforms.scale,params.scale);gl.uniform1f(uniforms.rotation,(params.rotation*Math.PI)/180);
      const c1=hexToRgba(params.color1),c2=hexToRgba(params.color2),c3=hexToRgba(params.color3);
      gl.uniform4f(uniforms.color1,...c1);gl.uniform4f(uniforms.color2,...c2);gl.uniform4f(uniforms.color3,...c3);
      gl.uniform1f(uniforms.proportion,params.proportion/100);gl.uniform1f(uniforms.softness,params.softness/100);gl.uniform1f(uniforms.shape,PatternShapes[params.shape]);gl.uniform1f(uniforms.shapeScale,params.shapeSize/100);gl.uniform1f(uniforms.distortion,params.distortion/50);gl.uniform1f(uniforms.swirl,params.swirl/100);gl.uniform1f(uniforms.swirlIterations,params.swirl===0?0:params.swirlIterations);
      gl.drawArrays(gl.TRIANGLES,0,6);frameIdRef.current=requestAnimationFrame(animate);
    };
    frameIdRef.current=requestAnimationFrame(animate);
    return()=>{if(frameIdRef.current)cancelAnimationFrame(frameIdRef.current);observer.disconnect();gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);gl.deleteBuffer(buffer)};
  },[failed,params]);

  return <div ref={containerRef} className={className} style={{position:"absolute",inset:0,overflow:"hidden",background:"linear-gradient(135deg,#F7F4EA 0%,#EDF3EA 48%,#E8DDCC 100%)",...style}}>
    {!failed&&<canvas ref={canvasRef} style={{display:"block",width:"100%",height:"100%"}}/>}
    {noise&&noise.opacity>0&&<div style={{position:"absolute",inset:0,backgroundImage:'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAElBMVEUAAAAAAAAAAAAAAAAAAAAAAADgKxmiAAAABnRSTlMCCgkGBAVJOAVJAAAASklEQVQ4y2NgGAWjYBSMglEwCgY/YGRgZBQUYmJiZGQEkYwMjIyMgoKCjIyMIJKBgRFIMjIyAklGRkYGRkFBYEcwMDIyMjAOUQAA1I4HwVwZAkYAAAAASUVORK5CYII=")',backgroundSize:(noise.scale??1)*200,backgroundRepeat:"repeat",opacity:noise.opacity/2,pointerEvents:"none"}}/>}
  </div>;
}

function hexToRgba(hex:string):[number,number,number,number]{const c=hex.replace("#","");return[parseInt(c.slice(0,2),16)/255,parseInt(c.slice(2,4),16)/255,parseInt(c.slice(4,6),16)/255,1]}

const FRAGMENT_SHADER=`#version 300 es
precision highp float;
uniform float u_time;uniform float u_pixelRatio;uniform vec2 u_resolution;uniform float u_scale;uniform float u_rotation;uniform vec4 u_color1;uniform vec4 u_color2;uniform vec4 u_color3;uniform float u_proportion;uniform float u_softness;uniform float u_shape;uniform float u_shapeScale;uniform float u_distortion;uniform float u_swirl;uniform float u_swirlIterations;out vec4 fragColor;
#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846
vec2 rotate(vec2 uv,float th){return mat2(cos(th),sin(th),-sin(th),cos(th))*uv;}
float random(vec2 st){return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);}
float noise(vec2 st){vec2 i=floor(st),f=fract(st);float a=random(i),b=random(i+vec2(1.,0.)),c=random(i+vec2(0.,1.)),d=random(i+vec2(1.,1.));vec2 u=f*f*(3.-2.*f);return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
vec4 blend_colors(vec4 c1,vec4 c2,vec4 c3,float mixer,float edgesWidth,float edge_blur){vec3 color1=c1.rgb*c1.a,color2=c2.rgb*c2.a,color3=c3.rgb*c3.a;float r1=smoothstep(.0+.35*edgesWidth,.7-.35*edgesWidth+.5*edge_blur,mixer);float r2=smoothstep(.3+.35*edgesWidth,1.-.35*edgesWidth+edge_blur,mixer);vec3 blended=mix(color1,color2,r1);float opacity=mix(c1.a,c2.a,r1);return vec4(mix(blended,color3,r2),mix(opacity,c3.a,r2));}
void main(){vec2 uv=gl_FragCoord.xy/u_resolution.xy;float t=.5*u_time;float noise_scale=.0005+.006*u_scale;uv-=.5;uv*=noise_scale*u_resolution;uv=rotate(uv,u_rotation*.5*PI);uv/=u_pixelRatio;uv+=.5;float n1=noise(uv+t),n2=noise(uv*2.-t),angle=n1*TWO_PI;uv.x+=4.*u_distortion*n2*cos(angle);uv.y+=4.*u_distortion*n2*sin(angle);float iterations=ceil(clamp(u_swirlIterations,1.,30.));for(float i=1.;i<=iterations;i++){uv.x+=clamp(u_swirl,0.,2.)/i*cos(t+i*1.5*uv.y);uv.y+=clamp(u_swirl,0.,2.)/i*cos(t+i*uv.x);}float proportion=clamp(u_proportion,0.,1.),shape=0.,mixer=0.;if(u_shape<.5){vec2 p=uv*(.5+3.5*u_shapeScale);shape=.5+.5*sin(p.x)*cos(p.y);mixer=shape+.48*sign(proportion-.5)*pow(abs(proportion-.5),.5);}else if(u_shape<1.5){vec2 p=uv*(.25+3.*u_shapeScale);float f=fract(p.y);shape=smoothstep(.0,.55,f)*smoothstep(1.,.45,f);mixer=shape+.48*sign(proportion-.5)*pow(abs(proportion-.5),.5);}else{float sh=1.-uv.y;sh-=.5;sh/=(noise_scale*u_resolution.y);sh+=.5;float scaling=.2*(1.-u_shapeScale);shape=smoothstep(.45-scaling,.55+scaling,sh+.3*(proportion-.5));mixer=shape;}fragColor=blend_colors(u_color1,u_color2,u_color3,mixer,1.-clamp(u_softness,0.,1.),.01+.01*u_scale);}`;

<div align="center">

# AI Website Builder

**Build modern websites with AI — from natural-language prompts to functional web experiences.**

Create a website from a prompt, refine its generated HTML in an interactive preview, save versions, and share or download the result.

[Live demo](https://ai-website-builder-nine-self.vercel.app/) · [Repository](https://github.com/hilla10/ai-website-builder) · [Report a bug](https://github.com/hilla10/ai-website-builder/issues)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20.19%2B-339933?logo=nodedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17%2B-4169E1?logo=postgresql&logoColor=white)

</div>

## Contents

- [AI Website Builder](#ai-website-builder)
  - [Contents](#contents)
  - [Overview](#overview)
  - [Screenshots and demo](#screenshots-and-demo)
  - [Features](#features)
    - [Implemented](#implemented)
    - [Not included / future work](#not-included--future-work)
  - [Technology](#technology)
  - [Architecture and workflow](#architecture-and-workflow)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment variables](#environment-variables)
    - [Server (`server/.env`)](#server-serverenv)
    - [Client (`client/.env`)](#client-clientenv)
  - [Run and build](#run-and-build)
  - [Usage](#usage)
  - [API](#api)
  - [Project structure](#project-structure)
  - [Data model](#data-model)
  - [Deployment](#deployment)
  - [Troubleshooting](#troubleshooting)
  - [Security](#security)
  - [Contributing](#contributing)
  - [Roadmap](#roadmap)
  - [License](#license)
  - [Author and acknowledgments](#author-and-acknowledgments)

## Overview

AI Website Builder is a full-stack application for turning a written brief into a single-page website. It sends the prompt to an OpenRouter-compatible AI endpoint, asks the model to enhance the brief and generate standalone HTML, and stores the result with the project. Users can preview generated pages, request AI revisions, make direct edits in the preview, and save, download, publish, or roll back project versions.

The workflow is intended for people who want to prototype a web presence without hand-authoring every component. The generated result is HTML styled with Tailwind CSS; this is not a general-purpose React component generator or an independent hosting platform.

## Screenshots and demo

Try the [live demo](https://ai-website-builder-nine-self.vercel.app/). The paths below are screenshot placeholders; the image files are not currently included in this repository.

| Screen          | Placeholder                                                                |
| --------------- | -------------------------------------------------------------------------- |
| Landing page    | ![Landing page screenshot placeholder](docs/images/landing-page.png)       |
| projects        | ![Projects screenshot placeholder](docs/images/dashboard.png)              |
| AI generation   | ![AI generation screenshot placeholder](docs/images/ai-generation.png)     |
| Website preview | ![Website preview screenshot placeholder](docs/images/website-preview.png) |
| Project editor  | ![Project editor screenshot placeholder](docs/images/project-editor.png)   |

## Features

### Implemented

- **Prompt-to-HTML generation:** Enhances a natural-language website brief and requests a complete HTML page from the configured AI model.
- **AI revisions and conversation history:** Follow-up prompts use the existing website code as context. User and assistant messages are saved with the project.
- **Interactive preview and editor:** Renders the page in an iframe, supports phone/tablet/desktop preview widths, and offers direct text and style edits.
- **Projects and versions:** Authenticated users can list, reopen, save, delete, and roll back their projects. Generated revisions are stored as versions.
- **Download and publication:** Download the current website as `index.html`; toggle its publication status and view published pages in the app at `/view/:projectId`.
- **Authentication and credits:** Better Auth email/password sessions protect user project routes. New accounts start with 20 credits; generation and each AI revision cost 5 credits.
- **Credit purchases:** Stripe Checkout offers credit packages; a signed webhook marks transactions paid and adds credits.
- **Community and feedback:** Browse published projects and receive UI notifications through Sonner.

### Not included / future work

- Published projects are rendered by this application; a custom domain or one-click deployment of each generated site is not implemented.
- Download currently exports a single HTML file, not a multi-file source archive.
- Collaborative editing and multiple AI providers are not implemented.

## Technology

| Area                  | Technologies                                  | Role                                                                            |
| --------------------- | --------------------------------------------- | ------------------------------------------------------------------------------- |
| Frontend              | React 19, TypeScript, Vite 8, Tailwind CSS 4  | Client application and responsive UI                                            |
| Routing and requests  | React Router 7, Axios                         | Browser routes and credentialed API requests                                    |
| UI                    | Sonner, Lucide React, Base UI, Better Auth UI | Notifications, icons, and interface components                                  |
| Backend               | Node.js, TypeScript, Express 5                | HTTP API and Stripe webhook                                                     |
| Database              | PostgreSQL, Prisma 7, `pg` adapter            | User, project, conversation, version, and transaction persistence               |
| Authentication        | Better Auth                                   | Email/password auth and database-backed sessions                                |
| AI                    | OpenAI SDK pointed at OpenRouter              | Prompt enhancement and HTML generation; model IDs are configured in server code |
| Payments              | Stripe                                        | Checkout for credit packages and webhook handling                               |
| Hosting configuration | Vercel config files                           | Frontend SPA rewrite and server function routing                                |

The schema uses PostgreSQL. Neon is a compatible hosting option, but the application does not contain Neon-specific integration.

## Architecture and workflow

```drawio
<mxfile>
  <diagram id="YQkq63N33Fq4pbsOeuLL" name="Page-1">
    <mxGraphModel dx="1876" dy="1606" grid="1" gridSize="10" guides="1" tooltips="0" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100" math="0" shadow="0">
      <root>
        <mxCell id="f85zcJxW5xo5lILywIK8-0" />
        <mxCell id="f85zcJxW5xo5lILywIK8-1" parent="f85zcJxW5xo5lILywIK8-0" />
        <UserObject label="" mermaidData="{&#xa;  &quot;data&quot;: &quot;flowchart LR\r\n  U[User] --&gt;|prompt, edits| F[React + Vite client]\r\n  F --&gt;|credentialed HTTP| E[Express API]\r\n  E --&gt;|session lookup| A[Better Auth]\r\n  E --&gt;|projects, versions, credits| D[(PostgreSQL via Prisma)]\r\n  E --&gt;|prompt enhancement and HTML generation| AI[OpenRouter-compatible AI]\r\n  AI --&gt; E\r\n  E --&gt; F\r\n  F --&gt;|HTML in preview iframe| P[Website preview]\r\n  E --&gt;|checkout session| S[Stripe]\r\n  S --&gt;|signed webhook| E&quot;,&#xa;  &quot;config&quot;: null&#xa;}" id="xHNrGeAP0ZefTl86ntIo-0">
          <mxCell connectable="0" parent="f85zcJxW5xo5lILywIK8-1" style="group;transparentBounds=1;editIcon=1;lockedGroup=0;groupPadding=10;" vertex="1">
            <mxGeometry as="geometry" />
          </mxCell>
        </UserObject>
        <UserObject label="User" mermaidId="n:U" mermaidBaseStyle="html=1;whiteSpace=wrap;strokeWidth=1;fillColor=light-dark(#ECECFF,#1f2020);strokeColor=light-dark(#9370DB,#cccccc);fontColor=light-dark(#333333,#cccccc);fontFamily=Trebuchet MS,Verdana,Arial,sans-serif;fontSize=16;" mermaidBaseValue="User" id="f85zcJxW5xo5lILywIK8-2">
          <mxCell parent="xHNrGeAP0ZefTl86ntIo-0" style="html=1;whiteSpace=wrap;strokeWidth=1;fillColor=light-dark(#ECECFF,#1f2020);strokeColor=light-dark(#9370DB,#cccccc);fontColor=light-dark(#333333,#cccccc);fontFamily=Trebuchet MS,Verdana,Arial,sans-serif;fontSize=16;" vertex="1">
            <mxGeometry height="54" width="92" x="10" y="268" as="geometry" />
          </mxCell>
        </UserObject>
        <UserObject label="React + Vite client" mermaidId="n:F" mermaidBaseStyle="html=1;whiteSpace=wrap;strokeWidth=1;fillColor=light-dark(#ECECFF,#1f2020);strokeColor=light-dark(#9370DB,#cccccc);fontColor=light-dark(#333333,#cccccc);fontFamily=Trebuchet MS,Verdana,Arial,sans-serif;fontSize=16;" mermaidBaseValue="React + Vite client" id="f85zcJxW5xo5lILywIK8-3">
          <mxCell parent="xHNrGeAP0ZefTl86ntIo-0" style="html=1;whiteSpace=wrap;strokeWidth=1;fillColor=light-dark(#ECECFF,#1f2020);strokeColor=light-dark(#9370DB,#cccccc);fontColor=light-dark(#333333,#cccccc);fontFamily=Trebuchet MS,Verdana,Arial,sans-serif;fontSize=16;" vertex="1">
            <mxGeometry height="54" width="193" x="250" y="268" as="geometry" />
          </mxCell>
        </UserObject>
        <UserObject label="Express API" mermaidId="n:E" mermaidBaseStyle="html=1;whiteSpace=wrap;strokeWidth=1;fillColor=light-dark(#ECECFF,#1f2020);strokeColor=light-dark(#9370DB,#cccccc);fontColor=light-dark(#333333,#cccccc);fontFamily=Trebuchet MS,Verdana,Arial,sans-serif;fontSize=16;" mermaidBaseValue="Express API" id="f85zcJxW5xo5lILywIK8-4">
          <mxCell parent="xHNrGeAP0ZefTl86ntIo-0" style="html=1;whiteSpace=wrap;strokeWidth=1;fillColor=light-dark(#ECECFF,#1f2020);strokeColor=light-dark(#9370DB,#cccccc);fontColor=light-dark(#333333,#cccccc);fontFamily=Trebuchet MS,Verdana,Arial,sans-serif;fontSize=16;" vertex="1">
            <mxGeometry height="54" width="140" x="682" y="231" as="geometry" />
          </mxCell>
        </UserObject>
        <UserObject label="Better Auth" mermaidId="n:A" mermaidBaseStyle="html=1;whiteSpace=wrap;strokeWidth=1;fillColor=light-dark(#ECECFF,#1f2020);strokeColor=light-dark(#9370DB,#cccccc);fontColor=light-dark(#333333,#cccccc);fontFamily=Trebuchet MS,Verdana,Arial,sans-serif;fontSize=16;" mermaidBaseValue="Better Auth" id="f85zcJxW5xo5lILywIK8-5">
          <mxCell parent="xHNrGeAP0ZefTl86ntIo-0" style="html=1;whiteSpace=wrap;strokeWidth=1;fillColor=light-dark(#ECECFF,#1f2020);strokeColor=light-dark(#9370DB,#cccccc);fontColor=light-dark(#333333,#cccccc);fontFamily=Trebuchet MS,Verdana,Arial,sans-serif;fontSize=16;" vertex="1">
            <mxGeometry height="54" width="143" x="1254" y="10" as="geometry" />
          </mxCell>
        </UserObject>
        <UserObject label="PostgreSQL via Prisma" mermaidId="n:D" mermaidBaseStyle="html=1;shape=cylinder3;boundedLbl=1;backgroundOutline=1;size=10;strokeWidth=1;whiteSpace=wrap;fillColor=light-dark(#ECECFF,#1f2020);strokeColor=light-dark(#9370DB,#cccccc);fontColor=light-dark(#333333,#cccccc);fontFamily=Trebuchet MS,Verdana,Arial,sans-serif;fontSize=16;" mermaidBaseValue="PostgreSQL via Prisma" id="f85zcJxW5xo5lILywIK8-6">
          <mxCell parent="xHNrGeAP0ZefTl86ntIo-0" style="html=1;shape=cylinder3;boundedLbl=1;backgroundOutline=1;size=10;strokeWidth=1;whiteSpace=wrap;fillColor=light-dark(#ECECFF,#1f2020);strokeColor=light-dark(#9370DB,#cccccc);fontColor=light-dark(#333333,#cccccc);fontFamily=Trebuchet MS,Verdana,Arial,sans-serif;fontSize=16;" vertex="1">
            <mxGeometry height="67" width="171" x="1240" y="114" as="geometry" />
          </mxCell>
        </UserObject>
        <UserObject label="OpenRouter-compatible AI" mermaidId="n:AI" mermaidBaseStyle="html=1;whiteSpace=wrap;strokeWidth=1;fillColor=light-dark(#ECECFF,#1f2020);strokeColor=light-dark(#9370DB,#cccccc);fontColor=light-dark(#333333,#cccccc);fontFamily=Trebuchet MS,Verdana,Arial,sans-serif;fontSize=16;" mermaidBaseValue="OpenRouter-compatible AI" id="f85zcJxW5xo5lILywIK8-7">
          <mxCell parent="xHNrGeAP0ZefTl86ntIo-0" style="html=1;whiteSpace=wrap;strokeWidth=1;fillColor=light-dark(#ECECFF,#1f2020);strokeColor=light-dark(#9370DB,#cccccc);fontColor=light-dark(#333333,#cccccc);fontFamily=Trebuchet MS,Verdana,Arial,sans-serif;fontSize=16;" vertex="1">
            <mxGeometry height="54" width="249" x="1201" y="231" as="geometry" />
          </mxCell>
        </UserObject>
        <UserObject label="Website preview" mermaidId="n:P" mermaidBaseStyle="html=1;whiteSpace=wrap;strokeWidth=1;fillColor=light-dark(#ECECFF,#1f2020);strokeColor=light-dark(#9370DB,#cccccc);fontColor=light-dark(#333333,#cccccc);fontFamily=Trebuchet MS,Verdana,Arial,sans-serif;fontSize=16;" mermaidBaseValue="Website preview" id="f85zcJxW5xo5lILywIK8-8">
          <mxCell parent="xHNrGeAP0ZefTl86ntIo-0" style="html=1;whiteSpace=wrap;strokeWidth=1;fillColor=light-dark(#ECECFF,#1f2020);strokeColor=light-dark(#9370DB,#cccccc);fontColor=light-dark(#333333,#cccccc);fontFamily=Trebuchet MS,Verdana,Arial,sans-serif;fontSize=16;" vertex="1">
            <mxGeometry height="54" width="178" x="663" y="335" as="geometry" />
          </mxCell>
        </UserObject>
        <UserObject label="Stripe" mermaidId="n:S" mermaidBaseStyle="html=1;whiteSpace=wrap;strokeWidth=1;fillColor=light-dark(#ECECFF,#1f2020);strokeColor=light-dark(#9370DB,#cccccc);fontColor=light-dark(#333333,#cccccc);fontFamily=Trebuchet MS,Verdana,Arial,sans-serif;fontSize=16;" mermaidBaseValue="Stripe" id="f85zcJxW5xo5lILywIK8-9">
          <mxCell parent="xHNrGeAP0ZefTl86ntIo-0" style="html=1;whiteSpace=wrap;strokeWidth=1;fillColor=light-dark(#ECECFF,#1f2020);strokeColor=light-dark(#9370DB,#cccccc);fontColor=light-dark(#333333,#cccccc);fontFamily=Trebuchet MS,Verdana,Arial,sans-serif;fontSize=16;" vertex="1">
            <mxGeometry height="54" width="102" x="1275" y="335" as="geometry" />
          </mxCell>
        </UserObject>
        <UserObject label="prompt, edits" mermaidId="e:U-&gt;F#0" mermaidBaseStyle="curved=1;startArrow=none;endArrow=block;endSize=7;strokeColor=light-dark(#333333,#cccccc);html=1;fontSize=16;labelBackgroundColor=light-dark(#E8E8E88D,#2a2a2a8D);fontFamily=Trebuchet MS,Verdana,Arial,sans-serif;fontColor=light-dark(#333333,#cccccc);exitX=1;exitY=0.5;entryX=0;entryY=0.5;" mermaidBaseValue="prompt, edits" id="f85zcJxW5xo5lILywIK8-10">
          <mxCell edge="1" parent="xHNrGeAP0ZefTl86ntIo-0" source="f85zcJxW5xo5lILywIK8-2" style="curved=1;startArrow=none;endArrow=block;endSize=7;strokeColor=light-dark(#333333,#cccccc);html=1;fontSize=16;labelBackgroundColor=light-dark(#E8E8E88D,#2a2a2a8D);fontFamily=Trebuchet MS,Verdana,Arial,sans-serif;fontColor=light-dark(#333333,#cccccc);exitX=1;exitY=0.5;entryX=0;entryY=0.5;" target="f85zcJxW5xo5lILywIK8-3">
            <mxGeometry relative="1" as="geometry">
              <Array as="points" />
            </mxGeometry>
          </mxCell>
        </UserObject>
        <UserObject label="credentialed HTTP" mermaidId="e:F-&gt;E#0" mermaidBaseStyle="curved=1;startArrow=none;endArrow=block;endSize=7;strokeColor=light-dark(#333333,#cccccc);html=1;fontSize=16;labelBackgroundColor=light-dark(#E8E8E88D,#2a2a2a8D);fontFamily=Trebuchet MS,Verdana,Arial,sans-serif;fontColor=light-dark(#333333,#cccccc);exitX=1;exitY=0.7407407407407407;entryX=0;entryY=0.7407407407407407;curved=1;exitX=1;exitY=0.74;entryX=0;entryY=0.74;" mermaidBaseValue="credentialed HTTP" id="f85zcJxW5xo5lILywIK8-11">
          <mxCell edge="1" parent="xHNrGeAP0ZefTl86ntIo-0" source="f85zcJxW5xo5lILywIK8-3" style="curved=1;startArrow=none;endArrow=block;endSize=7;strokeColor=light-dark(#333333,#cccccc);html=1;fontSize=16;labelBackgroundColor=light-dark(#E8E8E88D,#2a2a2a8D);fontFamily=Trebuchet MS,Verdana,Arial,sans-serif;fontColor=light-dark(#333333,#cccccc);exitX=1;exitY=0.74;entryX=0;entryY=0.74;" target="f85zcJxW5xo5lILywIK8-4">
            <mxGeometry relative="1" as="geometry">
              <mxPoint as="offset" />
              <Array as="points">
                <mxPoint x="563" y="356" />
              </Array>
            </mxGeometry>
          </mxCell>
        </UserObject>
        <UserObject label="session lookup" mermaidId="e:E-&gt;A#0" mermaidBaseStyle="curved=1;startArrow=none;endArrow=block;endSize=7;strokeColor=light-dark(#333333,#cccccc);html=1;fontSize=16;labelBackgroundColor=light-dark(#E8E8E88D,#2a2a2a8D);fontFamily=Trebuchet MS,Verdana,Arial,sans-serif;fontColor=light-dark(#333333,#cccccc);exitX=0.74;exitY=0;entryX=0;entryY=0.5;" mermaidBaseValue="session lookup" id="f85zcJxW5xo5lILywIK8-12">
          <mxCell edge="1" parent="xHNrGeAP0ZefTl86ntIo-0" source="f85zcJxW5xo5lILywIK8-4" style="curved=1;startArrow=none;endArrow=block;endSize=7;strokeColor=light-dark(#333333,#cccccc);html=1;fontSize=16;labelBackgroundColor=light-dark(#E8E8E88D,#2a2a2a8D);fontFamily=Trebuchet MS,Verdana,Arial,sans-serif;fontColor=light-dark(#333333,#cccccc);exitX=0.74;exitY=0;entryX=0;entryY=0.5;" target="f85zcJxW5xo5lILywIK8-5">
            <mxGeometry relative="1" as="geometry">
              <Array as="points">
                <mxPoint x="1021" y="37" />
              </Array>
            </mxGeometry>
          </mxCell>
        </UserObject>
        <UserObject label="projects, versions, credits" mermaidId="e:E-&gt;D#0" mermaidBaseStyle="curved=1;startArrow=none;endArrow=block;endSize=7;strokeColor=light-dark(#333333,#cccccc);html=1;fontSize=16;labelBackgroundColor=light-dark(#E8E8E88D,#2a2a2a8D);fontFamily=Trebuchet MS,Verdana,Arial,sans-serif;fontColor=light-dark(#333333,#cccccc);exitX=0.97;exitY=0;entryX=0;entryY=0.51;" mermaidBaseValue="projects, versions, credits" id="f85zcJxW5xo5lILywIK8-13">
          <mxCell edge="1" parent="xHNrGeAP0ZefTl86ntIo-0" source="f85zcJxW5xo5lILywIK8-4" style="curved=1;startArrow=none;endArrow=block;endSize=7;strokeColor=light-dark(#333333,#cccccc);html=1;fontSize=16;labelBackgroundColor=light-dark(#E8E8E88D,#2a2a2a8D);fontFamily=Trebuchet MS,Verdana,Arial,sans-serif;fontColor=light-dark(#333333,#cccccc);exitX=0.97;exitY=0;entryX=0;entryY=0.51;" target="f85zcJxW5xo5lILywIK8-6">
            <mxGeometry relative="1" as="geometry">
              <Array as="points">
                <mxPoint x="1021" y="148" />
              </Array>
            </mxGeometry>
          </mxCell>
        </UserObject>
        <UserObject label="prompt enhancement and HTML generation" mermaidId="e:E-&gt;AI#0" mermaidBaseStyle="curved=1;startArrow=none;endArrow=block;endSize=7;strokeColor=light-dark(#333333,#cccccc);html=1;fontSize=16;labelBackgroundColor=light-dark(#E8E8E88D,#2a2a2a8D);fontFamily=Trebuchet MS,Verdana,Arial,sans-serif;fontColor=light-dark(#333333,#cccccc);exitX=1;exitY=0.7407407407407407;entryX=0;entryY=0.7407407407407407;curved=1;exitX=1;exitY=0.74;entryX=0;entryY=0.74;" mermaidBaseValue="prompt enhancement and HTML generation" id="f85zcJxW5xo5lILywIK8-14">
          <mxCell edge="1" parent="xHNrGeAP0ZefTl86ntIo-0" source="f85zcJxW5xo5lILywIK8-4" style="curved=1;startArrow=none;endArrow=block;endSize=7;strokeColor=light-dark(#333333,#cccccc);html=1;fontSize=16;labelBackgroundColor=light-dark(#E8E8E88D,#2a2a2a8D);fontFamily=Trebuchet MS,Verdana,Arial,sans-serif;fontColor=light-dark(#333333,#cccccc);exitX=1;exitY=0.74;entryX=0;entryY=0.74;" target="f85zcJxW5xo5lILywIK8-7">
            <mxGeometry relative="1" as="geometry">
              <mxPoint as="offset" />
              <Array as="points">
                <mxPoint x="1012" y="425" />
              </Array>
            </mxGeometry>
          </mxCell>
        </UserObject>
        <UserObject label="" mermaidId="e:AI-&gt;E#0" mermaidBaseStyle="curved=1;startArrow=none;endArrow=block;endSize=7;strokeColor=light-dark(#333333,#cccccc);exitX=0;exitY=0.3888888888888889;entryX=1;entryY=0.3888888888888889;curved=1;exitX=0;exitY=0.39;entryX=1;entryY=0.39;" mermaidBaseValue="" id="f85zcJxW5xo5lILywIK8-15">
          <mxCell edge="1" parent="xHNrGeAP0ZefTl86ntIo-0" source="f85zcJxW5xo5lILywIK8-7" style="curved=1;startArrow=none;endArrow=block;endSize=7;strokeColor=light-dark(#333333,#cccccc);exitX=0;exitY=0.39;entryX=1;entryY=0.39;" target="f85zcJxW5xo5lILywIK8-4">
            <mxGeometry relative="1" as="geometry">
              <mxPoint as="offset" />
              <Array as="points">
                <mxPoint x="1012" y="246" />
              </Array>
            </mxGeometry>
          </mxCell>
        </UserObject>
        <UserObject label="" mermaidId="e:E-&gt;F#0" mermaidBaseStyle="curved=1;startArrow=none;endArrow=block;endSize=7;strokeColor=light-dark(#333333,#cccccc);exitX=0;exitY=0.3888888888888889;entryX=1;entryY=0.3888888888888889;curved=1;exitX=0;exitY=0.39;entryX=1;entryY=0.39;" mermaidBaseValue="" id="f85zcJxW5xo5lILywIK8-16">
          <mxCell edge="1" parent="xHNrGeAP0ZefTl86ntIo-0" source="f85zcJxW5xo5lILywIK8-4" style="curved=1;startArrow=none;endArrow=block;endSize=7;strokeColor=light-dark(#333333,#cccccc);exitX=0;exitY=0.39;entryX=1;entryY=0.39;" target="f85zcJxW5xo5lILywIK8-3">
            <mxGeometry relative="1" as="geometry">
              <mxPoint as="offset" />
              <Array as="points">
                <mxPoint x="563" y="265" />
              </Array>
            </mxGeometry>
          </mxCell>
        </UserObject>
        <UserObject label="HTML in preview iframe" mermaidId="e:F-&gt;P#0" mermaidBaseStyle="curved=1;startArrow=none;endArrow=block;endSize=7;strokeColor=light-dark(#333333,#cccccc);html=1;fontSize=16;labelBackgroundColor=light-dark(#E8E8E88D,#2a2a2a8D);fontFamily=Trebuchet MS,Verdana,Arial,sans-serif;fontColor=light-dark(#333333,#cccccc);exitX=0.93;exitY=1;entryX=0;entryY=0.5;" mermaidBaseValue="HTML in preview iframe" id="f85zcJxW5xo5lILywIK8-17">
          <mxCell edge="1" parent="xHNrGeAP0ZefTl86ntIo-0" source="f85zcJxW5xo5lILywIK8-3" style="curved=1;startArrow=none;endArrow=block;endSize=7;strokeColor=light-dark(#333333,#cccccc);html=1;fontSize=16;labelBackgroundColor=light-dark(#E8E8E88D,#2a2a2a8D);fontFamily=Trebuchet MS,Verdana,Arial,sans-serif;fontColor=light-dark(#333333,#cccccc);exitX=0.93;exitY=1;entryX=0;entryY=0.5;" target="f85zcJxW5xo5lILywIK8-8">
            <mxGeometry relative="1" x="0.0827" y="-18" as="geometry">
              <mxPoint x="-3" as="offset" />
              <Array as="points">
                <mxPoint x="553" y="362" />
              </Array>
            </mxGeometry>
          </mxCell>
        </UserObject>
        <UserObject label="checkout session" mermaidId="e:E-&gt;S#0" mermaidBaseStyle="curved=1;startArrow=none;endArrow=block;endSize=7;strokeColor=light-dark(#333333,#cccccc);html=1;fontSize=16;labelBackgroundColor=light-dark(#E8E8E88D,#2a2a2a8D);fontFamily=Trebuchet MS,Verdana,Arial,sans-serif;fontColor=light-dark(#333333,#cccccc);exitX=1;exitY=0.7407407407407407;entryX=0;entryY=0.7407407407407407;curved=1;exitX=1;exitY=0.74;entryX=0;entryY=0.74;" mermaidBaseValue="checkout session" id="f85zcJxW5xo5lILywIK8-18">
          <mxCell edge="1" parent="xHNrGeAP0ZefTl86ntIo-0" source="f85zcJxW5xo5lILywIK8-4" style="curved=1;startArrow=none;endArrow=block;endSize=7;strokeColor=light-dark(#333333,#cccccc);html=1;fontSize=16;labelBackgroundColor=light-dark(#E8E8E88D,#2a2a2a8D);fontFamily=Trebuchet MS,Verdana,Arial,sans-serif;fontColor=light-dark(#333333,#cccccc);exitX=1;exitY=0.74;entryX=0;entryY=0.74;" target="f85zcJxW5xo5lILywIK8-9">
            <mxGeometry relative="1" as="geometry">
              <mxPoint as="offset" />
              <Array as="points">
                <mxPoint x="1049" y="382" />
              </Array>
            </mxGeometry>
          </mxCell>
        </UserObject>
        <UserObject label="signed webhook" mermaidId="e:S-&gt;E#0" mermaidBaseStyle="curved=1;startArrow=none;endArrow=block;endSize=7;strokeColor=light-dark(#333333,#cccccc);html=1;fontSize=16;labelBackgroundColor=light-dark(#E8E8E88D,#2a2a2a8D);fontFamily=Trebuchet MS,Verdana,Arial,sans-serif;fontColor=light-dark(#333333,#cccccc);exitX=0;exitY=0.2592592592592593;entryX=1;entryY=0.2592592592592593;curved=1;exitX=0;exitY=0.26;entryX=1;entryY=0.26;" mermaidBaseValue="signed webhook" id="f85zcJxW5xo5lILywIK8-19">
          <mxCell edge="1" parent="xHNrGeAP0ZefTl86ntIo-0" source="f85zcJxW5xo5lILywIK8-9" style="curved=1;startArrow=none;endArrow=block;endSize=7;strokeColor=light-dark(#333333,#cccccc);html=1;fontSize=16;labelBackgroundColor=light-dark(#E8E8E88D,#2a2a2a8D);fontFamily=Trebuchet MS,Verdana,Arial,sans-serif;fontColor=light-dark(#333333,#cccccc);exitX=0;exitY=0.26;entryX=1;entryY=0.26;" target="f85zcJxW5xo5lILywIK8-4">
            <mxGeometry relative="1" as="geometry">
              <mxPoint as="offset" />
              <Array as="points">
                <mxPoint x="1049" y="241" />
              </Array>
            </mxGeometry>
          </mxCell>
        </UserObject>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>

```

1. Sign in or register using Better Auth.
2. Submit a website brief. The API checks credits, creates a project and conversation entry, then asks the configured AI model to improve the prompt and generate HTML.
3. View the generated page in the project editor. Request a revision or select page elements for direct text/style editing.
4. Save the current HTML, download it as `index.html`, or publish/unpublish it. Published pages are viewable through the app.
5. The database stores project ownership, current code, conversation messages, and generated versions.

## Prerequisites

- Node.js **20.19+** or **22.12+**, as required by the installed Vite 8 release.
- npm (the repository contains separate `client` and `server` lockfiles).
- A PostgreSQL database and connection string. Any PostgreSQL-compatible provider can be used.
- Better Auth secret and public API URL.
- An OpenRouter API key for AI generation.
- Stripe secret and webhook secret if using credit purchases.

The project does not pin an npm version. Use the npm version bundled with a supported Node.js release.

## Installation

From PowerShell:

```powershell
git clone https://github.com/hilla10/ai-website-builder.git
Set-Location ai-website-builder
```

Install and configure the server:

```powershell
Set-Location server
npm ci
Copy-Item .env.example .env
```

Edit `server/.env` with your local PostgreSQL URL, Better Auth secret and URL, trusted client origin, and OpenRouter key. Then create/update the local schema and generate Prisma Client:

```powershell
npx prisma migrate deploy
npx prisma generate
```

For local schema development, use `npx prisma migrate dev --name describe-your-change` after editing `prisma/schema.prisma`.

In a second PowerShell terminal, install and configure the client:

```powershell
Set-Location path\to\ai-website-builder\client
npm ci
Copy-Item .env.example .env
```

Set `VITE_BASEURL` in `client/.env` to the server origin (default `http://localhost:3000`).

## Environment variables

The repository includes `server/.env.example` and `client/.env.example`. Keep real credentials in local `.env` files or your hosting provider's secret manager; do not commit them.

### Server (`server/.env`)

| Variable                |             Required | Purpose                                                                                    |
| ----------------------- | -------------------: | ------------------------------------------------------------------------------------------ |
| `DATABASE_URL`          |                  Yes | PostgreSQL connection string used by Prisma's PostgreSQL adapter and CLI                   |
| `BETTER_AUTH_URL`       |                  Yes | Base URL for the Better Auth server, normally the API origin                               |
| `BETTER_AUTH_SECRET`    |                  Yes | Private Better Auth signing/encryption secret                                              |
| `TRUSTED_ORIGINS`       | Yes for browser auth | Comma-separated allowed frontend origins; used by Express CORS and Better Auth             |
| `AI_API_KEY`            |   Yes for generation | Server-side OpenRouter API key; the provider base URL is set in `server/configs/openai.ts` |
| `PORT`                  |                   No | Express port; defaults to `3000`                                                           |
| `NODE_ENV`              |                   No | Set to `production` for production cookie attributes                                       |
| `STRIPE_SECRET_KEY`     |         For payments | Stripe secret key for Checkout and webhook operations                                      |
| `STRIPE_WEBHOOK_SECRET` |         For payments | Stripe endpoint signing secret for `/api/stripe`                                           |

Example values are placeholders only:

```dotenv
DATABASE_URL="postgresql://user:password@localhost:5432/ai_website_builder"
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="replace_with_a_long_random_secret"
TRUSTED_ORIGINS="http://localhost:5173"
AI_API_KEY="your_openrouter_api_key"
PORT=3000
NODE_ENV=development
STRIPE_SECRET_KEY="sk_test_your_key"
STRIPE_WEBHOOK_SECRET="whsec_your_secret"
```

### Client (`client/.env`)

Vite exposes `VITE_` variables to browser code. This URL is public; never put server keys in the client environment.

```dotenv
VITE_BASEURL="http://localhost:3000"
```

`VITE_BASEURL` is used by Axios and the Better Auth client. The code falls back to `http://localhost:3000` if it is omitted.

## Run and build

Start the backend in one terminal:

```powershell
Set-Location server
npm run dev
```

The Express server listens on `http://localhost:3000` by default. Start the Vite frontend in another terminal:

```powershell
Set-Location client
npm run dev
```

Vite normally serves the client at `http://localhost:5173`. Add this exact origin to `TRUSTED_ORIGINS`.

Available scripts:

| Directory | Command           | Effect                                        |
| --------- | ----------------- | --------------------------------------------- |
| `client`  | `npm run dev`     | Start Vite development server                 |
| `client`  | `npm run build`   | Type-check and create `client/dist`           |
| `client`  | `npm run preview` | Preview the production client build           |
| `client`  | `npm run lint`    | Run ESLint                                    |
| `server`  | `npm run dev`     | Run Express with `tsx` and nodemon            |
| `server`  | `npm start`       | Run Express with `tsx`                        |
| `server`  | `npm run build`   | Generate Prisma Client and run `tsc --noEmit` |

There is no root-level npm script or test script in either package manifest.

## Usage

1. Open the client and register or sign in.
2. Enter a specific website brief, for example:

   ```text
   Build a modern, responsive solar energy company website.
   Include a hero section, services, pricing, customer testimonials,
   an about section, and a contact form. Use accessible colors and
   mobile-friendly layouts.
   ```

3. Wait for the generated website to appear in the project editor. Use the conversation panel for AI changes, or select a rendered element to edit its text and styles directly.
4. Preview at phone, tablet, or desktop widths. Save changes before leaving.
5. Use **Download** to save the current page as `index.html`, or **Publish** to make it available in the app's community and `/view/:projectId` route.

Project creation and each AI revision cost 5 credits. The schema default for new users is 20 credits. Buying additional credits requires Stripe credentials and a configured webhook.

## API

All routes below are mounted on the Express server. Protected routes require a valid Better Auth session cookie; the frontend sends credentials. JSON request examples use `Content-Type: application/json`.

| Method   | Path                                          | Auth                   | Request                                          | Verified result                                                      |
| -------- | --------------------------------------------- | ---------------------- | ------------------------------------------------ | -------------------------------------------------------------------- |
| `GET`    | `/api/user/credits`                           | Session                | —                                                | `{ "credits": number }`                                              |
| `POST`   | `/api/user/project`                           | Session                | `{ "initial_prompt": "..." }`                    | `201 { "projectId": "..." }`; starts project generation              |
| `GET`    | `/api/user/project/:projectId`                | Session + owner        | —                                                | `{ "project": ... }`, with ordered conversation and versions         |
| `GET`    | `/api/user/projects`                          | Session                | —                                                | `{ "projects": [...] }` for current user                             |
| `GET`    | `/api/user/publish-toggle/:projectId`         | Session + owner        | —                                                | Toggles publication; `{ "isPublished": boolean, "message": "..." }`  |
| `POST`   | `/api/user/purchase-credits`                  | Session                | `{ "planId": "basic" \| "pro" \| "enterprise" }` | `{ "payment_link": "..." }`                                          |
| `POST`   | `/api/project/version/:projectId`             | Session + owner        | `{ "message": "..." }`                           | Creates an AI revision; `{ "message": "Changes made successfully" }` |
| `PUT`    | `/api/project/save/:projectId`                | Session + owner        | `{ "code": "<!doctype html>..." }`               | Saves current HTML; `{ "message": "Project Saved Successfully." }`   |
| `GET`    | `/api/project/rollback/:projectId/:versionId` | Session + owner        | —                                                | Sets current code to that version                                    |
| `DELETE` | `/api/project/:projectId`                     | Session + owner        | —                                                | Deletes the owned project                                            |
| `GET`    | `/api/project/preview/:projectId`             | Session + owner        | —                                                | `{ "project": ... }`, including versions                             |
| `GET`    | `/api/project/published`                      | Public                 | —                                                | `{ "projects": [...] }` of published projects                        |
| `GET`    | `/api/project/published/:projectId`           | Public, published only | —                                                | `{ "code": "..." }`                                                  |
| `POST`   | `/api/stripe`                                 | Stripe signature       | Raw Stripe event                                 | Handles `payment_intent.succeeded` and acknowledges the event        |

Better Auth also handles its own endpoints under `/api/auth/*`; see the [Better Auth documentation](https://www.better-auth.com/docs).

Example project creation:

```http
POST /api/user/project
Content-Type: application/json
Cookie: auth_session=...

{
  "initial_prompt": "Build a responsive coffee shop website with a menu and contact section."
}
```

The server returns the project ID while generation proceeds; retrieve the project again to read generated code and conversation updates.

## Project structure

```text
.
├── client/
│   ├── src/
│   │   ├── components/       # Navigation, project cards, editor, UI primitives
│   │   ├── configs/axios.ts  # API base URL and credentialed Axios instance
│   │   ├── lib/              # Better Auth client and shared utilities
│   │   ├── pages/            # Home, projects, preview, community, pricing, settings
│   │   ├── assets/           # Static and sample frontend assets
│   │   ├── App.tsx           # Browser routes
│   │   └── main.tsx          # React entry point
│   ├── vercel.json           # SPA rewrite
│   └── package.json
└── server/
    ├── configs/openai.ts     # OpenRouter-compatible OpenAI SDK client
    ├── controllers/          # User, project, and Stripe webhook handlers
    ├── lib/                  # Better Auth and Prisma setup
    ├── middlewares/          # Session authentication middleware
    ├── prisma/
    │   ├── migrations/       # PostgreSQL migration history
    │   └── schema.prisma     # Persistent data models
    ├── routes/               # User and project route definitions
    ├── server.ts             # Express app, CORS, auth, and route mounts
    ├── prisma7.config.ts     # Prisma CLI database configuration
    └── vercel.json           # Server function routing
```

## Data model

Prisma uses PostgreSQL. Main models and relations:

- **User:** Better Auth identity, `credits` (default 20), and `totalCreation`; owns projects, sessions, accounts, and payment transactions.
- **WebsiteProject:** Owner, initial prompt, current generated HTML, current version ID, publication flag, and timestamps.
- **Conversation:** User/assistant messages associated with a project; deleted with its project.
- **Version:** Generated HTML snapshots and optional description associated with a project; deleted with its project.
- **Transaction:** Stripe credit-purchase record with plan, amount, credit quantity, and payment status.
- **Session, Account, Verification:** Better Auth persistence tables.

Apply committed migrations with `npx prisma migrate deploy`; after schema changes, create a migration with `npx prisma migrate dev --name <name>`. `npm run build` in `server` runs Prisma Client generation.

## Deployment

The repository has separate Vercel configuration for the SPA (`client/vercel.json`) and Express API (`server/vercel.json`). Deploy them as separate Vercel projects, setting each project's root directory to its respective folder. The client config rewrites application routes to `/`; the server config routes requests to `server.ts`.

Before deploying:

1. Configure production environment variables for the API: PostgreSQL URL, Better Auth URL/secret, comma-separated trusted origin(s), and AI key. Add both Stripe secrets if credit purchases are enabled.
2. Set the client `VITE_BASEURL` to the deployed API origin and rebuild the frontend.
3. Set `TRUSTED_ORIGINS` to include the deployed client origin. Ensure it matches the origin used by the browser.
4. Run `npx prisma migrate deploy` against the production database and generate Prisma Client as part of the server build/deployment.
5. Configure the Stripe webhook endpoint at `<API origin>/api/stripe` and use its signing secret as `STRIPE_WEBHOOK_SECRET`.
6. Test registration, generation, saving, the public published-page route, and the Stripe callback in the target environment.

The configuration files do not establish that the supplied live demo or a new deployment is currently healthy. Confirm Vercel build logs, CORS, cookies, and environment settings in the target project.

## Troubleshooting

| Symptom                                      | Check                                                                                                                                              |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| API connection or browser CORS error         | Confirm `VITE_BASEURL`, server `PORT`, and that the exact client origin is in `TRUSTED_ORIGINS`.                                                   |
| Prisma cannot connect                        | Check `DATABASE_URL`, database availability/network access, and run migrations from `server`.                                                      |
| Missing generated Prisma Client              | Run `npx prisma generate` in `server`; the server build also invokes it.                                                                           |
| Authentication fails or cookies are missing  | Check `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `TRUSTED_ORIGINS`, HTTPS in production, and credentialed client requests.                           |
| AI generation fails                          | Check `AI_API_KEY`, OpenRouter access/quota, and model availability. Model IDs are currently fixed in the server controllers.                      |
| Insufficient credits                         | Generation and revisions each require 5 credits. Verify the user's stored balance; purchases require correctly configured Stripe keys and webhook. |
| Checkout completes but credits do not appear | Check the `/api/stripe` endpoint, webhook signing secret, and Stripe delivery logs.                                                                |
| Client route refresh returns 404             | Confirm the deployed client uses the SPA rewrite in `client/vercel.json`.                                                                          |

## Security

- Keep database, Better Auth, AI, and Stripe secrets only on the server. Any `VITE_` value is shipped to the browser.
- Authenticated user routes use Better Auth session checks and query projects by owner. Published-project endpoints are intentionally public.
- Set `TRUSTED_ORIGINS` narrowly to the exact allowed origins and use HTTPS in production.
- The current API validates that prompts and HTML are present but does not show comprehensive schema validation or rate limiting. Add these controls before exposing a production service broadly.
- Generated HTML is user/model-controlled content. The preview currently renders it through `iframe srcDoc` without a sandbox attribute; treat generated code as untrusted and review/isolate it before production use.
- Configure Stripe's webhook signing secret; do not rely on an unsigned payment callback.

## Contributing

1. Fork the repository and create a focused branch: `git switch -c feat/your-change`.
2. Install client and server dependencies with `npm ci` in each folder.
3. Make the change and run the relevant checks: `npm run lint` and `npm run build` in `client`, and `npm run build` in `server`.
4. Open a pull request describing the change and how it was verified. There are currently no test scripts in the package manifests.

Bug reports, feature ideas, and documentation improvements are welcome via [GitHub Issues](https://github.com/hilla10/ai-website-builder/issues).

## Roadmap

Ideas, not implemented features:

- Support additional AI providers and configurable models.
- Export complete multi-file project archives.
- Add richer visual customization and safer preview isolation.
- Add explicit version browsing and comparison.
- Enable collaborative editing and one-click hosting for generated sites.

## License

The project information identifies MIT as the intended license, `LICENSE` file. Add the MIT license text before distributing the repository as an MIT-licensed project. The `server/package.json` license field is package metadata and does not substitute for a repository license.

## Author and acknowledgments

**Hailemichael Nigusse** · [GitHub](https://github.com/hilla10) · [Portfolio](https://portfolio-rho-gules-15.vercel.app/)

Repository: [hilla10/ai-website-builder](https://github.com/hilla10/ai-website-builder)

Built with React, Vite, Tailwind CSS, Express, Prisma, PostgreSQL, Better Auth, OpenRouter, Stripe, and the open-source libraries listed in the package manifests.

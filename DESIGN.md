# Design system — Visitor Atlas

## Overview

A field atlas for a simulated visitor signal. The abstract projection and city register make the fixed-city demo legible without pretending to be geo analytics.

## Colors

- Atlas paper: #F1EEE5
- Ink: #1D2B2A
- Projection navy: #2B4457
- Land green: #7D9B74
- Marker orange: #D16C48
- Map ground: #DFE5D7
- Warm action: #F3D494

## Typography

- Display: Iowan Old Style / Palatino Linotype / Georgia.
- Data labels and counts: Courier New.
- Avenir Next carries explanatory copy and buttons.
- Orange is the signal marker; green describes land, not status.

## Layout

- Paper masthead and wide editorial hero.
- Navy console contains actions, abstract SVG projection, city register, and demo note.
- Markers live on one authored projection; the register exposes the same state in text.
- Mobile preserves the map before stacking the register.

## Elevation & Depth

Flat map and console surfaces only. Dot scale and color carry signal; no shadowed map cards.

## Shapes

Rectangular field, circular dots, square controls, and thin atlas rules.

## Components

- Atlas header: fixed-city and synthetic status.
- Projection: inline SVG grid, land shapes, and accessible marker titles.
- Simulation controls: add and clear.
- City register: selectable rows with count.
- Boundary note: explicit no-IP/no-live-data disclosure.

## Do’s and Don’ts

Do keep every marker traceable to the fixed city list. Do make simulation obvious.
Don’t imply a map provider, IP lookup, live audience, or geographic accuracy.


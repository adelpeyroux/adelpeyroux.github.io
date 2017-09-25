---
layout: post
title:  "Advanced Image Processing - Texture Synthesis"
image: ''
date:   2017-09-22 14:00:00 +0200
tags: 
- semester9 
- iap
- image
- processing
- mathlab
- octave
- texture synthesis
description: ''
categories:
- Semester 9
- Advanced Image Processing
- Advanced Image Processing Practice
---

[Lecture](https://moodle1.u-bordeaux.fr/pluginfile.php/304162/mod_resource/content/0/TextureSynthesis.pdf)

## Textures

Cela peut etre regulier et deterministe ou bien totalement aléatoire.

## Texture synthesis

Partir d'une petite image represantant une texture et en créer une plus grande perceptuellement similaire.

### Aproaches 

  * Physical simulation, on vient créer des modeles physiques qui represente nos textures pour les reconstruires.
  * Parametric feature matching. On calcul sur l'image d'example une distribution des couleurs pour reconstruire une image plus grande qui possede les mêmes distributions.
  * Non parametrix synthesis. B&sé sur les chaines de markov et les patch. Pour reconstruire un pixel, on regarde ce qu'il y a autour pouis on regarde dans l'image d'origine pour retrouver ce qui ressemble le plus.
  
## Markov chain

### Definition

  * On a une séquence de n variables a léatoires.
  * $$x _t$$ etat au temps t de la variable.
  * Markov assumption : chaque état ne depends que des états précedents.

## Digital Image Completion

### Diffusion

Isotropic diffusion : heat equation

// add equation 

  * $$ I _0 E \omega$$ is the input image
  * $$\Delta$$ id the gradient of the image // add formula
  * div is the divergence operator // add formula
  * $$ laplacian $$ is the Laplacian operator // add formula
  
Anisotropic diffusion

// add equation

  * c is an increasing function, controlling the amount of smoothing applied at pixel (x, y)

## Practice

[Article](http://graphics.cs.cmu.edu/people/efros/research/EfrosLeung.html)

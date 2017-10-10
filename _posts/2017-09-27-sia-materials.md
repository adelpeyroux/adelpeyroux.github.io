---
layout: post
title:  "Advanced Image synthesis - Materials"
image: ''
date:   2017-09-27 11:30:00 +0200
tags: 
- semester9 
- sia
- 
description: ''
categories:
- Semester 9
- Advanced Image Synthesis Courses
- Advanced Image Synthesis
---

# BRDF et au dela 

Plan : 

* Modelisation de l'apparence
  * Aperçu des modeles en CG
  * Modèles de reflectance (BRDF)
  * Mesures de la reflectance (BRDF)
  
## Apparence 

L'apparence depend de la position, drection, teps et longueur d'onde

Modelise : 
* Réflexion
* Transmission/Refraction
* Fluorescence et Phosphorescece
* Transluence / et effets volumiques (subsurface scattering)
* Transfers d'énergie entre longueurs d'ondes

Fonction à haute dimension -> Complexe à utiliser

## BSSRDF

[Jimenez 2010] Modelisation de la peau réaliste en temps réel

## SV-BRDF

Simplificatrion de la BSSRDF
* Pas de transmission / refraction ou subsurface scattering
* Dépendance angulaire et spatiales

## BRDF

Modelise comment le materiau réfléchit la lumiere

Aucune dépendance spatiale mais dépend de la longueur d'onde de la lumiere.






# TODO 

Contre exemple de pourquoi le modele de phong ne conserve pas l'energie.

$$ \int _{\phi = 0} ^{2 * \pi} \int _{\theta = 0} ^{\frac{\pi}{2}} cos(\theta) sin(\theta) d \theta d \phi  $$ 

Quel est le domaine de $$ \phi d$$ -> $$[0,\pi]$$


# ICI 


$$ D(N _1, N _2) = \sum _{p\ in\ N} { (R _1 (p) - R _2 (p)) ^2 + (G _1 (p) - G _2 (p)) ^2 + (B _1 (p) - B _2 (p)) ^2 } $$

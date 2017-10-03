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

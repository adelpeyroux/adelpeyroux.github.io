---
layout: post
title:  "Advanced Image synthesis - Shadow Volumes"
image: ''
date:   2017-12-21 11:30:00 +0200
tags: 
- semester9 
- sia
- real time
- OpenGl
- 3D
- c++
- shadow
- shadow volumes
description: ''
categories:
- Semester 9
- Advanced Image Synthesis Practice
- Advanced Image Synthesis
---

# TD6 : Shadow Volumes

## 1. Construction des volumes d'ombres

La création d'un shadow volume repose sur le principe suivant. On veux créer un volume representant le volume des ombres portées d'un modele sur la scene pour un lumiere donné. Le principe est de trouver la silhouette du maillage. La silhouette est ici la frontière sur un maillage entre les parties éclairées d'un maillage et les parties non éclairées. Pour construire un tel volume on va donc:

* Pour chaque arête du maillage: 
  * Déterminer si l'arête est sur la silhouete. Une arête est sur la silhouette si parmis les deux faces correspondantes à cette arête, une est éclairé et l'autre non. On determine si une face est éclairée ou non à l'aide du signe du cos term entre la direction de la lumiere et la normale de la face.
  * Si silhouette, alors on crée un quad à l'aide de l'arête et du projette à l'infini de cette dernière par rapport à la lumière.
  * Il faut faire attention ici à ce que la face soit construite dans le bon sens.

Ainsi on obtient : 

![wireframe](/assets/img/sia/td-shadow/volume.gif)

![fill](/assets/img/sia/td-shadow/fill.gif)

## 2. Comptage des entrées et sorties

Afin d'obtenir un rendu de la scene contenant il ombres portées il faut utiliser les volumes d'ombre précedement construits tel que: 

* Remplir de Depth Buffer en déssinant toute la géometrie de la scéne. Ici on viendra seulement dessiner la composante ambiante de la scène.
* Ensuite on vient mettre a jour le Stencil Buffer en dessinant les volumes d'ombres. Ainsi pour chaque quad orienté vers l'avant (en direction de la lumière) et passant le Depth Test on viens incémenter le Stencil Buffer. Inversement pour les quad orientés vers l'arriere.
* Enfin on viens redessiner l'ensemble de la scène après avoir reinitialisé le Depth Buffer en ignorant les fragment ayant des valeurs non nulles dans le Stencil Buffer. En faisant cela on viens desiiner toutes les parties éclairées de la scène.

Si on met a jours l'ensemble des volumes d'ombre de la scenes quand nos objets ou nos lumières bougent on obtient le résultat suivant: 

![final result](/assets/img/sia/td-shadow/shadow_volumes.gif)

### Liens utiles 

[Page du td](http://www.labri.fr/perso/pbenard/teaching/sia/td6.html)

[Archive contenant le code source](/assets/archives/sia/sia_td6_delpeyroux.zip)

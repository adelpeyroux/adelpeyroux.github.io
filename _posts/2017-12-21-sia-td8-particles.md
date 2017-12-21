---
layout: post
title:  "Advanced Image synthesis - Particles"
image: ''
date:   2017-12-21 9:30:00 +0200
tags: 
- semester9 
- sia
- real time
- OpenGl
- 3D
- c++
- physic simulation
- particles
description: ''
categories:
- Semester 9
- Advanced Image Synthesis Practice
- Advanced Image Synthesis
---

# TD8 : Système masse-ressort

## 1. Construction et résolution du systeme physique

Comme demandé dans le sujet les GravityForce, DragForce et Spring force on été implémenté à l'aide des formules trouvées dans le cours.

Ensuite il a fallut coder les differentes opérations nécessaire a la résolution du système de particules. Ces operation consitent au remplissage des matrices representant le systeme de particules et necessaires à sa résolution. Ensuite deux pas d'integration on été ajouté. Le permier un pas de Euleur simple qui déplace les particules le long de leurs vitesse selon un $$ \Delta t $$ et la méthode du point milieu. Cette derniere methode correspond a evaluer une integration d'euler point la moitier d'un pas de temps, evaluer la vitesse en ce point et appliquer un déplacement depuis la position d'origine selon la vitesse évalué juste avant selon un pas de temps. Ceci nous donne le résultat suivant pour notre grille de tissu.

![simple](/assets/img/sia/td-particles/simple.png)

## Ajout des collisions

Résultats des collisions entreles particules et un plan : 

![simple coll](/assets/img/sia/td-particles/simple-collision.png)

Afin de gerer la colision entre le systeme de particule et un model donné il faut: 
* Pour chaque particule: 
  * Lancer un rayon depuis sa position dans la direction de se vitesse.
  * Trouver l'intersection entre ce rayon et le Mesh.
  * Si intersection, il faut verifier que la particule soit sur la face où l'intersection doit avoir lieux.
  * Si oui, on calcul la réponse a cette collision et on l'applique.
  
La recherche de l'intersection entre le mesh et le rayon peut etre accelleré à l'aide d'un BVH. Néanmoins l'utilisation classique d'un BVH avec un rayon peut ne pas etre totallement efficace. En effet dans le cas où une particule est loin d'un model mais se deplace dans sa direction, un intersection inutile peut etre trouvée. Pour améliorer cela on peut immaginer chercher l'intersection que si la particule est suffisament proche du BVH.

![collision](/assets/img/sia/td-particles/collision.png) ![zoom](/assets/img/sia/td-particles/zoom.png)

![gif](/assets/img/sia/td-particles/gif.gif)

### Liens utiles 

[Cours](http://www.labri.fr/perso/pbenard/teaching/sia/slides/AnimPhysique.pdf)

[Page du td](http://www.labri.fr/perso/pbenard/teaching/sia/td8.html)

[Archive contenant le code source](/assets/archives/sia/sia_td8_delpeyroux.zip)

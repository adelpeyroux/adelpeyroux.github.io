---
layout: post
title:  "Advanced Image synthesis - Intro"
image: ''
date:   2017-09-06 11:00:00 +0200
tags: 
- semester9 
- sia
description: ''
categories:
- Semester 9
- Advanced Image Synthesis Courses
- Advanced Image Synthesis
---

(Projection violette)

[Pdf de ce cours](http://www.labri.fr/perso/pbenard/teaching/sia/slides/Introduction.pdf)

[Site très gentil :-)](http://www.scratchapixel.com)

## Introduction

[Site web de l'UE](http://www.labri.fr/perso/pbenard/teaching/sia/)

3 classes d'algorithmes de synthese d'image : 
	* Rendu temps réel
	* Rendu Hors ligne (temps maitrisé)
	* Rendu physiquement réaliste
	 
Problèmes à résoudre : 
  * Modélisation
  * Synthèse d'une image
  * Animer
	
Syllabus : (todo : mettre des liens vers les pages qui parleront de chaue sujet !!)
  * Rendus hors ligne :
    * [Integration de Monte Carlo](/sia-monte-carlo/)
    * Matériaux
    * Eclairage global
  * Rendu temps réel
    * Scenes complexes
    * Ombres portées
  * Rendu expressif
  * Géometrie et animation
    * Laplacien et interpolation poly harmoniques
    * Animation basé sur la physique
    * LOD
	  
Synthese d'image : 

On part d'un caméra virtuelle (un point de vue), elle est constituée d'un tableau de pixel, une position, orientation, résolution, ... .
Puis on utilise des models 3D (ensembles de points et de faces).

Problématique : Quelle est la couleur de chaque pixel de la grille de la caméra ?

Tout ceci sera parametré par un ensemble d'information comme : 
  * Les lumieres
  * les mateiraux
  * Le milieu ambiant  
  * ...
	
Simulation entre lumiere matiere et environnement.

Modeles physique / mathématiques 
  * Relativité générale (mécanique quantique)
  * Equations de Maxwell
  * Transfert radiatif (transport linéaire)
  * Eclairage global - Equation du rendu (optique géometrique)
	
### Equation du rendu
[Kajiya 1986]

\$\$ L(x,w) = L_e(x,w) + \int _{\Omega _n} L(x,w') <n.-w'> \varphi(x,-w',w) dw' $$

  * $$ L(x,w) $$ : Lumiere emise par le point x dans la direction w
  * $$ L_e(x,w) $$ : Lumiere propre emise par l'objet.
  * $$ L(x,w') $$: Lumiere arrivant au point x depuis w. demande d'integrer toute les reception de lumiere dans toutes les direction et de les ponderer.
  * $$ <n . -w'> $$ : cos-term
  * $$ \varphi(x, -w', w)$$ : BRDF : A quel point la sourface réflechi la lumiere.
	
Equation récursive trop couteuse à evaluer en temps réel. Ceci nous amene a l'aproximation de l'eclairege local (direct). Ce qui nous amene a l'équation suivante : 

\$\$ L(x,w) = \sum_l V _l (x) <n.-w'> \varphi(-w', w) $$

### Caméra réaliste : 

Camera simple = tete d'epingle ce qui n'est pas équivalent a une caméra realiste.
On peut venir simuler de "vrais" caméra.
Cela se traduit en integrant l'équation du rendus sur le temps et sur la surface de la lentille. 

\$\$ L(x,w) = \int _{surface} \int _t [ L_e(x,w) + \int _{\Omega _n} L(x,w') <n.-w'> \varphi(x,-w',w) dw' ] $$

### Réflexions : 

Reflexion dites glossy en integrant la reflexion dans un cone lors des reflexions

### Le realisme à tout prix ??

![gras](https://media.giphy.com/media/vPN3zK9dNL236/giphy.gif)




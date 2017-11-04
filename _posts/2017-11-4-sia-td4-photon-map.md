---
layout: post
title:  "Advanced Image synthesis - Photon Map"
image: ''
date:   2017-11-04 9:30:00 +0200
tags: 
- semester9 
- sia
- sampling
- montecarlo
- raycasting
- 3D
- C++
- Photon Map
description: ''
categories:
- Semester 9
- Advanced Image Synthesis Practice
- Advanced Image Synthesis
---

# TD4 - Photon Mapping

## 1. Émission et tracé des photons

Dans un premier temps il nous faut tracer l'ensemble des chemins lumineux en generant des photons depuis les sources lumineuses et en les "lançant" dans la scene. Ainsi de maniere aléatoire on vas selectionner une source lumineuse dans la scene. Cette source vas créer un photon qui sera positionné aléatoirement sur la surface de la source avec une direction échantilloné dans le demi hemisphere orientée dans le plan tangeant de la source. ensuite on "lance" ce photon dans la scene comme s'il s'agissait d'un rayon. Dans le cas d'un intersection plusieurs cas de figures se posent. Néanmoins dans tout les cas l'idée reste la même. En effet, quand un photon rencontre une surface on vas calculer une nouvelle direction ("rebond" du phonton) et l'energie que celui ci perd lors de cette "collision". Le calcul de la direction dépend de la nature de la surface intersectionnée: 

* Intersection avec une surface reflective (mirroir pur): On calcule la direction de reflection (grace à l'équation de snell descartes), l'energie absorder et on continue le chemin lumineux.
* Intersection avec une surface refractive:  On calcule la direction de réfraction dans la surface, l'energie absorder et on continue le chemin lumineux.
* Intersection avec une surface émissive: dans ce cas on arrete le chemin lumineux. Car, une surface emissive est une lampe (dans notre cas), et donc on peut supposé que des chemins lumineux seront lancé depuis cette lampe.
* Intersection avec une surface diffuse: On enregistre le photon courant dans une photon map. Ensuite on met à jours la direction en echantillonant selon la brdf sur un demi hemisphere et l'énergie puis on continue le chemin lumineux.

Comme critere d'arret de la continuation du chemin lumineux on met en place une roulette russe. Ce mécanisme d'arret est conditionner par un rapport entre l'energie entrante et l'energie sortante lors d'une intersection. Ainsi après chaque intersection, on calcule ce rapport, et on le compare a un nombre tiré aléatoirement. Si le rapport est supérieure au nombre obtenus alors on continue, sinon on stop le chemin lumineux et on tire un autre photon.

Afin de calculer l'energie sortante, on pondere l'energie entrante par la pdf, la brdf et le rapport entre les energies. Ainsi, l'energie diminue petit a petit tout le long du chemin lumineux. 

Tracer tout ces chemins lumineux dans la scène nous permet de construire une photon map qui contiendra l'emplacement de tout les photons avec des surfaces diffuses de la scene, la direction incidente du photon lors de l'intersection et l'énergie que le photon "dépose" sur la surface. Cette photon map nous sera utile dans la prochaine partie.

## 2. Estimation de la radiance

Afin de visualiser la scene, on vas lancer des rayons depuis la caméra de la même maniere que pour la méthode du Path Tracing. A la seule difference que quand un rayon intersecte une surface diffuse on viens chercher dans la photon map tout les photons proches du point d'intersection pour évaluer la radiance au point d'intersection. Dans le cas de surface emissive, reflectives ou refractives on continue le chemin de vue kusqua atteindre une surface diffuse ou atteindre le niveau de reccursion maximal. Quand on extrait de la photon map les photon proches on utilise les forumles suivante pour évaluer la radiance: 



\$\$ L_{o}(p \leftarrow \omega_o) \approx 
	\frac{1}{N~w^2} \sum_{i=0}^{N} K\left(\frac{p-p_i}{w}\right) ~ \Phi_i ~ \rho(p,\omega_o,\omega_i) $$

Où:
* \$$ 
  K(x) = 
	\begin{cases}
	  \frac{3}{\pi} \left(1-||x||^2 \right)^2 & \text{si } ||x|| \in [0,1] \\ 
	  0 & \text{sinon}
	\end{cases}
$$ 
* $$N$$ est le nombre de chemins lumineux.
* $$p$$ est le point d'intersection.
* $$p _i$$ est la position du photon extrait.
* $$\omega$$ le rayon de recherche des photons les plus proches.
* $$\Omega _i$$ l'énergie du photon.
* $$\rho (p, w _0, w _i)$$ la brdf du materiau.

## 3. Résultats

Voici les résultats de mon implémentation du photon map. À gauche on à 1 million de photons pour un rayon par pixel de la camera et à droite, 10 millions de photons et 5x5 rayons par pixel de la camera.

![pmap_1M_1x1](/assets/img/sia/td-pmap/cbox_pmap_1M_1x1.png)|![pmap_1M_1x1](/assets/img/sia/td-pmap/cbox_pmap_10M_5x5.png)

### Liens utiles 

[Page du td](http://www.labri.fr/perso/pbenard/teaching/sia/td4.html)

[Archive contenant le code source](/assets/archives/sia/sia_td4_delpeyroux.zip)

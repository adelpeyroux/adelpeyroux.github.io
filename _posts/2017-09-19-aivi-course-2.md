---
layout: post
title:  "Animated Image and Video Indexing - Course 2"
image: ''
date:   2017-09-19 10:15:00 +0200
tags: 
- semester9 
- iaiv
description: ''
categories:
- Semester 9
- Animated Image and Video Indexing
- Animated Image and Video Indexing - Courses
---

 Lecture of the day : [pdf file](http://dept-info.labri.fr/~benois-p/AnimImageVideoIndexIPCV2017_2018/Lecture2.pdf)
 
Pour calculer $$\sigma$$ on vient prendre des patchs dans des parties homogènes de l'imgae, la moyenne sera donc constantes et on poura donc evaluer e $$\sigma$$ comme il faut en utilisant la formule appropriée.
 
**Projected Motion** : Mouvement réel projeté dans l'espace de projection (plan focal).

**Observed Motion** : Mouvement obe=servé (mouvement de lumiere).

Avec cela on peut construire un champs de déplacement appellé **dense motion field**. C'est un champs vectoriel qui represente les mouvements dans l'image. On peut le dérivé pour obtenir le **velocity field**.

## Entropy 

L'entropy d'une variable aléatoire est : 

\$\$ H(X) = - \sum _{i = 0} ^{N - 1} p(x _i) log _2 p(x _i) $$

Ca caracterise l'ordre du system. Si une image est parfaitement constante on obtiens une entropy de 0. 

## Quantity of information 

\$\$ I(x _i) = - log _2 p(x _i) $$


## QI and Information coding/compression

Le **Theorom of Source Coding** exprime qu'il existe une limite haute de la quantitté d'information. Dans le cas d'une compression sans perte (lossless) cette limite est donnée par l'entropy de la source.

Ratio de compression : 

\$\$ \tho = \frac{Quantity of initial information}{Quantity of encoded information} $$

## Video Coding stadards

Tout les standars de compression sont construit sur le meme principe : **hybride video coding**

Voir schéma [page 33 de la lecture 1](http://dept-info.labri.fr/~benois-p/AnimImageVideoIndexIPCV2017_2018/Lecture1.pdf?page=33)


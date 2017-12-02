---
layout: post
title:  "TIM - Video Game - RadioGun"
image: ''
date:   2017-12-02 12:00:00 +0200
tags: 
- semester9 
- tim
- video game
- Unity
- tempo estimation
- Fm synthesis
description: ''
categories:
- Semester 9
- Musical Computing
---

# RadioGun

Ce jeu est une sorte de Metroid Vania like. On controle un personnage qui doit survivre à un flot d'enemis continus. Le build proposé reste très simple mais montre les principales briques de gameplay. 

## Gameplay : 

Le joueur se déplace à l'aides des touches : Up, Left, Right et Down.

On peut sauter avec la touche C et tirer avec la touche X.

Le principe fondamental du jeu est que l'ensemble des evenement in-game sont callés sur les pulsations de tempo. J'ai donc implémenté un estimateur de tempo, qui prend un fichier de musique estime le tempo et déclanche des evenements OnBeat sur les pulsations. De plus l'ensemble des bruitages est réalisé grace à de la synthese FM (tir du pistolet et ramassage des power-ups). Afin de renforcer l'effet de pulsation, certaines animation du décor sont commandés graces aux evenements OnBeat.

## Theme : La vie en Rose

On retrouve la theme du jeu dans l'ambiance chromatique du jeu. En effet, l'ensemble des elements sont roses/violets. De plus j'aurais aimé implementer un filtre de couleur rose sur l'ensemble des sons générés a l'aide de la synthese FM. 

## Il manque : 

Il manque a mon jeu des menus pour selectionner les niveaux et les musiques. Aussi l'ensemble des boucles de gameplay plus haut niveaux que du combat dans un simple écran (parcous d'un monde composées de niveaux). aussi il manque beaucoup de mécanique et d'interfaces.

Du coté technique, l'estimateur de tempo n'est pas tres robuste, il detecte souvent soit le double du tempo réel ou bien la moitié. Aussi il faudrait aligner les évenements OnBeat sur les pulsations de la musique. Et aussi rendre un peu plus robuste la synthese FM pour éviter des clics quand trop de son sont envoyés au synthetiseur.

## Links 

[Linux Build](/assets/archives/games/RadioGun_linux_build.zip)
[Win64 build](/assets/archives/games/RadioGun_win64_build.zip)

[Unity Project](/assets/archives/games/RadioGun.zip)

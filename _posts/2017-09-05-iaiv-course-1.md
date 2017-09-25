---
layout: post
title:  "Animated Image and Video Indexing - Course 1"
image: ''
date:   2017-09-05 10:15:00 +0200
tags: 
- semester9 
- iaiv
description: ''
categories:
- Semester 9
- Animated Image and Video Indexing
- Animated Image and Video Indexing - Courses
---

Lecture of the day : [pdf file](http://dept-info.labri.fr/~benois-p/AnimImagesIndexVideoIPCV2017_2018/Lecture1.pdf)

[Pr. Jenny Benois-Pineau](mailto://jenny.benois-pinneau@u-bordeaux.fr) at office : Building A30, room 272.
[Webpage for the UE](http://dept-info.labri.fr/~benois-p)

We will be in groups of three and we will have to analyse papers for presenting it to all the class.

## Introduction 

UGC : user generated content
Very used in medical imaging.

### Colour system : 

RGB system : 3 component additive system. Each component correspond in order at Red, Green, and Blue.

\$\$ C(x,y) = r(x,y) + g(x,y) + b(x,y) $$

It is used in video cameras RGB-D

Allows for a precise colour acquistion

But it is a correlated coulor system instead of systems that separate luminance and chrominance components like lab, YUV, ...

It existe linear transformations between coulor systems (using matrices)

If $$|FD(x, y, t)| >= Threshold$$ then the pixel (x,y) "is moving".
But, changemlent in illumination will may result in movment detection, and the choice of the threshold will be difficult.

To take in account these problems we will evaluate the minimum and maximum value for each pixel on a time interval equal \delta t and we will use them to compute a more accurate threshold. These max and mim will have to be updated over time.

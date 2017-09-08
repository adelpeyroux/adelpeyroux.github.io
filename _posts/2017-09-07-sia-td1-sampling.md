---
layout: post
title:  "Advanced Image synthesis - Sampling"
image: ''
date:   2017-09-07 9:30:00 +0200
tags: 
- semester9 
- sia
- sampling
- montecarlo
- raycasting
- 3D
- C++
description: ''
categories:
- Semester 9
- Advanced Image Synthesis Practice
- Advanced Image Synthesis
---


## Integration de Monte-Carlo 1D

J'utilise le code suivant afin d'evaluer l'integration de la fonction $$ f(x) = 5 x ^4 $$ : 

{% highlight c++ %}
double int_mc(double(*f)(double), double& varest, double a, double b, int n)
{
  double factor = 1. / n;
  double varest_factor = 1. / (n - 1);
  
  double result = 0.;
  double fx2 = 0.;
  varest = 0.;
  
  for (int i = 0; i < n; ++i) {
    double x = getX(a, b);

    double step_value = factor * f(x);
    fx2 += f(x) * f(x);  
    
    result += step_value;
  }

  varest = ((fx2 * factor) - (result * result)) * varest_factor;
  return result;
}
{% endhighlight %}

La fonction getX(double a, double b) retourne un double aléatoire compris entre a et b tel que : 

{% highlight c++ %}
double getX(double a, double b) {
  return (rand() / double(RAND_MAX)) * (b - a) + a;
}
{% endhighlight %} 

Ceci nous permet donc d'obtenir l'estimation de l'integrale de la fonction $$ f(x) $$ et sa variance estimée. Enfin pour obtenir sa variance analytique il nous faut integrer la formule suivante : 
<div class="center-me">
	$$
	\begin{align}
		\sigma ^2 & = \frac{1}{N} \int _0 ^1 (5 x^4 -1)^2 \, dx \\
		& = \frac{1}{N} \int _0 ^1 (25 x^8 - 10 x^4 + 1) \, dx \\
		& = \frac{1}{N} \left[\frac{25}{9} x^9 - \frac{10}{5} x ^5 + x \right]_0 ^1 \\
		& = \frac{1}{N} (\frac{25}{9} - 2 + 1) \\
		& = \frac{1}{N} * \frac{16}{9}
	\end{align}
	$$
</div>

## Anti-Aliasing

L'anti-aliasing a bien été implémenter en utilisant une grille réguliere et une jitterid grid pour integrer les différents rayons nécessaires. On peut voir dessous les resultats pour la scene **tw.scn** avec a gauche sans anti-aliasing, au centre celui utilisant la grille régulière et a droite celui stratifié (on ne parle pas de parquet ici).

![sans anti-aliasing](/assets/img/sia/td-sampling/tw.png)|![avec anti-aliasing](/assets/img/sia/td-sampling/tw-anti-aliasing.png)|![avec anti-aliasing](/assets/img/sia/td-sampling/tw-anti-aliasing-jitterid.png)

On peut aussi voir la difference entre les deux méthodes d'anti-aliasing avec des valeurs de **samples** differentes ci-dessous : 

![regular samples = 2](/assets/img/sia/td-sampling/deuxSpheres-regular-2.png)|![regular samples = 8](/assets/img/sia/td-sampling/deuxSpheres-regular-8.png)|![regular samples = 32](/assets/img/sia/td-sampling/deuxSpheres-regular-32.png)
![startified samples = 2](/assets/img/sia/td-sampling/deuxSpheres-startified-2.png)|![startified samples = 8](/assets/img/sia/td-sampling/deuxSpheres-startified-8.png)|![startified samples = 32](/assets/img/sia/td-sampling/deuxSpheres-stratified-32.png)


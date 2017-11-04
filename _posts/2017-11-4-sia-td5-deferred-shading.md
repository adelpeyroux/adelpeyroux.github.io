---
layout: post
title:  "Advanced Image synthesis - Deferred shading"
image: ''
date:   2017-11-04 9:30:00 +0200
tags: 
- semester9 
- sia
- real time
- OpenGl
- 3D
- c++
- deferred shading
description: ''
categories:
- Semester 9
- Advanced Image Synthesis Practice
- Advanced Image Synthesis
---

# TD5 : Deferred shading

# 1. Création et remplissage du g-buffer

Afin d'initialiser le FBO (ou g-buffer) on utilise le code source suivant. Dans notre cas on stocke les couleurs, les normales, les coéficients spéculaires et la profondeur dans deux textures. La premiere pour les couleurs et les coefficients spéculaires (rouge, vert, bleu, spéculaire) et la seconde pour les normales et les profondeurs ($$n _x$$, $$n _y$$, $$n _z$$, profondeur). Il faut néanmoins definir un buffer pour la profondeur afin que le DEPTH TEST s'execute comme il faut.

{% highlight c++ %}
	//1. generate a framebuffer object and bind it
    glGenFramebuffers(1, &_fboId);
    glBindFramebuffer(GL_DRAW_FRAMEBUFFER, _fboId);

    //2. init texture
    glGenTextures(2, textures);
    glGenRenderbuffers(1, &renderbuffer);

    for (int i = 0; i < 2; ++i) {
        // Bind the newly created texture
        glBindTexture(GL_TEXTURE_2D, textures[i]);

        // Give an empty image to OpenGL
        glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA32F, width, height, 0, GL_RGBA, GL_FLOAT, 0);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, (GLint)GL_NEAREST);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, (GLint)GL_NEAREST);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, (GLint)GL_CLAMP_TO_EDGE);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, (GLint)GL_CLAMP_TO_EDGE);

        glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0 + i, GL_TEXTURE_2D, textures[i], 0);
    }


    glBindRenderbuffer(GL_RENDERBUFFER, renderbuffer);
    glRenderbufferStorage(GL_RENDERBUFFER, GL_DEPTH_COMPONENT32F, width, height);
    glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_RENDERBUFFER, renderbuffer);

    //6. Set the list of draw buffers.
    GLenum DrawBuffers[2] = { GL_COLOR_ATTACHMENT0, GL_COLOR_ATTACHMENT1 };
    glDrawBuffers(2, DrawBuffers); // "1" is the size of DrawBuffers

    //7. check FBO status
    checkFBOAttachment();

    //8. switch back to original framebuffer
    glBindFramebuffer(GL_FRAMEBUFFER, 0);
    glBindTexture(GL_TEXTURE_2D, 0);
{% endhighlight %}

Grace à ce FBO, si on dessine la scene (toute la geometrie) dans ces buffers on obtient les resultats suivants: 

![collor buffer](/assets/img/sia/td-deferred/color.png) *Buffer des couleurs et coefs spéculaires* | ![normal buffer](/assets/img/sia/td-deferred/normal.png) *Buffer des normales et profondeurs*

# 2. Calcul de l'éclairage

Ainsi, dans les textures du FBO on a donc calculé toutes les informations nécessaire pour "rendre" la scene avec des lumieres. On vas donc utiliser toutes ces informations pour calculer l'éclairage sans devoir tout recalculer pour toute la geometrie (toute la partie du pipeline OpenGL dédié aux sommets et aux primitives). Ainsi dans un second temps on viens juste dessiner, pour chaque lumière, un quad de la même taille que l'affichage afin de generer un fragment par pixel. Grace a ceci on peut facilement évaluer le rendu final de la scene en piochant toutes les informations nécessaires dans le FBO et en calculant l'éclairage pour chaque lampes les une apres les autres. Afin de pouvoir afficher l'eclairage de pludieurs lampes, il faut activer le BLEND et ainsi additioner toute les contributions lumineuses en les ajoutant les unes aux autres.

{% highlight c++ %}
	_fbo.bind();
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);


    _gbufferPrg.activate();

    // draw meshes into the fbo
    for(int i=0; i<_shapes.size(); ++i)
    {
        ...
    }
    _gbufferPrg.deactivate();

    _fbo.unbind();

    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    glEnable (GL_BLEND);
    glBlendEquation (GL_FUNC_ADD);
    glBlendFunc (GL_ONE, GL_ONE);

    glDisable(GL_DEPTH_TEST);
    for (int i = 0; i < 4; ++i) {
        // Update light number i
		...

        _deferredPrg.activate();

	    // Render the quad with the deferred shaders
		// these shaders pick the information into the fbo textures
		// and compute the light for all visible fragments

        _deferredPrg.deactivate();
    }
    glEnable(GL_DEPTH_TEST);
    glDisable(GL_BLEND);

	// draw lights in the scene
    for (int i = 0; i < 4; ++i) {
        ...
    }
{% endhighlight %}

Pour 4 lampes on obtien le résultat suivant (pas très convaincant).

![deferred](/assets/img/sia/td-deferred/deferred.png)

De plus il me semble qu'il y a quelque chose qui cloche avec mon implementation sans pouvoir mettre la main dessus.

### Liens utiles 

[Page du td](http://www.labri.fr/perso/pbenard/teaching/sia/td5.html)

[Archive contenant le code source](/assets/archives/sia/sia_td5_delpeyroux.zip)

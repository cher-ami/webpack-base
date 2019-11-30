// todo : SOLID doc pour les différents dégradé implémenter + throw error si pDirection pas bon

export enum GradientTypes {
  LINEAR,
  RADIAL
}

export class BitmapUtils {
  /**
   * Générer un bitmap dégradé
   * @param pWidth Largeur de l'image
   * @param pHeight Hauteur de l'image
   * @param pColorStops Liste des couleurs (premier index étant la position du dégradé entre 0 et 1, et en second index la couleur)
   * @param pGradientType Linear or radial gradient. Look for enum GradientTypes on module BitmapUtils.
   * @param pDirection Direction du dégradé comme suit : x0 y0 x1 y1
   * @returns Le dégradé sous forme d'élément canvas
   */
  static generateGradient(
    pWidth: number,
    pHeight: number,
    pColorStops: any[][],
    pGradientType: GradientTypes,
    pDirection: number[] = [0, 0, pWidth, pHeight]
  ): HTMLCanvasElement {
    // Créer le canvas aux bonnes dimensions
    var canvas = document.createElement("canvas");
    canvas.width = pWidth;
    canvas.height = pHeight;

    // Récupérer le contexte 2D
    var context = canvas.getContext("2d");

    // Dessiner sur toute la surface
    context.rect(0, 0, pWidth, pHeight);

    var gradient;

    if (pGradientType == GradientTypes.RADIAL) {
      pDirection[0] = pWidth / 2;
      pDirection[1] = pHeight / 2;
      pDirection[2] = Math.min(pWidth, pHeight) / 2;

      gradient = context.createRadialGradient(
        pDirection[0],
        pDirection[1],
        0,
        pDirection[0],
        pDirection[1],
        pDirection[2]
      );
    } else if (pGradientType == GradientTypes.LINEAR) {
      if (pDirection.length != 4) {
        // todo : throw error
      }

      // Créer le dégradé linéaire
      gradient = context.createLinearGradient(
        pDirection[0],
        pDirection[1],
        pDirection[2],
        pDirection[3]
      );
    } else {
      // todo : throw error
    }

    // Ajouter chaque stop
    for (var i in pColorStops) {
      gradient.addColorStop(pColorStops[i][0], pColorStops[i][1]);
    }

    // Dessiner
    context.fillStyle = gradient;
    context.fill();

    // Retourner le canvas
    return canvas;
  }

  // todo : doc

  static generateText(
    pText: string,
    pWidth: number,
    pHeight: number,
    pFont: string = "12px Arial",
    pColor: string = "black",
    pAlign: string = "left",
    pVerticalOffset: number = 1
  ): HTMLCanvasElement {
    // Créer le canvas aux bonnes dimensions
    var canvas = document.createElement("canvas");

    // Définir la taille
    canvas.width = pWidth;
    canvas.height = pHeight;

    // Récupérer le contexte 2D
    var context = canvas.getContext("2d");

    // Configurer le texte
    context.font = pFont;
    context.textBaseline = "top";
    context.fillStyle = pColor;
    context.textAlign = pAlign;

    var horizontalOffset = 1;

    if (pAlign.toLowerCase() == "center") {
      horizontalOffset = pWidth / 2;
    }

    // Ecrire le texte
    context.fillText(pText, horizontalOffset, pVerticalOffset);

    // Retourner le canvas
    return canvas;
  }

  /**
   * Create canvas from multiline text.
   * Height will be auto from fixed width.
   * Width and height will be defined on canvas object.
   * @param pText text to print on canvas
   * @param pMaxWidth max-width in pixel of the text. If the text overlaps this width, it warps.
   * @param pLineHeight distance between the lines, in pixel.
   * @param pFont size and font name of the text
   * @param pColor color of the text
   * @param pAlign alignement of the text left/center/right
   * @param pPadding Padding arround text to avoid bleeding
   * @returns {HTMLCanvasElement}
   */
  static generateMultilineText(
    pText: string,
    pMaxWidth: number,
    pLineHeight: number,
    pFont: string = "12px Arial",
    pColor: string = "black",
    pAlign: string = "left",
    pPadding = 2
  ): HTMLCanvasElement {
    // Create canvas and get 2D context
    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");

    // Configure text drawing
    context.font = pFont;
    context.textBaseline = "top";
    context.fillStyle = pColor;
    context.textAlign = pAlign;

    // Split text in words to get auto line breaks
    let words = pText.split(" ");
    let currentLine = "";
    let lines = [];

    // Get final height of the canvas
    let y = pPadding;
    for (let n = 0; n < words.length; n++) {
      // Add a word at end of line
      let testLine = currentLine + words[n] + " ";
      let metrics = context.measureText(testLine);
      let testWidth = metrics.width;

      // If we get too much width
      if (testWidth > pMaxWidth - pPadding * 2 && n > 0) {
        // Register line for drawing
        lines.push(currentLine);

        // Reset next line and add last word to next line
        currentLine = words[n] + " ";

        // Break line
        y += pLineHeight;
      }

      // Still not filling all current line
      else {
        // Test next word on same line
        currentLine = testLine;
      }
    }

    // Register last line for drawing
    lines.push(currentLine);

    // Set canvas size before re-setting context options
    canvas.width = pMaxWidth;
    canvas.height = y + pPadding + pLineHeight;

    // Configure text drawing options now our canvas is resized
    context.font = pFont;
    context.textBaseline = "top";
    context.fillStyle = pColor;
    context.textAlign = pAlign;

    // Set offset in order to match the alignement rule
    const offset = pAlign == "center" ? canvas.width / 2 : pPadding;

    // Draw lines on canvas
    y = pPadding;
    for (let n = 0; n < lines.length; n++) {
      context.fillText(lines[n], offset, n * pLineHeight);
    }

    // Return filled canvas
    return canvas;
  }

  /**
   * Fit une image dans un canvas à la manière d'un background-cover centré.
   * Version modifié du code trouvé ici : https://sdqali.in/blog/2013/10/03/fitting-an-image-in-to-a-canvas-object/
   * @param pImage L'objet Image à dessiner sur le canvas
   * @param pCanvasWidth La largeur du canvas (cadre) généré
   * @param pCanvasHeight La hauteur du canvas (cadre) généré
   * @param pFitMethod "cover" pour laisser dépasser l'image du cadre, "contain" pour ajouter des bordures
   * @param pBackgroundColor La couleur de fond, "transparent" par défaut.
   */
  static generateFitCanvasTexture(
    pImage:
      | HTMLImageElement
      | HTMLCanvasElement
      | HTMLVideoElement
      | ImageBitmap,
    pCanvasWidth: number,
    pCanvasHeight: number,
    pFitMethod = "cover",
    pBackgroundColor = "transparent"
  ) {
    // On crée un nouveau canvas et on récupère son contexte
    const canvas = document.createElement("canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d");

    // On set le canvas avec la taille donnée en paramètre
    canvas.width = pCanvasWidth;
    canvas.height = pCanvasHeight;

    // On détermine les ratios du canvas et de l'image
    const imageAspectRatio = pImage.width / pImage.height;
    const canvasAspectRatio = canvas.width / canvas.height;

    // point de départ de la zone a dessiner sur le canvas
    let xStart = 0;
    let yStart = 0;

    // dimensions de la zone à dessiner sur le canvas
    let renderableWidth = canvas.width;
    let renderableHeight = canvas.height;

    /**
     * Deux cas de figure : cover / contain. Dans les deux cas, on compare le ratio de l'image au ratio du canvas.
     * cover : si le ratio de l'image est plus grand que le canvas, on fit à la hauteur et on centre en largeur, sinon, l'inverse.
     * contain : si le ratio de l'image est moins grand que le canvas, on on fit à la hauteur et on centre en largeur, sinon l'inverse
     */
    if (pFitMethod == "cover") {
      if (imageAspectRatio > canvasAspectRatio) {
        renderableHeight = canvas.height;
        renderableWidth = pImage.width * (renderableHeight / pImage.height);
        xStart = (canvas.width - renderableWidth) / 2;
        yStart = 0;
      } else if (imageAspectRatio < canvasAspectRatio) {
        renderableWidth = canvas.width;
        renderableHeight = pImage.height * (renderableWidth / pImage.width);
        xStart = 0;
        yStart = (canvas.height - renderableHeight) / 2;
      }
    } else if (pFitMethod == "contain") {
      if (imageAspectRatio < canvasAspectRatio) {
        renderableHeight = canvas.height;
        renderableWidth = pImage.width * (renderableHeight / pImage.height);
        xStart = (canvas.width - renderableWidth) / 2;
        yStart = 0;
      } else if (imageAspectRatio > canvasAspectRatio) {
        renderableWidth = canvas.width;
        renderableHeight = pImage.height * (renderableWidth / pImage.width);
        xStart = 0;
        yStart = (canvas.height - renderableHeight) / 2;
      }
    }

    // On rempli avec la couleur de fond
    context.fillStyle = pBackgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // On dessine l'image et on retourne le canvas
    context.drawImage(
      pImage,
      xStart,
      yStart,
      renderableWidth,
      renderableHeight
    );
    return canvas;
  }
}

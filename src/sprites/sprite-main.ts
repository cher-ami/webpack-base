/**
 * @copyright Original by Alexis Bouhet - https://zouloux.com
 * @copyright Adapted by Willy Brauner - https://willybrauner.com
 */

/**
 * This is a generated file. Do not modify.
 */

export interface ITexture {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ISprite {
  name: string;
  prefix: string;
  width: number;
  height: number;
  path: string;
  seed: string;

  textures: { [index: string]: ITexture };
}

export const SpriteData: ISprite = {
  name: "main",
  prefix: "sprite-main",

  width: 50,
  height: 32,

  path: "sprite-main.png",
  seed: "211cda6e5751001736c884de2",

  textures: {
    "network-icon-instagram": {
      x: 1,
      y: 1,
      width: 30,
      height: 30,
    },
    "network-icon-facebook": {
      x: 33,
      y: 1,
      width: 16,
      height: 30,
    },
  },
};

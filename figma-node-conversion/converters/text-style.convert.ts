import { FontWeight, TextStyleManifest } from "@reflect-ui/core";
import { convertFontStyleToReflect } from "./font-style.convert";
import { inferFontWeight } from "@reflect-ui/font-utils";
import { convertLetterSpacingToReflect } from "./letter-spacing.convert";
import { figma_lineheight_to_reflect_ling_height } from "./line-height.convert";
import { convertTextDecorationToReflect } from "./tetx-decoration.convert";
import { TextStyle, TextNode, LetterSpacing } from "@design-sdk/figma-types";
import type { ReflectTextNode } from "@design-sdk/figma-node";

export function convertTextStyleToReflect(
  origin: TextStyle,
  node?: TextNode
): TextStyleManifest {
  return {
    name: origin.name,
    fontFamily: origin.fontName.family,
    fontWeight: inferFontWeight(origin.fontName.style),
    fontStyle: convertFontStyleToReflect(origin.fontName),
    fontSize: origin.fontSize,
    wordSpacing: undefined, // non-figma property
    decoration: convertTextDecorationToReflect(origin.textDecoration),
    decorationStyle: undefined,
    decorationThickness: undefined,
    // TODO: fixme
    // @ts-ignore
    letterSpacing: convertLetterSpacingToReflect(
      origin.letterSpacing as LetterSpacing
    ),
    lineHeight: figma_lineheight_to_reflect_ling_height(origin.lineHeight),
    color: undefined, // non-figma property (figma does not contain color to text style)
  };
}

export function extractTextStyleFromTextNode(
  origin: ReflectTextNode
): TextStyleManifest {
  let _fontFamily = origin.fontName?.family;
  let _fontWeight = inferFontWeight(origin.fontName?.style);
  if (!origin.fontName) {
    // TODO: add warning system.
    // console.warn("this might be a bug (or by multiple textstyle). no fontName was found in text node. the text node was", origin);
    // console.info('since no fontName was provided, falling back to "Roboto Regular"');

    _fontFamily = "Roboto";
    _fontWeight = FontWeight.normal;
  }

  return {
    name: undefined,
    fontFamily: _fontFamily,
    fontWeight: _fontWeight,
    fontStyle: convertFontStyleToReflect(origin.fontName),
    fontSize: origin.fontSize,
    wordSpacing: undefined, // non-figma property
    decoration: origin.textDecoration,
    decorationStyle: undefined,
    decorationThickness: undefined,
    // TODO: fixme
    // @ts-ignore
    letterSpacing: convertLetterSpacingToReflect(
      origin.letterSpacing as LetterSpacing
    ),
    lineHeight: origin.lineHeight,
    color: origin.primaryColor,
  };
}

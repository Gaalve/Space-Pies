package de.tu_berlin.Converter;

public class AtlasRegion {
    public final String fileName;
    public final boolean rotated;
    public final boolean trimmed;
    public final int srcW;
    public final int srcH;

    public final int spriteSrcX;
    public final int spriteSrcY;
    public final int spriteSrcW;
    public final int spriteSrcH;

    public final int frameX;
    public final int frameY;
    public final int frameW;
    public final int frameH;

    public AtlasRegion(String fileName, boolean rotated, boolean trimmed, int srcW, int srcH, int spriteSrcX,
                     int spriteSrcY, int spriteSrcW, int spriteSrcH, int frameX, int frameY, int frameW, int frameH) {
        this.fileName = fileName;
        this.rotated = rotated;
        this.trimmed = trimmed;
        this.srcW = srcW;
        this.srcH = srcH;
        this.spriteSrcX = spriteSrcX;
        this.spriteSrcY = spriteSrcY;
        this.spriteSrcW = spriteSrcW;
        this.spriteSrcH = spriteSrcH;
        this.frameX = frameX;
        this.frameY = frameY;
        this.frameW = frameW;
        this.frameH = frameH;
    }
}

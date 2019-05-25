package de.tu_berlin.Converter;


import com.badlogic.gdx.tools.texturepacker.TexturePacker;
import org.json.JSONWriter;

import javax.swing.plaf.synth.Region;
import java.io.*;
import java.util.ArrayList;

public class Main {

    public static void main(String[] args){
//        parsePackAtlasToJSON("./src/game-base/assets");
        String path = "./src/game-base/assets/sprites/";
        String outPath = "./src/game-base/assets/atlas/";
        try {
            TexturePacker.main(new String[]{path, outPath});
        } catch (Exception e) {
            e.printStackTrace();
        }
        parsePackToJSON(outPath);
    }

    public static void parsePackToJSON(String path){
        AtlasFile af = parsePackToFile(path);
        try {
            PrintWriter pw = new PrintWriter(path+"pack.json");
            JSONWriter writer = new JSONWriter(pw);
            writer.object().key("textures")
                    .array().object()
                        .key("image").value(af.meta.name)
                        .key("format").value(af.meta.format)
                        .key("size").object()
                            .key("w").value(af.meta.w)
                            .key("h").value(af.meta.h)
                        .endObject()
                        .key("scale").value(af.meta.scale)
                        .key("frames")
                        .array();

            for (AtlasRegion ar : af.regions){
                writer.object()
                        .key("filename").value(ar.fileName)
                        .key("rotated").value(ar.rotated)
                        .key("trimmed").value(ar.trimmed)
                        .key("sourceSize").object()
                            .key("w").value(ar.srcW)
                            .key("h").value(ar.srcH)
                        .endObject()
                        .key("spriteSourceSize").object()
                            .key("x").value(ar.spriteSrcX)
                            .key("y").value(ar.spriteSrcY)
                            .key("w").value(ar.spriteSrcW)
                            .key("h").value(ar.spriteSrcH)
                        .endObject()
                        .key("frame").object()
                            .key("x").value(ar.frameX)
                            .key("y").value(ar.frameY)
                            .key("w").value(ar.frameW)
                            .key("h").value(ar.frameH)
                        .endObject()
                    .endObject();
            }
            writer.endArray().endObject().endArray().endObject();
            pw.flush();
            pw.close();

        } catch (IOException e) {
            e.printStackTrace();
        }



//        try {
//            PrintWriter pw = new PrintWriter(path+"pack.json");
//            JSONWriter writer = new JSONWriter(pw);
//            writer.object().key("textures").array().object().
//                    key("image").value("mock.png")
//                    .key("format").value("RGBA8888")
//                    .key("size").object()
//                        .key("w").value(1620)
//                        .key("h").value(1320).endObject()
//                    .key("scale").value(1)
//                    .key("frames").array()
//                        .object().key("filename").value("mehe").endObject()
//                    .endArray()
//                    .endObject()
//                    .endArray()
//                    .endObject();
//
//            pw.flush();
//            pw.close();
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
    }

    public static AtlasFile parsePackToFile(String path){
        path += "pack.atlas";
        return new AtlasFile(parsePackToMeta(path), parsePackToRegions(path));
    }

    public static AtlasMeta parsePackToMeta(String path){
        try(BufferedReader br = new BufferedReader(new FileReader(path))) {
            int idx = 0;
            String imgName = "None";
            int[] size = new int[2];
            String format = "None";

            for(String line; (line = br.readLine()) != null; idx++) {
                if(idx > 0){
                    if(idx > 5) break;
                    switch (idx){
                        case 1: imgName = line;
                            break;
                        case 2:
                            String[] sizeAsString = line.split(":")[1].split(",");
                            size[0] = Integer.parseInt(sizeAsString[0].trim());
                            size[1] = Integer.parseInt(sizeAsString[1].trim());
                            break;
                        case 3:
                            format = line;
                            break;
                        default:
                    }
                }
            }
            return new AtlasMeta(imgName, format, size[0], size[1], 1);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static AtlasRegion[] parsePackToRegions(String path){
        ArrayList<AtlasRegion> regionList = new ArrayList<>();
        try(BufferedReader br = new BufferedReader(new FileReader(path))) {
            int idx = 0;

            for(String line; (line = br.readLine()) != null; idx++) {
                if(idx > 4) break; //skip first 4 lines (meta)
            }
            idx = 0;
            String[] regionLines = new String[7];
            for(String line; (line = br.readLine()) != null; idx++) {
                regionLines[idx] = line;
                if(idx == 6){
                    idx = -1;
                    regionList.add(parsePackLinesToRegion(regionLines));
                }
            }
            AtlasRegion[] regions = new AtlasRegion[regionList.size()];
            return regionList.toArray(regions);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static AtlasRegion parsePackLinesToRegion(String[] lines){
        if(lines.length != 7)return null;
//        int idx = 0;
//        for (String line: lines) System.out.println(idx++ + line);
        return new AtlasRegion(
                lines[0],
                Boolean.parseBoolean(lines[1].split(":")[1].trim()),
                false,
                Integer.parseInt(lines[3].split(":")[1].split(",")[0].trim()),
                Integer.parseInt(lines[3].split(":")[1].split(",")[1].trim()),
                0,0,
                Integer.parseInt(lines[3].split(":")[1].split(",")[0].trim()),
                Integer.parseInt(lines[3].split(":")[1].split(",")[1].trim()),
                Integer.parseInt(lines[2].split(":")[1].split(",")[0].trim()),
                Integer.parseInt(lines[2].split(":")[1].split(",")[1].trim()),
                Integer.parseInt(lines[3].split(":")[1].split(",")[0].trim()),
                Integer.parseInt(lines[3].split(":")[1].split(",")[1].trim())
        );
    }
}

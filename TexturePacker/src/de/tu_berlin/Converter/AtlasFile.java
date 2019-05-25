package de.tu_berlin.Converter;

import java.util.List;

public class AtlasFile {
    public final AtlasMeta meta;
    public final AtlasRegion[] regions;

    public AtlasFile(AtlasMeta meta, AtlasRegion[] regions) {
        this.meta = meta;
        this.regions = regions;
    }
}

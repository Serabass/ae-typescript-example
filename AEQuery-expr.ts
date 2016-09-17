class AEQueryExpr extends JQuery<Layer> {

    constructor(query:(...args) => JQuery<Layer>) {
        super(query);
    }

    public expr:JQueryExpr = {

        text: layer => layer instanceof TextLayer,
        av: layer => layer instanceof AVLayer,

        even: layer => layer.index % 2 === 0,
        odd: layer => layer.index % 2 !== 0,
        first: layer => layer.index === 1,
        last: layer => layer.index === layer.containingComp.numLayers,

        '3d': layer => (<AVLayer>layer).threeDLayer,
        threeD: layer => (<AVLayer>layer).threeDLayer,
        shy: layer => layer.shy,
        solo: layer => layer.solo,
        selected: layer => layer.selected,
        locked: layer => layer.locked,
        enabled: layer => layer.enabled,
        guide: layer => (<AVLayer>layer).guideLayer,

        motionBlur: layer => (<AVLayer>layer).motionBlur,
        adjustment: layer => (<AVLayer>layer).adjustmentLayer,
        audioActive: layer => (<AVLayer>layer).audioActive,
        audioEnabled: layer => (<AVLayer>layer).audioEnabled,
        effectsActive: layer => (<AVLayer>layer).effectsActive,
        hasVideo: layer => layer.hasVideo,
        hasTrackMatte: layer => (<AVLayer>layer).hasTrackMatte,
        'null': layer => layer.nullLayer,
        timeRemapEnabled: layer => (<AVLayer>layer).timeRemapEnabled,
        trackMatte: layer => (<AVLayer>layer).isTrackMatte,
        hasParent: layer => (<AVLayer>layer).parent !== null,

        // Make 2n too (like CSS) for get, e.g., every 3rd element
        nth: (layer, range:AEQRange | Nth) => {
            if (range instanceof AEQRange)
                return (<AEQRange>range).contains(layer.index);

            if (range instanceof Nth)
                return (<Nth>range).check(layer.index);

            throw "123123123";
        },

        within: (layer, time1:Time, time2?:Time) => {
            if (time2 === void 0)
                return layer.inPoint === time1.value;

            return layer.inPoint >= time1.value && layer.inPoint <= time2.value
                && layer.outPoint >= time1.value && layer.outPoint <= time2.value;
        },

        starts: (layer, time1:Time, time2?:Time) => {
            if (time2 === void 0)
                return layer.inPoint === time1.value;

            return layer.inPoint >= time1.value && layer.inPoint <= time2.value;
        },

        ends: (layer, time1:Time, time2?:Time) => {
            if (time2 === void 0)
                return layer.outPoint === time1.value;

            return layer.outPoint >= time1.value && layer.outPoint <= time2.value;
        },

        light: (layer) => layer instanceof LightLayer,
        shape: (layer) => layer instanceof ShapeLayer,
        camera: (layer) => layer instanceof CameraLayer,

        before: (layer, selector:JQuerySelector) => {
            throw "Under construction";
        },

        after: (layer, selector:JQuerySelector) => {
            throw "Under construction";
        }
    };

}
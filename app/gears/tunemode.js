var AWFUL_COLORS = [
    "#FF7300",
    "#FF00BF",
    "#7af800",
    "#ff00ff",
    "#ff9966",
    "#00ff00",
    "#81F7BE",
    "#ffff00",
    "#b4aeff",
    "#ffff66",
    "#00ffcc",
    "#fa85d6",
    "#33cc33",
    "#FFF4A3",
    "#d7afe6",
    "#B48925",
    "#56FF00",
    "#6A7E25"
];

export var getAwfulColor = function() {
    return AWFUL_COLORS[Math.floor(Math.random()*AWFUL_COLORS.length)];
};

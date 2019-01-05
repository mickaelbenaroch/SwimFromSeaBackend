class ResultModel {
    constructor(name, radius, medals,fillKey, beachVolleyball,diving,other,rowing,sailing,swimming,waterPolo,latitude,longitude) {
        this.name = name || null;
        this.radius = radius || null;
        this.medals = medals || null;
        this.country = name || null;
        this.fillKey = fillKey || null;
        this.beachVolleyball = beachVolleyball || 0;
        this.diving = diving || 0;
        this.other = other || 0;
        this.rowing = rowing || 0;
        this.sailing = sailing || 0;
        this.swimming = swimming || 0;
        this.waterPolo = waterPolo || 0;
        this.latitude = latitude || null;
        this.longitude = longitude || null;
    }
}

module.exports =  ResultModel;

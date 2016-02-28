// Nasty little hack, to keep down on requests
var itemEndpoint="https://public-crest.eveonline.com/types/";

var outputTree;

function loadItem(typeID) {
    lookupUrl=itemEndpoint+typeID+"/";
    $.getJSON(lookupUrl,function(data){
        formatOutput(data);
    });
}





function formatOutput(itemData) {
    attributeTree=Array();
    for (attribute=0; attribute < itemData.dogma.attributes.length;attribute++){
        attributeTree[itemData.dogma.attributes[attribute].attribute.id]=itemData.dogma.attributes[attribute].value;
    }
    attributeTree.capacity=itemData.capacity;
    attributeTree.mass=itemData.mass;
    attributeTree.volume=itemData.volume;
    outputTree=Array();
    outputTree.attributes=attributes(attributeTree);



    displayAttributes();

}


function displayAttributes() {
    var infoView = document.getElementById('infoView');
    var tbl = document.createElement('table');
    tbl.style.width = '100%';
    tbl.setAttribute('border', '1');
    for (var attribute in outputTree.attributes) {
        var tbdy = document.createElement('tbody');
        header=tbdy.insertRow();
        cell=document.createElement("TH");
        contents=document.createTextNode(attribute);
        cell.colSpan=4;
        cell.className="attributeHead";
        cell.appendChild(contents);
        header.appendChild(cell);
        for (var i=0;i<outputTree.attributes[attribute].length;i++) {
            key=Object.keys(outputTree.attributes[attribute][i])[0];
            row=tbdy.insertRow();
            if (key == "Resists") {
                resist=row.insertCell();
                resist.className="emresist";
                progress=document.createElement("progress");
                progress.value=outputTree.attributes[attribute][i][key].em.substring(0,outputTree.attributes[attribute][i][key].em.length-2);
                progress.max=100;
                contents=document.createTextNode(outputTree.attributes[attribute][i][key].em);
                resist.appendChild(progress);
                resist.appendChild(contents);
                resist=row.insertCell();
                resist.className="thermalresist";
                progress=document.createElement("progress");
                progress.value=outputTree.attributes[attribute][i][key].thermal.substring(0,outputTree.attributes[attribute][i][key].thermal.length-2);
                progress.max=100;
                contents=document.createTextNode(outputTree.attributes[attribute][i][key].thermal);
                resist.appendChild(progress);
                resist.appendChild(contents);
                resist=row.insertCell();
                resist.className="kineticresist";
                progress=document.createElement("progress");
                progress.value=outputTree.attributes[attribute][i][key].kinetic.substring(0,outputTree.attributes[attribute][i][key].kinetic.length-2);
                progress.max=100;
                contents=document.createTextNode(outputTree.attributes[attribute][i][key].kinetic);
                resist.appendChild(progress);
                resist.appendChild(contents);
                resist=row.insertCell();
                resist.className="explosiveresist";
                progress=document.createElement("progress");
                progress.value=outputTree.attributes[attribute][i][key].explosive.substring(0,outputTree.attributes[attribute][i][key].explosive.length-2);
                progress.max=100;
                contents=document.createTextNode(outputTree.attributes[attribute][i][key].explosive);
                resist.appendChild(progress);
                resist.appendChild(contents);
            } else {
                start=row.insertCell();
                start.colSpan=3;
                contents=document.createTextNode(key);
                start.appendChild(contents);
                value=row.insertCell();
                contents=document.createTextNode(outputTree.attributes[attribute][i][key]);
                value.appendChild(contents);
            }
        }
        tbl.appendChild(tbdy);
    }
    infoView.appendChild(tbl);
}


function attributes(attributeTree) {
    displayTree=Array();
    displayTree.Structure=structureData(attributeTree);
    displayTree.Armor=armorData(attributeTree);
    if (!displayTree.Armor) {
        delete displayTree.Armor;
    }
    displayTree.Shield=shieldData(attributeTree);
    if (!displayTree.Shield) {
        delete displayTree.Shield;
    }
    displayTree.Capacitor=capacitorData(attributeTree);
    if (!displayTree.Capacitor) {
        delete displayTree.Capacitor;
    }
    displayTree.Targeting=targetingData(attributeTree);
    if (!displayTree.Targeting) {
        delete displayTree.Targeting;
    }
    displayTree.Propulsion=propulsionData(attributeTree);
    if (!displayTree.Propulsion) {
        delete displayTree.Propulsion;
    }
    return displayTree;
}

function fitting(itemJson) {

}

function requirements(itemJson) {

}

function structureData(attributeTree) {

    structure=Array();
    if (9 in attributeTree) {
        structure.push({"Structure Hitpoints":formatDogma(9,attributeTree[9] )});
    }
    structure.push({"Capacity":formatDogma('capacity',attributeTree.capacity )});
    structure.push({"Mass":formatDogma('mass',attributeTree.mass )});
    structure.push({"Volume":formatDogma('volume',attributeTree.volume )});
    if (70 in attributeTree) {
        structure.push({"Inertial Modifier":formatDogma(70,attributeTree[70])});
    }
    if (974 in attributeTree) {
        resists=Array();
        resists.em=formatDogma(974,attributeTree[974]);
        resists.thermal=formatDogma(977,attributeTree[977]);
        resists.kinetic=formatDogma(976,attributeTree[976]);
        resists.explosive=formatDogma(975,attributeTree[975]);
        structure.push({"Resists":resists});
    }
    return structure;
}

function armorData(attributeTree) {

    armor=Array();
    if (265 in attributeTree) {
        armor.push({"Armor Hitpoints":formatDogma(265,attributeTree[265])});
        resists=Array();
        resists.em=formatDogma(267,attributeTree[267]);
        resists.thermal=formatDogma(270,attributeTree[270]);
        resists.kinetic=formatDogma(269,attributeTree[269]);
        resists.explosive=formatDogma(268,attributeTree[268]);
        armor.push({"Resists":resists});
        return armor;
    }
    return false;
}

function shieldData(attributeTree) {

    shield=Array();
    if (263 in attributeTree) {
        shield.push({"Shield Capacity":formatDogma(263,attributeTree[263])});
        shield.push({"Shield recharge Time":formatDogma(479,attributeTree[479])});
        resists=Array();
        resists.em=formatDogma(271,attributeTree[271]);
        resists.thermal=formatDogma(274,attributeTree[274]);
        resists.kinetic=formatDogma(273,attributeTree[273]);
        resists.explosive=formatDogma(272,attributeTree[272]);
        shield.push({"Resists":resists});
        return shield;
    }
    return false;
}


function capacitorData(attributeTree) {

    capacitor=Array();
    if (482 in attributeTree) {
        capacitor.push({"Capacitor Capacity":formatDogma(482,attributeTree[482])});
        capacitor.push({"Capacitor recharge time":formatDogma(55,attributeTree[55])});
        return capacitor;
    }
    return false;
}

function targetingData(attributeTree) {

    targeting=Array();
    if (76 in attributeTree) {
        targeting.push({"Maximum Targeting Range":formatDogma(76,attributeTree[76])});
        targeting.push({"Maximum Locked Targets":formatDogma(192,attributeTree[192])});
        targeting.push({"Signature Radius":formatDogma(552,attributeTree[552])});
        targeting.push({"Scan Resolution":formatDogma(564,attributeTree[564])});
        sensors=Array();
        sensors.Ladar=formatDogma(209,attributeTree[209]);
        sensors.Radar=formatDogma(208,attributeTree[208]);
        sensors.Magnetometric=formatDogma(210,attributeTree[210]);
        sensors.Gravometric=formatDogma(211,attributeTree[211]);
        targeting.push(sensors);
        return targeting;
    }
    return false;
}


function propulsionData(attributeTree) {
    propulsion=Array();
    if (37 in attributeTree) {
        propulsion.push({"Maximum Velocity":formatDogma(37,attributeTree[37])});
        propulsion.push({"Ship Warp Speed":formatDogma(600,attributeTree[600])});
        return propulsion;
    }
    return false;
}

function formatDogma(attributeID,value) {
    switch(attributeID) {
        case 'capacity':
            return value+" m3";
        case 'mass':
            return value+" kg";
        case 'volume':
            return value+" m3";
        case 600:
            return value+" AU/s";
        case 267:
        case 268:
        case 269:
        case 270:
        case 271:
        case 272:
        case 273:
        case 274:
        case 974:
        case 975:
        case 976:
        case 977:
            return (Math.round((1-value)*100))+" "+units[attributeID].displayname;
        case 55:
        case 479:
            return value/1000+" "+units[attributeID].displayname;
        default:
            if (units[attributeID]) {
                displayvalue=value+" "+units[attributeID].displayname;
            } else {
                displayvalue=value;
            }
            return displayvalue;
    }
}
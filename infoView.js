// Nasty little hack, to keep down on requests
var itemEndpoint="https://public-crest.eveonline.com/types/";

var itemdata;


var outputTree;

function loadItem(type) {
    if (isFinite(type)) {
        lookupUrl=itemEndpoint+type+"/";
    } else {
        lookupUrl=type;
    }
    $.getJSON(lookupUrl,function(data){
        formatOutput(data);
    });
}





function formatOutput(itemData) {
    attributeTree=Array();
    itemdata=Array();
    for (attribute=0; attribute < itemData.dogma.attributes.length;attribute++){
        attributeTree[itemData.dogma.attributes[attribute].attribute.id]=itemData.dogma.attributes[attribute].value;
        itemdata[itemData.dogma.attributes[attribute].attribute.id]=itemData.dogma.attributes[attribute];
    }
    attributeTree.capacity=itemData.capacity;
    attributeTree.mass=itemData.mass;
    attributeTree.volume=itemData.volume;
    outputTree=Array();
    outputTree.attributes=attributes(attributeTree);
    itemdata.description=itemData.description;
    itemdata.name=itemData.name;


    displayAttributes();

}



function displayAttributes() {
    var infoView = document.getElementById('infoView');
    infoView.innerHTML ="";
    header=document.createElement("h2");
    header.innerHTML=itemdata.name;
    contents=document.createElement("p");
    contents.innerHTML=itemdata.description;
    contents.className="itemDescription";
    header.className="itemName";
    infoView.appendChild(header);
    infoView.appendChild(contents);
    var tbl = document.createElement('table');
    tbl.className = 'infoTable';
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
            } else if (key == "Sensors") {
                sensors=row.insertCell();
                sensors.className="grav";
                contents=document.createTextNode(outputTree.attributes[attribute][i][key].Gravometric);
                sensors.appendChild(contents);
                sensors=row.insertCell();
                sensors.className="ladar";
                contents=document.createTextNode(outputTree.attributes[attribute][i][key].Ladar);
                sensors.appendChild(contents);
                sensors=row.insertCell();
                sensors.className="mag";
                contents=document.createTextNode(outputTree.attributes[attribute][i][key].Magnetometric);
                sensors.appendChild(contents);
                sensors=row.insertCell();
                sensors.className="radar";
                contents=document.createTextNode(outputTree.attributes[attribute][i][key].Radar);
                sensors.appendChild(contents);
            } else  {
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

function cleanattributes(attributeTree){

    delete attributeTree[9];
    delete attributeTree.capacity;
    delete attributeTree.mass;
    delete attributeTree.volume;
    delete attributeTree[974];
    delete attributeTree[975];
    delete attributeTree[976];
    delete attributeTree[977];
    delete attributeTree[70];
    delete attributeTree[265];
    delete attributeTree[267];
    delete attributeTree[268];
    delete attributeTree[269];
    delete attributeTree[270];
    delete attributeTree[263];
    delete attributeTree[479];
    delete attributeTree[271];
    delete attributeTree[272];
    delete attributeTree[273];
    delete attributeTree[274];
    delete attributeTree[482];
    delete attributeTree[55];
    delete attributeTree[76];
    delete attributeTree[192];
    delete attributeTree[552];
    delete attributeTree[564];
    delete attributeTree[209];
    delete attributeTree[208];
    delete attributeTree[210];
    delete attributeTree[211];
    delete attributeTree[37];
    delete attributeTree[600];
    delete attributeTree[109];
    delete attributeTree[110];
    delete attributeTree[111];
    delete attributeTree[113];
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


    cleanattributes(attributeTree);

    for (var key in attributeTree) {
        if (key in attributeTypes) {
            if (!(attributeTypes[key].categoryname in displayTree)) {
                displayTree[attributeTypes[key].categoryname]=Array();    
            }
            var myObj ={};
            myObj[attributeTypes[key].displayname]=itemdata[key].value+" "+attributeTypes[key].displayunit;
            displayTree[attributeTypes[key].categoryname].push(myObj);
        } else {
            console.log(key);
        }
    }

    delete displayTree.Graphics;
    delete displayTree.NULL;

    return displayTree;
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
        targeting.push({"Sensors":sensors});
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

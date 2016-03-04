$.urlParam = function(name){
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results===null){
       return null;
   }
   else{
          return results[1] || 0;
  }
};




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
        formatDogmaJSON(data);
    });
}





function formatDogmaJSON(itemData) {
    attributeTree=Array();
    itemdata=Array();
    if ("attributes" in itemData.dogma) {
        for (attribute=0; attribute < itemData.dogma.attributes.length;attribute++){
            attributeTree[itemData.dogma.attributes[attribute].attribute.id]=itemData.dogma.attributes[attribute].value;
            itemdata[itemData.dogma.attributes[attribute].attribute.id]=itemData.dogma.attributes[attribute];
        }
    }
    attributeTree.capacity=itemData.capacity;
    attributeTree.mass=itemData.mass;
    attributeTree.volume=itemData.volume;
    outputTree=Array();
    outputTree.attributes=attributes(attributeTree);
    itemdata.description=itemData.description;
    itemdata.name=itemData.name;

    if ("effects" in itemData.dogma) {
        for (effectnum=0;effectnum<itemData.dogma.effects.length;effectnum++){
            switch (itemData.dogma.effects[effectnum].effect.id) {
                case 12:
                    outputTree.attributes.Fitting.push({"Slot":"High Slot"});
                    break;
                case 11:
                    outputTree.attributes.Fitting.push({"Slot":"Low Slot"});
                    break;
                case 13:
                    outputTree.attributes.Fitting.push({"Slot":"Mid Slot"});
                    break;
                case 42:
                    outputTree.attributes.Fitting.push({"Required":"Turret Slot"});
                    break;
                case 40:
                    outputTree.attributes.Fitting.push({"Required":"Launcher Slot"});
                    break;
            }
        }
    }

    blueprintUrl="https://www.fuzzwork.co.uk/blueprint/api/blueprint.php?typeid="+itemData.id;

    $.getJSON(blueprintUrl,function(data){
        formatBlueprint(data);
    });
}

function formatBlueprint(data) {

    if ("activityMaterials" in data) {
        outputTree.blueprintData=data;
    }
    traitUrl="https://www.fuzzwork.co.uk/api/traits.php?typeid="+data.requestedid;
    $.getJSON(traitUrl,function(data){
        formatTraits(data);
    });
}

function formatTraits(data) {

    if (data.length){
        outputTree.Traits=data;
    }
    displayInfo();
}

function toggleTab(tabNum) {

    var tabs=document.getElementsByClassName("tab");
    for (var tab=0;tab<tabs.length;tab++) {
        tabs[tab].style.display = 'none'; 
    }
    switch (tabNum) {
        case 1:
            tab=document.getElementById("descriptionDiv");
            break;
        case 2:
            tab=document.getElementById("attributeDiv");
            break;
        case 3:
            tab=document.getElementById("fittingDiv");
            break;
        case 4:
            tab=document.getElementById("blueprintDiv");
            break;
    }
    tab.style.display = "block";

}



function displayInfo() {
    var infoView = document.getElementById('infoView');
    infoView.innerHTML ="";
    menu=document.createElement("div");
    menu.id="displayMenu";
    descriptionbutton=document.createElement("button");
    descriptionbutton.className="descriptionbutton";
    descriptionbutton.addEventListener("click",function() {toggleTab(1);},false);
    t = document.createTextNode("Description");
    descriptionbutton.appendChild(t);
    menu.appendChild(descriptionbutton);
    attributebutton=document.createElement("button");
    attributebutton.className="attributebutton";
    attributebutton.addEventListener("click",function() {toggleTab(2);},false);
    t = document.createTextNode("Attributes");
    attributebutton.appendChild(t);
    menu.appendChild(attributebutton);
    if ("Fitting" in outputTree.attributes) {
        fittingbutton=document.createElement("button");
        fittingbutton.className="fittingbutton";
        t = document.createTextNode("Fitting");
        fittingbutton.appendChild(t);
        fittingbutton.addEventListener("click",function() {toggleTab(3);},false);
        menu.appendChild(fittingbutton);
    }
    if ("blueprintData" in outputTree) {
        blueprintbutton=document.createElement("button");
        blueprintbutton.className="blueprintbutton";
        t = document.createTextNode("Materials");
        blueprintbutton.appendChild(t);
        blueprintbutton.addEventListener("click",function() {toggleTab(4);},false);
        menu.appendChild(blueprintbutton);
    }
    






    infoView.appendChild(menu);

    attributeDiv=document.createElement("div");
    attributeDiv.id="attributeDiv";
    attributeDiv.className="tab";
    attributeDiv.style.display = 'none';
    descriptionDiv=document.createElement("div");
    descriptionDiv.id="descriptionDiv";
    descriptionDiv.className="tab";
    header=document.createElement("h2");
    header.innerHTML=itemdata.name;
    contents=document.createElement("p");
    contents.innerHTML=itemdata.description;
    contents.className="itemDescription";
    header.className="itemName";
    infoView.appendChild(header);
    descriptionDiv.appendChild(contents);

    if ("Traits" in outputTree) {
        header=document.createElement("h3");
        header.innerHTML="Traits";
        descriptionDiv.appendChild(header);
        for (var trait=0;trait<outputTree.Traits.length;trait++) {
            contents=document.createElement("p");
            contents.className="traits";
            contents.innerHTML=outputTree.Traits[trait].typename+": "+outputTree.Traits[trait].bonus+" "+outputTree.Traits[trait].displayName+" "+outputTree.Traits[trait].bonusText;
            descriptionDiv.appendChild(contents);
        }
    }




    infoView.appendChild(descriptionDiv);
    var tbl = document.createElement('table');
    tbl.className = 'infoTable';
    for (var attribute in outputTree.attributes) {
        if (attribute=="Fitting") {
            continue;
        }
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
                progress.value=outputTree.attributes[attribute][i][key].em;
                progress.max=100;
                contents=document.createTextNode(outputTree.attributes[attribute][i][key].em+" %");
                resist.appendChild(progress);
                resist.appendChild(contents);
                resist=row.insertCell();
                resist.className="thermalresist";
                progress=document.createElement("progress");
                progress.value=outputTree.attributes[attribute][i][key].thermal;
                progress.max=100;
                contents=document.createTextNode(outputTree.attributes[attribute][i][key].thermal+" %");
                resist.appendChild(progress);
                resist.appendChild(contents);
                resist=row.insertCell();
                resist.className="kineticresist";
                progress=document.createElement("progress");
                progress.value=outputTree.attributes[attribute][i][key].kinetic;
                progress.max=100;
                contents=document.createTextNode(outputTree.attributes[attribute][i][key].kinetic+" %");
                resist.appendChild(progress);
                resist.appendChild(contents);
                resist=row.insertCell();
                resist.className="explosiveresist";
                progress=document.createElement("progress");
                progress.value=outputTree.attributes[attribute][i][key].explosive;
                progress.max=100;
                contents=document.createTextNode(outputTree.attributes[attribute][i][key].explosive+" %");
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
                value.className="attributeValue";
                contents=document.createTextNode(outputTree.attributes[attribute][i][key]);
                value.appendChild(contents);
            }
        }
        tbl.appendChild(tbdy);
    }
    attributeDiv.appendChild(tbl);
    infoView.appendChild(attributeDiv);
    
    if ("Fitting" in outputTree.attributes) {
        fittingDiv=document.createElement("div");
        fittingDiv.style.display = 'none';
        fittingDiv.id="fittingDiv";
        fittingDiv.className="tab";
        var ftbl = document.createElement('table');
        ftbl.className = 'infoTable';
        var ftbdy = document.createElement('tbody');
        header=ftbdy.insertRow();
        cell=document.createElement("TH");
        contents=document.createTextNode("Fitting");
        cell.colSpan=4;
        cell.className="attributeHead";
        cell.appendChild(contents);
        header.appendChild(cell);
        for (var fi=0;fi<outputTree.attributes.Fitting.length;fi++) {
            key=Object.keys(outputTree.attributes.Fitting[fi])[0];
            row=ftbdy.insertRow();
            start=row.insertCell();
            start.colSpan=3;
            contents=document.createTextNode(key);
            start.appendChild(contents);
            value=row.insertCell();
            value.className="attributeValue";
            contents=document.createTextNode(outputTree.attributes.Fitting[fi][key]);
            value.appendChild(contents);
        }
        ftbl.appendChild(ftbdy);
        fittingDiv.appendChild(ftbl);
        infoView.appendChild(fittingDiv);
    }

    if ("blueprintData" in outputTree) {
        blueprintDiv=document.createElement("div");
        blueprintDiv.id="blueprintDiv";
        blueprintDiv.style.display = 'none';
        blueprintDiv.className="tab";
        var btbl = document.createElement('table');
        btbl.className = 'infoTable';
        var btbdy = document.createElement('tbody');
        for (var activity in outputTree.blueprintData.activityMaterials) {
            header=btbdy.insertRow();
            cell=document.createElement("TH");
            contents=document.createTextNode(activityName[activity]);
            cell.colSpan=4;
            cell.className="attributeHead";
            cell.appendChild(contents);
            header.appendChild(cell);
            for (var am=0;am<outputTree.blueprintData.activityMaterials[activity].length;am++) {
                row=btbdy.insertRow();
                start=row.insertCell();
                start.colSpan=3;
                contents=document.createTextNode(outputTree.blueprintData.activityMaterials[activity][am].name);
                start.appendChild(contents);
                value=row.insertCell();
                value.className="attributeValue";
                contents=document.createTextNode(outputTree.blueprintData.activityMaterials[activity][am].quantity);
                value.appendChild(contents);
            }
        }
        btbl.appendChild(btbdy);
        blueprintDiv.appendChild(btbl);
        infoView.appendChild(blueprintDiv);
    }
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
            if (attributeTypes[key].displayunit == 's') {
                itemdata[key].value=itemdata[key].value/1000;
            }
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
    }
    if (267 in attributeTree) { 
        resists=Array();
        resists.em=formatDogma(267,attributeTree[267]);
        resists.thermal=formatDogma(270,attributeTree[270]);
        resists.kinetic=formatDogma(269,attributeTree[269]);
        resists.explosive=formatDogma(268,attributeTree[268]);
        armor.push({"Resists":resists});
    }
    if (armor.length) {
        return armor;
    }
    return false;
}

function shieldData(attributeTree) {

    shield=Array();
    if (263 in attributeTree) {
        shield.push({"Shield Capacity":formatDogma(263,attributeTree[263])});
        shield.push({"Shield recharge Time":formatDogma(479,attributeTree[479])});
    }
    if (271 in attributeTree) {
        resists=Array();
        resists.em=formatDogma(271,attributeTree[271]);
        resists.thermal=formatDogma(274,attributeTree[274]);
        resists.kinetic=formatDogma(273,attributeTree[273]);
        resists.explosive=formatDogma(272,attributeTree[272]);
        shield.push({"Resists":resists});
    }
    if (shield.length) {
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
            return isFinite(Math.round((1-value)*100))?(Math.round((1-value)*100)):0;
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


var activityName={'1':'Manufacturing','3':'TE Research','4':'ME research','5':'Copying','7':'Reverse Engineering','8':'Invention'};

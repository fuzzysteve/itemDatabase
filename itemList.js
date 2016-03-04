var marketGroups="https://public-crest.eveonline.com/market/groups/";

    function loadMarketGroups() {
        $.getJSON(marketGroups,function(data,status,xhr) {
            marketGroups=data.items;
            $.map(marketGroups,function(group){
                if (typeof group.parentGroup === 'undefined') {
                    $("#marketGroup").append("<li data-cresthref='"+group.href+"' class='groupLink'>"+group.name+"</li>");
                }
                }
            );
            $('.groupLink').click(function(event){event.stopPropagation();openSubGroup(event.target);});
            $("#marketgroupmain").show();
        });


    }
    function openSubGroup(group)
    {
        var node;
        var itemcount=0;
        if ($(group).children('ul').length>0) {
            $(group).children('ul').toggle();
        } else {
            $(group).append('<ul class="subdisplay"></ul>');
            node=$(group).children('ul');
            $.map(marketGroups,function(subgroup){
            if (typeof subgroup.parentGroup != 'undefined' && subgroup.parentGroup.href === group.dataset.cresthref) {
                node.append("<li data-cresthref='"+subgroup.href+"' class='groupLink'>"+subgroup.name+"</li>");
            }
            if (subgroup.href === group.dataset.cresthref) {
                $.getJSON(subgroup.types.href,function(data,status,xhr) {
                    $.map(data.items,function(item){
                        if (item.marketGroup.href== group.dataset.cresthref) {
                            node.append("<li data-cresthref='"+item.type.href+"' class='itemLink'><img width=16 hieght=16 src='"+item.type.icon.href+"'  data-cresthref='"+item.type.href+"'>"+item.type.name+"</li>");
                            itemcount++;
                        }
                    });
                    console.log(itemcount);
                    if (itemcount>0) {
                     $('.itemLink').click(function(event){event.stopPropagation();updateInfo(event.target.dataset.cresthref);});
                    }
                });
            }
            });
        }
    }


    function updateInfo(itemid)
    {
        loadItem(itemid);
        if (!isFinite(itemid)){
            itemid=itemid.replace('https://public-crest.eveonline.com/types/','');
            itemid=itemid.replace('/','');
        }
        try {
            var stateObj = {};
            history.pushState(stateObj, itemid, "/info/?typeid="+itemid);
        } catch(err) { console.log("No pushstate");  }
    }


var marketGroups="https://crest-tq.eveonline.com/market/groups/";
var searchObj=Array();
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
            itemid=itemid.replace('https://crest-tq.eveonline.com/types/','');
            itemid=itemid.replace('/','');
        }
        try {
            var stateObj = {};
            history.pushState(stateObj, itemid, "/info/?typeid="+itemid);
        } catch(err) { console.log("No pushstate");  }
    }

    function singleView() {
        document.cookie="ShowAllTabs=Yes";
    }


function loadSearchCache(){
       fillCache('start');
}


function emptyCache(){
    localStorage.removeItem('searchCache');
    $('#search').hide();
    $('#loadcache').show();
    $('#emptycache').hide();
}

function fillCache(page) {
    var getpage;
    var cachedata;
    if (cachedata = localStorage.getItem('searchCache')) {
        try {
        searchObj=JSON.parse(cachedata);
        $('#search').show();
        $('#loadcache').hide();
        $('#emptycache').show();
        return;
        }
        catch(e)
        {
            console.log('invalid json');
        }
    }

    if (page=='start') {
        alert("Cache is being filled. It'll remain until you clear it. This will take around 20-30 seconds");
        getpage="https://crest-tq.eveonline.com/market/types/";
    } else {
        getpage=page;
    }
     $.getJSON(getpage,function(data,status,xhr) {
        $.map(data.items,function(item){
            searchObj.push({href:item.type.href,name:item.type.name,search:item.type.name.toLowerCase(),icon:item.type.icon.href,marketid:item.marketGroup.id,markethref:item.marketGroup.href});
        });
        if (typeof data.next != 'undefined') {
            fillCache(data.next.href);
        } else {
            localStorage.setItem("searchCache",JSON.stringify(searchObj));
             $('#search').show();
             $('#loadcache').hide();
        }
     });
}

function doSearch() {
    var searchString=$('#search').val().replace('/','').toLowerCase();
    $('#searchList').show();
    $('#marketGroup').hide();
    $('#searchList').empty();
    $.map(searchObj,function(item){
        if (item.search.match(searchString)) {
            $('#searchList').append("<li data-cresthref='"+item.href+"' class='itemLink'><img width=16 height=16 src='"+item.icon+"' data-cresthref='"+item.href+"'>"+item.name+"</li>");
        }
    });
    $('.itemLink').click(function(event){event.stopPropagation();updateInfo(event.target.dataset.cresthref);});
}


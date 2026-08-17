var marketGroups="https://www.fuzzwork.co.uk/api/marketGroups.php";
    function loadMarketGroups() {
        $.getJSON(marketGroups,function(data,status,xhr) {
            $.map(data.groups,function(group){
                    $("#marketGroup").append("<li data-groupid='"+group.groupid+"' class='groupLink'>"+group.name+"</li>");
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
            $.getJSON(marketGroups+"?parent="+group.dataset.groupid,function(data,status,xhr) {
                $.map(data.groups,function(item){
                    node.append("<li data-groupid='"+item.groupid+"' class='groupLink'>"+item.name+"</li>");
                });
                $.map(data.types,function(item){
                     node.append("<li data-type='"+item.typeid+"' class='itemLink'>"+item.name+"</li>");
                });
                $('.itemLink').click(function(event){event.stopPropagation();updateInfo(event.target.dataset.type);});
            });
        }
    }

    function updateInfo(itemid)
    {
        loadItem(itemid);
        try {
            var stateObj = {};
            history.pushState(stateObj, itemid, "/info/?typeid="+itemid);
        } catch(err) { console.log("No pushstate");  }
    }

    function singleView() {
        document.cookie="ShowAllTabs=Yes";
    }


function setLanguage() {
    var cookieok=confirm("This needs a cookie and a reload. ctrl+F5");
    if (cookieok){
        if ($("#language").val()=="Default") {
            $.cookie('info-language',null);
        } else {
            $.cookie('info-language',$("#language").val());
        }
    }
}

function ajaxSetup() {
        var headers = {
            "Accept": "application/json, charset=utf-8",
            // ESI versioning moved from URL paths (e.g. /latest/) to this header;
            // shift the cutover back 11h since ESI's API day changes at 11:00 UTC.
            "X-Compatibility-Date": new Date(Date.now() - 11*60*60*1000).toISOString().slice(0,10)
        };
        if ($.cookie('info-language')) {
            headers['Accept-Language'] = $.cookie('info-language');
        }
        $.ajaxSetup({
            accepts: "application/json, charset=utf-8",
            crossDomain: true,
            type: "GET",
            dataType: "json",
            headers: headers,
            error: function (xhr, status, error) {
                displayError(error);
            }
        });
}


function initSearch() {
    $('#search').autocomplete({
        source: '/api/itemSearch.php',
        minLength: 2,
        select: function(event, ui) {
            updateInfo(ui.item.id);
            $('#search').val('');
            return false;
        }
    });
}


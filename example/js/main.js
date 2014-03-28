$(document).ready(function(){

    function wireUp(){
        $('.loading').hide();

        $('#btnGetAllLists').click(function(){
            getAllLists();
        });
        $('#btnGetListInfo').click(function(){
            getListInfo();
        });
        $('#btnGetListItems').click(function(){
            getListItems();
        });
        $('#btnGetListContentTypes').click(function(){
            getListContentTypes();
        });
    }

    //examples functions
    function getAllLists(){
        var textbox = $('#txtGetAllListsResult');
        var loading = textbox.siblings(".loading");
        loading.show();
        $.ajax({
            url: '/getAllLists'
        }).done(function(result){
            loading.hide();
            textbox.val(JSON.stringify(result));
        });
    }

    function getListInfo(){
        var textbox = $('#txtGetListInfoResult');
        var list = $('#txtListInfoList').val();
        var loading = textbox.siblings(".loading");
        loading.show();
        $.ajax({
            url: '/getListInfo',
            data:{
                list: list
            }
        }).done(function(result){
            loading.hide();
                textbox.val(JSON.stringify(result));
            });
    }

    function getListItems(){
        var textbox = $('#txtGetListItemsResult');
        var list = $('#txtListItemsList').val();
        var loading = textbox.siblings(".loading");
        loading.show();
        $.ajax({
            url: '/getListItems',
            data:{
                list: list
            }
        }).done(function(result){
            loading.hide();
            textbox.val(JSON.stringify(result));
        });
    }

    function getListContentTypes(){
        var textbox = $('#txtGetListContentTypesResult');
        var list = $('#txtListContentTypesList').val();
        var loading = textbox.siblings(".loading");
        loading.show();
        $.ajax({
            url: '/getListContentTypes',
            data:{
                list: list
            }
        }).done(function(result){
            loading.hide();
            textbox.val(JSON.stringify(result));
        });
    }

    //startup
    wireUp();
});
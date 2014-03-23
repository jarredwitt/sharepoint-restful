$(document).ready(function(){

    function wireUp(){
        $('#btnGetAllLists').click(function(){
            getAllLists();
        });
        $('#btnGetListInfo').click(function(){
            getListInfo();
        });
        $('#btnGetListItems').click(function(){
            getListItems();
        });
    }

    //examples functions
    function getAllLists(){
        var textbox = $('#txtGetAllListsResult');
        $.ajax({
            url: '/getAllLists'
        }).done(function(result){
            textbox.val(JSON.stringify(result));
        });
    }

    function getListInfo(){
        var textbox = $('#txtGetListInfoResult');
        var list = $('#txtListInfoList').val();
        $.ajax({
            url: '/getListInfo',
            data:{
                list: list
            }
        }).done(function(result){
                textbox.val(JSON.stringify(result));
            });
    }

    function getListItems(){
        var textbox = $('#txtGetListItemsResult');
        var list = $('#txtListItemsList').val();
        $.ajax({
            url: '/getListItems',
            data:{
                list: list
            }
        }).done(function(result){
                console.log(result.length);
                textbox.val(JSON.stringify(result));
            });
    }

    //startup
    wireUp();
});
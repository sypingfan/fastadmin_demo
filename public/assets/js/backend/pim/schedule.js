define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'pim/schedule/index' + location.search,
                    add_url: 'pim/schedule/add',
                    edit_url: 'pim/schedule/edit',
                    del_url: 'pim/schedule/del',
                    table: 'pim_schedule',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'weigh',
                fixedColumns: true,
                fixedRightNumber: 1,
                columns: [
                    [
                        {checkbox: true},
                        {field: 'operate', title: __('Operate'),
                            table: table,
                            buttons: [
                                {
                                    name:'start',
                                    text:'',
                                    classname:'btn btn-xs btn-info btn-ajax btn-restoreit',
                                    icon:'fa fa-play',
                                    url:'pim/schedule/start',
                                    confirm:'是否开始',
                                    refresh:true
,                                },
                                {
                                    name:'finish',
                                    text:'',
                                    classname:'btn btn-xs btn-danger btn-ajax btn-restoreit',
                                    icon:'fa fa-stop',
                                    url:'pim/schedule/finish',
                                    confirm:'是否结束',
                                    refresh:true
                                    ,                                }
                            ],
                            events: Table.api.events.operate,
                            formatter: function (value, row, index) {
                                var that = $.extend({},this);
                                var table = $(that.table).clone(true);

                                if(row.status == 0){
                                    $(table).data("operate-finish",null);
                                }else if(row.status == 1){
                                    $(table).data("operate-start",null);
                                }else if(row.status == 2){
                                    $(table).data("operate-start",null);
                                    $(table).data("operate-finish",null);

                                }

                                $(table).data("operate-edit",false);
                                $(table).data("operate-del",false)

                                that.table = table;
                                return Table.api.formatter.operate.call(that,value,row,index);
                            }
                        },
                        {field: 'title', title: __('Title'), operate: 'LIKE'},
                        {field: 'deadline', title: __('Deadline'), operate: 'RANGE',formatter:Table.api.formatter.dateonly},
                        {field: 'stime', title: __('Stime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false,
                            formatter: function (value,row) {
                                if(row.stime == '2000-01-01 00:00:01'){
                                    return __('StimeTitle');
                                }
                                return row.stime;
                            }
                        },
                        {field: 'etime', title: __('Etime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false,
                            formatter: function (value,row) {
                                if(row.etime == '2000-01-01 00:00:01'){
                                    return __('EtimeTitle');
                                }
                                return row.etime;
                            }
                        },
                        {
                            field:'consthours',title:__("CostHours") + '('+__("Unit")+')',formatter(value,row,index){
                                if(row.etime == '2000-01-01 00:00:01'){
                                    return "未设定";
                                }else{
                                    etime = new Date(row.etime.toString());
                                    stime = new Date(row.stime.toString());

                                    if(etime - stime < 0){
                                        return __('Stime')+"或"+__('Etime')+"错误"
                                    }else{
                                        return ((etime - stime) / 100 * 60 * 60).toFixed(1);
                                    }
                                }
                                return row.consthours;
                            }
                        },
                        {field: 'attachfile', title: __('Attachfile'), operate: false, formatter: function (value,row,index) {
                                if(row.attachfile == ''){
                                    return "";
                                }else{
                                    return "<a href='"+row.attachfile+"' target='_blank'>"+__('View')+"</a>";
                                }
                            }},
                        {field: 'status', title: __('Status'), searchList: {"0":__('Status 0'),"1":__('Status 1'),"2":__('Status 2')}, formatter: Table.api.formatter.status},

                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
        },
        recyclebin: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    'dragsort_url': ''
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: 'pim/schedule/recyclebin' + location.search,
                pk: 'id',
                sortName: 'id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'title', title: __('Title'), align: 'left'},
                        {
                            field: 'deletetime',
                            title: __('Deletetime'),
                            operate: 'RANGE',
                            addclass: 'datetimerange',
                            formatter: Table.api.formatter.datetime
                        },
                        {
                            field: 'operate',
                            width: '140px',
                            title: __('Operate'),
                            table: table,
                            events: Table.api.events.operate,
                            buttons: [
                                {
                                    name: 'Restore',
                                    text: __('Restore'),
                                    classname: 'btn btn-xs btn-info btn-ajax btn-restoreit',
                                    icon: 'fa fa-rotate-left',
                                    url: 'pim/schedule/restore',
                                    refresh: true
                                },
                                {
                                    name: 'Destroy',
                                    text: __('Destroy'),
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
                                    icon: 'fa fa-times',
                                    url: 'pim/schedule/destroy',
                                    refresh: true
                                }
                            ],
                            formatter: Table.api.formatter.operate
                        }
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
        },

        add: function () {
            Controller.api.bindevent();
        },
        edit: function () {
            Controller.api.bindevent();
        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});

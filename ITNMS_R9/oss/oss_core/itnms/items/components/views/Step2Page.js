define([
    "oss_core/itnms/items/actions/ItemAction",
    "text!oss_core/itnms/items/components/views/step2Page.html"
], function(action,tpl) {
    var Step2Page = function(options) {
        this.options = options;
        this.options.dataList.showTpl = this.options.showTpl;
        this.itemObj = this.options.itemObj;
        this.upObj = this.options.upObj;
        //console.log(this.options.dataList)
        this.dataList = this.options.dataList;
        this.$el = $(this.options.el)
        this.tpl = fish.compile(tpl)
    }

    Step2Page.prototype.render = function() {
        this.remove();
        this.$el.html(this.tpl(this.dataList));
        this.afterRender();
    }

    Step2Page.prototype.remove = function() {
        this.$el.html("");
    }

    Step2Page.prototype.afterRender = function() {
        var self = this;
        self.switchBtn();
        self.$el.find('.addItems').off('click').on('click',function(){
            self.addDelayBtn();
        })
        self.getItemList();
        self.renderItemBaseInfo();
    }

    Step2Page.prototype.renderItemBaseInfo = function() {
        var self = this;
        if(self.upObj && self.upObj !== 'undefined'){
            var delay = self.upObj.delay.split(";")
            this.$el.find('.filterDelay').val(delay[0]);
            if(delay.length > 1){
                self.addbaseItem(delay);
            }
            this.$el.find('.snmp_oid').val(self.upObj.snmp_oid);
            this.$el.find('.filterCommunity').val(self.upObj.snmp_community);
            this.$el.find('.filterPort').val(self.upObj.port);
            this.$el.find('.trapper_hosts').val(self.upObj.trapper_hosts);
            this.$el.find('.username').val(self.upObj.username);
            this.$el.find('.password').val(self.upObj.password);
            this.$el.find('.snmpv3_contextname').val(self.upObj.snmpv3_contextname);
            this.$el.find('.snmpv3_securityname').val(self.upObj.snmpv3_securityname);
            this.$el.find('.snmpv3_securitylevel option:selected').val(self.upObj.snmpv3_securitylevel);
            this.$el.find('.params').val(self.upObj.params);
            this.$el.find('.ipmi_sensor').val(self.upObj.ipmi_sensor);
            this.$el.find(".authtype option[value="+this.upObj.authtype+"]").prop("selected","selected");
            this.$el.find(".jmx_endpoint option[value="+this.upObj.jmx_endpoint+"]").prop("selected","selected");
            this.$el.find('.master_itemid input').val(this.upObj.name);
            this.$el.find('.master_itemid').data("itemid",this.upObj.master_itemid);
        }
    }

    Step2Page.prototype.switchBtn = function() {
        var self = this;
        var $switch = self.$el.find('.switch-btn').switchbutton('option','size','xs');
        $switch.on("switchbutton:change", function(e,state){
            self.$el.find('.dlayJian').val('');
            self.$el.find('.dlayTIme').val('');
            if(state){
                self.$el.find('.dlayJian').attr('placeholder',"50s");
                self.$el.find('.dlayTIme').show();
            }else{
                self.$el.find('.dlayJian').attr('placeholder',"md1-31wd1-7h0-23m0-59s0-59");
                self.$el.find('.dlayTIme').hide();
            }
        });
    }

    Step2Page.prototype.addDelayBtn=function() {
        var self = this;
        var el=self.$el.find('.addDelayItem').find('tbody')
        this.addDelayItem(el);
    }

    Step2Page.prototype.addbaseItem = function(data) {
        var self = this;
        var el = self.$el.find('.addDelayItem').find('tbody')
        var datas = data.slice(1);
        var $item =fish.map(datas,function(d){
            var itemdata = d.split("/");
            var optionState = (itemdata.length > 1) ? '灵活模式' : '调度模式'
            itemdata[1] = itemdata[1] ? itemdata[1] : '';
            return '<tr class="DelayItemTr"><td class="i1">'+optionState+'</td><td class="i2">'+itemdata[0]+'</td><td><span class="i3">'+itemdata[1]+'</span><i class="glyphicon glyphicon-remove-circle fr delDelayItem"></i></td></tr>';
        })
        el.append($item);
        self.addItemEvent(el);
    }

    Step2Page.prototype.addDelayItem = function(el,data) {
        var self = this;
        var optionState = self.$el.find('.switch-btn').switchbutton('option','state');
        var delayObj = {
            'optionState' : optionState ? '灵活模式' : '调度模式',
            'dlayJian' : self.$el.find('.dlayJian input').val() ? self.$el.find('.dlayJian input').val() : '',
            'dlayTIme' : self.$el.find('.dlayTIme input').val() ? self.$el.find('.dlayTIme input').val() : ''
        }
        var $item = '<tr class="DelayItemTr"><td class="i1">'+delayObj.optionState+'</td><td class="i2">'+delayObj.dlayJian+'</td><td><span class="i3">'+delayObj.dlayTIme+'</span><i class="glyphicon glyphicon-remove-circle fr delDelayItem"></i></td></tr>';
        el.append($item);
        self.addItemEvent(el);
    }

    Step2Page.prototype.getItemList = function(){
        var self = this;
        self.$el.find('.master_itemid').find('.smaster_span').off('click').on('click', function() {
            action.itemGet(self.itemObj).then(function(data) {
                var trItem = fish.map(data.result,function(d, elem) {
                    var status = (d.status === 1 && 'Disable') || 'Enabled';
                    return '<li data-itemid="'+d.itemid+'" class="liHover"><span class="gName">'+d.name+'</span><span>'+d.key_+'</span><span>'+self.dataList.ITEM_TYPE[d.type].paraName+'</span><span>'+self.dataList.ITEM_VALUE_TYPE[d.value_type].paraName+'</span><span>'+status+'</span></li>';
                })
                var $content = '<div class="popItemList"><div class="modal-header"><h4 class="modal-title">监控项</h4></div>'+
                    '<div class="modal-body">'+
                        '<ul>'+
                            '<li>'+
                                '<span>名称</span>'+
                                '<span>键值</span>'+
                                '<span>类型</span>'+
                                '<span>值类型</span>'+
                                '<span>状态</span>'+
                            '</li>'+
                            trItem.join("")+
                        '</table>'+
                    '</div>'+
                '</div>';
                var options = {
                    height: 400,
                    width: (self.$el.width() / 1.5),
                    modal: true,
                    content:$content,
                    draggable: false,
                    autoResizable: true
                };
                var popup = fish.popup($.extend({}, options));
                $('.liHover').off('click').on('click', function() {
                    var itemid = $(this).data('itemid')
                    var gName = $(this).children('.gName').text();
                    self.$el.find('.master_itemid input').attr("value",gName)
                    self.$el.find('.master_itemid').data("itemid",itemid);
                    popup.close();
                })
            })
        });
    }

    Step2Page.prototype.addItemEvent = function(el) {
        var self = this;
        el.find('.delDelayItem').off('click').on('click', function() {
            $(this).parent().parent().remove();
        })

    }

    Step2Page.prototype.getInfo = function() {
        var litems = {},itemv2 = "";
        var filterDelay = this.$el.find('.filterDelay').val();
        var snmp_oid = this.$el.find('.snmp_oid').val();
        var snmp_community = this.$el.find('.filterCommunity').val();
        var port = this.$el.find('.filterPort').val();
        var trapper_hosts = this.$el.find('.trapper_hosts').val();
        var username = this.$el.find('.username').val();
        var password = this.$el.find('.password').val();
        var snmpv3_contextname = this.$el.find('.snmpv3_contextname').val();
        var snmpv3_securityname = this.$el.find('.snmpv3_securityname').val();
        var snmpv3_securitylevel = this.$el.find('.snmpv3_securitylevel option:selected').val();
        var params = this.$el.find('.params').val();
        var ipmi_sensor = this.$el.find('.ipmi_sensor').val();
        var authtype = this.$el.find('.authtype option:selected').val();
        var jmx_endpoint = this.$el.find('.jmx_endpoint').val();
        var $items = this.$el.find('.addDelayItem').find('tbody').find('.DelayItemTr')
        var master_itemid = this.$el.find('.master_itemid').data("itemid");
        fish.map($items,function(row){
            var $row =$(row);
            if($row.find('.i2').text() && $row.find('.i3').text()){
                itemv2 += ";" + $row.find('.i2').text() + "/" + $row.find('.i3').text();
            }else{
                itemv2 += ";" + $row.find('.i2').text()
            }
        });
        litems.delay = (itemv2 && filterDelay + itemv2) || filterDelay;
        litems.snmp_oid = snmp_oid;
        litems.snmp_community = snmp_community;
        litems.port = port;
        litems.trapper_hosts = trapper_hosts;
        litems.username = username;
        litems.password = password;
        litems.snmpv3_contextname = snmpv3_contextname;
        litems.snmpv3_securityname = snmpv3_securityname;
        litems.snmpv3_securitylevel = snmpv3_securitylevel;
        litems.params = params;
        litems.ipmi_sensor = ipmi_sensor;
        litems.authtype = authtype;
        litems.jmx_endpoint = jmx_endpoint;
        litems.master_itemid = master_itemid;
        return litems;
    }


    return Step2Page;

})
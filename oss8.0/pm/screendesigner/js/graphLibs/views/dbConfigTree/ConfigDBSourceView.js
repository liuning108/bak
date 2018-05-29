define([
    "i18n!oss_core/pm/screendesigner/i18n/SDesinger",
  "text!oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/LiItem.html",
  "oss_core/pm/screendesigner/actions/BScreenMgrAction",
  "text!oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/indiLi.html",
  "text!oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/dimeLi.html",
  "text!oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/configDBSource.html",
  "oss_core/pm/screendesigner/js/codemirror/codemirror",
  "oss_core/pm/screendesigner/js/codemirror/sql",
  "css!oss_core/pm/screendesigner/js/codemirror/codemirror.css"
], function(i18nData,LiItemTpl,action,indiLiTpl, dimeLiTpl, tpl, CodeMirror) {
  return portal.BaseView.extend({
    className: "ui-dialog dialog configDBSourceDialog",
    template: fish.compile(tpl),
    indiTpl: fish.compile(indiLiTpl),
    dimeTpl: fish.compile(dimeLiTpl),
    liItemTplFun:fish.compile(LiItemTpl),
    resource: fish.extend({}, i18nData),
    initialize: function(config,parent) {
      this.config = config
      this.iniConfig =$.extend(true,{},config);
      this.state=0;
      this.parent=parent;
    },
    events: {
      'click .configDBSourceClose': 'close',
      'click .nextbutton': 'next',
      'click .Prevbutton': 'prev',
      'click .radioSQL': 'radioSQL',
      'click .radioAPI': 'radioAPI',
      'click .toDime': 'toDime',
      'click .toIndi': 'toIndi',
      'click .doneButton': 'doneButton',
      'click .modifiedDB':'modifiedDB',
      'click .dsitem':'selectDBType'

    },
    selectDBType:function(e) {
        this.config=$.extend(true,{},this.iniConfig)
        this.$el.find('.dbSelect').hide();
        var $target=this.$el.find(e.target);
        $target.find('.dbSelect').show();
        var type = $target.data("type")
        if(this.iniConfig.type!=type){
            this.config.attrs.sql=""
        }else{
            this.config.attrs.sql=this.iniConfig.attrs.sql;
        }
        if(type==1){

          this.radioSQL()
        }else{
          this.radioAPI()
        }
         // itemSelect
    },
    modifiedDB:function(e) {
       var $parent=this.$el.find(e.target).parent()
       var $span =$parent.find("span");
       var text =$span.text();
                 $span.hide();
       var $input=$parent.find("input")
       $input.show();
       $input.val(text);
       $input.off('keypress')
             .on('keypress',function(e){
                 if(e.keyCode=="13"){
                     $span.text($input.val());
                     $input.hide();
                     $span.show();
                 }

               })


    },
    checkXY:function(){
        return this.$el.find('#sortable6').find('li').length>0
    },
    getColModelsInfo:function($ul){
       return fish.map($ul.find('li'),function(li) {
            var name = $(li).data("name");
            var as = $(li).find('span').text();
            return {
                'name': name,
                'as': as
            }
        })
    },
    doneButton: function() {
        var self =this;
        if(this.checkXY()){
            this.config.attrs.x_colModels=this.getColModelsInfo(this.$el.find('#sortable5'));
            this.config.attrs.y_colModels=this.getColModelsInfo(this.$el.find('#sortable6'));
            action.saveOrUpdateSourceService(this.config,function(data) {
                fish.success('success');
                self.trigger('close')
            })
        }else{
            fish.warn('Indicator (the Y axis) cannot be empty');
        }

    },
    toIndi: function() {
      var $indis = $("input[name='dime']:checkbox:checked")
      var models = fish.map($indis, function(chk) {
        $(chk).parent().remove();
        return {label: $(chk).val()}
      })
      this.switchAxisUL(models, '.indisUL', this.indiTpl)
    },
    toDime: function() {
      var $indis = $("input[name='indi']:checkbox:checked")
      var models = fish.map($indis, function(chk) {
        $(chk).parent().remove();
        return {label: $(chk).val()}
      })
      this.switchAxisUL(models, '.dimeUL', this.dimeTpl)
    },

    switchAxisUL: function(models, selector, tplFun) {
      var $ul = this.$el.find(selector)
      fish.each(models, function(model) {
        $ul.append(tplFun(model));
      })
    },

    render: function() {
      this.$el.html(this.template(this.resource));
      return this;
    },
    radioSQL: function() {
      console.log("radioSQL");
      this.$el.find('.sqlItem').show();
      this.$el.find('.apiItem').hide();
      this.config.type=1;
      console.log(this.config.type);

    },
    radioAPI: function() {
        console.log("radioAPI");
      this.$el.find('.apiItem').show();
      this.$el.find('.sqlItem').hide();
      this.config.type=2;
       console.log(this.config.type);

    },
    sqlSource:function(data,e) {
        this.$el.find('.sourceTypeNameClass').text(i18nData.SQL_SOURCE)
        var nextState=1;
        console.log(data);
        var $combobox1 = this.$el.find('#sourceCombo').combobox({
          placeholder: '',
          dataTextField: 'NAME',
          dataValueField: 'ID',
          dataSource: data.sourceList,
          template: '<li><a >test</a></li>'
        });
        $combobox1.combobox('value', this.config.source)


        this.sourceCombobox=$combobox1
        var $sql = this.$el.find('.sql2')
        if(!this.editor){
            var editor = CodeMirror.fromTextArea($sql[0], {
              mode: 'text/x-plsql',
              indentWithTabs: true,
              smartIndent: true,
              lineNumbers: true,
              matchBrackets: true,
              autofocus: true
            });
            editor.setSize('height', '180px');
            editor.setValue(this.config.attrs.sql);
            this.editor=editor;
        }
        setTimeout(function() {
          editor.refresh();
        }, 1000);

        this.$el.find('#xyFields').slimscroll({height:'320px',width:'99%'});
        this.$el.find('.serviceName').val(this.config.name)
        this.state=nextState;
        $(e.target).text(i18nData.NEXTSTEP);
        this.$el.find("#configDBTabs").tabs("showTab", nextState, true);

    },

    apiSource:function(data ,e) {
        var self =this;
        this.$el.find('.sourceTypeNameClass').text("API Source")
        this.$el.find('.serviceApiName').val(this.config.attrs.sql)
        var nextState=1;
        console.log(data);
        var $combobox1 = this.$el.find('#sourceCombo').combobox({
          placeholder: '',
          dataTextField: 'NAME',
          dataValueField: 'ID',
          dataSource: data.sourceList,
          template: '<li><a >test</a></li>'
        });
        $combobox1.on('combobox:change', function () {
             var obj = $combobox1.combobox('getSelectedItem')
             if(obj){
                 if(obj.URL){
                     self.$el.find('.serviceApiURL').text(obj.URL)
                 }
             }

        });
        $combobox1.combobox('value', this.config.source)

        this.apiEdit={
          getValue:function(){
              return self.$el.find('.serviceApiName').val();
          }
        }

        this.sourceCombobox=$combobox1
        this.$el.find('#xyFields').slimscroll({height:'320px',width:'99%'});
        this.$el.find('.serviceName').val(this.config.name)
        this.state=nextState;
        $(e.target).text(i18nData.NEXTSTEP);
        this.$el.find("#configDBTabs").tabs("showTab", nextState, true);
    },
    initBasicInfoSate:function(e) {

        var self =this;
        if(this.config.type==1){
            action.getSource(function(data){
               self.sqlSource(data,e);
            })

        }else{
            action.getApiSource(function(data){
              self.apiSource(data,e);
              });
        }


    },

    next: function(e) {
      var  target=$(e.target);
      var currentState= this.state;
      if (currentState==0){
          this.initBasicInfoSate(e)
      }

      if (currentState==1){
          this.initColModesState(e);
      }
      if (currentState==2){
        this.doneButton();
      }
      this.$el.find('.Prevbutton').show();

    },
    prev: function(e) {
      var target=this.$el.find(e.target);
      var currentState= this.state
      var nextState=currentState-1;
      if (nextState==0){
        $(e.target).hide();
      }
      this.state=nextState;
      this.$el.find("#configDBTabs").tabs("showTab", nextState, true);
      this.$el.find('.nextbutton').text(i18nData.NEXTSTEP);

    },

    colModelsToIndi: function(colModels) {
      var self = this;
      var $ul = this.$el.find('.indisUL')
      $ul.empty();
      fish.each(colModels, function(model) {
        $ul.append(self.indiTpl(model));
      })

    },


    initCurrentState:function(){
        if( this.state==0 ){
           this.initTypeSate()
        }
        if( this.state==1){
            this.initBasicInfoSate()
        }
        if(this.state==2){
            this.initColModesState();
        }


    },
    initTypeSate:function(){
       var type =this.config.type;

       if (type==1){
        this.$el.find('.sqlImage').find('img').show();
        this.radioSQL()
       }else{
        this.$el.find('.apiImage').find('img').show();
        this.radioAPI()
       }

    },
    chekcColModelsInfo:function() {
        var flag =this.$el.find('#tabs-aForm').isValid();
        if(this.editor){
            var sql =this.editor.getValue();
            var len =sql.trim().length;
            if(len<=1){
                flag=false;
                this.$el.find('.CodeMirror').addClass("editor-sql-error")
                // this.$el.find('.errorMessage').text('Please enter the SQL statement');
            }else {
                this.$el.find('.CodeMirror').removeClass("editor-sql-error")
                this.$el.find('.errorMessage').text('');
            }
        }
        return flag;
    },

    getFields:function(e,fields) {
        var self =this;
        var fields=fields.fields;
        this.fields = fish.map(fields,function(name) {
           return {
               'id'  :'filed_'+name,
               'name' : name,
               'as'   : name
           }
        })
        var $ul4 =this.$el.find('#sortable4');
        var $ul5 =this.$el.find('#sortable5');
        var $ul6 =this.$el.find('#sortable6');
        $ul4.empty();
        $ul5.empty();
        $ul6.empty();
        //
        // x_colModels:[{'name':'AREA',as:'地区'}],
        // y_colModels:[{'name':'G4',as:'4G'}],
        fish.each(this.fields,function(filed) {
            xNames=fish.pluck(self.config.attrs.x_colModels,"name");
            yNames=fish.pluck(self.config.attrs.y_colModels,"name");
            if (fish.contains(xNames,filed.name)){
                var filed= fish.findWhere(self.config.attrs.x_colModels,{'name':filed.name});
                $ul5.append(self.liItemTplFun(filed));
                return;
            }
            if(fish.contains(yNames,filed.name)){
                var filed= fish.findWhere(self.config.attrs.y_colModels,{'name':filed.name});
                $ul6.append(self.liItemTplFun(filed));
                return;
            }
            $ul4.append(self.liItemTplFun(filed));
        })
        this.sortableMappingFields()
        $(e.target).text(i18nData.NEXTSTEP);
        var nextState=2;
        this.state=nextState;
        this.$el.find("#configDBTabs").tabs("showTab", nextState, true);

    },

    initColModesState:function(e) {
         var self =this;
         this.$el.find('.CodeMirror').removeClass("editor-sql-error")
         this.$el.find('.errorMessage').text('');

        if(this.chekcColModelsInfo()){
            this.config.name=this.$el.find('.serviceName').val();
            this.config.source=this.sourceCombobox.combobox('value');

            if(this.config.type==1){
            this.config.attrs.sql=this.editor.getValue();
            action.getFields(this.config.source,
                             this.config.attrs.sql,
                             function(data){
                                 if(data.fields.fields.length>0){
                                   self.getFields(e,data.fields);
                                 }else {
                                     self.$el.find('.CodeMirror').addClass("editor-sql-error")
                                     self.$el.find('.errorMessage').text(data.fields.message);
                                 }
                            })
           }else{
               this.config.attrs.sql=this.apiEdit.getValue();
               action.getAPIField(this.config.source,
                                  this.config.attrs.sql,
                                  function(data){
                                      console.log(data);
                                      if (data.result.code==1) {
                                          self.getFields(e,{'fields':data.result.data});
                                      }else{
                                          self.$el.find('.CodeMirror').addClass("editor-sql-error")
                                          self.$el.find('.errorMessage').text(data.result.msg);

                                      }
                                  }
                                 )
           }

         }

    },
    afterRender: function() {
       this.$el.find('#configDBTabs').tabs("option", "event", "none");
       this.initCurrentState();
    },
    sortableMappingFields: function() {
      this.$el.find(".list-group").sortable({connectWith: ".list-group"});
      this.$el.find("#sortable4, #sortable5, #sortable6").disableSelection();
    },
    close: function() {
      this.trigger('close')
    }

  });
});

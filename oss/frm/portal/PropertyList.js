(function($, undefined) {
	var template = '{{#data}}<div class="{{../colCssp}}"><div class="form-group {{#if required}}required{{/if}}">' +
		'<label class="{{../labelCssp}} control-label">{{label}}</label>' +
		'<div class="{{../elCssp}}"><div class="input-group">' +
		"{{#ifCond type '===' 'textarea'}}" +
		'<textarea id="{{id}}" name="{{name}}" class="form-control" data-rule="{{datarule}}"></textarea>' +
		'{{else}}' +
		"{{#ifCond type '===' 'multiselect'}}" +
		'<select id="{{id}}" name="{{name}}" class="form-control" multiple data-rule="{{datarule}}"></select>' +
		'{{else}}' +
		'<input id="{{id}}" name="{{name}}" class="form-control" data-rule="{{datarule}}">' +
		'{{/ifCond}}' +
		'{{/ifCond}}' +
		'</div></div></div></div>{{/data}}';

	$.widget("ui.propertylist", {
		// default options
		options: {
			colCssp: "col-md-6 col-sm-6",
			labelCssp: "col-md-4 col-sm-4",
			elCssp: "col-md-8 col-sm-8",
			data: [],
			appendTo: false,
			bindCtrl: []
		},

		className: 'random' + Math.floor(Math.random() * ( 100 + 1)),

		_create: function() {
			this.element.addClass('form-horizontal clearfix');
			this.element.addClass(this.className);
			this.original = this.element.children();
		},

		_init: function() {
			if (this.options.appendTo) {
				this.element.find(this.options.appendTo).empty();
			} else {
				this.element.children().not(this.original).empty();
			}
			this._buildHTML();
			this._initWidget();
			this.element.form();
		},

		_destroy: function() {
			if (this.options.appendTo) {
				this.element.find(this.options.appendTo).empty();
			} else {
				this.element.children().not(this.original).empty();
			}
		},

		_buildHTML: function() {

			$.each(this.options.data, function(index, val) {
				val.name = val.name || val.id;
			});

			var html = Handlebars.compile(template)(this.options);
			this.options.appendTo ? this.element.find(this.options.appendTo).append(html) : this.element.prepend(html);
		},

		_initWidget: function() {
			var jsonarr = this.options.data;
			var that = this;
			for (var i = 0; i < jsonarr.length; i++) {
				var obj = jsonarr[i];
				option = $.extend(true, this.options[obj.type], obj); //支持控件所有初始化属性
				selectEl = $('.' + this.className).find("#" + obj.id);
				switch (obj.type) {
					case "datetimepicker":
						selectEl.datetimepicker(option);
						if (obj.value) {
							selectEl.datetimepicker("value", obj.value);
						}
						break;
					case "popedit":
						selectEl.popedit(option);
						if (obj.value) {
							selectEl.popedit("setValue", obj.value);
						}
						break;
					case "combobox":
						selectEl.combobox(option);
						selectEl.parent('.input-group').removeClass("input-group");
						//如果有data属性，就忽略url属性，将data作为下拉框选项
						if (obj.data) {
							//如果有bindctrl属性，data属性的内容需要做联动处理
							if (obj.bindctrl)
							{
								//根据前一个下拉框生成联动的下拉框
								this.linkage(obj);
								//给前一个下拉添加change事件，随时联动
//								var newobj = obj;
								$("#" + obj.bindctrl).on('combobox:change', function(e){	
									for (var i = 0; i < that.options.data.length; i++)
									{
										if (that.options.data[i].bindctrl == $(e.target)[0].id)
										{
											that.linkage(that.options.data[i]);
										}
									}
								});
								
								that.options.bindCtrl.push($("#" + obj.bindctrl));
								break;
							}
							else
							{
								selectEl.combobox("option", "dataSource", obj.data);
								if (obj.value) {
									selectEl.combobox("value", obj.value);
								}
								break;
							}
						}
						if (obj.url) {
							$.getJSON(obj.url, obj, function(o) {
								return function(json, textStatus) {
									$('.' + this,className).find("#" + o.id).combobox("option", "dataSource", json);
									if (o.value) {
										$('.' + this,className).find("#" + o.id).combobox("value", o.value);
									}
								}
							}(obj));
						}
						break;
					case "multiselect":
						selectEl.multiselect(option);
						selectEl.parent('.input-group').removeClass("input-group");
						//如果有data属性，就忽略url属性，将data作为多选框选项
						if (obj.data) {
							selectEl.multiselect("option", "dataSource", obj.data);
							if (obj.value) {
								selectEl.multiselect("value", obj.value.split('|'));
							}
							break;
						}
						if (obj.url) {
							$.getJSON(obj.url, obj, function(o) {
								return function(json, textStatus) {
									$('.' + this,className).find("#" + o.id).multiselect("option", "dataSource", json);
									if (o.value) {
										$('.' + this,className).find("#" + o.id).multiselect("value", o.value.split('|'));
									}
								}
							}(obj));
						}
						break;
					default:
						selectEl.val(obj.value);
						selectEl.parent('.input-group').removeClass("input-group");
						break;
				}
			}
		},
		//联动
		linkage: function(obj)
		{
			var selectEl = $('.' + this.className).find("#" + obj.id);
			var val = $("#" + obj.bindctrl)[0].value;
			var newDate = [];
			for (var x in obj.data)
			{
				if (obj.data[x].bindTo == val)
				{
					newDate.push(obj.data[x]);
				}
			}
			selectEl.combobox("option", "dataSource", newDate);
			//value默认取newDate的第一个name
			if (newDate.length > 0) 
			{	
				selectEl.combobox("value", newDate[0].value);
			}
			else
			{
				selectEl.combobox("value", "");
			}
		},
		linkageRefresh:function(){
			var objs = this.options.bindCtrl;
			_.each(objs,function(obj){
				obj.trigger("combobox:change");
			})
		}
	});
})(jQuery);
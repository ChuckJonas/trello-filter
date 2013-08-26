"use strict"
/*global $:false, jQuery:false */

var createButtons = function () {
	var cards;
	$('#content').bind('DOMNodeInserted', function () {
		if ($('.window-sidebar').length == 1) {
			$('#content').unbind('DOMNodeInserted');
			//get swimlanes
			var lists = $('.list-card-container').find('.list-card-position').children('strong:first-child').map(function (i, el) {
				return $(el).text();
			});
			var uniquelists = [];
			$.each(lists, function (i, el) {
				if ($.inArray(el, uniquelists) === -1) uniquelists.push(el);
			});

			//add swimlane buttons
			$('<label class="button-link danger label-list-filter"><input type="checkbox" class="list-filter" id="filter-all" checked> All</label>').appendTo('.window-module.gutter');
			$(uniquelists).each(function () {
				$('<label class="button-link label-list-filter"><input type="checkbox" class="list-filter" id="filter-' + this + '"> '  + this + '</label>').appendTo('.window-module.gutter');
			});

			//get label classes
			var labels = [];
			$('.card-label').each(function(){
				var c = $(this).attr('class');
				if($.inArray(c, labels) === -1) labels.push(c);
			});

			//add select 'all' button
			$('<hr/>').appendTo('.window-module.gutter');
			$('<label class="button-link danger label-list-filter"><input type="checkbox" class="label-filter" id="filter-all-labels" checked> All Labels</label>').appendTo('.window-module.gutter');
			$('<label class="button-link label-list-filter"><input type="checkbox" class="label-filter" id="filter-no-label"> No Label</label>').appendTo('.window-module.gutter');
			//add button for each label
			$(labels).each(function () {
				$('<label class="button-link label-list-filter"><input type="checkbox" class="label-filter" id="filter-' + this.replace('card-label ','') + '"> <span class="'  + this + '"></span></label>').appendTo('.window-module.gutter');
			});

			$('.list-card-container').addClass('list-set');
			$('.list-card-container').addClass('label-set');
			
			$('.window-module.gutter').on('change', '.list-filter', function (e) {
				e.preventDefault();
				var currentId = this.id.replace('filter-', '');
				if (currentId == 'all') {
					$('.list-card-container').addClass('list-set');
					$('.list-filter').not($(this)).attr('checked', false);
					$(this).parent().siblings('.danger').removeClass('danger');
					$(this).parent().addClass('danger');
				}
				else {
					$('#filter-all').attr('checked', false);
					$('#filter-all').parent().removeClass('danger');
					$('.list-filter:checked').each(function() {
						$(this).parent().addClass('danger');
						currentId = this.id.replace('filter-', '');
						cards = $('.list-card-container').find('.list-card-position:contains("' + currentId + '")').parents('.list-card-container').filter(':hidden');
						$(cards).addClass('list-set');
					});
					$('.list-filter').not(':checked').each(function() {
						$(this).parent().removeClass('danger');
						currentId = this.id.replace('filter-', '');
						cards = $('.list-card-container').find('.list-card-position:contains("' + currentId + '")').parents('.list-card-container');
						$(cards).removeClass('list-set');
					});
				}
				//hide all show
				$('.list-card-container').fadeOut();
				$('.list-card-container.list-set.label-set').fadeIn();

			});



			//Label click action
			$('.window-module.gutter').on('change', '.label-filter', function (e) {
				e.preventDefault();
				var currentId = this.id.replace('filter-', '');
				
				if (currentId == 'all-labels') { //display everything
					
					$('.list-card-container').addClass('label-set');
					$('.label-filter').not($(this)).attr('checked', false);
					$(this).parent().siblings('.danger').removeClass('danger');
					$(this).parent().addClass('danger');
				}
				else {
					$('#filter-all-labels').attr('checked', false);
					$('#filter-all-labels').parent().removeClass('danger');
					//add qualified cards to label set
					$('.label-filter:checked').each(function() {
						$(this).parent().addClass('danger');
						currentId = this.id.replace('filter-', '');
						if(currentId =='no-label'){ //special case for no-label
							cards = $('.list-card-container').find('.card-labels:not(:has(*))').parents('.list-card-container').filter(':hidden');
						}else{
							cards = $('.list-card-container').find('.'+currentId).parents('.list-card-container').filter(':hidden');
						}
						
						$(cards).addClass('label-set');
					});
					//remove unqualified cards from label set
					$('.label-filter').not(':checked').each(function() {
						$(this).parent().removeClass('danger');
						currentId = this.id.replace('filter-', '');
						if(currentId =='no-label'){ //special case for no-label
							cards = $('.list-card-container').find('.card-labels:not(:has(*))').parents('.list-card-container');
						}else{
							cards = $('.list-card-container').find('.'+currentId).parents('.list-card-container');
						}
						$(cards).removeClass('label-set');
					});
				}
				//hide all show
				$('.list-card-container').fadeOut();
				$('.list-card-container.list-set.label-set').fadeIn();
			});
		}
	});
};
var ran = 0;
var href = window.location.href;
if (href.substr(href.lastIndexOf('/') + 1) == 'cards') {
	createButtons();
	ran = 1;
}
setInterval(function () {
	var href = window.location.href;
	if (href.substr(href.lastIndexOf('/') + 1) == 'cards') {
		if (ran === 0) {
			ran = 1;
			createButtons();
		}
	} else {
		ran = 0;
	}
}, 500);
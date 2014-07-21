var myDataRef;
(function($) {

	"use strict";
    var dateObj = new Date();
    var month2 = dateObj.getUTCMonth();
    var day2 = dateObj.getUTCDate();
    var year2 = dateObj.getUTCFullYear();
    var apiKey = '6caa866f-71bf-4d05-b183-3618c682cbbb';

    myDataRef = new Firebase('https://greenangel.firebaseio.com/');
    $('#messageInput').keypress(function (e) {
        if (e.keyCode == 13) {
            var name = $('#nameInput').val();
            var text = $('#messageInput').val();
            myDataRef.push({name: name, text: text});
            $('#messageInput').val('');
        }
    });
    myDataRef.on('child_added', function(snapshot) {
        var message = snapshot.val();
        displayChatMessage(message.name, message.text);
    });
    function displayChatMessage(name, text) {
        $('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messagesDiv'));
        $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
    };

    myDataRef.on('child_changed', function(snapshot) {
       var event = snapshot.val();
        var events = [
            {
                "class": event.class,
                "end": event.end,
                "id": event.id,
                "start": event.start,
                "title": event.title,
                "url": event.url,
                "name": event.name
            }
        ];
        console.log(events[0].title);
        options.onAfterEventsLoad(events);
    });


//
    var newdate = year2 + "-" + (month2+1) + "-" + day2;
//
//    console.log(newdate);
//    console.info(newdate);

    $('#upload, #done, #input_amount').hide();

    function open() {
        $('#block').fadeIn();
        $('#popup').fadeIn();
    }

    function close() {
        $('#block').fadeOut();
        $('#popup').fadeOut();
    }


	var options = {
		events_source: 'events.json.php',
		view: 'month',
		tmpl_path: 'tmpls/',
		tmpl_cache: false,
		day: 'now',

		onAfterEventsLoad: function(events) {
			if(!events) {
				return;
			}
			var list = $('#eventlist');
			list.html('');

            console.log(events[0].title);
			$.each(events, function(key, val) {
				$(document.createElement('li'))
					.html('<a href="' + val.url + '">' + val.title + '</a>')
					.appendTo(list);
			});
		},
		onAfterViewLoad: function(view) {
			$('#side-panel h3').text(this.getTitle());
			$('.btn-group button').removeClass('active');
			$('button[data-calendar-view="' + view + '"]').addClass('active');
		},
		classes: {
			months: {
				general: 'label'
			}
		}
	};

	var calendar = $('#calendar').calendar(options);

	$('#side-panel button[data-calendar-nav]').each(function() {
		var $this = $(this);
		$this.click(function() {
			calendar.navigate($this.data('calendar-nav'));
		});
	});

	$('.btn-group button[data-calendar-view]').each(function() {
		var $this = $(this);
		$this.click(function() {
			calendar.view($this.data('calendar-view'));
		});
	});

	$('#first_day').change(function(){
		var value = $(this).val();
		value = value.length ? parseInt(value) : null;
        console.info(value);
		calendar.setOptions({first_day: value});
		calendar.view();
	});

	$('#language').change(function(){
		calendar.setLanguage($(this).val());
		calendar.view();
	});

	$('#events-in-modal').change(function(){
		var val = $(this).is(':checked') ? $(this).val() : null;
		calendar.setOptions({modal: val});
	});
	$('#events-modal .modal-header, #events-modal .modal-footer').click(function(e){
		//e.preventDefault();
		//e.stopPropagation();
	});


    $('#income, #expense').click(function(e) {
        $('#income, #expense').hide();
        console.log(newdate);
        $('#upload, #done, #input_amount').show();
    });
    $(' #done').click(function(e) {
        //add check for uploaded image or input box
        $('#upload, #done, #input_amount').hide();
        $('#income, #expense').show();

    });
    /*
    $('#upload').click(function(e) {
        var link =  "//api.idolondemand.com/1/api/sync/ocrdocument/v1?"
        var link = "/1/api/sync/highlight/v1?text=text&highlight_expression=links&apikey=" + apiKey;
        $.get(

        , function() {
                alert("success");
         });
    });*/

    $('#upload').click(function(e) {
        open();
    });
    $('#closebtn').click(function(e) {
        close();
    });

    function handleFileSelect(evt) {
        var files = evt.target.files; // FileList object

        // files is a FileList of File objects. List some properties.
        var output = [];
        for (var i = 0, f; f = files[i]; i++) {
            output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                f.size, ' bytes, last modified: ',
                f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                '</li>');

            ocrToText(f);
        }
        document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
    }


    function ocrToText(fn) {
        var filename = fn.value;
        var url = "http://i.imgur.com/huGoz8j.jpg";
        var link =  "//api.idolondemand.com/1/api/sync/ocrdocument/v1?url=" + url +
                    "&mode=scene_photo&apikey=" + apiKey;

        $.get(link, function(data) {
//            JSON.parse(data);

            var p = JSON.stringify(data);
            console.log(p);
            var x = JSON.parse(p);
            console.log(x);
            console.log(x.text_block[0].text);
//            console.log(data);
            //alert(jobj.text_block['text']);
            //alert(p.text_block[0]);
//            alert(JSON.stringify(data));
        });

    }
    function handleFileDrop(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        var files = evt.dataTransfer.files; // FileList object.

        // files is a FileList of File objects. List some properties.
        var output = [];
        for (var i = 0, f; f = files[i]; i++) {
            output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                f.size, ' bytes, last modified: ',
                f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                '</li>');

            ocrToText(f);
        }
        document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
    }

    function handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    // Setup the dnd listeners.
    var dropZone = document.getElementById('drop_zone');
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileDrop, false);

    document.getElementById('files').addEventListener('change', handleFileSelect, false);





//    var i = $(this).index();
//    $('.fullarticle').hide();
//    $('#article' + (i+1)).show();
}(jQuery));
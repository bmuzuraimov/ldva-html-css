/* ========================================
    General script
   ====================================== */
/* == Graph object == */
if ($('#graph').length) {
    new Morris.Area({
        element: 'graph',
        data: [{
            date: '1/12/2022',
            value: 264
        }, {
            date: '2/12/2022',
            value: 50
        }, {
            date: '3/12/2022',
            value: 473
        }, {
            date: '4/12/2022',
            value: 345
        }, {
            date: '5/12/2022',
            value: 20
        }, {
            date: '5/12/2022',
            value: 543
        }, {
            date: '5/12/2022',
            value: 23
        }, {
            date: '5/12/2022',
            value: 542
        }],
        xkey: 'date',
        axes: 'y',
        axes: 'x',
        lineWidth: 1,
        parseTime: false,
        ykeys: ['value'],
        labels: ['#'],
        hideHover: true,
        lineColors: ['#3494ed'],
    });
}
/* == Image slider == */
if ($('.screenshot-wrapper')[0]) {
    $('.screenshot-wrapper').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        infinite: false,
        lazyLoad: 'ondemand',
        nextArrow: $('.slider-next'),
        prevArrow: $('.slider-prev'),
        responsive: [{
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                infinite: true,
                dots: true
            }
        }, {
            breakpoint: 850,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
            }
        }, {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }],
    });
}
//Modal popups
$('.screenshot').on('click', '.screenshot-card', function(){
    const index = $(this).index('.screenshot-card');
    const src = $('.screenshot-image').eq(index).attr('src');
    const modal_count = 'Count ' + $(this).find('.date').val();
    $('.modal-count').html(modal_count);
    $('.modal-image img').attr('src', src);
    $('.modal-bg').addClass('modal-bg-active');
    $('.modal-history').css({display: 'block'});
});
$('.modal-close').click(() => {
    $('.modal-bg').removeClass('modal-bg-active');
    $('.modal > *').css({display: 'none'});
});
//Don't let submit forms, instead handle here with response
$('form').submit(function(){
    return false;
});
/* ========================================
    Dashboard page script
   ====================================== */
if ($('.dashboard-container')[0]) { //if dashboard class exists
    $('.live-btn-box').on('click', '.live-cam-btn', function() {
        $('.live-btn-box .live-cam-active').removeClass('live-cam-active');
        $(this).addClass('live-cam-active');
        const camera = $(this).attr('value');
        switch(camera) {
          case 'All cameras':
            // if All cameras. Don't forget to refresh slick slider
            // $('#slick-slider').slick('refresh');
            alert('History of all cameras');
            break;
          case 'Camera 1':
            // if Camera 1. Don't forget to refresh slick slider
            // $('#slick-slider').slick('refresh');
            alert('Screenshots of camera 1');
            break;
          case 'Camera 2':
            // if Camera 2. Don't forget to refresh slick slider
            // $('#slick-slider').slick('refresh');
            alert('Screenshots of camera 2');
            break;
          case 'Camera 3':
            // if Camera 3. Don't forget to refresh slick slider
            // $('#slick-slider').slick('refresh');
            alert('Screenshots of camera 3');
            break;
          case 'Camera 4':
            // if Camera 4. Don't forget to refresh slick slider
            // $('#slick-slider').slick('refresh');
            alert('Screenshots of camera 4');
            break;
          default:
            alert('Error occured! Please try again.');
        }
    });
}
/* ========================================
    Camera page script
   ====================================== */
if ($('.camera-container')[0]) { //if camera class exists
    // get video coordinates to draw relative shapes on top layer (.drawing-area)
    const vid_bound = $('#streaming-video')[0].getBoundingClientRect();
    const m_pos = { // object for cursor coordinates
        x: -1,
        y: -1
    };
    const l_line = $('.drawing-area line').length - 1; // index of the last line
    let a_line = true; // is line following mouse
    let f_point = true; // remember first point to check if distance with last point is close
    const regions = new Array(); // all regions
    let cur_region = new Array(); // current region coordinates (when closed add to 'regions' array)
    $('#face-mask').change(function() {
        if(this.checked) {
            // face mask checkbox checked
        }else{
            // face mask checkbox unchecked
        }        
    });
    $('#threshold-confirm').click(function(){ //Threshold post request
        $.post($('#threshold-form').attr('action'), $('#threshold-form :input').serializeArray(), function(response){
          $('#threshold-confirm').html('Saved');
        });
    });
    $('#threshold-btn').click(() => {
        $('.modal-bg').addClass('modal-bg-active');
        $('.modal-threshold').css({display: 'block'});
    });
    $('#streaming-video').mousemove(() => {
        m_pos.x = event.pageX - vid_bound.left;
        m_pos.y = event.pageY - vid_bound.top;
        if (a_line) {
            if (!f_point) {
                $('.drawing-area line').eq(l_line).attr('x2', m_pos.x).attr('y2', m_pos.y);
            }
        }
    });
    $('#draw-btn').click(() => {
        const mode = $('#draw-btn').text();
        if (mode === 'Set Region of Interest') {
            a_line = true;
            $('#draw-btn').text('Cancel');
            $('.drawing-area').removeClass('hidden');
            $('#streaming-video').css({
                cursor: 'crosshair'
            });
        } else if (mode === 'Cancel') {
            $('#draw-btn').text('Set Region of Interest');
            $('.drawing-area').addClass('hidden');
            $('#streaming-video').css({
                cursor: 'default'
            });
        } else if (mode === 'Reset' && regions.length === 0) {
            $('#draw-btn').text('Cancel');
            $(`.drawing-area line:nth-last-of-type(-n+${cur_region.length})`).remove();
            cur_region = [];
            f_point = true;
        } else if (mode === 'Reset' && regions.length > 0) {
            $('#draw-btn').text('Save');
            $(`.drawing-area line:nth-last-of-type(-n+${cur_region.length})`).remove();
            cur_region = [];
            f_point = true;
        } else if(mode === 'Save'){
            Swal.fire({
              title: 'Image saved!',
              icon: 'success',
              confirmButtonColor: '#1890FF',
            });
            $('#draw-btn').text('Set Region of Interest');
            $('#streaming-video').css({
                cursor: 'default'
            });
            a_line = false;
        }
    });
    $('#streaming-video').click(() => {
        const mode = $('#draw-btn').text();
        if (mode !== 'Set Region of Interest') {
            m_pos.x = event.pageX - vid_bound.left;
            m_pos.y = event.pageY - vid_bound.top;
            m_pos.x = m_pos.x.toFixed(2);
            m_pos.y = m_pos.y.toFixed(2);
            if (f_point) {
                $('#draw-btn').text('Reset');
                f_point = false;
                regions.push(cur_region); // create new region
                regions[regions.length - 1].push([m_pos.x, m_pos.y]);
            } else {
                const dist = Math.sqrt(((m_pos.x - cur_region[0][0])**2) + ((m_pos.y - cur_region[0][1])**2));
                if (dist < 10) {
                    $('#draw-btn').text('Save');
                    $('.drawing-area line').eq(l_line).attr('x2', regions[regions.length - 1][0][0]).attr('y2', regions[regions.length - 1][0][1]);
                    $(document.createElementNS('http://www.w3.org/2000/svg', 'circle')).attr({
                        cx: regions[regions.length - 1][0][0],
                        cy: regions[regions.length - 1][0][1],
                        r: 2
                    }).appendTo('.drawing-area');
                    $('.drawing-area line').css({
                        'stroke-width': '4'
                    });
                    $('.drawing-area circle').css({
                        'stroke-width': '5'
                    });
                    f_point = true;
                    cur_region = []; // empty current region array
                    const json_regions = JSON.stringify(regions);
                    console.log(json_regions); // shows coordinates of plotted dots
                    return false;
                }
                regions[regions.length - 1].push([m_pos.x, m_pos.y]);
            }
            $(document.createElementNS('http://www.w3.org/2000/svg', 'line')).attr({
                x1: m_pos.x,
                y1: m_pos.y,
                x2: m_pos.x,
                y2: m_pos.y,
            }).appendTo('.drawing-area');
        }
    });
}
if ($('.history-container')[0]) { //if dashboard class exists
    $('#all').change(function() {
        if(this.checked) {
            $('.filter-cam').prop('checked', true);
        }else{
            $('.filter-cam').prop('checked', false);
        }        
    }); 
    $('#show-result').click(function() {
        alert('Searching results');       
    });
    $('.pagin-btns').on('click', '.pagin-btn', function() {
        alert('Page #'+$(this).val());
    });
    $('#pagin-select').on('change', function() {
      alert(this.value);
    });   
}
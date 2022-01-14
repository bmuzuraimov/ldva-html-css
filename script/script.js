/* ========================================
    General script
   ====================================== */
new Morris.Area({
    element: 'graph',
    data: [{
        date: '1/12/2022',
        value: 264
    }, {
        date: '2/12/2022',
        value: 244
    }, {
        date: '3/12/2022',
        value: 473
    }, {
        date: '4/12/2022',
        value: 345
    }, {
        date: '5/12/2022',
        value: 234
    }],
    xkey: 'date',
    axes: "y",
    axes: "x",
    lineWidth: 1,
    parseTime: false,
    ykeys: ['value'],
    labels: ['Value'],
    lineColors: ['#3494ed'],
});
$('.screenshot-wrapper').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
    nextArrow: $('.next'),
    prevArrow: $('.prev'),
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
/* ========================================
    Dashboard page script
   ====================================== */
$('#threshold-btn').click(() => {
    $('.modal-bg').addClass('modal-bg-active');
});
$('.live-btn-box').on('click', '.live-cam-btn', function() {
    $('.live-btn-box .live-cam-active').removeClass('live-cam-active');
    $(this).addClass('live-cam-active');
});
/* ========================================
    Camera page script
   ====================================== */
if ($('.camera-container')[0]) {
    const vid_bound = $('.camera-container')[0].getBoundingClientRect(); // get coordinates of the video
    const m_pos = {
        x: -1,
        y: -1
    }; // cursor coordinates relatively to the video frame
    const l_line = $('.drawing-area line').length - 1; // index of the last line
    let a_line = true; // is line follow mouse
    let f_point = true; // remember first point to check if distance with last point is close
    const regions = new Array(); // all regions
    let cur_region = new Array(); // current region coordinates
    $('#streaming-video').mousemove(() => {
        m_pos.x = event.pageX - vid_bound.left;
        m_pos.y = event.pageY - vid_bound.top;
        if (a_line) {
            if (!f_point) {
                $('.drawing-area line').eq(l_line).attr('x2', m_pos.x).attr('y2', m_pos.y);
            }
            $('#cursor').attr('cx', m_pos.x).attr('cy', m_pos.y);
        }
    });
    $('#draw-btn').click(() => {
        const mode = $('#draw-btn').text();
        if (mode == 'Set Region of Interest') {
            a_line = true;
            $('#draw-btn').text('Cancel');
            $('.drawing-area').removeClass('hidden');
            $('#streaming-video').css({
                cursor: 'crosshair'
            });
        } else if (mode == 'Cancel') {
            $('#draw-btn').text('Set Region of Interest');
            $('.drawing-area').addClass('hidden');
            $('#streaming-video').css({
                cursor: 'default'
            });
        } else if (mode == 'Reset' && regions.length == 0) {
            $('#draw-btn').text('Cancel');
            $(`.drawing-area line:nth-last-of-type(-n+${cur_region.length})`).remove();
            cur_region = [];
            f_point = true;
        } else if (mode == 'Reset' && regions.length > 0) {
            $('#draw-btn').text('Save');
            $(`.drawing-area line:nth-last-of-type(-n+${cur_region.length})`).remove();
            cur_region = [];
            f_point = true;
        } else {
            alert('Image Saved');
            $('#draw-btn').text('Set Region of Interest');
            $('#streaming-video').css({
                cursor: 'default'
            });
            a_line = false;
        }
    });
    $('#streaming-video').click(() => {
        const mode = $('#draw-btn').text();
        if (mode != 'Set Region of Interest') {
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
                const dist = Math.sqrt(Math.pow((m_pos.x - cur_region[0][0]), 2) + Math.pow((m_pos.y - cur_region[0][1]), 2));
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
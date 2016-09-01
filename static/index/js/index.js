
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

var Test = React.createClass({
    render: function() {
        var artist_component = this.props.artists.map(function(artists) {
            var content = '';
            if (artists.images[0]){
                return <div key={artists.id} className="artist">
                    <div className="name">{artists.name}</div>
                    <div><img className="artist_img" src={artists.images[0].url} /></div>
                    <div><button className="save" type="button">Save</button></div></div>;
            } else {
                return <div key={artists.id} className="artist">
                    <div className="name">{artists.name}</div>
                    <div></div>
                    <div><button className="save" type="button">Save</button></div></div>;
            }

        });
        return <div>{artist_component}</div>;
    }
});
$('#submit_button').click(function() {
    var data = $('#search_box').val();
    $.ajax({
        type: "POST",
        url: "",
        data: {'artist_name': data},
        success: function(artists){
            var artist_list = JSON.parse(artists);
            ReactDOM.render(<Test artists={artist_list} />, document.getElementById('content'));
        }
    });
});
$('#content').on('click', 'button.save', function() {
    var data = {
        'name': $(this).parent().parent().find('div.name').html(),
        'image_url': $(this).parent().parent().find('img').attr('src')
    };
    $.ajax({
        type: "POST",
        url: "",
        data: data,
        success: function(res){
            if (res == 'OK') {
                console.log('saved')
            }
        }
    });
});




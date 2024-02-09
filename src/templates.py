def build_guest_template(name):
    guest_template='''
        <!DOCTYPE html>
        <html>
        <head>
            <title>Guest Page</title>
                <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500&display=swap" rel="stylesheet">
            <link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">
        </head>
        <body>
            <h1 id="app-title">Find My Rocket App</h1>
            <h4 id="welcome">Welcome %s</h4>
                    <div id="radar-container">
                        <img id="radar" src="{{ url_for('static', filename='images/radar.png') }}" alt="Radar">
                    </div>
                    
                    <div id="rocket-container">
                        <img id="rocket" src="{{ url_for('static', filename='images/rocket.png') }}" alt="Rocket">
                    </div>
                   

                    <div id="text-container">
                      <div id="random-text"></div>
                   </div>
            <script src="{{ url_for('static', filename='js/guest.js') }}"></script>
        </body>
        </html>
       ''' %name
    return guest_template
import os, secrets, subprocess, math
from flask import Flask, render_template, request, redirect, url_for, make_response, flash, render_template_string
from templates import build_guest_template

app = Flask(__name__)
secret_key = secrets.token_hex(int(math.e))
app.secret_key = secret_key

def authenticated():
    auth = request.cookies.get('auth', 0)
    if auth==app.secret_key:
        return True
    else:
        return False

@app.route('/')
def index():
    return render_template('login.html')

@app.route('/subscribe')
def subscribe():
    return render_template('subscribe.html')


@app.route('/admin-login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        creds_file_path = os.path.join(app.static_folder, 'files', 'creds')      
        with open(creds_file_path, 'r') as creds_file:
            stored_username, stored_password = creds_file.read().strip().split(',')
        
        if username == stored_username and password == stored_password:
            response = make_response(redirect(url_for('diagnostics')))
            response.set_cookie('auth', app.secret_key)
            return response
        else:
            message = "Incorrect credentials. Please try again."
            return render_template('admin-login.html', message=message)
    else:
        return render_template('admin-login.html', message="")

@app.route('/update-account', methods=['GET', 'POST'])
def update_account():
    is_authenticated=authenticated()
    if ((is_authenticated==True) and request.method == 'GET'):
       return render_template('update-account.html')
    elif (request.method == 'POST' and (is_authenticated:=True)):
        new_username = request.form.get('new_username')
        new_password = request.form.get('new_password')
        confirm_password = request.form.get('confirm_password')
        if new_password == confirm_password:
            creds_path = os.path.join(app.static_folder, 'files', 'creds')
            with open(creds_path, 'w') as creds_file:
                creds_file.write(f'{new_username},{new_password}')
            new_secret_key = secrets.token_hex(int(math.e))
            app.secret_key = new_secret_key
            message = "You must login after updating credentials."
            return render_template('admin-login.html', message=message)
        else:
            message = "Passwords do not match. Please try again."
            return render_template('update-account.html', message=message)
    else:
        message = "Accessing Diagnostics Requries Admin Credentials."
        return render_template('admin-login.html', message=message)
    
@app.route('/update-service', methods=['GET', 'POST'])
def update_service():
    is_authenticated=authenticated()
    if (is_authenticated==True and request.method=='GET'):
       return render_template('update-service.html', output=None)
    elif (request.method == 'POST' and (is_authenticated:=True)):
        file = request.files['file']
        if file:
            if file.filename.endswith('.c'):
                file.save(os.path.join('static/files', 'service.c'))
                result = subprocess.run(['gcc','-v','-o','/app/static/files/service','/app/static/files/service.c'], stdout=subprocess.PIPE)
                output = result.stdout.decode('utf-8')
                flash(f"Compilation results: {output}")   
                result = subprocess.run(['supervisorctl','start','service'], stdout=subprocess.PIPE)
                output = result.stdout.decode('utf-8')
                flash(f"Service Restart results: {output}")                
                flash('Service uploaded and service updated.')
                return render_template('diagnostics.html', output=output)
            else:
                flash('Invalid file format. Please upload a .c file.')
                return render_template('update-service.html', output=None)
    else:
        message = "Accessing Diagnostics Requries Admin Credentials."
        return render_template('admin-login.html', message=message)


@app.route('/guest', methods=['GET','POST'])
def guest():
    if request.method == 'POST':
       name=request.form['username']
       guest_template=build_guest_template(name)
       return render_template_string(guest_template)

@app.route('/diagnostics')
def diagnostics():
    auth = request.cookies.get('auth', 0)
    if authenticated():
        return render_template('diagnostics.html')
    else:
        message = "Accessing Diagnostics Requries Admin Credentials."
        return render_template('admin-login.html', message=message)

if __name__ == '__main__':
    app.run(debug=False,host="0.0.0.0",port=5000)

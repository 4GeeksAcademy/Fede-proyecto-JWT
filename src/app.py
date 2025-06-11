"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, TokenBlockedList
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager



# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')

app = Flask(__name__)
app.url_map.strict_slashes = False

# Aqui empezamos el ejercicio y vamos cnfigurar JWT
# 1- activamos entorno virtual con pipenv shell
# JWT Configuration
# 2- copiamos esta linea extraida de la documentacion --app.config["JWT_SECRET_KEY"] = "super-secret"--
# 3- la adaptamos a nuestro repo escribiendo despues del = --os.getenv("FLASK_APP_KEY")-- esto es una variable que esta en nuestro archivo .env
app.config["JWT_SECRET_KEY"] = os.getenv("FLASK_APP_KEY")
# 4-creamos instancia (que la obtenems de la documentacion) que luego usaremos en nuestro codigo
jwt = JWTManager(app)
# 5- recuerda importar arriba JWTManager
# lo siguiente es ir al archivo routes.py

#si llegas ha esta lia es que ya has pasado por los demas archivos de rutas y ahora necesitas hacer el logout
# implementamos el codigo extraido de la documentacion de jwt
@jwt.token_in_blocklist_loader # esta funcion lo que hace es responder verdader si el token esta blokeado y Falso si "no" esta blokeado
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    #token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar() # recuerda importar arriba ↑ el TokenBlocklist
    token = TokenBlockedList.query.filter_by(jti=jti).first() # recuerda importar arriba ↑ el TokenBlocklist

    return token is not None


# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)

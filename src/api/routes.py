"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, TokenBlockedList
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt  # aqui importamos bcrypt (paso 9)
from flask_jwt_extended import create_access_token  # lo usamos en el login
from flask_jwt_extended import get_jwt_identity  # lo usamos en la ruta protegida
from flask_jwt_extended import jwt_required  # lo usamos en la ruta protegida
from flask_jwt_extended import get_jwt  # lo usamos en la ruta protegida
from datetime import timedelta  # esto es para modificar el tiempo del token

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# 10- aqui creamos una instancia de bcrypt y de flask
app = Flask(__name__)
bcrypt = Bcrypt(app)

# 7- aqui creamos una nueva ruta para el registro de usuario
# 8- como necesitamos un nombre y un email ir al archivo models y crear la columna de fullname para que sea un nuevo campo
# recordar hacer  run migrade y upgrade luego de camiar el modelo


@api.route('/register', methods=['POST'])
def register_user():
    body = request.get_json()
    new_user = User(email=body["email"],
                    fullname=body["fullname"])
# 9- aqui creamos el password
# para ello necesitamos instalar bcrypt --pipenv install flask-bcrypt--
# no olvides de importarlo arriba
# 10- esta arriba ↑
# 11- creamos una instancia par hashear la contraseña (pondremos el nombre que querramos en este caso hashed_password)
# y dentro colocamos el codigo extraido de la documnetacion bcrypt --bcrypt.generate_password_hash( y aqui nuestro cuerpo de password)--
    hashed_password = bcrypt.generate_password_hash(
        body["password"]).decode("utf-8")
    new_user.password = hashed_password
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.serialize()), 201
# 12- una vez realizado todos los pasos probamos con postman hacer el post
# Hasta aqui llegaria la parte de registro de usuario, ahora nos falta el login y logout

# Ruta LOGIN


@api.route('/login', methods=['POST'])
def login_user():
    body = request.get_json()  # decimos que el cuerpo sera una respuesta json
    # primero buscamos al usuario haciendo un filter y buscame el primero
    user = User.query.filter_by(email=body["email"]).first()
    if user is None:
        # retorna un error si no encuentra al usuario
        return jsonify({"msg": "correo no encontrado"}), 401
    # buscamos en la documentacion e implementamos la siguiente funcion para chequer el password --bcrypt.check_password_hash(pw_hash, 'hunter2')--
    # aqui comparamos user.password con body["password"] y esto retornara  False o True
    is_valid_password = bcrypt.check_password_hash(
        user.password, body["password"])
    if not is_valid_password:
        # retorna un error si no es  Treu
        return jsonify({"msg": "clave invalida"}), 401
    # si es True se genera el token
    token = create_access_token(identity=str(
        user.id), expires_delta=timedelta(minutes=1))
    # aqui hay que recordar importar arriba ↑ el create_access_token
    return jsonify({"token": token}), 200  # retorna un error si no es  Treu


# Ruta PROTECTED O PROTEGIDA eta ruta me traera la informacion del usuario y al mismo tiempo me valida el token
@api.route('/private', methods=['GET'])
# aqui necesitaremos importar un decorador que obtendremos de la documentacion --@jwt_required()--
# no olvides importarlo arriba ↑
@jwt_required()  # con esto la ruta se convierte automaticamente en una ruta protegida
def user_info():
    user_id = get_jwt_identity()  # Obtiene el identity del token
    user = User.query.get(user_id)
    payload = get_jwt()  # Obtiene todos los campos del payload del token
    # Retornando la informacion del token y del usuario
    return jsonify({
        "user": user.serialize(),
        "payload": payload
    })
# hecho esto en postman al hacer el Get devemos introducir en el header como autorization el token que extraigamos del login
# Lo siguiente es hacer el logout pero antes hay que crear un nuevo modelo

# Ruta LOGOUT


@api.route('/logout', methods=["POST"])
@jwt_required()
def user_logout():
    payload = get_jwt()
    # recuerda importar arriba ↑ --TokenBlockedList--
    token_bloked = TokenBlockedList(jti=payload["jti"])
    db.session.add(token_bloked)
    db.session.commit()
    return jsonify({"msg": "User logged out"})
# esta ruta consiste en agarrar mi token jti y agregarlo a la lista de tokens blokeados

# si quieres ver la lista de los token revocados recuerda ir al admin para renderizar el modelo TokenBolkedList y que se vea en tu api backend


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

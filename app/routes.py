from flask import request, jsonify
from app import app, db
from app.models import User
from app.services import hash_password, check_password
from flask_jwt_extended import create_access_token

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'message': 'Dados de usuário incompletos'}), 400

    hashed_password = hash_password(password)

    new_user = User(
        username=username,
        email=email,
        password=hashed_password
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'Usuário registrado com sucesso!'}), 201
    except:
        return jsonify({'message': 'Erro ao registrar usuário. Verifique se o nome de usuário ou e-mail já existem.'}), 409

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if user and check_password(user.password, password):
        access_token = create_access_token(identity=user.username)
        return jsonify(access_token=access_token)
    
    return jsonify({"message": "Nome de usuário ou senha inválidos"}), 401
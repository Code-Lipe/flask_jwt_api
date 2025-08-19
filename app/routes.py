from flask import request, jsonify
from app import app, db
from app.models import User
from app.services import hash_password

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
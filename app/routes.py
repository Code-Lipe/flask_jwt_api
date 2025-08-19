# Importações necessárias para as funcionalidades das rotas
from flask import request, jsonify, render_template
from app import app, db
from app.models import User
from app.services import hash_password, check_password
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

# ====================================================================
# Rotas que servem as páginas HTML (Frontend)
#
# Estas rotas são acessadas por requisições GET e renderizam os
# templates que compõem a interface do usuário.
# ====================================================================

@app.route('/')
def show_register_page():
    """
    Renderiza a página inicial de cadastro.
    """
    return render_template('register.html')

@app.route('/login', methods=['GET'])
def show_login_page():
    """
    Renderiza a página de login.
    """
    return render_template('login.html')

@app.route('/dashboard', methods=['GET'])
def dashboard():
    """
    Renderiza a página protegida (dashboard).
    O conteúdo real será carregado via JavaScript.
    """
    return render_template('protected.html')

# ====================================================================
# Rotas da API (Backend)
#
# Estas rotas são acessadas por requisições POST e GET (com JWT)
# para interagir com a lógica de negócio e o banco de dados.
# ====================================================================

@app.route('/register', methods=['POST'])
def register():
    """
    Endpoint para registro de novos usuários.
    Recebe os dados via JSON, cria um novo usuário no banco de dados
    e retorna uma mensagem de sucesso ou erro.
    """
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
    """
    Endpoint para autenticação de usuários.
    Verifica as credenciais e, se corretas, retorna um JWT.
    """

    data = request.get_json()
    
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if user and check_password(user.password, password):
        access_token = create_access_token(identity=str(user.id))
        return jsonify(access_token=access_token)

    return jsonify({"message": "Nome de usuário ou senha inválidos"}), 401

@app.route('/protected', methods=['GET'])
@jwt_required()
def get_protected_data():
    """
    Endpoint protegido por JWT.
    Retorna dados do usuário logado se um token válido for fornecido.
    """
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    return jsonify(logged_in_as=user.username), 200
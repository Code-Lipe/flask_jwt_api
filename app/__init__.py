# Importa as classes e módulos necessários do Flask e de outras bibliotecas
from flask import Flask, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
import os

# ====================================================================
# Configuração da Aplicação Flask
# ====================================================================

# Cria a instância da aplicação Flask
app = Flask(__name__)

# Configuração do banco de dados SQLAlchemy
# 'sqlite:///site.db' define o uso de um banco de dados SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
# 'SQLALCHEMY_TRACK_MODIFICATIONS' é desabilitada para otimizar o desempenho
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configuração da chave secreta para o JWT
# O código tenta obter a chave de uma variável de ambiente, mas usa uma
# fallback (sua_chave_secreta_aqui) caso a variável não esteja definida.
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY') or 'sua_chave_secreta_aqui'

# ====================================================================
# Inicialização das Extensões
# ====================================================================

# Inicializa as extensões do Flask com a instância da aplicação
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# ====================================================================
# Manipuladores de Erro do JWT
# ====================================================================

# Define o que acontece quando um token de acesso está ausente
# ou é inválido. Em vez de retornar um JSON de erro padrão,
# redireciona o usuário para a página de login.
@jwt.unauthorized_loader
def unauthorized_callback(callback):
    """
    Callback para requisições sem token de autorização.
    Redireciona para a página de login.
    """
    return redirect(url_for('show_login_page'))

# ====================================================================
# Importação de Rotas e Modelos
# ====================================================================

# Importa os módulos de rotas e modelos no final para evitar
# problemas de importação circular.
from app import routes, models
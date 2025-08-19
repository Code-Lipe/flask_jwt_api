from app import app, db
from app.models import User

# Cria o banco de dados se ele não existir
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)